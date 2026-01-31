# Google Ads Integration - Brainstorm Session

**Data**: 2026-01-31
**Status**: Em andamento - aguardando decisão do usuário

---

## Contexto do Projeto

### O que é o Cold Service Refrigeração

Landing page + sistema de rastreamento de técnicos em tempo real para empresa de conserto de geladeiras em Recife.

- **Tipo**: Landing page SaaS + app mobile para técnicos
- **Propósito**: Converter leads de tráfego do Google Ads
- **Stack**: Next.js 14, Tailwind CSS 4, Vercel (região gru1)

### Sistema DTR Existente

Já existe um sistema de Dynamic Text Replacement em `/lib/dtr.js` e `/lib/content.js`:

- Normaliza keywords (lowercase, remove acentos, substitui espaços por hífens)
- Hierarquia: Match direto → Match parcial → Fallback de marca → Fallback de problema → Default
- **URL Pattern**: `/?keyword=conserto-geladeira-brastemp`

**Keywords mapeadas:**
- Por marca: `conserto-geladeira-brastemp`, `conserto-geladeira-electrolux`, etc.
- Por problema: `geladeira-nao-gela`, `geladeira-fazendo-barulho`, `geladeira-vazando-agua`
- Genéricas: `conserto-geladeira-recife`, `assistencia-tecnica-geladeira`

**Elementos personalizados:**
- Headline e subheadline do hero
- Texto do CTA
- Destaque de serviços
- Badges de urgência

### Integrações Atuais

**Nenhuma integração de ads/analytics ainda:**
- Sem Google Ads tags/GTM
- Sem Google Analytics
- Sem pixels de conversão
- Sem CRM

**APIs internas:**
- `/api/session` - tracking de sessão cliente-técnico
- `/api/technician-location` - GPS em tempo real dos técnicos

### Estrutura do Projeto

```
/pages              - Next.js pages (index.js é a landing principal)
/components         - Componentes React
/lib                - Lógica de negócio (DTR, content mappings)
/styles             - CSS global (Tailwind)
/public             - Assets estáticos
/technician-app     - App Android Kotlin para técnicos
/pages/api          - API endpoints
```

---

## Pergunta Pendente

**Quando você fala em "títulos dinâmicos" com Google Ads, qual abordagem você tem em mente?**

1. **Sincronizar títulos da landing page com os anúncios** - os headlines dos anúncios no Google Ads refletem automaticamente as variações que existem na landing page (ex: "Conserto Brastemp" aparece tanto no anúncio quanto na página)

2. **Customizers no Google Ads** - criar um feed de dados que o Google Ads consome para inserir dinamicamente informações nos anúncios (preços, disponibilidade, promoções, etc.)

3. **Outra coisa** - descrever o que está imaginando

---

## Próximos Passos

1. Definir a abordagem de títulos dinâmicos
2. Mapear arquitetura da integração
3. Implementar GTM/tracking básico
4. Criar sistema de sincronização (se aplicável)

---

## Notas Técnicas

- O projeto está pronto para integração com GTM (mencionado no README como TODO)
- Já possui estrutura de dados rica em `/lib/content.js` que pode alimentar feeds
- A/B Testing via Vercel Edge Config está planejado mas não implementado
