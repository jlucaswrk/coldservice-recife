#!/bin/bash

# ============================================
# Cold Service - Deploy Script
# Automatiza: commit, push, PR, build e download do APK
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
APK_DEST="$HOME/Desktop/ColdServiceAPK"
REPO="jlucaswrk/coldservice-recife"
WORKFLOW="build-android.yml"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Cold Service - Deploy Automatizado   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Verificar se gh está autenticado
if ! gh auth status &>/dev/null; then
    echo -e "${RED}❌ GitHub CLI não está autenticado. Execute: gh auth login${NC}"
    exit 1
fi

# Configurar gh para git
gh auth setup-git 2>/dev/null || true

# Verificar se há mudanças para commitar
echo -e "${YELLOW}📋 Verificando mudanças...${NC}"
if git diff --quiet && git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança detectada. Continuar mesmo assim? (s/n)${NC}"
    read -r response
    if [[ "$response" != "s" && "$response" != "S" ]]; then
        echo -e "${RED}Cancelado.${NC}"
        exit 0
    fi
    SKIP_COMMIT=true
else
    SKIP_COMMIT=false
    git status --short
fi

# Commit
if [[ "$SKIP_COMMIT" == "false" ]]; then
    echo ""
    echo -e "${YELLOW}💬 Mensagem do commit (ou Enter para mensagem padrão):${NC}"
    read -r commit_msg

    if [[ -z "$commit_msg" ]]; then
        commit_msg="chore: deploy update $(date '+%Y-%m-%d %H:%M')"
    fi

    echo -e "${BLUE}📦 Fazendo commit...${NC}"
    git add -A
    git commit -m "$commit_msg" || true
fi

# Push
BRANCH=$(git branch --show-current)
echo -e "${BLUE}🚀 Fazendo push para ${BRANCH}...${NC}"
git push origin "$BRANCH" || {
    echo -e "${RED}❌ Falha no push. Verifique suas credenciais.${NC}"
    exit 1
}

# Verificar/Criar PR
echo -e "${BLUE}🔍 Verificando Pull Request...${NC}"
PR_URL=$(gh pr view --json url -q '.url' 2>/dev/null || echo "")

if [[ -z "$PR_URL" ]]; then
    echo -e "${YELLOW}📝 Criando Pull Request...${NC}"
    PR_URL=$(gh pr create --title "Deploy: $(date '+%Y-%m-%d %H:%M')" --body "Deploy automatizado via script" 2>/dev/null || echo "")

    if [[ -z "$PR_URL" ]]; then
        echo -e "${YELLOW}⚠️  Não foi possível criar PR (talvez já esteja na main). Continuando...${NC}"
    else
        echo -e "${GREEN}✅ PR criada: $PR_URL${NC}"
    fi
else
    echo -e "${GREEN}✅ PR existente: $PR_URL${NC}"
fi

# Aguardar workflow iniciar
echo ""
echo -e "${BLUE}⏳ Aguardando workflow iniciar...${NC}"
sleep 5

# Pegar o run mais recente
RUN_ID=$(gh run list --workflow="$WORKFLOW" --limit 1 --json databaseId -q '.[0].databaseId')

if [[ -z "$RUN_ID" ]]; then
    echo -e "${RED}❌ Não foi possível encontrar o workflow run.${NC}"
    exit 1
fi

echo -e "${BLUE}🔄 Workflow iniciado: Run #$RUN_ID${NC}"
echo -e "${BLUE}   Acompanhe em: https://github.com/$REPO/actions/runs/$RUN_ID${NC}"
echo ""

# Aguardar conclusão do build
echo -e "${YELLOW}⏳ Aguardando build concluir (isso pode levar alguns minutos)...${NC}"

while true; do
    STATUS=$(gh run view "$RUN_ID" --json status,conclusion -q '.status')
    CONCLUSION=$(gh run view "$RUN_ID" --json conclusion -q '.conclusion')

    if [[ "$STATUS" == "completed" ]]; then
        break
    fi

    # Mostrar progresso
    CURRENT_STEP=$(gh run view "$RUN_ID" 2>/dev/null | grep -E "^\s+\*" | head -1 | sed 's/^[[:space:]]*\* //' || echo "...")
    echo -ne "\r${BLUE}   ⚙️  $CURRENT_STEP${NC}                    "

    sleep 10
done

echo ""

# Verificar resultado
if [[ "$CONCLUSION" == "success" ]]; then
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Build falhou. Verifique: https://github.com/$REPO/actions/runs/$RUN_ID${NC}"
    gh run view "$RUN_ID" --log-failed 2>/dev/null | tail -20
    exit 1
fi

# Criar pasta de destino
mkdir -p "$APK_DEST"

# Baixar APK
echo -e "${BLUE}📥 Baixando APK...${NC}"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
APK_FILE="$APK_DEST/cold-service-$TIMESTAMP.apk"

# Baixar para pasta temporária e mover
TEMP_DIR=$(mktemp -d)
gh run download "$RUN_ID" -n cold-service-technician-apk -D "$TEMP_DIR"

# Encontrar o APK e mover
APK_DOWNLOADED=$(find "$TEMP_DIR" -name "*.apk" | head -1)
if [[ -n "$APK_DOWNLOADED" ]]; then
    mv "$APK_DOWNLOADED" "$APK_FILE"
    rm -rf "$TEMP_DIR"

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         🎉 DEPLOY CONCLUÍDO! 🎉         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}📱 APK salvo em:${NC}"
    echo -e "   ${BLUE}$APK_FILE${NC}"
    echo ""
    echo -e "${YELLOW}Para instalar no Android:${NC}"
    echo -e "   1. Transfira o APK para o celular"
    echo -e "   2. Habilite 'Fontes desconhecidas' nas configurações"
    echo -e "   3. Abra e instale o APK"
    echo ""

    # Abrir pasta no Finder
    open "$APK_DEST"
else
    echo -e "${RED}❌ APK não encontrado no artifact.${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi
