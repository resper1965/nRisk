---
type: doc
name: api
description: Referência da API REST n.Risk
category: api
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# API Reference — n.Risk

Base URL: `/` (Cloud Run expõe na raiz)

- **Design:** [api-design.md](./api-design.md)
- **OpenAPI:** [api.openapi.yaml](./api.openapi.yaml)

## Autenticação

Rotas sob `/api/v1/*` exigem header:

```
Authorization: Bearer <JWT>
```

O JWT deve conter a custom claim `tenant_id` (Firebase Auth / Identity Platform).

### Integração Frontend

- **Token:** `user.getIdToken()` (Firebase Auth)
- **Header:** `Authorization: Bearer <idToken>`
- **Validação client-side:** domain (hostname) e scan_id (UUID) antes das chamadas
- **CORS:** Configurar no backend quando frontend em domínio diferente — ver [frontend.md](./frontend.md)

---

## Endpoints

### GET /health

Health check. **Sem autenticação.**

**Response:** `200 OK`

```json
{"status": "ok"}
```

---

### POST /api/v1/scans

Inicia um novo scan para o domínio informado.

**Auth:** Obrigatório  
**Body:**

```json
{
  "domain": "example.com"
}
```

**Validação:**
- `domain` obrigatório
- `domain` deve ser hostname válido (RFC 1123); rejeita caracteres especiais, espaços, comprimento > 253

**Response:** `201 Created`

**Headers:** `Location: /api/v1/scans/{id}`

```json
{
  "scan_id": "uuid",
  "domain": "example.com",
  "status": "pending",
  "tenant_id": "org-123"
}
```

**Erros (body inclui `error` e `code`):**
- `400` — INVALID_REQUEST, INVALID_DOMAIN
- `401` — token ausente ou inválido
- `403` — tenant_id ausente nas claims
- `500` — falha ao criar scan

---

### GET /api/v1/scans/:id

Retorna um scan pelo ID, restrito ao tenant do token. Inclui **domain_scores** (nota A–F por eixo ISO) quando o scan possui findings — P1.1 rating por eixo (spider/relatório).

