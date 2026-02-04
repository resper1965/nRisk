---
status: in_progress
generated: 2026-02-04
source: Adaptação da Base UI (resper1965/clone) aos Módulos n.Risk
parentPlan: nrisk-mvp
baseRepository: https://github.com/resper1965/clone
baseStack: Next.js 15, React 19, Shadcn UI
agents:
  - type: "frontend-specialist"
    role: "Adaptar componentes e telas do clone ao domínio n.Risk"
  - type: "architect-specialist"
    role: "Definir estrutura de pastas e roteamento por persona"
docs:
  - "architecture.md"
  - "project-overview.md"
phases:
  - id: "setup"
    name: "Setup e Estrutura Base"
    prevc: "E"
  - id: "auth-layout"
    name: "Auth e Layout Principal"
    prevc: "E"
  - id: "modulo-subscritor"
    name: "Módulo Subscritor (Seguradora)"
    prevc: "E"
  - id: "modulo-grc"
    name: "Módulo GRC (Gestor de Terceiros)"
    prevc: "E"
  - id: "modulo-ciso"
    name: "Módulo CISO (Painel de Postura)"
    prevc: "E"
  - id: "modulo-trust-center"
    name: "Trust Center Público"
    prevc: "E"
---

# Adaptação da Base UI (resper1965/clone) aos Módulos n.Risk

