---
type: doc
name: adr-001-stack-api-typescript-scan-go
description: Decisão de manter Go no Scan Engine e migrar API + assessment para TypeScript (Next.js)
category: architecture
---

# ADR-001: Stack — API/Assessment em TypeScript (Next.js), Scan Engine em Go

## Status

**Aceito** — a ser aplicado quando o frontend for construído.

## Contexto

- MVP com iteração rápida; frontend é obrigatório (Dashboard, questionários, spider chart).
- Hoje: API REST + assessment em Go (Gin); Scan Engine em Go (Cloud Run Job); frontend ainda não existe.
- Objetivo: maximizar velocidade de entrega e contratação sem perder o que já funciona.

## Decisão

1. **Manter Go para o Scan Engine**
   - É um job batch isolado; já funciona; deploy como Cloud Run Job.
   - Lugar certo para Go: I/O com ferramentas externas (Nuclei, Nmap, Subfinder), parser, escrita em Firestore.

2. **Migrar a API REST + assessment para TypeScript (Next.js)** quando for construir o frontend.
   - API Routes (REST) em Next.js cobrindo: scans (orquestração), assessment (CRUD, RBAC), questionários, respostas, evidências, relatórios.
   - Lógica de scoring/cross-check (~400 linhas em Go) será reimplementada em TypeScript (~200 linhas) e **compartilhada com o frontend** para preview de score em tempo real.
   - `mapping_logic.json` e `assessment_questions.json` continuam como fontes de verdade, consumidas por Next.js e pelo Scan Engine (Go).

### Razões

| Motivo | Detalhe |
|--------|---------|
| Velocidade de iteração | Startup precisa iterar rápido; TypeScript fullstack reduz ciclo front–back. |
| Domínio CRUD-heavy | Questionários, respostas, evidências, relatórios; Go não brilha nesse perfil. |
| Frontend obrigatório | Next.js unifica API + UI; elimina duplicação de tipos e dois deploys de backend. |
| Contratação | Dev TypeScript fullstack é muito mais fácil de encontrar que Go no Brasil. |
| Scoring no frontend | Mesma lógica de scoring/cross-check no server e no client = preview em tempo real sem chamada extra. |

## Arquitetura alvo

```
┌─────────────────────────────┐
│  Next.js (TypeScript)       │
│  - API Routes (REST)        │
│  - Assessment / CRUD / RBAC  │
│  - Dashboard + Spider Chart │
│  - Scoring engine (shared)  │
│  - Cloud Run (service)      │
└──────────┬──────────────────┘
           │ Pub/Sub (scan request)
┌──────────▼──────────────────┐
│  Go Scan Engine             │
│  - Nmap / Nuclei / Subfinder │
│  - Parser + mapping_logic    │
│  - Cloud Run Job (batch)     │
└─────────────────────────────┘
```

- Scan Engine em Go: microserviço que recebe jobs via Pub/Sub e escreve findings no Firestore.
- Next.js: consome Firestore (e Cloud SQL se aplicável) para API e UI; orquestra scans publicando em Pub/Sub.
- JSONs compartilhados: `mapping_logic.json`, `assessment_questions.json` (repositório ou artefato comum).

## Consequências

- **Positivas:** um stack de produto (TypeScript); tipos compartilhados; scoring reutilizável no front; contratação mais simples.
- **Negativas:** migração da API Go para Next.js quando iniciar frontend; possível período de transição (duas APIs ou feature flags).
- **Riscos:** manter disciplina na API (versionamento, erro, auth) ao sair de Gin para Next.js API Routes.

## Referências

- [contexto-nrisk.md](./contexto-nrisk.md)
- [architecture.md](./architecture.md)
- [nrisk-backend-boilerplate](../plans/nrisk-backend-boilerplate.md)
- [nrisk-ui-base-clone](../plans/nrisk-ui-base-clone.md)
