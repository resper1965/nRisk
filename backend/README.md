# n.Risk API Backend

Boilerplate inicial da API n.Risk — avaliação de postura cibernética, **multi-tenant desde o dia zero**.

## Stack

- **Backend:** Go (Golang) + Gin
- **Auth:** GCP Identity Platform (Firebase Auth) via JWT
- **Banco:** Firestore (scans) + Cloud SQL/PostgreSQL (GRC)
- **Infra:** Cloud Run

## Estrutura (Clean Architecture simplificada)

```
backend/
├── cmd/api/           # Entrypoint
├── internal/
│   ├── domain/        # Entidades (Company, ScanResult, AssessmentResponse)
│   ├── middleware/    # Auth JWT + tenant_id
│   ├── repository/    # Firestore, futuro Cloud SQL
│   └── controller/    # Handlers HTTP
├── pkg/logger/        # Logs JSON para Cloud Logging
├── go.mod
└── Dockerfile
```

## Pré-requisitos

- Go 1.22+
- Projeto GCP com Firestore e Identity Platform
- Variável `GCP_PROJECT_ID`
- Token JWT com custom claim `tenant_id`

## Rodar localmente

```bash
export GCP_PROJECT_ID=seu-projeto
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
go run ./cmd/api
```

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /health | Não | Health check |
| POST | /api/v1/scans | Sim | Iniciar scan (body: `{"domain":"example.com"}`) |
| GET | /api/v1/scans/:id | Sim | Obter scan por ID |

## Custom Claims (Firebase)

Para o middleware funcionar, o token deve incluir `tenant_id` nas custom claims. Configure no Firebase Auth / Identity Platform:

```json
{
  "tenant_id": "org-123"
}
```

## Deploy (Cloud Run)

```bash
gcloud run deploy nrisk-api \
  --source . \
  --region us-central1 \
  --set-env-vars GCP_PROJECT_ID=seu-projeto
```
