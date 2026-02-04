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

Arquitetura serverless no Google Cloud Platform com workers efêmeros, mensageria assíncrona e persistência híbrida.

## Componentes GCP

| Componente | Serviço GCP | Papel |
|------------|-------------|-------|
| **Frontend** | Firebase Hosting | Dashboard Next.js |
| **API Backend** | Cloud Run (Go) | Lógica de negócio, questionários |
| **Scan Engine** | Cloud Run Jobs | Execução de Nuclei, Nmap, Subfinder |
| **Mensageria** | Pub/Sub | Desacoplamento scan request → execução |
| **Persistência** | Cloud SQL (PostgreSQL) | GRC, controles ISO, questionários |
| **Persistência** | Firestore | Scans, findings, resultados variáveis |
| **Evidence Vault** | Cloud Storage | Documentos com CMEK |
| **Auth** | Identity Platform | MFA, JWT com tenant_id |
| **Secrets** | Secret Manager | Chaves Threat Intel (Shodan, Censys) |
| **WAF** | Cloud Armor | Proteção do Dashboard |

## Fluxo de Dados (Resumo)

```
API → Pub/Sub (scan-requests) → Cloud Run Job → Firestore (findings)
                                          → Cloud SQL (score, controles)
```

## Estrutura de Código (Backend)

```
backend/
├── cmd/
│   ├── api/          # API REST (Cloud Run Service)
│   └── scan-job/     # Core Engine (Cloud Run Job)
├── internal/
│   ├── domain/       # AuditFinding, ScanResult, etc.
│   ├── engine/       # Orquestração de ferramentas
│   ├── parser/       # Tradução GRC (mapping_logic.json)
│   ├── controller/   # Handlers HTTP
│   ├── middleware/   # Auth JWT
│   └── repository/   # Firestore, (futuro) Cloud SQL
└── mapping_logic.json  # Fonte de verdade ISO 27001
```

## Multi-tenancy

- **Path Firestore:** `tenants/{tenantId}/scans/{scanId}/findings/{findingId}`
- **JWT:** Custom claim `tenant_id` obrigatório
- **Isolamento:** Queries e regras Firestore filtradas por tenant
