---
type: doc
name: frontend
description: Frontend n.Risk — Dashboard, Trust Center e integração
category: frontend
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Frontend — n.Risk

Base: [resper1965/clone](https://github.com/resper1965/clone) (Shadcn UI Kit — Next.js 15, React 19). Ver [nrisk-ui-base-clone](../plans/nrisk-ui-base-clone.md) para mapeamento de módulos.

## Stack

| Tecnologia | Versão |
|------------|--------|
| Next.js | 15 |
| React | 19 |
| UI Kit | Shadcn UI |
| Auth | Firebase Auth (Identity Platform) |
| Formulários | react-hook-form + zod |

## Integração com API

### Base URL

```env
NEXT_PUBLIC_API_URL=https://nrisk-api-xxx.run.app
```

### Autenticação

1. **Login:** Firebase Auth (signInWithEmailAndPassword ou OAuth)
2. **Token:** Obter ID token com `user.getIdToken()`
3. **Requests:** Header `Authorization: Bearer <idToken>`
4. **Custom claims:** `tenant_id` injetado no token pelo Identity Platform

### Chamadas

| Ação | Método | Endpoint |
|------|--------|----------|
| Iniciar scan | POST | /api/v1/scans |
| Obter scan | GET | /api/v1/scans/:id |
| Health | GET | /health |

### Validação Client-Side

- **domain:** Validar hostname (RFC 1123) antes de POST /scans
- **scan_id:** UUID; validar antes de GET /scans/:id

### CORS

A API não expõe CORS por padrão. Ao integrar frontend em domínio diferente:
- Configurar CORS no backend (origem do Firebase Hosting)
- Ou usar mesmo domínio (proxy reverso)

## Estrutura de Rotas (Planejada)

```
app/
├── (auth)/           # Login, registro
├── (dashboard)/      # Layout com sidebar
│   ├── subscritor/   # Seguradora
│   ├── grc/          # Gestor de Terceiros
│   └── ciso/         # Painel de Postura (Avaliado)
├── trust/[slug]/     # Trust Center público
└── api/              # API routes (Next.js)
```

## Módulos por Persona

| Persona | Telas principais |
|---------|------------------|
| **Subscritor** | Dashboard score, busca domínio, propostas, spider chart |
| **GRC** | Fornecedores, convites, Trust Centers |
| **CISO** | Painel postura, questionário, Evidence Vault, inconsistências |
| **Trust Center** | Página pública, selos, NDA, documentos |

## Componentes Críticos

| Necessidade | Componente Shadcn | Uso |
|-------------|-------------------|-----|
| Score 0–1000 | Card + count-animation | Exibir score dinâmico |
| Tabela propostas | DataTable | Lista de scans/propostas |
| Formulário scan | Form + Input | Campo domain, validação |
| Categorias A–F | Badge | Cor por categoria |
| Spider chart ISO | Chart (Radar) | Domínios A.10, A.12, A.13 |
| Questionário | Tabs + Form | Multi-step assessment |

## Setup (Quando Integrar)

1. Clonar `https://github.com/resper1965/clone` em `frontend/`
2. Configurar `NEXT_PUBLIC_API_URL`, Firebase config
3. Adaptar layout (sidebar por persona)
4. Integrar telas de scan (POST /scans, GET /scans/:id)
5. Deploy: Firebase Hosting

## Referências

- [API Reference](./api.md)
- [Plano UI Base Clone](../plans/nrisk-ui-base-clone.md)
- [Architecture](./architecture.md)
