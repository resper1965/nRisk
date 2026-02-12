---
status: done
generated: 2026-02-06
source: TPRA Methodology + MVP Plan + Assessment Hibrido
parentPlan: nrisk-mvp
agents:
  - type: "architect-specialist"
    role: "Modelar entidades de fornecedores, convites e Trust Center"
  - type: "backend-specialist"
    role: "API endpoints para TPRA: fornecedores, convites, trilhas, Trust Center"
  - type: "frontend-specialist"
    role: "Dashboard GRC, painel de portfolio, Trust Center publico"
  - type: "database-specialist"
    role: "Schema para suppliers, invitations, trust_center_profiles"
  - type: "security-auditor"
    role: "RBAC multi-tenant, NDA workflow, Evidence Vault"
  - type: "test-writer"
    role: "E2E fluxo de convite, scoring de portfolio, cross-check de terceiros"
docs:
  - "tpra-avaliacao-riscos-terceiros.md"
  - "architecture.md"
  - "database.md"
  - "api.md"
  - "regras-de-negocio-assessment.md"
phases:
  - id: "fase-1"
    name: "Gestao de Fornecedores e Convites"
    prevc: "D"
  - id: "fase-2"
    name: "Trilhas de Maturidade (Bronze/Prata/Ouro)"
    prevc: "D"
  - id: "fase-3"
    name: "Cross-Check Engine TPRA"
    prevc: "D"
  - id: "fase-4"
    name: "Trust Center e NDA Workflow"
    prevc: "D"
  - id: "fase-5"
    name: "Portfolio Dashboard e Metricas TPRM"
    prevc: "D"
  - id: "fase-6"
    name: "Monitoramento Continuo e Alertas"
    prevc: "D"
---

# Plano de Implementacao TPRA — n.Risk

> Plano de desenvolvimento para implementar o ciclo completo de Third-Party Risk Assessment (TPRA) no n.Risk. Cobre desde a gestao de fornecedores ate o monitoramento continuo.

## Task Snapshot

- **Primary goal:** Implementar o ciclo TPRA completo: Identificacao > Due Diligence > Scoring > Conformidade > Remediacao/Monitoramento.
- **Success signal:** Gestor GRC consegue cadastrar fornecedor, enviar convite, receber assessment preenchido, ver score hibrido com cross-check e acompanhar evolucao no portfolio.
- **Key references:**
  - [TPRA Metodologia](../docs/tpra-avaliacao-riscos-terceiros.md)
  - [Plano MVP](./nrisk-mvp.md)
  - [Scoring Metodologia](./nrisk-scoring-metodologia.md)
  - [Regras de Negocio](../docs/regras-de-negocio-assessment.md)

---

## 1. Modelo de Dados TPRA

### 1.1 Novas Entidades (Cloud SQL)

#### `suppliers` — Cadastro de Fornecedores

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | PK |
| tenant_id | UUID | Sim | Tenant do avaliador (quem cadastrou) |
| name | VARCHAR(255) | Sim | Nome do fornecedor |
| domain | VARCHAR(253) | Sim | Dominio principal |
| cnpj | VARCHAR(18) | Nao | CNPJ (apenas Brasil) |
| criticality | ENUM | Sim | critical, high, medium, low |
| category | VARCHAR(100) | Nao | Setor/tipo (cloud, erp, saas, consultoria, etc.) |
| status | ENUM | Sim | active, inactive, pending_assessment, blocked |
| supplier_tenant_id | UUID | Nao | FK para tenants.id se o fornecedor tambem e tenant na plataforma |
| contact_name | VARCHAR(255) | Nao | Nome do contato principal |
| contact_email | VARCHAR(255) | Nao | E-mail do contato |
| notes | TEXT | Nao | Observacoes internas |
| created_at | TIMESTAMP | Sim | Data de cadastro |
| updated_at | TIMESTAMP | Sim | Ultima atualizacao |

**Indices:** `idx_suppliers_tenant` (tenant_id), `idx_suppliers_domain` (domain), `idx_suppliers_criticality` (tenant_id, criticality).
**RLS:** Isolamento por `tenant_id` do avaliador.

