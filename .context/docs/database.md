---
type: doc
name: database
description: Esquemas e persistência de dados n.Risk
category: database
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Persistência de Dados — n.Risk

Modelo híbrido: **Firestore** para scans/findings (MVP) e **Cloud SQL** para GRC/assessments (Mês 2).

## 1. Firestore (MVP)

### Hierarquia de Coleções

```
tenants/{tenantId}/
├── scans/{scanId}              # Documento ScanResult
└── scans/{scanId}/findings/{findingId}  # Subcoleção AuditFinding
```

### Documento Scan (`tenants/{tenantId}/scans/{scanId}`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | string | Sim | UUID do scan |
| tenant_id | string | Sim | ID do tenant |
| domain | string | Sim | Domínio escaneado |
| status | string | Sim | pending, running, completed, completed_with_errors, failed |
| score | number | Sim | 0–1000; base 1000 menos deduções |
| score_category | string | Sim | A (≥900), B (≥750), C (≥600), D (≥400), E (≥250), F (<250) |
| started_at | timestamp | Sim | Início do scan |
| finished_at | timestamp | Não | Fim do scan |

**Regras Firestore:** `isTenantMember(tenantId)`; validação de `score` 0–1000 e `domain` não vazio no create/update.

### Documento Finding (`tenants/{tenantId}/scans/{scanId}/findings/{findingId}`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | UUID do finding |
| tenant_id | string | ID do tenant |
| scan_id | string | ID do scan pai |
| domain | string | Domínio escaneado |
| tool_name | string | nuclei, nmap, subfinder |
| technical_finding | string | Achado bruto |
| template_id | string | ID do template Nuclei (opcional) |
| port | number | Porta (Nmap; opcional) |
| control_id | string | C-01, C-02, etc. |
| iso_domain | string | A.13.1.1, etc. |
| iso_title | string | Nome do controle |
| score_deduction | number | Dedução aplicada |
| severity | string | critical, high, medium, low |
| title | string | Título legível |
| detail | string | Detalhes |
| recommendation | string | Recomendação de remediação |
| raw_output | string | Output bruto da ferramenta |
| created_at | timestamp | Data de criação |

**Regras Firestore:** `isTenantMember(tenantId)` para read/write.

### Coleção Answers (Firestore — MVP)

| Path | Uso | Status |
|------|-----|--------|
| tenants/{tid}/answers/{questionId} | Respostas declarativas (assessment_questions.json) | MVP em uso |

**Migração:** Cloud SQL `assessment_answers` será a fonte canônica; Firestore answers podem coexistir para rollout gradual.

### Outras Coleções (Firestore)

| Path | Uso | Status |
|------|-----|--------|
| tenants/{tid}/public_profile/{profileId} | Trust Center público | Previsto |
| tenants/{tid}/{document=**} | Genérico sob tenant | Catch-all |

### Índices Firestore

Consultas atuais são por ID (documento único). Listagens por `domain`, `status` ou `started_at` exigirão índices compostos quando implementadas.

---

## 2. Cloud SQL (PostgreSQL) — Mês 2

### Tabelas (001_grc_schema.sql, 002_assessment_questions_answers.sql)

| Tabela | Papel |
|--------|-------|
| **tenants** | Catálogo de organizações; `id` = tenant_id do JWT |
| **frameworks** | ISO 27001, NIST, LGPD |
| **controls** | Controles do framework (C-01, C-02, …) |
| **mapping_logic** | Achado técnico → control_id, impact_on_score |
| **assessments** | Sessão/rodada de questionário; tenant_id, framework_id, status |
| **assessment_questions** | Catálogo de perguntas; vinculado a control_id do mapping_logic |
| **assessment_answers** | Respostas; tenant_id, assessment_id, question_id, answer_status (sim/nao/na/Inconsistent), evidence_storage_path |

### Relacionamentos

```
frameworks ← controls ← mapping_logic
tenants ← assessments
assessment_questions → controls
tenants + assessments ← assessment_answers → assessment_questions, controls
```

### Índices Cloud SQL

| Tabela | Índice | Propósito |
|--------|--------|-----------|
| frameworks | idx_frameworks_name_version | Lookup por nome/versão |
| controls | idx_controls_framework | Filtrar por framework |
| controls | idx_controls_iso_domain | Filtrar por domínio ISO |
| mapping_logic | idx_mapping_logic_control | Lookup por controle |
| mapping_logic | idx_mapping_logic_finding | Lookup por achado técnico |
| mapping_logic | idx_mapping_logic_control_finding | Unique (control, finding) |
| assessments | idx_assessments_tenant | Filtrar por tenant |
| assessment_questions | idx_assessment_questions_control | Lookup por control_id |
| assessment_answers | idx_assessment_answers_tenant | Filtrar por tenant |
| assessment_answers | idx_assessment_answers_assessment | Filtrar por assessment |
| assessment_answers | idx_assessment_answers_tenant_assessment_question | Unique (tenant, assessment, question) |

### RLS (Row Level Security)

