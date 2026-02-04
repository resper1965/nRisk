---
status: in_progress
generated: 2026-02-04
parentPlan: nrisk-assessment-hibrido
agents:
  - type: "database-specialist"
    role: "Schema Cloud SQL assessment_questions, assessment_answers"
  - type: "backend-specialist"
    role: "Logic Engine, repositórios, endpoints, Storage"
  - type: "security-auditor"
    role: "Multi-tenancy, RLS, tenant_id em todas as queries"
  - type: "feature-developer"
    role: "Implementar integração scan-engine → Logic Engine"
  - type: "test-writer"
    role: "Testes unitários Logic Engine, integração API"
docs:
  - "architecture.md"
  - "data-flow.md"
  - "security.md"
  - "nrisk-assessment-hibrido.md"
phases:
  - id: "db-schema"
    name: "Database Cloud SQL"
    prevc: "P"
  - id: "logic-engine"
    name: "Logic Engine Inconsistência"
    prevc: "E"
  - id: "storage"
    name: "Storage GCS"
    prevc: "E"
  - id: "api"
    name: "API Endpoints"
    prevc: "E"
  - id: "multi-tenancy"
    name: "Multi-tenancy e RLS"
    prevc: "E"
---

# Implementação Módulo Assessments Híbridos

> Plano de implementação para Cloud SQL, Logic Engine de inconsistência (findings vs answers), Storage GCS, API GET/PATCH assessments e multi-tenancy rigoroso.

## Task Snapshot

- **Primary goal:** Implementar o módulo de Assessments Híbridos conforme requisitos: tabelas Cloud SQL `assessment_questions` e `assessment_answers`; função Go que marca como Inconsistent respostas positivas contraditas por achados técnicos; serviço de upload GCS organizado por `tenant_id/assessment_id/evidence_file`; endpoints GET /assessments e PATCH /assessments/:id; isolamento multi-tenant em todas as operações.
- **Success signal:** API funcional; respostas "Sim" contraditas por findings marcadas Inconsistent; evidências salvas em GCS com path correto; nenhuma query sem filtro tenant_id.
- **Key references:**
  - [Assessment Híbrido (Plano pai)](./nrisk-assessment-hibrido.md)
  - [Mapping Logic](../../backend/mapping_logic.json)
  - [Schema GRC existente](../../backend/migrations/001_grc_schema.sql)
  - [Engine/Scan](../../backend/internal/engine/runner.go), [Parser](../../backend/internal/parser/parsers.go)

---

## 1. Database (Cloud SQL)

### 1.1 Tabela `assessment_questions`

Catálogo de perguntas vinculadas aos controles ISO do `mapping_logic.json`.

```sql
CREATE TABLE assessment_questions (
    id              VARCHAR(20) PRIMARY KEY,
    control_id      VARCHAR(20) NOT NULL REFERENCES controls(id),
    iso_domain      VARCHAR(50) NOT NULL,
    question_text   TEXT NOT NULL,
    framework_id    UUID REFERENCES frameworks(id),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessment_questions_control ON assessment_questions (control_id);
```

**Vinculação:** Cada `control_id` em `assessment_questions` deve existir em `controls` e corresponder aos `control_id` usados no `mapping_logic.json` (C-01, C-02, C-03, C-04, etc.).

### 1.2 Tabela `assessment_answers`

Respostas dos usuários com tenant_id, answer_status e evidence_storage_path.

```sql
CREATE TABLE assessment_answers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           VARCHAR(100) NOT NULL,
    assessment_id       UUID NOT NULL,
    question_id         VARCHAR(20) NOT NULL REFERENCES assessment_questions(id),
    control_id          VARCHAR(20) NOT NULL REFERENCES controls(id),
    answer_status       VARCHAR(20) NOT NULL CHECK (answer_status IN ('sim', 'nao', 'na', 'Inconsistent')),
    evidence_storage_path TEXT,
    responded_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX idx_assessment_answers_tenant ON assessment_answers (tenant_id);
CREATE INDEX idx_assessment_answers_assessment ON assessment_answers (assessment_id);
CREATE UNIQUE INDEX idx_assessment_answers_tenant_assessment_question
    ON assessment_answers (tenant_id, assessment_id, question_id);
```