#### `supplier_invitations` — Convites de Assessment

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | PK |
| tenant_id | UUID | Sim | Tenant do avaliador |
| supplier_id | UUID | Sim | FK suppliers.id |
| track | ENUM | Sim | bronze, silver, gold |
| framework_id | VARCHAR(50) | Sim | ISO27001, NIST, LGPD |
| invited_email | VARCHAR(255) | Sim | E-mail do fornecedor convidado |
| invited_by | VARCHAR(255) | Sim | E-mail do gestor que enviou |
| status | ENUM | Sim | pending, accepted, in_progress, completed, expired |
| token | VARCHAR(64) | Sim | Token unico para acesso do fornecedor |
| expires_at | TIMESTAMP | Sim | Validade do convite |
| accepted_at | TIMESTAMP | Nao | Quando o fornecedor aceitou |
| completed_at | TIMESTAMP | Nao | Quando o assessment foi submetido |
| created_at | TIMESTAMP | Sim | Data de criacao |

**Indices:** `idx_invitations_supplier` (supplier_id), `idx_invitations_token` (token UNIQUE), `idx_invitations_tenant_status` (tenant_id, status).

#### `trust_center_profiles` — Perfil Trust Center

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | PK |
| tenant_id | UUID | Sim | FK tenants.id (tenant do fornecedor/avaliado) |
| slug | VARCHAR(100) | Sim | URL slug publico (/trust/{slug}) |
| display_name | VARCHAR(255) | Sim | Nome exibido publicamente |
| description | TEXT | Nao | Descricao da empresa |
| logo_url | VARCHAR(500) | Nao | URL do logo |
| is_public | BOOLEAN | Sim | Trust Center visivel sem autenticacao |
| show_score | BOOLEAN | Sim | Exibir score A-F publicamente |
| show_domain_scores | BOOLEAN | Sim | Exibir spider chart publicamente |
| nda_required | BOOLEAN | Sim | Exigir NDA para documentos sensiveis |
| seals | JSONB | Nao | Array de selos (ISO, SOC2, LGPD, etc.) |
| public_documents | JSONB | Nao | Array de docs publicos (nome, url, tipo) |
| nda_documents | JSONB | Nao | Array de docs que exigem NDA |
| created_at | TIMESTAMP | Sim | Data de criacao |
| updated_at | TIMESTAMP | Sim | Ultima atualizacao |

**Indices:** `idx_trust_center_slug` (slug UNIQUE), `idx_trust_center_tenant` (tenant_id UNIQUE).

#### `nda_requests` — Solicitacoes de NDA

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | UUID | Sim | PK |
| trust_center_id | UUID | Sim | FK trust_center_profiles.id |
| requester_email | VARCHAR(255) | Sim | E-mail do solicitante |
| requester_name | VARCHAR(255) | Sim | Nome do solicitante |
| requester_company | VARCHAR(255) | Nao | Empresa do solicitante |
| status | ENUM | Sim | pending, approved, rejected, expired |
| approved_by | VARCHAR(255) | Nao | Quem aprovou |
| approved_at | TIMESTAMP | Nao | Quando aprovou |
| expires_at | TIMESTAMP | Nao | Validade do acesso NDA |
| created_at | TIMESTAMP | Sim | Data da solicitacao |

### 1.2 Alteracoes em Entidades Existentes

#### `assessment_questions` — Novos campos

| Campo novo | Tipo | Descricao |
|------------|------|-----------|
| track | ENUM(bronze, silver, gold) | Trilha minima para esta pergunta aparecer |
| evidence_required | BOOLEAN | Se a trilha Prata/Ouro exige evidencia |
| tpra_stage | ENUM | Estagio TPRA: identification, due_diligence, risk_scoring, compliance, remediation |
| supplier_context | BOOLEAN | Se a pergunta e especifica para avaliacao de terceiros (vs autoavaliacao) |

#### `assessments` — Novos campos

| Campo novo | Tipo | Descricao |
|------------|------|-----------|
| track | ENUM(bronze, silver, gold) | Trilha escolhida para este assessment |
| supplier_id | UUID | FK suppliers.id (se assessment de terceiro) |
| invitation_id | UUID | FK supplier_invitations.id (se via convite) |

---

## 2. Fases de Implementacao

### Fase 1 — Gestao de Fornecedores e Convites (2 semanas)

**Objetivo:** Permitir que o Gestor GRC cadastre fornecedores, classifique por criticidade e envie convites de assessment.

**Entregas:**

