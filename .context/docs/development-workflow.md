---
type: doc
name: development-workflow
description: Processos de desenvolvimento e contribuição
category: workflow
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Fluxo de Desenvolvimento

## Branching

- **main:** Produção
- **develop:** Integração (opcional)
- **feature/*** ou **fix/***: Tarefas específicas

## Commits

- **Conventional Commits:** `feat(scope): descrição`, `fix(scope): descrição`
- Exemplo: `feat(scan-engine): add Nuclei parser`

## Pré-requisitos

- Go 1.22+
- `GCP_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`
- Ferramentas de scan (nmap, nuclei, subfinder) para testes locais do scan-job

## Rodar Localmente

```bash
# API
cd backend && go run ./cmd/api

# Scan Job (variáveis de ambiente obrigatórias)
TENANT_ID=x SCAN_ID=y DOMAIN=example.com go run ./cmd/scan-job
```

## Deploy

- **API:** `gcloud run deploy nrisk-api --source . --region us-central1`
- **Scan Job:** Build `Dockerfile.scan-job` → Cloud Run Jobs
