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

---

## Endpoints TPRA (Gestao de Fornecedores)

> Endpoints planejados para o modulo TPRA. Ver [plano de implementacao](../plans/nrisk-tpra-implementacao.md).

### POST /api/v1/suppliers

Cadastra um fornecedor. Dispara scan automatico do dominio.

**Auth:** Obrigatorio (Gestor GRC)
**Body:**

```json
{
  "name": "Fornecedor Exemplo",
  "domain": "fornecedor.com.br",
  "criticality": "high",
  "category": "saas",
  "contact_name": "Joao Silva",
  "contact_email": "joao@fornecedor.com.br",
  "cnpj": "12.345.678/0001-90"
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "tenant_id": "org-123",
  "name": "Fornecedor Exemplo",
  "domain": "fornecedor.com.br",
  "criticality": "high",
  "status": "pending_assessment",
  "scan_id": "uuid-do-scan-automatico"
}
```

---

### GET /api/v1/suppliers

Lista fornecedores do tenant com filtros.

**Auth:** Obrigatorio
**Query:** `criticality` (critical/high/medium/low), `status` (active/inactive/pending_assessment/blocked), `page`, `per_page`

**Response:** `200 OK` — Array de suppliers com ultimo score.

---

### GET /api/v1/suppliers/:id

Detalhes do fornecedor com ultimo score e historico.

**Auth:** Obrigatorio
**Response:** `200 OK` — Supplier + ultimo scan + score + assessment status.

---

### PATCH /api/v1/suppliers/:id

Atualiza dados do fornecedor.

**Auth:** Obrigatorio (Gestor GRC)
**Body:** Campos parciais (name, criticality, category, contact_*, notes).

---

### POST /api/v1/suppliers/:id/invite

Envia convite de assessment para o fornecedor.

**Auth:** Obrigatorio (Gestor GRC)
**Body:**

```json
{
  "track": "silver",
  "framework_id": "ISO27001",
  "invited_email": "ciso@fornecedor.com.br"
}
```

**Response:** `201 Created` — Invitation com token e expires_at.

---

### GET /api/v1/invitations

Lista convites do tenant.

**Auth:** Obrigatorio
**Query:** `status` (pending/accepted/in_progress/completed/expired), `supplier_id`

---

### POST /api/v1/invitations/:token/accept

Fornecedor aceita convite. **Sem auth** (via token).

**Response:** `200 OK` — Assessment criado, link para preenchimento.

---

### GET /api/v1/suppliers/:id/score

Score hibrido do fornecedor com cross-check TPRA.

**Auth:** Obrigatorio
**Response:** `200 OK` — ScoreBreakdown + inconsistencias TPRA.

---

### GET /api/v1/suppliers/:id/score-history

Historico de scores do fornecedor (snapshots).

**Auth:** Obrigatorio
**Query:** `limit` (1-100, default 50)

---

### GET /api/v1/portfolio/summary

Metricas agregadas do portfolio de fornecedores.

**Auth:** Obrigatorio (Gestor GRC / Seguradora)

**Response:** `200 OK`

```json
{
  "total_suppliers": 45,
  "assessed": 38,
  "coverage_pct": 84.4,
  "avg_score": 712,
  "avg_category": "B",
  "at_risk": 5,
  "distribution": { "A": 8, "B": 15, "C": 10, "D": 3, "E": 1, "F": 1 },
  "inconsistency_rate_pct": 12.3
}
```

---

### GET /api/v1/portfolio/suppliers

Lista de fornecedores com score, tendencia e criticidade para o dashboard.

**Auth:** Obrigatorio
**Query:** `criticality` (critical/high/medium/low), `sort` (score_asc/score_desc/name/criticality)

**Response:** `200 OK`

```json
{
  "suppliers": [
    {
      "id": "uuid",
      "name": "Fornecedor X",
      "domain": "fornecedor.com",
      "criticality": "high",
      "status": "active",
      "score": 742.5,
      "score_category": "B",
      "answer_count": 18,
      "has_assessment": true,
      "last_scored": "2026-02-10T..."
    }
  ],
  "total": 45
}
```

---

### GET /api/v1/portfolio/risk-distribution

Distribuicao de scores A-F do portfolio com heatmap por criticidade.

**Auth:** Obrigatorio

**Response:** `200 OK`