### 1.3 Tabela `assessments` (sessão/run)

Entidade de agrupamento: um assessment é uma "rodada" de respostas.

```sql
-- Ajuste na tabela assessments existente ou criação se não existir
CREATE TABLE IF NOT EXISTS assessments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       VARCHAR(100) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    framework_id    UUID REFERENCES frameworks(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessments_tenant ON assessments (tenant_id);
```

### 1.4 RLS para `assessment_answers` e `assessments`

```sql
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY assessment_answers_tenant ON assessment_answers
    USING (tenant_id = current_setting('app.current_tenant_id', true));

CREATE POLICY assessments_tenant ON assessments
    USING (tenant_id = current_setting('app.current_tenant_id', true));
```

**Arquivo de migração:** `backend/migrations/002_assessment_questions_answers.sql`

---

## 2. Logic Engine (Go)

### 2.1 Função `MarkInconsistentAnswers`

Entrada:
- `findings []*domain.AuditFinding` — achados do scan (engine AI2PentestTool)
- `answers []*domain.AssessmentAnswer` — respostas do usuário

Saída:
- `[]*domain.AssessmentAnswer` com `answer_status = "Inconsistent"` onde aplicável

**Lógica:**
1. Construir mapa: `control_id → []technical_finding` a partir de `mapping_logic.json` (reverso: para cada control_id, quais findings o contradizem).
2. Construir set de `(control_id, technical_finding)` presentes nos findings do scan.
3. Para cada answer com `answer_status == "sim"`:
   - Se existe finding no scan para o `control_id` da resposta → marcar `answer_status = "Inconsistent"`.
4. Retornar lista de answers (alguns com status atualizado).

**Localização:** `internal/assessment/crosscheck.go`

```go
// MarkInconsistentAnswers recebe findings do scan e answers do usuário.
// Marca como "Inconsistent" qualquer resposta positiva contradita por achado técnico.
func MarkInconsistentAnswers(
    findings []*domain.AuditFinding,
    answers []*domain.AssessmentAnswer,
    mapping *parser.Parser,
) []*domain.AssessmentAnswer
```

**Integração:** O `parser.Parser` já carrega `mapping_logic.json` e expõe `FindByTechnicalFinding`. Será necessário método reverso: `FindByControlID` ou iterar mappings para obter `control_id → technical_finding`.

---

## 3. Storage Integration (GCP Cloud Storage)

### 3.1 Estrutura de paths

```
gs://{bucket}/tenants/{tenant_id}/assessments/{assessment_id}/evidence/{filename}
```

Exemplo: `gs://nrisk-evidence/tenants/tenant-abc/assessments/uuid-123/evidence/politica-rh.pdf`

### 3.2 Serviço de upload

**Pacote:** `internal/storage/evidence.go` (estender o existente)

**Método:**
```go
func (e *EvidenceStore) UploadEvidenceForAssessment(
    ctx context.Context,
    tenantID, assessmentID, filename string,
    r io.Reader,
) (storagePath string, err error)
```