| Artefato | Descricao |
|----------|-----------|
| Migration `003_suppliers.sql` | Tabela `suppliers` com RLS |
| Migration `004_invitations.sql` | Tabela `supplier_invitations` |
| API `POST /api/v1/suppliers` | Cadastrar fornecedor (dominio, criticidade, contato) |
| API `GET /api/v1/suppliers` | Listar fornecedores do tenant com filtros (criticidade, status) |
| API `GET /api/v1/suppliers/:id` | Detalhes do fornecedor + ultimo score |
| API `PATCH /api/v1/suppliers/:id` | Atualizar dados do fornecedor |
| API `POST /api/v1/suppliers/:id/invite` | Enviar convite de assessment (trilha, e-mail) |
| API `GET /api/v1/invitations` | Listar convites do tenant |
| API `POST /api/v1/invitations/:token/accept` | Fornecedor aceita convite (sem auth; via token) |
| UI: Pagina de Fornecedores | Tabela com nome, dominio, criticidade, score, status |
| UI: Modal de Cadastro | Formulario com dominio, criticidade, contato |
| UI: Modal de Convite | Escolha de trilha + e-mail do fornecedor |

**Regras de negocio:**
- Ao cadastrar fornecedor com dominio, disparar scan automatico (Pub/Sub → Scan Job)
- Convite gera token unico com validade de 30 dias
- Fornecedor que aceita convite ganha acesso ao assessment na trilha escolhida
- Se o fornecedor ja e tenant, vincular `supplier_tenant_id`

**Steps:**
1. Criar migrations `003_suppliers.sql` e `004_invitations.sql`
2. Implementar CRUD de suppliers (API + repository)
3. Implementar fluxo de convites (API + token + aceitacao)
4. Trigger: cadastro de fornecedor → scan automatico do dominio
5. UI: pagina de fornecedores + modais

---

### Fase 2 — Trilhas de Maturidade Bronze/Prata/Ouro (2 semanas)

**Objetivo:** Permitir que o assessment filtre perguntas por trilha e exija evidencias conforme a trilha escolhida.

**Entregas:**

| Artefato | Descricao |
|----------|-----------|
| Migration `005_questions_tracks.sql` | Adicionar campo `track` e `evidence_required` em `assessment_questions` |
| Seed: perguntas Prata | 15+ perguntas com `evidence_required = true` |
| Seed: perguntas Ouro | 20+ perguntas framework completo (ISO 27001 Anexo A total) |
| API: filtro por trilha | `GET /api/v1/assessment?track=silver` retorna perguntas da trilha |
| Logica de score por trilha | F penalizado por falta de evidencia em Prata/Ouro (regra 2 do regras-de-negocio) |
| UI: indicador de trilha | Badge Bronze/Prata/Ouro no assessment |
| UI: upload de evidencia | Componente de upload vinculado a pergunta (GCS Evidence Vault) |

**Regras de negocio:**
- Bronze: 20 perguntas atuais; evidencia opcional
- Prata: Bronze + 15 perguntas adicionais; evidencia obrigatoria para perguntas com `evidence_required = true`
- Ouro: Prata + 20 perguntas adicionais; cobertura total dos 15 dominios ISO 27001
- Resposta "Sim" sem evidencia em Prata/Ouro reduz fator F (nao bloqueia)

**Steps:**
1. Adicionar campo `track` e `evidence_required` nas perguntas existentes
2. Criar perguntas Prata com foco em evidencia (politicas, certificados, auditorias)
3. Criar perguntas Ouro com cobertura completa ISO 27001 Anexo A
4. Implementar filtro por trilha na API de assessment
5. Implementar logica de F com penalidade por falta de evidencia
6. UI: upload de evidencia com preview e vinculo a pergunta

---

### Fase 3 — Cross-Check Engine para TPRA (1 semana)

**Objetivo:** Estender o cross-check para funcionar no contexto de avaliacao de terceiros, comparando respostas do fornecedor com scan do dominio dele.

**Entregas:**

| Artefato | Descricao |
|----------|-----------|
| Extensao `MarkInconsistentAnswers` | Aceitar scan do `supplier_tenant_id` para cross-check |
| API: cross-check por fornecedor | `GET /api/v1/suppliers/:id/score` retorna score com cross-check |
| Novas regras de cross-check TPRA | Regras especificas para contexto de terceiros |
| UI: indicador de inconsistencia | Badge vermelho em respostas inconsistentes |

**Novas regras de cross-check TPRA:**

| Pergunta (assessment do fornecedor) | Evidencia tecnica (scan do dominio do fornecedor) | Acao |
|--------------------------------------|---------------------------------------------------|------|
| "Avalia fornecedores criticos de TI" (Q-12) | Scan detecta subcontratantes com portas criticas | Alerta de Risco |
| "Possui clausula de notificacao 72h" | Credenciais do dominio vazadas sem notificacao | Inconsistencia Critica |
| "Dados pessoais com controles adequados" (Q-20) | Missing privacy policy detectada no scan | Inconsistencia |
| "Backup com testes periodicos" (Q-07) | Nenhuma evidencia tecnica possivel | Sem cross-check (apenas declaratorio) |

