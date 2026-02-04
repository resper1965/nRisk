---
type: doc
name: tooling
description: Scripts, IDE e produtividade
category: tooling
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Ferramentas e Produtividade

## Go

- **Versão:** 1.22+
- **Build:** `go build ./...`
- **API:** `go run ./cmd/api`
- **Scan Job:** `go run ./cmd/scan-job`

## Docker

- **API:** `docker build -t nrisk-api .`
- **Scan Job:** `docker build -f Dockerfile.scan-job -t nrisk-scan-job .`

## GCP

- **gcloud:** Deploy Cloud Run, Pub/Sub, Firestore
- **Variáveis:** `GCP_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`
- **Deploy:** Ver [devops.md](./devops.md) para comandos completos (API, Scan Job, Firestore rules)

## ai-context (MCP)

- **buildSemantic:** Contexto focado para geração de código
- **fillSingle:** Preencher docs em `.context/`
- **workflow-init / workflow-advance:** Fluxo PREVC
