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

### Outras Coleções (Firestore)

| Path | Uso | Status |
|------|-----|--------|
| tenants/{tid}/public_profile/{profileId} | Trust Center público | Previsto |
| tenants/{tid}/{document=**} | Genérico sob tenant | Catch-all |

### Índices Firestore

Consultas atuais são por ID (documento único). Listagens por `domain`, `status` ou `started_at` exigirão índices compostos quando implementadas.

---

## 2. Cloud SQL (PostgreSQL) — Mês 2

### Tabelas (001_grc_schema.sql)

| Tabela | Papel |
|--------|-------|
| **tenants** | Catálogo de organizações; `id` = tenant_id do JWT |
| **frameworks** | ISO 27001, NIST, LGPD |
| **controls** | Controles do framework (C-01, C-02, …) |
| **mapping_logic** | Achado técnico → control_id, impact_on_score |
| **assessments** | Respostas de questionário por tenant e controle |

### Relacionamentos

```
frameworks ← controls ← mapping_logic
tenants ← assessments → controls
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
| assessments | idx_assessments_control | Filtrar por controle |
| assessments | idx_assessments_tenant_control | Unique (tenant, control) |

### RLS (Row Level Security)

- **assessments:** isolamento por `tenant_id` via `current_setting('app.current_tenant_id')`
- **tenants, frameworks, controls, mapping_logic:** dados globais (sem tenant_id)

**Função:** `set_tenant_context(tenant_id TEXT)` — definir tenant na sessão antes das queries.

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
- **Cloud SQL:** `backend/migrations/001_grc_schema.sql`; aplicar manualmente ou via Cloud SQL Admin
- **Dados iniciais:** `frameworks`, `controls` e `mapping_logic` populados com ISO 27001 no script
