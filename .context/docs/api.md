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

Retorna um scan pelo ID, restrito ao tenant do token.

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
  "started_at": "2026-02-04T...",
  "finished_at": "2026-02-04T..."
}
```

**Erros:**
- `400` — INVALID_SCAN_ID
- `401` — MISSING_AUTH, INVALID_AUTH_FORMAT, INVALID_TOKEN
- `403` — MISSING_TENANT_ID
- `404` — scan não encontrado ou de outro tenant
- `500` — erro interno

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
