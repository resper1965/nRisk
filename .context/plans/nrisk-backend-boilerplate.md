---
status: completed
generated: 2026-02-04
source: Boilerplate Backend n.Risk (Go/Gin/GCP)
parentPlan: nrisk-arquitetura-gcp
agents:
  - type: "backend-specialist"
    role: "API Gin, repositórios, controllers"
  - type: "architect-specialist"
    role: "Clean Architecture, multi-tenancy"
  - type: "security-auditor"
    role: "JWT, middleware, logs"
docs:
  - "architecture.md"
  - "security.md"
phases:
  - id: "boilerplate"
    name: "Boilerplate Inicial"
    prevc: "E"
---

# Backend Boilerplate n.Risk (Go/Gin)

> API Go multi-tenant com Gin, Firestore e JWT (GCP Identity Platform). Implementado conforme especificação DevSecOps.

## Resumo do Boilerplate

| Artefato | Localização |
|----------|-------------|
| **Entrypoint** | `backend/cmd/api/main.go` |
| **Domain** | `backend/internal/domain/models.go` |
| **Middleware Auth** | `backend/internal/middleware/auth.go` |
| **Repositório Firestore** | `backend/internal/repository/firestore/scan_repository.go` |
| **Controller Scan** | `backend/internal/controller/scan_controller.go` |
| **Logger** | `backend/pkg/logger/logger.go` |
| **Dockerfile** | `backend/Dockerfile` |

---

## Estrutura de Pastas (Clean Architecture)

```
backend/
├── cmd/api/main.go
├── internal/
│   ├── domain/models.go      # Company, ScanResult, AssessmentResponse
│   ├── middleware/auth.go    # JWT + tenant_id
│   ├── repository/firestore/
│   │   └── scan_repository.go
│   └── controller/
│       └── scan_controller.go
├── pkg/logger/logger.go
├── go.mod
├── Dockerfile
└── README.md
```

---

## Implementações

### 1. Middleware de Identidade
- Valida JWT do GCP Identity Platform (Firebase Auth)
- Extrai `tenant_id` das custom claims
- Injeta `tenant_id` e `user_id` (uid) no `gin.Context`

### 2. Repositório Firestore
- Caminho: `/tenants/{tenant_id}/scans/{scan_id}` — isolamento multi-tenant
- `Save`, `GetByID`, `CreatePendingScan`

### 3. Domain Structs
- `Company`, `ScanResult` (DNS, SSL, Score), `AssessmentResponse`
- `DNSInfo`, `SSLInfo`, `Finding`

### 4. Segurança
- Graceful shutdown (SIGINT/SIGTERM, timeout 30s)
- Logs estruturados JSON para Cloud Logging

### 5. Controller
- `POST /api/v1/scans` — inicia scan (body: `{"domain":"example.com"}`)
- `GET /api/v1/scans/:id` — obtém scan por ID

---

## Próximos Passos
- Integrar Pub/Sub para disparar workers
- Adicionar Cloud SQL para GRC (Company, Assessments)
- Testes unitários e de integração
