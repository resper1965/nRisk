---
status: in_progress
generated: 2026-02-04
parentPlan: nrisk-ui-base-clone
baseRepository: https://github.com/resper1965/clone
baseStack: Next.js 15, React 19, Shadcn UI
agents:
  - type: "frontend-specialist"
    role: "Adaptar layouts e componentes do clone ao n.Risk"
  - type: "architect-specialist"
    role: "Estrutura de rotas, sidebar por persona"
  - type: "feature-developer"
    role: "Integrar API scans, assessments, Trust Center"
docs:
  - "frontend.md"
  - "api.md"
  - "nrisk-ui-base-clone.md"
phases:
  - id: "setup"
    name: "Setup e Clone"
    prevc: "P"
  - id: "auth-layout"
    name: "Auth e Layout Principal"
    prevc: "E"
  - id: "modulo-ciso"
    name: "Módulo CISO (Painel + Assessments)"
    prevc: "E"
  - id: "modulo-subscritor"
    name: "Módulo Subscritor"
    prevc: "E"
  - id: "modulo-grc"
    name: "Módulo GRC"
    prevc: "E"
  - id: "trust-center"
    name: "Trust Center Público"
    prevc: "E"
---

# Integração Frontend n.Risk com Clone (resper1965/clone)

> Trazer o layout do [resper1965/clone](https://github.com/resper1965/clone) e adequar as funcionalidades do n.Risk às estruturas e componentes disponíveis.

## Task Snapshot

- **Primary goal:** Integrar o frontend n.Risk usando o clone como base; mapear dashboards, páginas e componentes existentes às funcionalidades (scans, assessments, Trust Center); implementar chamadas à API n.Risk.
- **Success signal:** Frontend funcional em `frontend/`; login/registro; painel CISO com scans e assessments; sidebar por persona; Trust Center público.
- **Key references:**
  - [Clone: resper1965/clone](https://github.com/resper1965/clone)
  - [nrisk-ui-base-clone](./nrisk-ui-base-clone.md)
  - [frontend.md](../docs/frontend.md)
  - [api.md](../docs/api.md)

---

## 1. Estrutura Real do Clone (Explorada)

### 1.1 Rotas disponíveis

| Grupo | Caminho | Conteúdo |
|-------|---------|----------|
| **Auth** | `app/dashboard/(auth)/` | Layout com sidebar; múltiplos dashboards |
| **Guest** | `app/dashboard/(guest)/` | Login, register, forgot-password |
| **Dashboards** | `(auth)/project-management/`, `ecommerce/`, `crm/`, `default/` | Cards, charts, tabelas |
| **Pages** | `(auth)/pages/` | orders, users, products, profile, settings, onboarding-flow, pricing |

### 1.2 Componentes UI (Shadcn)

`components/ui/`: card, table, form, chart, progress, badge, alert, tabs, dialog, sidebar, input, select, button, dropdown-menu, avatar, skeleton, toast, etc.

`components/ui/custom/`: count-animation, prompt, etc.

`components/layout/`: header, sidebar, logo

### 1.3 Stack

- Next.js 15, React 19
- Shadcn UI (Tailwind)
- Node.js 20+

---

## 2. Mapeamento n.Risk → Clone

### 2.1 Auth e Layout

| Necessidade n.Risk | Base no Clone | Ação |
|--------------------|---------------|------|
| Login | `(guest)/login/` | Integrar Firebase Auth; obter token com `tenant_id` |
| Registro | `(guest)/register/` | Campos org, email; Identity Platform |
| Sidebar | `components/layout/sidebar/` | Itens por persona: Subscritor, GRC, CISO |
| Layout principal | `(auth)/layout.tsx` | Header + user menu; notificações |

### 2.2 Módulo CISO (Painel de Postura)

| Funcionalidade | Base no Clone | API n.Risk |
|----------------|---------------|------------|
| Dashboard score | `default/` ou `profile/` | GET /scans/:id, GET /assessment/score |
| Score dinâmico | Card + `count-animation` | Score 0–1000, categoria A–F |
| Iniciar scan | Form + Input | POST /scans (domain) |
| Lista de scans | `pages/orders/` (DataTable) | — (ou Firestore direto) |
| Detalhe scan | `orders/[id]/` | GET /scans/:id |
| Questionário | `pages/onboarding-flow/` | GET /assessment, POST /assessment/answer |
| Assessments (progresso) | Tabs + Progress | GET /assessments, PATCH /assessments/:id |
| Evidências | `pages/products/` ou upload | multipart POST |
| Inconsistências | Alert ou Badge | Status Inconsistent nas respostas |

### 2.3 Módulo Subscritor (Seguradora)

| Funcionalidade | Base no Clone | API n.Risk |
|----------------|---------------|------------|
| Dashboard | `project-management/` ou `ecommerce/` | Cards: score médio, propostas |
| Busca domínio | Input + Button | POST /scans |
| Resultado score | Card | GET /scans/:id |
| Lista propostas | `pages/orders/` | — |
| Spider chart ISO | `components/ui/chart` (Radar) | Dados do scan |

### 2.4 Módulo GRC

| Funcionalidade | Base no Clone | API n.Risk |
|----------------|---------------|------------|
| Dashboard | `crm/` | Fornecedores, conformes, pendentes |
| Lista fornecedores | `pages/users/` | — |
| Convite | Dialog + Form | — (futuro) |

### 2.5 Trust Center Público

| Funcionalidade | Base no Clone | API n.Risk |
|----------------|---------------|------------|
| Layout público | `(guest)/layout` (sem sidebar) | URL `/trust/[slug]` |
| Selos | `pages/pricing/` ou Cards | Score, ISO 27001 |
| Documentos | `products/product-list` | — |

---

## 3. Estrutura de Rotas n.Risk (Proposta)

```
app/dashboard/
├── (guest)/              # Clone existente
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (auth)/               # Layout com sidebar
│   ├── layout.tsx
│   ├── ciso/             # Painel de Postura
│   │   ├── page.tsx      # Dashboard score
│   │   ├── scans/
│   │   │   ├── page.tsx  # Lista
│   │   │   └── [id]/page.tsx
│   │   ├── assessments/
│   │   │   ├── page.tsx  # Progresso
│   │   │   └── [id]/page.tsx
│   │   └── evidencias/
│   ├── subscritor/
│   │   ├── page.tsx
│   │   └── propostas/
│   ├── grc/
│   │   ├── page.tsx
│   │   └── fornecedores/
│   └── pages/            # settings, profile (reaproveitar)
└── trust/[slug]/         # Trust Center (layout guest ou próprio)
```

---

## 4. Fases de Implementação

### Fase 1 — Setup

1. Clonar `https://github.com/resper1965/clone` em `nRisk/frontend/`
2. Renomear projeto; `package.json` → name: "nrisk-dashboard"
3. Env: `NEXT_PUBLIC_API_URL`, Firebase config
4. Remover dashboards não usados (opcional) ou manter e mapear

### Fase 2 — Auth e Layout

1. Integrar Firebase Auth em login/register
2. Adaptar sidebar: itens por role (subscritor, grc, ciso)
3. Middleware: redirecionar não autenticados para login
4. Token: `user.getIdToken()` em todas as chamadas API

### Fase 3 — Módulo CISO (prioridade)

1. **Criar** `(auth)/ciso/` com page.tsx (dashboard)
2. Form scan: Input domain + Button → POST /api/v1/scans
3. Lista scans: adaptar `pages/orders` → colunas: domain, status, score
4. Detalhe scan: GET /api/v1/scans/:id
5. Assessments: GET /assessment, POST /assessment/answer; Tabs para trilhas
6. GET /assessments, PATCH /assessments/:id (quando Cloud SQL estiver)
7. Score híbrido: GET /assessment/score

### Fase 4 — Subscritor e GRC

1. Subscritor: dashboard baseado em project-management
2. GRC: dashboard baseado em crm; lista users → fornecedores

### Fase 5 — Trust Center

1. Rota `/trust/[slug]` com layout público
2. Cards/selos; link para documentos

---

## 5. Integrações API (Checklist)

| Endpoint | Uso no Frontend |
|----------|-----------------|
| POST /api/v1/scans | Form "Iniciar scan" (domain) |
| GET /api/v1/scans/:id | Detalhe do scan |
| GET /api/v1/assessment | Listar perguntas (framework=ISO27001) |
| POST /api/v1/assessment/answer | Submeter resposta (multipart com evidência) |
| GET /api/v1/assessment/score | Card score híbrido |
| GET /api/v1/assessments | Lista progresso (futuro) |
| PATCH /api/v1/assessments/:id | Atualizar respostas (futuro) |

---

## 6. Dependências

- API n.Risk rodando (Cloud Run ou local)
- CORS configurado no backend para origem do frontend
- Firebase/Identity Platform com custom claims `tenant_id`

---

## 7. Evidence & Follow-up

- [ ] Clone em `frontend/` com npm install ok
- [ ] Login funcionando com Firebase
- [ ] Sidebar com itens CISO
- [ ] POST /scans e GET /scans/:id integrados
- [ ] Questionário (GET /assessment, POST /assessment/answer) funcional
- [ ] Score híbrido exibido
