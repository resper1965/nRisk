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