**Steps:**
1. Estender `MarkInconsistentAnswers` para aceitar scan de terceiro
2. Adicionar novas regras TPRA no mapping
3. Implementar endpoint de score por fornecedor
4. UI: mostrar inconsistencias no contexto de avaliacao do fornecedor

---

### Fase 4 — Trust Center e NDA Workflow (2 semanas)

**Objetivo:** Permitir que o avaliado (CISO) publique um Trust Center com score, selos e documentos, com fluxo de NDA para docs sensiveis.

**Entregas:**

| Artefato | Descricao |
|----------|-----------|
| Migration `006_trust_center.sql` | Tabelas `trust_center_profiles` e `nda_requests` |
| API `POST /api/v1/trust-center` | Criar/atualizar perfil Trust Center |
| API `GET /api/v1/trust-center` | Obter perfil do tenant autenticado |
| API `GET /trust/:slug` | Endpoint publico (sem auth) — retorna perfil Trust Center |
| API `POST /trust/:slug/nda-request` | Solicitar acesso NDA (sem auth) |
| API `GET /api/v1/nda-requests` | Listar solicitacoes NDA do tenant |
| API `PATCH /api/v1/nda-requests/:id` | Aprovar/rejeitar NDA |
| UI: Editor Trust Center | Formulario para configurar o que e publico |
| UI: Pagina publica Trust Center | Score, selos, docs publicos, botao NDA |
| UI: Gestao de NDA | Lista de solicitacoes com aprovacao |

**Regras de negocio:**
- Trust Center tem URL publica: `/trust/{slug}`
- Opcoes configuraveis: mostrar score, mostrar spider chart, exigir NDA
- Selos sao badges (ISO 27001, SOC 2, LGPD) com status (certificado, em progresso, planejado)
- NDA: solicitante informa e-mail e empresa; tenant aprova; acesso expira em 90 dias (configuravel)
- Documentos publicos: politica de privacidade, termos, certificados
- Documentos NDA: relatorios de auditoria, pentest, SOC 2 report

**Steps:**
1. Criar migrations para Trust Center e NDA
2. Implementar CRUD de Trust Center (API + repository)
3. Implementar fluxo de NDA (solicitacao, aprovacao, expiracao)
4. Endpoint publico `/trust/:slug` com dados do perfil + score
5. UI: editor + pagina publica + gestao de NDA

---

### Fase 5 — Portfolio Dashboard e Metricas TPRM (2 semanas)

**Objetivo:** Oferecer ao Gestor GRC e a Seguradora uma visao consolidada de todos os fornecedores/segurados.

**Entregas:**

| Artefato | Descricao |
|----------|-----------|
| API `GET /api/v1/portfolio/summary` | Metricas agregadas do portfolio |
| API `GET /api/v1/portfolio/suppliers` | Lista de fornecedores com score, tendencia, criticidade |
| API `GET /api/v1/portfolio/risk-distribution` | Distribuicao de score A-F do portfolio |
| UI: Dashboard Portfolio | Cards com metricas + tabela de fornecedores + graficos |
| UI: Heatmap de risco | Mapa de calor criticidade x score |
| UI: Tendencia de portfolio | Grafico de evolucao do score medio |

**Metricas TPRM implementadas:**

| Metrica | Calculo | Visualizacao |
|---------|---------|--------------|
| Cobertura de avaliacao | suppliers com assessment completed / suppliers total | Gauge (%) |
| Score medio | AVG(Sf) de todos os suppliers com score | Numero + tendencia |
| Distribuicao A-F | COUNT por categoria | Bar chart |
| Taxa de inconsistencia | AVG(% de respostas inconsistentes) | Gauge (%) |
| Fornecedores em risco | COUNT suppliers com score D/E/F | Numero em vermelho |
| Tendencia do portfolio | Score medio por mes (ultimos 12) | Line chart |

**Steps:**
1. Implementar queries de agregacao (portfolio summary)
2. API endpoints de portfolio
3. UI: dashboard com cards, tabela, graficos
4. UI: heatmap criticidade x score
5. UI: grafico de tendencia

---

### Fase 6 — Monitoramento Continuo e Alertas (1 semana)

**Objetivo:** Automatizar re-scans e alertar quando a postura de um fornecedor deteriora.

**Entregas:**

| Artefato | Descricao |
|----------|-----------|
| Cloud Scheduler | Job de re-scan conforme criticidade do fornecedor |
| Logica de deterioracao | Comparar score atual com ultimo snapshot |
| API `GET /api/v1/suppliers/:id/score-history` | Historico de scores do fornecedor |
| Webhook/notificacao | Alertar gestor quando score cai abaixo do threshold |
| UI: Timeline de score | Grafico de evolucao do score do fornecedor |
| UI: Alertas | Notificacoes de deterioracao |