- **assessments, assessment_answers:** isolamento por `tenant_id` via `current_setting('app.current_tenant_id')`
- **assessment_questions:** dados globais (catálogo)
- **tenants, frameworks, controls, mapping_logic:** dados globais (sem tenant_id)

**Função:** `set_tenant_context(tenant_id TEXT)` — definir tenant na sessão antes das queries.

---

## 2.1 Tabelas TPRA (Planejadas — Migrations 003-006)

> Ver [plano de implementacao TPRA](../plans/nrisk-tpra-implementacao.md) para detalhes completos.

### `suppliers` (003_suppliers.sql)

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | UUID PK | ID do fornecedor |
| tenant_id | UUID FK | Tenant do avaliador |
| name | VARCHAR(255) | Nome do fornecedor |
| domain | VARCHAR(253) | Dominio principal |
| cnpj | VARCHAR(18) | CNPJ (opcional) |
| criticality | ENUM(critical,high,medium,low) | Nivel de criticidade |
| status | ENUM(active,inactive,pending_assessment,blocked) | Status do fornecedor |
| supplier_tenant_id | UUID FK (nullable) | Se fornecedor tambem e tenant |
| contact_name | VARCHAR(255) | Contato principal |
| contact_email | VARCHAR(255) | E-mail do contato |

**RLS:** Isolamento por `tenant_id` do avaliador.
**Indices:** `tenant_id`, `domain`, `(tenant_id, criticality)`.

### `supplier_invitations` (004_invitations.sql)

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | UUID PK | ID do convite |
| tenant_id | UUID FK | Tenant do avaliador |
| supplier_id | UUID FK | Fornecedor convidado |
| track | ENUM(bronze,silver,gold) | Trilha do assessment |
| framework_id | VARCHAR(50) | ISO27001, NIST, LGPD |
| invited_email | VARCHAR(255) | E-mail do convidado |
| token | VARCHAR(64) UNIQUE | Token de acesso |
| status | ENUM(pending,accepted,in_progress,completed,expired) | Status |
| expires_at | TIMESTAMP | Validade (30 dias) |

### `trust_center_profiles` (006_trust_center.sql)

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | UUID PK | ID do perfil |
| tenant_id | UUID FK UNIQUE | Um Trust Center por tenant |
| slug | VARCHAR(100) UNIQUE | URL publica /trust/{slug} |
| is_public | BOOLEAN | Visibilidade publica |
| show_score | BOOLEAN | Exibir score A-F |
| nda_required | BOOLEAN | Exigir NDA para docs sensiveis |
| seals | JSONB | Array de selos |
| public_documents | JSONB | Docs publicos |
| nda_documents | JSONB | Docs protegidos por NDA |

### `nda_requests` (006_trust_center.sql)

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | UUID PK | ID da solicitacao |
| trust_center_id | UUID FK | Trust Center alvo |
| requester_email | VARCHAR(255) | E-mail do solicitante |
| status | ENUM(pending,approved,rejected,expired) | Status |
| approved_by | VARCHAR(255) | Quem aprovou |
| expires_at | TIMESTAMP | Validade do acesso NDA (90 dias) |

### Alteracoes em tabelas existentes (005_questions_tracks.sql)

| Tabela | Campo novo | Tipo | Descricao |
|--------|------------|------|-----------|
| assessment_questions | track | ENUM(bronze,silver,gold) | Trilha minima |
| assessment_questions | evidence_required | BOOLEAN | Exige evidencia em Prata/Ouro |
| assessment_questions | tpra_stage | ENUM | Estagio TPRA |
| assessment_questions | supplier_context | BOOLEAN | Especifica para avaliacao de terceiros |
| assessments | track | ENUM(bronze,silver,gold) | Trilha do assessment |
| assessments | supplier_id | UUID FK | Fornecedor avaliado |
| assessments | invitation_id | UUID FK | Convite que originou |

---

## 3. Separação Firestore vs Cloud SQL

| Critério | Firestore | Cloud SQL |
|----------|-----------|-----------|
| **Dados** | Scans, findings, scores | GRC, controles, questionários |
| **Schema** | Flexível; documentos variáveis | Estruturado; migrations |
| **Acesso** | Por tenant + scan_id | Por tenant; RLS |
| **MVP** | ✅ Em uso | ❌ Migrations prontas; integração Mês 2 |

---

## 4. Fluxo de Persistência (Scan Job)

1. **CreatePendingScan** (API): grava `tenants/{tid}/scans/{sid}` com status `pending`
2. **FindingRepository.SaveBatch**: grava `tenants/{tid}/scans/{sid}/findings/{fid}` para cada AuditFinding
3. **ScoreRepository.UpdateScanScore**: atualiza documento scan com `score`, `score_category`, `status`, `finished_at`

---

## 5. Migrações

- **Firestore:** sem migrations formais; schema implícito no código e nas regras
- **Cloud SQL:** `backend/migrations/001_grc_schema.sql`, `002_assessment_questions_answers.sql`; aplicar manualmente ou via Cloud SQL Admin
- **Dados iniciais:** `frameworks`, `controls` e `mapping_logic` populados com ISO 27001 no script
