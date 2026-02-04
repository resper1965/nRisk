---
type: doc
name: architecture
description: Arquitetura do sistema n.Risk no GCP
category: architecture
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Arquitetura n.Risk no GCP

## Visão Geral

Arquitetura serverless no Google Cloud Platform com workers efêmeros, mensageria assíncrona e persistência híbrida. O backend é um BFF em Go (Gin) que expõe a API REST e orquestra scans via Cloud Run Jobs.

## Componentes GCP

| Componente | Serviço GCP | Papel |
|------------|-------------|-------|
| **Frontend** | Firebase Hosting | Dashboard Next.js (base: resper1965/clone) |
| **API Backend** | Cloud Run (Go) | BFF: lógica de negócio, scans, questionários |
| **Scan Engine** | Cloud Run Jobs | Execução de Nuclei, Nmap, Subfinder |
| **Mensageria** | Pub/Sub | Desacoplamento scan request → execução (futuro) |
| **Persistência** | Cloud SQL (PostgreSQL) | GRC, controles ISO, questionários (Mês 2) |
| **Persistência** | Firestore | Scans, findings, resultados variáveis |
| **Evidence Vault** | Cloud Storage | Documentos com CMEK |
| **Auth** | Identity Platform | MFA, JWT com tenant_id |
| **Secrets** | Secret Manager | Chaves Threat Intel (Shodan, Censys) |
| **WAF** | Cloud Armor | Proteção do Dashboard |

## Fluxo de Dados

### Fluxo atual (MVP)

```
API (POST /api/v1/scans) → Firestore (documento pending)
                              ↓
Disparo manual (gcloud/scheduler) → Cloud Run Job (TENANT_ID, SCAN_ID, DOMAIN)
                              ↓
Scan Job → Nuclei, Nmap, Subfinder → Parser → Firestore (findings + score)
```

### Fluxo futuro (com Pub/Sub)

```
API → Pub/Sub (scan-requests) → Cloud Run Job → Firestore (findings)
                                          → Cloud SQL (score, controles)
```

## Estrutura de Código (Backend)

```
backend/
├── cmd/
│   ├── api/          # Entrypoint API REST (Cloud Run Service)
│   └── scan-job/     # Entrypoint Core Engine (Cloud Run Job)
├── internal/
│   ├── domain/       # AuditFinding, ScanResult, models
│   ├── engine/       # Orquestração Nuclei, Nmap, Subfinder
│   ├── parser/       # Tradução GRC (mapping_logic.json)
│   ├── controller/   # Handlers HTTP (ScanController)
│   ├── middleware/   # Auth JWT (tenant_id)
│   └── repository/   # Firestore (scan, finding, score)
├── pkg/
│   ├── logger/       # Logs JSON para Cloud Logging
│   └── validator/    # Validação (domain/hostname RFC 1123)
├── migrations/       # Schema Cloud SQL (001_grc_schema.sql)
└── mapping_logic.json  # Fonte de verdade ISO 27001
```

## Entry Points

| Entry Point | Arquivo | Descrição |
|-------------|---------|-----------|
| API REST | `cmd/api/main.go` | Servidor Gin, rotas /health e /api/v1/* |
| Scan Job | `cmd/scan-job/main.go` | Job batch: executa ferramentas, persiste findings |

## Decisões Arquiteturais

| Decisão | Justificativa |
|---------|---------------|
| **Gin como BFF** | Sem API Gateway separado; Gin atua como BFF com AuthMiddleware e controllers |
| **Firestore para scans** | Schema flexível; findings variam por ferramenta; consultas por tenant |
| **validator.IsValidHostname** | Mitiga injeção em comandos (nmap, nuclei); validação antes de CreatePendingScan e execução |
| **Scan Job stateless** | Recebe TENANT_ID, SCAN_ID, DOMAIN via env; sem estado entre execuções |

## Multi-tenancy

- **Path Firestore:** `tenants/{tenantId}/scans/{scanId}/findings/{findingId}`
- **JWT:** Custom claim `tenant_id` obrigatório
- **Isolamento:** Queries e regras Firestore filtradas por tenant; controller usa tenant do token

## Persistência (Detalhe)

Ver [database.md](./database.md) para esquemas Firestore e Cloud SQL, índices e RLS.

- **Firestore:** `tenants/{tid}/scans/{sid}` (ScanResult), `tenants/{tid}/scans/{sid}/findings/{fid}` (AuditFinding)
- **Cloud SQL:** GRC, controles, assessments; migrations em `backend/migrations/`

## DevOps

Containers, deploy, env vars e CI/CD: [devops.md](./devops.md)

## Boundaries Internos

| Camada | Responsabilidade |
|--------|------------------|
| **controller** | Validação de entrada (validator), orquestração de repositórios |
| **repository** | Persistência Firestore; isolamento por tenant |
| **engine** | Execução de ferramentas externas; timeout, logs |
| **parser** | Tradução output → RawFinding; mapping_logic → AuditFinding |
