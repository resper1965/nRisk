---
slug: getting-started
category: getting-started
generatedAt: 2026-02-04T18:53:51.041Z
---

# How do I set up and run this project?

## Getting Started

### Prerequisites

- **Go 1.22+**
- **GCP Project** com Firestore e Identity Platform
- **Variáveis:** `GCP_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`
- (Opcional) **Ferramentas de scan:** nmap, nuclei, subfinder (para testes locais do scan-job)
- (Opcional) **Assessments:** `GCS_EVIDENCE_BUCKET` (upload de evidências), `ASSESSMENT_QUESTIONS_PATH` (default: ./assessment_questions.json)

### Installation

```bash
git clone https://github.com/resper1965/nRisk.git
cd nRisk/backend
go mod download
```

### Running

```bash
# API REST
export GCP_PROJECT_ID=seu-projeto
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
go run ./cmd/api

# Scan Job (Cloud Run Job ou local)
TENANT_ID=org-1 SCAN_ID=scan-1 DOMAIN=example.com go run ./cmd/scan-job
```

### Docker

```bash
# API
docker build -t nrisk-api .

# Scan Job
docker build -f Dockerfile.scan-job -t nrisk-scan-job .
```
