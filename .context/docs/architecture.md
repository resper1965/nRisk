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
│   ├── domain/       # AuditFinding, ScanResult, Answer, models
│   ├── engine/       # Orquestração Nuclei, Nmap, Subfinder
│   ├── parser/       # Tradução GRC (mapping_logic.json)
│   ├── assessment/   # Loader, scoring, crosscheck (Logic Engine)
│   ├── controller/   # ScanController, AssessmentController
│   ├── middleware/   # Auth JWT (tenant_id)
│   ├── repository/   # Firestore (scan, finding, score, answer); Cloud SQL (assessment)
│   └── storage/      # EvidenceStore (GCS upload)
├── pkg/
│   ├── logger/       # Logs JSON para Cloud Logging
│   └── validator/    # Validação (domain/hostname RFC 1123)
├── migrations/       # 001_grc_schema.sql, 002_assessment_questions_answers.sql
├── mapping_logic.json
└── assessment_questions.json  # Catálogo de perguntas (framework ISO27001)
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

- **Path Firestore:** `tenants/{tenantId}/scans/{scanId}/findings/{findingId}`; `tenants/{tid}/answers/` (Firestore MVP)
- **Path GCS:** `tenants/{tenantId}/assessments/{assessmentId}/evidence/{filename}`
- **Cloud SQL:** RLS em `assessments` e `assessment_answers`; `set_tenant_context(tenant_id)` antes das queries
- **JWT:** Custom claim `tenant_id` obrigatório
- **Isolamento:** Todas as queries e chamadas Storage usam `tenant_id` extraído do middleware

## Persistência (Detalhe)

Ver [database.md](./database.md) para esquemas Firestore e Cloud SQL, índices e RLS.

- **Firestore:** `tenants/{tid}/scans/{sid}` (ScanResult), `tenants/{tid}/scans/{sid}/findings/{fid}` (AuditFinding)
- **Cloud SQL:** GRC, controles, assessments; migrations em `backend/migrations/`

## DevOps

Containers, deploy, env vars e CI/CD: [devops.md](./devops.md)

## Módulo de Assessments Híbridos

O módulo combina **declarações do usuário** (questionários) com **validação técnica** (findings do scan). O **Logic Engine (Cross-Check)** compara respostas positivas com achados técnicos: se um finding contradiz uma resposta "Sim", marca como **Inconsistent**.

| Componente | Responsabilidade |
|------------|------------------|
| **assessment_questions** | Catálogo no Cloud SQL; vinculado a control_id do mapping_logic |
| **assessment_answers** | Respostas por tenant; answer_status (sim/nao/na/Inconsistent) |
| **Evidence Vault** | GCS path: `tenants/{tid}/assessments/{aid}/evidence/{file}`; SHA-256 por arquivo para verificação de integridade |
| **MarkInconsistentAnswers** | Função Go em `internal/assessment/crosscheck.go` |

## Boundaries Internos

| Camada | Responsabilidade |
|--------|------------------|
| **controller** | Validação de entrada (validator), orquestração de repositórios |
| **repository** | Persistência Firestore e Cloud SQL; isolamento por tenant |
| **engine** | Execução de ferramentas externas; timeout, logs |
| **parser** | Tradução output → RawFinding; mapping_logic → AuditFinding |
| **assessment** | Loader de perguntas; scoring; crosscheck (Logic Engine) |