**Frequencia de re-scan por criticidade:**

| Criticidade | Frequencia | Alerta se |
|-------------|------------|-----------|
| Critico | Semanal | Score cai >= 100 pontos ou muda de categoria |
| Alto | Quinzenal | Score cai >= 150 pontos ou muda de categoria |
| Medio | Mensal | Score muda de categoria |
| Baixo | Trimestral | Score cai para D/E/F |

**Steps:**
1. Implementar Cloud Scheduler com frequencia por criticidade
2. Logica de comparacao de score (atual vs snapshot anterior)
3. Sistema de alertas (in-app + webhook configuravel)
4. UI: timeline de score por fornecedor
5. UI: painel de alertas

---

## 3. Mapeamento TPRA → Fases

| Estagio TPRA | Fase | Entrega principal |
|-------------|------|-------------------|
| Identificacao de terceiros | Fase 1 | CRUD de fornecedores com criticidade |
| Due Diligence / Questionarios | Fase 1 + Fase 2 | Convites + trilhas Bronze/Prata/Ouro |
| Risk Scoring | Fase 3 + existente | Cross-check TPRA + score hibrido |
| Conformidade (LGPD/ISO) | Fase 4 + existente | Trust Center + Evidence Vault |
| Remediacao e Monitoramento | Fase 5 + Fase 6 | Portfolio + re-scan + alertas |

---

## 4. Dependencias

| Fase | Depende de |
|------|------------|
| Fase 1 | Backend Go → Next.js (ADR-001) ou implementar em Go como transicao |
| Fase 2 | Fase 1 (supplier_id para vincular assessment) + assessment_questions.json atualizado |
| Fase 3 | Fase 1 + Fase 2 + motor de cross-check existente |
| Fase 4 | Fase 1 (para Trust Center saber qual tenant mostrar) |
| Fase 5 | Fase 1 + Fase 3 (para ter scores de fornecedores) |
| Fase 6 | Fase 5 + Cloud Scheduler + Pub/Sub (fluxo de scan) |

---

## 5. Riscos e Mitigacao

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Fornecedor nao responde convite | Alta | Medio | Lembretes automaticos; fallback score so tecnico |
| Volume de fornecedores alto para scan | Media | Alto | Rate limiting; fila de prioridade por criticidade |
| NDA workflow complexo | Baixa | Medio | MVP com aprovacao manual; automacao posterior |
| Trust Center com dados incorretos | Media | Alto | Score sempre calculado; selos manuais com validacao |

---

## 6. Estimativa de Esforco

| Fase | Esforco | Calendario | Pre-requisito |
|------|---------|------------|---------------|
| Fase 1 | ~10 person-days | 2 semanas | Schema + API base |
| Fase 2 | ~10 person-days | 2 semanas | Fase 1 + questions JSON |
| Fase 3 | ~5 person-days | 1 semana | Fase 1 + 2 |
| Fase 4 | ~10 person-days | 2 semanas | Fase 1 |
| Fase 5 | ~10 person-days | 2 semanas | Fase 1 + 3 |
| Fase 6 | ~5 person-days | 1 semana | Fase 5 |
| **Total** | **~50 person-days** | **~10 semanas** | |

---

## 7. Evidence & Follow-up

- [x] Criar migrations SQL para suppliers, invitations, trust_center, monitoring, alerts (003-007)
- [x] Implementar API CRUD de suppliers (Fase 1 — commit 94f935a)
- [x] Implementar fluxo de convites com token (Fase 1 — commit 94f935a)
- [x] Estender assessment_questions.json com perguntas Prata/Ouro (commit 4ee54b5)
- [x] Estender mapping_logic.json com regras TPRA (commit 4ee54b5)
- [x] Trilhas de maturidade Bronze/Prata/Ouro (Fase 2 — commit d6d1e5e)
- [x] Cross-Check Engine para TPRA + supplier score (Fase 3 — commit 3f19347)
- [x] Implementar Trust Center publico (Fase 4 — commit 5c38b45)
- [x] Implementar NDA workflow (Fase 4 — commit 5c38b45)
- [x] Dashboard de portfolio com metricas TPRM (Fase 5 — commit e742deb)
- [x] Sistema de monitoramento continuo e alertas (Fase 6 — commit e742deb)
- [ ] Testes E2E do fluxo completo: cadastro → convite → assessment → score → portfolio
