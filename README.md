# Cold Service Refrigeração - Landing Page

Landing page otimizada para conversão da Cold Service Refrigeração, empresa de conserto de geladeiras em Recife.

## Stack

- **Next.js 14** (Pages Router)
- **Tailwind CSS 4**
- **Vercel** (hospedagem)

## Funcionalidades

- **Dynamic Text Replacement (DTR)**: Personalização de conteúdo baseada em keywords do Google Ads
- **Responsive Design**: Mobile-first, otimizado para conversão
- **Contato Direto**: Botões click-to-call e WhatsApp
- **Formulário de Contato**: Desktop only, gera mensagem pré-preenchida para WhatsApp
- **SEO Otimizado**: Meta tags, Open Graph, geo tags locais

## Estrutura

```
/components     # Componentes React (Header, Hero, Services, etc.)
/lib            # Lógica de negócio (DTR, conteúdo)
/pages          # Páginas Next.js
/styles         # CSS global (Tailwind)
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Dynamic Text Replacement

A página personaliza conteúdo baseado no parâmetro `?keyword=`:

```
# Por marca
/?keyword=conserto-geladeira-brastemp
/?keyword=conserto-geladeira-electrolux

# Por problema
/?keyword=geladeira-nao-gela
/?keyword=geladeira-fazendo-barulho

# Genérico
/?keyword=conserto-geladeira-recife
```

## Deploy

```bash
npm run build
```

Deploy automático via Vercel ao fazer push para o repositório.

## Configuração

Edite `lib/content.js` para atualizar:

- Dados de contato (telefone, WhatsApp, email)
- Horário de atendimento
- Serviços oferecidos
- Depoimentos
- FAQ
- Mapeamentos de DTR

## Próximos Passos

- [ ] Integração com CMS (Contentful/Sanity)
- [ ] Google Tag Manager
- [ ] A/B Testing via Vercel Edge Config
- [ ] Imagens reais (técnicos, logo)