- Validar `tenantID` e `assessmentID` (segurança, path traversal)
- Path: `tenants/{tenantID}/assessments/{assessmentID}/evidence/{sanitized_filename}`
- Retornar path completo (gs:// ou path relativo conforme convenção)

**Multi-tenancy:** O path inclui tenant_id; o middleware garante que só o tenant autenticado faça upload. Validar que `tenant_id` do JWT coincide com o path.

---

## 4. API Endpoints

### 4.1 `GET /api/v1/assessments`

**Objetivo:** Listar progresso dos assessments do tenant.

**Query params (opcionais):** `framework_id`, `status`

**Comportamento:**
- Extrair `tenant_id` do middleware de autenticação
- Chamar `SELECT * FROM assessments WHERE tenant_id = $1` (com RLS via `set_tenant_context`)
- Para cada assessment, opcionalmente agregar contagem de respostas (total, sim, nao, Inconsistent)
- Retornar lista com progresso (ex: `answers_count`, `inconsistent_count`)

**Response:**
```json
{
  "assessments": [
    {
      "id": "uuid",
      "tenant_id": "...",
      "framework_id": "...",
      "status": "draft",
      "progress": { "total": 20, "answered": 15, "inconsistent": 2 },
      "created_at": "..."
    }
  ]
}
```

### 4.2 `PATCH /api/v1/assessments/:id`

**Objetivo:** Atualizar respostas de um assessment.

**Path:** `id` = UUID do assessment

**Body (exemplo):**
```json
{
  "answers": [
    { "question_id": "Q-01", "answer_status": "sim", "evidence_storage_path": null },
    { "question_id": "Q-02", "answer_status": "nao" }
  ]
}
```

**Comportamento:**
1. Extrair `tenant_id` do middleware
2. Verificar que o assessment pertence ao tenant (SELECT ... WHERE id = $1 AND tenant_id = $2)
3. Para cada answer no body: UPSERT em `assessment_answers` (tenant_id, assessment_id, question_id, control_id, answer_status, evidence_storage_path)
4. Se houver `scan_id` no body ou query: buscar findings do scan, chamar `MarkInconsistentAnswers`, persistir status atualizado
5. Retornar assessment atualizado com lista de answers

**Upload de evidência:** Pode ser em request separado (POST /assessments/:id/evidence) que retorna `evidence_storage_path`, ou no PATCH com multipart. Recomendação: endpoint dedicado para upload e o PATCH recebe o path já gerado.

---

## 5. Multi-tenancy

### 5.1 Regras obrigatórias

| Operação | Regra |
|----------|-------|
| **SQL** | Todas as queries em `assessment_answers` e `assessments` devem filtrar por `tenant_id` |
| **Sessão** | Antes de cada query: `SELECT set_tenant_context($1)` com tenant_id do JWT |
| **Storage** | Path sempre começa com `tenants/{tenant_id}/`; validar tenant no handler |
| **API** | `tenant_id` obtido do `c.Get(middleware.TenantIDKey)`; nunca confiar em body ou query |

### 5.2 Checklist de implementação

- [ ] Repositório Cloud SQL: método que chama `set_tenant_context(tenantID)` antes de SELECT/INSERT/UPDATE
- [ ] Handlers: sempre passar `tenantID` para repositórios
- [ ] Storage: `UploadEvidenceForAssessment` recebe `tenantID` do contexto/handler, não do cliente
- [ ] RLS habilitado em `assessment_answers` e `assessments`

---

## 6. Fases de Implementação

### Fase 1 — Database
- Criar `002_assessment_questions_answers.sql`
- Popular `assessment_questions` com dados do `assessment_questions.json` ou mapping_logic
- Aplicar migração no Cloud SQL

### Fase 2 — Logic Engine
- Implementar `internal/assessment/crosscheck.go`
- Função `MarkInconsistentAnswers(findings, answers, mapping)`
- Testes unitários com findings e answers mockados

### Fase 3 — Storage
- Estender `EvidenceStore` com `UploadEvidenceForAssessment`
- Path: `tenant_id/assessment_id/evidence/{file}`

### Fase 4 — API
- Repositório `assessment_repository.go` (Cloud SQL)
- Controller: `GET /assessments`, `PATCH /assessments/:id`
- Opcional: `POST /assessments/:id/evidence` para upload

### Fase 5 — Multi-tenancy
- Garantir `set_tenant_context` em todas as operações
- Revisão de código: nenhuma query sem tenant_id

---

## 7. Dependências

- Cloud SQL configurado e migrations aplicadas
- Driver PostgreSQL: `github.com/lib/pq` ou `github.com/jackc/pgx`
- GCS bucket para evidências (env `GCS_EVIDENCE_BUCKET`)
- Engine AI2PentestTool (scan job) persistindo findings no Firestore; o Logic Engine consumirá via `FindingRepository` ou equivalente

---

## 8. Evidências e Follow-up

- [ ] Migração 002 aplicada com sucesso
- [ ] Testes `MarkInconsistentAnswers` passando
- [ ] GET /assessments retornando apenas dados do tenant
- [ ] PATCH /assessments/:id atualizando respostas e aplicando cross-check quando scan_id fornecido
- [ ] Upload de evidência salvando em path correto no GCS