> Usar o [resper1965/clone](https://github.com/resper1965/clone) (Shadcn UI Kit — Next.js 15, React 19) como base; mapear e adaptar componentes, telas e elementos a cada módulo da plataforma n.Risk.

## Task Snapshot

- **Primary goal:** Estabelecer a base frontend do n.Risk a partir do clone, adaptando dashboards, forms, tabelas e componentes ao domínio Cyber Risk & Assessment.
- **Success signal:** Estrutura de rotas por persona; componentes renomeados/adaptados; design system consistente.
- **Key references:**
  - [Base: resper1965/clone](https://github.com/resper1965/clone)
  - [PRD MVP](./nrisk-mvp.md)
  - [Matriz GRC](./nrisk-matriz-rastreabilidade-grc.md)
  - [Governança APIs](./nrisk-governanca-dados-apis.md)

---

## 1. Visão da Base (Clone)

| Aspecto | Valor |
|---------|-------|
| **Repositório** | https://github.com/resper1965/clone |
| **Stack** | Next.js 15, React 19 |
| **UI** | Shadcn UI Kit — admin dashboards, templates, componentes prontos |
| **Estrutura típica** | `app/`, `components/`, `hooks/`, `lib/`, `public/` |

---

## 2. Mapeamento Módulo n.Risk → Componente/Tela Clone

### 2.1 Auth e Layout Base

| Necessidade n.Risk | Solução no Clone (caminho real) | Adaptação |
|--------------------|----------------------------------|-----------|
| **Login** | `(guest)/login/v1/` ou `v2/` | Incluir MFA; branding n.Risk |
| **Registro** | `(guest)/register/v1/` ou `v2/` | Campos: org, email, domínio/CNPJ |
| **Forgot password** | `(guest)/forgot-password/` | Manter fluxo |
| **Sidebar / Nav** | `sidebar.tsx` em layout | Itens por persona (Subscritor, GRC, CISO) |
| **Layout principal** | `dashboard/(auth)/layout` | Header com user menu, notificações |

### 2.2 Módulo Subscritor (Seguradora)

| Necessidade n.Risk | Solução no Clone (caminho real) | Adaptação |
|--------------------|----------------------------------|-----------|
| **Dashboard principal** | `project-management/` (summary-cards, chart-project-overview) ou `ecommerce/` (stat-cards, revenue) | Cards: Score médio, propostas pendentes, alertas |
| **Busca CNPJ/Domínio** | Input + Button (ui) | Integrar com API de Subscrição |
| **Resultado Score** | `default/total-revenue` ou Card | Exibir Score (0–1000), categoria A–F, Top 3 riscos |
| **Lista de propostas** | `pages/orders/` (data-table) | Colunas: Domínio, Score, Categoria, Data, Ações |
| **Detalhe proposta** | `pages/orders/[id]/` | Score, Top 3 riscos, spider chart |
| **Relatório PDF** | Button de export | Chamar geração de Relatório de Subscrição |
| **Spider chart ISO** | `components/ui/chart` (Radar) ou `project-management/chart-project-efficiency` | Domínios A.10, A.12, A.13 |
| **Webhooks config** | `pages/settings/` | URL de callback, eventos, testes |

### 2.3 Módulo GRC (Gestor de Terceiros)

| Necessidade n.Risk | Solução no Clone (caminho real) | Adaptação |
|--------------------|----------------------------------|-----------|
| **Dashboard resumo** | `crm/` (leads, total-deals, sales-pipeline) | Fornecedores em análise, conformes, pendentes |
| **Lista de fornecedores** | `pages/users/` (data-table) | Colunas: Fornecedor, Score, Status assessment, Trust Center link |
| **Enviar convite** | `Dialog` + `Form` (ui) | E-mail, mensagem, prazo |
| **Monitorar Trust Center** | Link ou embed | Abrir Trust Center do parceiro |
| **Delegação de perguntas** | `Select` multi ou `pages/products/create/add-category` | Selecionar perguntas e destinatários (FR3) |

### 2.4 Módulo CISO / Painel de Postura (Avaliado)

| Necessidade n.Risk | Solução no Clone (caminho real) | Adaptação |
|--------------------|----------------------------------|-----------|
| **Dashboard Painel** | `profile/` (profile-card, latest-activity) ou `default/` | Score dinâmico, tendência |
| **Score dinâmico** | `ui/custom/count-animation` + Card | Score 0–1000, trend (↑↓), categoria |
| **Questionário (15 perguntas)** | `onboarding-flow/` (multi-step) + `Tabs` | Trilhas Essencial/Intermediário/Avançado; uma pergunta por step |
| **Evidence Vault (upload)** | `products/create/add-media-from-url` ou componente de upload | PDF, imagens; vincular a resposta |
| **Inconsistências** | `ui/alert` ou `ui/badge` | Listar flags (ex.: "C-01: Porta RDP detectada") |
| **Progresso** | `ui/progress` | % concluído do assessment |
| **Log de transparência** | `pages/users/data-table` ou `orders/data-table` | "Quem consultou nos últimos 90 dias" |

### 2.5 Trust Center Público

| Necessidade n.Risk | Solução no Clone (caminho real) | Adaptação |
|--------------------|----------------------------------|-----------|
| **Layout público** | `(guest)/layout` (sem sidebar) | URL `/trust/[slug]` |
| **Página pública** | `pricing/` (table, column ou single) | Selos como "planos" ou cards |
| **Selos de segurança** | `ui/badge` + `ui/card` | Score, ISO 27001, NIST CSF |
| **Documentos públicos** | `products/product-list` ou cards | Links para PDFs públicos |
| **NDA para sensíveis** | `Dialog` + `Checkbox` + botão Assinar | Fluxo de aceite antes de liberar |
| **Widget embarcável** | Componente isolado | iframe ou script para site do cliente |

### 2.6 Configurações e Outros

| Necessidade n.Risk | Solução no Clone | Adaptação |
|--------------------|------------------|-----------|
| **Configurações da conta** | Settings page | Perfil, MFA, tokens de API |
| **Token de autorização (OAuth)** | Form de geração | Chave temporária para auditor |
| **Notificações** | Dropdown/bell | Alertas de score, webhooks, convites |

---

## 3. Componentes Shadcn a Reutilizar (Checklist)

Componentes típicos do Shadcn UI que o clone deve ter; adaptar props e conteúdo:

| Componente | Uso no n.Risk |
|------------|---------------|
| **Button** | Ações (buscar, salvar, exportar PDF) |
| **Card** | Score, métricas, perguntas, selos |
| **Table / DataTable** | Propostas, fornecedores, logs, documentos |
| **Form** (react-hook-form + zod) | Questionário, convites, configurações |
| **Input, Select, Checkbox** | Formulários |
| **Alert, Badge** | Inconsistências, categorias de risco (A–F) |
| **Tabs** | Alternar entre trilhas (Essencial/Intermediário/Avançado) |
| **Dialog / Modal** | NDA, convite, confirmações |
| **Progress** | Progresso do assessment |
| **Chart** (Recharts) | Spider chart, tendência de score |
| **DropdownMenu** | Ações por linha, user menu |
| **Avatar** | Usuário logado |
| **Skeleton** | Loading states |

---

## 4. Estrutura de Rotas Sugerida

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── layout.tsx          # Sidebar + header; itens por role
│   ├── subscritor/         # Seguradora
│   │   ├── page.tsx        # Dashboard
│   │   ├── propostas/
│   │   ├── assess/[domain]/
│   │   └── configuracoes/
│   ├── grc/                # Gestor de Terceiros
│   │   ├── page.tsx
│   │   ├── fornecedores/
│   │   ├── convites/
│   │   └── ...
│   └── ciso/               # CISO / Avaliado
│       ├── page.tsx        # Painel de Postura
│       ├── assessment/
│       ├── evidencias/
│       └── ...
├── trust/[slug]/           # Trust Center público (sem auth obrigatória)
│   └── page.tsx
└── api/                    # API routes (Next.js)
```

---

## 5. Passos de Implementação

### Fase 1 — Setup

1. Clonar `https://github.com/resper1965/clone` como base do frontend n.Risk
2. Renomear projeto; ajustar `package.json` e metadados
3. Configurar variáveis de ambiente (API base URL, Identity Platform)

### Fase 2 — Layout e Auth

1. Adaptar layout principal (sidebar) com itens por persona
2. Adaptar telas de login/registro; integrar Identity Platform (MFA)
3. Middleware de rota por role (subscritor, grc, ciso)

### Fase 3 — Módulos por Persona

1. **Subscritor:** Dashboard, busca, resultado score, tabela propostas, spider chart
2. **GRC:** Lista fornecedores, convites, delegação
3. **CISO:** Painel postura, questionário, Evidence Vault, inconsistências
4. **Trust Center:** Página pública, selos, NDA, widget

### Fase 4 — Integrações

1. Chamadas à API (Subscrição, Trust Center, Assessment)
2. Webhooks config e testes
3. Geração/visualização de PDF

---

## 6. Estrutura Real do Clone (Explorada)

### 6.1 Dashboards Disponíveis

| Dashboard | Caminho | Melhor para n.Risk |
|-----------|---------|---------------------|
| **project-management** | `app/dashboard/(auth)/project-management/` | Subscritor: summary-cards, chart-project-overview, table-recent-projects, reports |
| **ecommerce** | `app/dashboard/(auth)/ecommerce/` | Subscritor: stat-cards, revenue, recent-orders |
| **crm** | `app/dashboard/(auth)/crm/` | GRC: leads, sales-pipeline, total-deals, leads-by-source |
| **default** | `app/dashboard/(auth)/default/` | Base: total-revenue, subscriptions, latest-payments |
| **onboarding-flow** | `app/dashboard/(auth)/pages/onboarding-flow/` | Assessment: multi-step form (account-type, work-preferences, interests) |
| **users** | `app/dashboard/(auth)/pages/users/` | GRC: data-table de fornecedores |
| **orders** | `app/dashboard/(auth)/pages/orders/` | Subscritor: data-table de propostas; orders/[id] para detalhe |
| **products** | `app/dashboard/(auth)/pages/products/` | Evidence Vault: product-list como base para lista de documentos |
| **settings** | `app/dashboard/(auth)/pages/settings/` | Configurações: account, appearance, notifications, billing |
| **profile** | `app/dashboard/(auth)/pages/profile/` | CISO: profile-card, latest-activity para Painel de Postura |
| **pricing** | `app/dashboard/(auth)/pages/pricing/` | Trust Center: tabela/coluna de selos |

### 6.2 Auth e Páginas Públicas

| Página | Caminho |
|--------|---------|
| **Login** | `app/dashboard/(guest)/login/v1/` ou `v2/` |
| **Registro** | `app/dashboard/(guest)/register/v1/` ou `v2/` |
| **Forgot password** | `app/dashboard/(guest)/forgot-password/` |
| **404 / 500** | `app/dashboard/(guest)/pages/error/` |

### 6.3 Componentes UI (Shadcn)

`components/ui/`: chart, table, form, card, badge, progress, tabs, dialog, sidebar, accordion, alert, avatar, button, checkbox, dropdown-menu, input, select, toast, etc.

`components/ui/custom/`: count-animation, prompt (chat), minimal-tiptap (editor).

---

## 7. Evidence & Follow-up

- [ ] Clone integrado ao monorepo ou pasta `frontend/` do n.Risk
- [ ] Documento de componentes disponíveis no clone (após exploração)
- [ ] Layout por persona implementado
- [ ] Telas críticas (Dashboard Subscritor, Painel CISO, Trust Center) adaptadas
- [ ] Design tokens (cores, tipografia) alinhados à marca n.Risk