**Auth:** Obrigatório  
**Params:** `id` — UUID do scan

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "tenant_id": "org-123",
  "domain": "example.com",
  "status": "completed",
  "score": 850,
  "score_category": "B",
  "findings": [],
  "started_at": "2026-02-04T...",
  "finished_at": "2026-02-04T...",
  "domain_scores": [
    {
      "domain_id": "A.10.1.1",
      "label": "Criptografia - Certificados",
      "score": 850,
      "grade": "B"
    },
    {
      "domain_id": "A.13.2.1",
      "label": "Comunicações - Anti-phishing",
      "score": 800,
      "grade": "B"
    }
  ]
}
```

- **domain_scores** (opcional): agregado por `iso_domain` a partir dos findings do scan; `score` 0–1000, `grade` A–F (900+ A, 750+ B, 600+ C, 400+ D, 250+ E, &lt;250 F). Ausente se não houver findings ou se a listagem falhar.

**Erros:**
- `400` — INVALID_SCAN_ID
- `401` — MISSING_AUTH, INVALID_AUTH_FORMAT, INVALID_TOKEN
- `403` — MISSING_TENANT_ID
- `404` — scan não encontrado ou de outro tenant
- `500` — erro interno

---

### GET /api/v1/scans/:id/score-history (P1.2 jornada persistida)

Retorna o histórico de ScoreBreakdown do scan (cross-check + score por data) para demandantes.

**Auth:** Obrigatório  
**Params:** `id` — UUID do scan  
**Query:** `limit` (opcional, 1–100, default 50)

**Response:** `200 OK`

```json
{
  "scan_id": "uuid",
  "snapshots": [
    {
      "id": "snapshot-uuid",
      "tenant_id": "org-123",
      "scan_id": "uuid",
      "domain": "example.com",
      "computed_at": "2026-02-05T...",
      "score_breakdown": {
        "technical_score": 850,
        "compliance_score_raw": 900,
        "compliance_score": 765,
        "confidence_factor": 0.85,
        "hybrid_score": 816,
        "score_category": "B",
        "inconsistencies": [],
        "domain_scores": {}
      }
    }
  ]
}
```

Snapshots são criados quando `GET /api/v1/assessment/score/full?scan_id=...` é chamado.

**Erros:** idem GET /api/v1/scans/:id; `500` — LOAD_FAILED ao listar histórico.

---

### Justificativas de findings (P1.6)

Permitem que o cliente submeta justificativas para findings; o avaliador aprova ou rejeita. Findings com justificativa **aprovada** deixam de penalizar o score em `GET /api/v1/assessment/score/full`.

#### POST /api/v1/scans/:scan_id/findings/:finding_id/justifications

Submete uma justificativa para um finding.

**Auth:** Obrigatório  
**Params:** `scan_id` (UUID), `finding_id` (ID do finding)  
**Body:**

```json
{
  "text": "Risco aceito pela diretoria; controles compensatórios documentados.",
  "submitted_by": "user@empresa.com"
}
```

**Response:** `201 Created`

```json
{
  "justification": {
    "id": "uuid",
    "tenant_id": "...",
    "scan_id": "...",
    "finding_id": "...",
    "status": "submitted",
    "text": "...",
    "submitted_by": "...",
    "submitted_at": "2026-02-05T..."
  },
  "scan_id": "...",
  "finding_id": "..."
}
```

**Erros:** `400` — INVALID_SCAN_ID, INVALID_FINDING_ID, INVALID_BODY; `401`/`403` — auth; `500` — SAVE_FAILED.

#### GET /api/v1/scans/:scan_id/findings/:finding_id/justifications

Lista justificativas de um finding (para cliente e avaliador).

**Auth:** Obrigatório  
**Params:** `scan_id` (UUID), `finding_id` (ID do finding)

**Response:** `200 OK`

```json
{
  "justifications": [
    {
      "id": "uuid",
      "status": "submitted",
      "text": "...",
      "submitted_by": "...",
      "submitted_at": "...",
      "reviewed_by": "",
      "reviewed_at": null,
      "decision_note": ""
    }
  ],
  "scan_id": "...",
  "finding_id": "..."
}
```

**Erros:** `400` — INVALID_SCAN_ID, INVALID_FINDING_ID; `500` — LIST_FAILED.

#### PATCH /api/v1/scans/:scan_id/justifications/:id/review

Avaliador aprova ou rejeita uma justificativa.

**Auth:** Obrigatório  
**Params:** `scan_id` (UUID), `id` (ID da justificativa)  
**Body:**

```json
{
  "reviewed_by": "avaliador@nrisk.com",
  "decision": "approved",
  "decision_note": "Evidência de controles compensatórios aceita."
}
```

- `decision`: `"approved"` ou `"rejected"`.

**Response:** `200 OK` — corpo com a justificativa atualizada (inclui `status`, `reviewed_at`, `decision_note`).

**Erros:** `400` — INVALID_SCAN_ID, INVALID_ID, INVALID_BODY, INVALID_DECISION; `404` — NOT_FOUND; `500` — UPDATE_FAILED.

---

### GET /api/v1/assessments

Lista o progresso dos assessments do tenant.

**Auth:** Obrigatório  
**Query params (opcionais):** `framework_id`, `status`

**Response:** `200 OK`

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

**Multi-tenancy:** Retorna apenas assessments do `tenant_id` do JWT.

---

### PATCH /api/v1/assessments/:id

Atualiza respostas de um assessment. Aplica Logic Engine (Cross-Check) quando `scan_id` fornecido: respostas positivas contraditas por findings são marcadas como `Inconsistent`.

**Auth:** Obrigatório  
**Params:** `id` — UUID do assessment  
**Body:**

```json
{
  "answers": [
    { "question_id": "Q-01", "answer_status": "sim", "evidence_storage_path": null },
    { "question_id": "Q-02", "answer_status": "nao" }
  ],
  "scan_id": "uuid-opcional"
}
```

**Response:** `200 OK` — assessment atualizado com lista de answers (incluindo status Inconsistent quando aplicável)

**Erros:**
- `400` — INVALID_REQUEST, question_id/control_id inválido
- `404` — assessment não encontrado ou de outro tenant

---

### GET /api/v1/assessment (legado / MVP Firestore)

Lista perguntas do framework. **Query:** `?framework=ISO27001`

### POST /api/v1/assessment/answer (legado / MVP Firestore)

Salva uma resposta e opcionalmente faz upload de evidência (multipart). Path GCS: `tenants/{tid}/evidence/{questionId}_{filename}`

### GET /api/v1/assessment/score

Retorna score híbrido: `(T * 0.6) + (C * 0.4)`. **Query:** `?framework=ISO27001&scan_id=opcional`

### GET /api/v1/assessment/score/full (P1.2 jornada persistida; P1.6 justificativas)

Calcula ScoreBreakdown completo (cross-check, F, penalidade crítica, domain_scores), **persiste snapshot** no histórico do scan e retorna o breakdown. **Query:** `?scan_id=uuid` (obrigatório), `?framework=ISO27001`

**P1.6:** Findings com justificativa **aprovada** (via PATCH /scans/:scan_id/justifications/:id/review) deixam de penalizar o score: são excluídos de `findingsByControl`, de `has_critical_finding` e o score técnico (T) é recalculado a partir dos findings restantes.

**Response:** `200 OK` — `{ "score_breakdown": { ... }, "scan_id": "uuid", "framework_id": "ISO27001" }`. Cada chamada adiciona um registro em GET /api/v1/scans/:id/score-history.

---

## Scan Job (Cloud Run Job)

Não é API HTTP. Executado como job com variáveis de ambiente:

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| TENANT_ID | Sim | ID do tenant |
| SCAN_ID | Sim | ID do scan (criado pela API) |
| DOMAIN | Sim | Domínio alvo (validado como hostname) |
| GCP_PROJECT_ID | Não | Default: nrisk-dev |
| MAPPING_LOGIC_PATH | Não | Default: mapping_logic.json |
