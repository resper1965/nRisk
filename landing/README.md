# Landing n.Risk

Site do produto n.Risk (ecossistema ness.). **Vite + React + React Router + Tailwind CSS**. Multi-páginas com rotas: visão geral, Supply Chain, Insurance, Assessments, Metodologia, Contato.

## Branding

- **Marca:** n.Risk (minúsculas); ponto "." em **#00ade0** (accent)
- **Fonte:** Montserrat (classes Tailwind; carregada via Google Fonts no index.html)
- **Estética:** enterprise premium, minimalista, muito whitespace; paleta neutra (slate/gray) + acento #00ade0

## Stack

- Vite 5
- React 18
- React Router 6
- Tailwind CSS 3
- Sem bibliotecas de UI (shadcn, MUI, Chakra)

## Estrutura

- **src/App.jsx** — Rotas (/, /nrisk, /nrisk/supply-chain, /nrisk/insurance, /nrisk/assessments, /nrisk/methodology, /nrisk/contact)
- **src/main.jsx** — Entry; BrowserRouter
- **src/pages/** — NriskOverview, SupplyChain, Insurance, Assessments, Methodology, Contact
- **src/components/** — Layout, Header, Footer, Logo (inline no Header), CtaSection, Accordion, ProductMock

## Rotas

| Rota | Página |
|------|--------|
| / | Redireciona para /nrisk |
| /nrisk | Visão geral |
| /nrisk/supply-chain | Risco de terceiros |
| /nrisk/insurance | Underwriting / Cyber Insurance |
| /nrisk/assessments | Assessments e evidências |
| /nrisk/methodology | Metodologia (score, Cross-Check, Fator de Confiança, etc.) |
| /nrisk/contact | Formulário de contato |

## Como rodar localmente

```bash
cd landing
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Saída em **dist/**. Para preview: `npm run preview`.

## Deploy no GCP (Cloud Run)

O Dockerfile faz build Vite e serve **dist/** com nginx (porta 8080). SPA: fallback para index.html.

```bash
./deploy-gcp.sh
```

Ou manualmente com `gcloud run deploy` (fonte . ou imagem do Dockerfile).

### Domínio personalizado e SSL (nrisk.ness.com.br)

Para HTTPS no domínio customizado, o **mapeamento de domínio** no Cloud Run já foi criado. O certificado SSL é emitido pelo Google quando o DNS estiver correto.

**Registro DNS obrigatório** (no provedor do domínio ness.com.br):

| Tipo  | Nome  | Valor / Alvo           |
|-------|--------|-------------------------|
| CNAME | `nrisk` | `ghs.googlehosted.com.` |

- **Nome:** `nrisk` (subdomínio nrisk.ness.com.br).
- **Alvo:** exatamente `ghs.googlehosted.com.` (com ponto final no valor, conforme o provedor).

Se o CNAME estiver apontando para a URL do Cloud Run (`*.run.app`), altere para `ghs.googlehosted.com.` para o certificado ser provisionado. A emissão pode levar de 15 minutos a 24 horas.

Consultar mapeamentos e registros:
```bash
gcloud beta run domain-mappings describe --domain nrisk.ness.com.br --region us-central1 --project nrisk-486513
```

## Footer

"© {ano} ness. Todos os direitos reservados." + "powered by ness." (link https://ness.com.br).