```json
{
  "distribution": { "A": 8, "B": 15, "C": 10, "D": 3, "E": 1, "F": 1 },
  "unscored": 7,
  "total": 45,
  "criticality_heatmap": {
    "critical": { "A": 2, "B": 3, "C": 1, "D": 0, "E": 0, "F": 0, "unscored": 1 },
    "high": { "A": 3, "B": 5, "C": 4, "D": 1, "E": 0, "F": 0, "unscored": 2 },
    "medium": { "A": 2, "B": 5, "C": 3, "D": 1, "E": 1, "F": 0, "unscored": 3 },
    "low": { "A": 1, "B": 2, "C": 2, "D": 1, "E": 0, "F": 1, "unscored": 1 }
  }
}
```

---

### POST /api/v1/trust-center

Cria ou atualiza perfil Trust Center do tenant.

**Auth:** Obrigatorio (CISO)
**Body:**

```json
{
  "slug": "fornecedor-exemplo",
  "display_name": "Fornecedor Exemplo",
  "is_public": true,
  "show_score": true,
  "show_domain_scores": true,
  "nda_required": true,
  "seals": [
    { "name": "ISO 27001", "status": "certified", "valid_until": "2027-03-15" },
    { "name": "LGPD", "status": "compliant" }
  ],
  "public_documents": [
    { "name": "Politica de Privacidade", "url": "https://...", "type": "policy" }
  ]
}
```

---

### GET /trust/:slug

Endpoint publico (sem auth). Retorna perfil Trust Center.

**Response:** `200 OK` — display_name, score (se show_score), selos, docs publicos.

---

### POST /trust/:slug/nda-request

Solicita acesso NDA (sem auth).

**Body:**

```json
{
  "requester_email": "gestor@empresa.com",
  "requester_name": "Maria Santos",
  "requester_company": "Empresa Contratante"
}
```

---

### GET /api/v1/nda-requests

Lista solicitacoes NDA do tenant.

**Auth:** Obrigatorio (CISO)

---

### PATCH /api/v1/nda-requests/:id

Aprovar ou rejeitar solicitacao NDA.

**Auth:** Obrigatorio (CISO)
**Body:** `{ "status": "approved" }` ou `{ "status": "rejected" }`

---

## Endpoints TPRA — Monitoramento Continuo e Alertas (Fase 6)

### GET /api/v1/monitoring/config

Retorna configuracao de monitoramento do tenant (intervalos de re-scan, thresholds de alerta).

**Auth:** Obrigatorio

**Response:** `200 OK`

```json
{
  "config": {
    "critical_interval_days": 7,
    "high_interval_days": 14,
    "medium_interval_days": 30,
    "low_interval_days": 90,
    "score_drop_threshold": 100,
    "category_change_alert": true,
    "webhook_url": "",
    "webhook_enabled": false
  }
}
```

---

### POST /api/v1/monitoring/config

Atualiza configuracao de monitoramento. Campos parciais (somente os enviados sao atualizados).

**Auth:** Obrigatorio
**Body:**

```json
{
  "critical_interval_days": 3,
  "score_drop_threshold": 150,
  "webhook_url": "https://hooks.example.com/alerts",
  "webhook_enabled": true
}
```

---

### POST /api/v1/monitoring/check

Executa verificacao de deterioracao de todos os fornecedores. Compara score atual vs anterior e gera alertas.

**Auth:** Obrigatorio

**Response:** `200 OK`

```json
{
  "suppliers_checked": 45,
  "alerts_generated": 3,
  "alerts": [
    {
      "id": "uuid",
      "supplier_id": "uuid",
      "type": "score_drop",
      "severity": "high",
      "title": "Score drop: Fornecedor X",
      "detail": "Score caiu de B (742) para D (398)",
      "status": "open"
    }
  ]
}
```

Tipos de alerta: `score_drop`, `category_change`, `critical_finding`, `scan_overdue`.

---

### GET /api/v1/monitoring/status

Resumo do monitoramento: config + alertas abertos + scans overdue.

**Auth:** Obrigatorio

**Response:** `200 OK`

```json
{
  "config": { "..." },
  "open_alerts": 5,
  "overdue_scans": 3,
  "total_suppliers": 45
}
```

---

### GET /api/v1/alerts

Lista alertas do tenant.

**Auth:** Obrigatorio
**Query:** `status` (open/acknowledged/resolved)

**Response:** `200 OK`

```json
{
  "alerts": [
    {
      "id": "uuid",
      "supplier_id": "uuid",
      "type": "score_drop",
      "severity": "high",
      "title": "Score drop: Fornecedor X",
      "status": "open",
      "created_at": "2026-02-10T..."
    }
  ],
  "total": 5,
  "open_count": 3
}
```

---

### PATCH /api/v1/alerts/:id

Atualiza status de um alerta (acknowledge ou resolve).

**Auth:** Obrigatorio
**Body:**

```json
{
  "status": "acknowledged"
}
```

**Response:** `200 OK` — Alerta atualizado.

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
