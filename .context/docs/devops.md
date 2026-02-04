---
type: doc
name: devops
description: Deploy, containers e infraestrutura n.Risk
category: devops
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# DevOps e Infraestrutura — n.Risk

## 1. Containers

### API (Cloud Run Service)

| Arquivo | Base | Porta |
|---------|------|-------|
| `backend/Dockerfile` | golang:1.22-alpine → alpine:3.19 | 8080 |

**Build:**
```bash
cd backend
docker build -t nrisk-api .
```

**Variáveis de ambiente:** `PORT` (default 8080), `GCP_PROJECT_ID`, `ENV` (opcional para logs), `GCS_EVIDENCE_BUCKET` (upload de evidências; opcional), `ASSESSMENT_QUESTIONS_PATH` (path para assessment_questions.json; default: ./assessment_questions.json)

### Scan Job (Cloud Run Job)

| Arquivo | Base | Ferramentas |
|---------|------|-------------|
| `backend/Dockerfile.scan-job` | golang:1.22-alpine → alpine:3.19 | nmap (pré-instalado) |

**Build:**
```bash
cd backend
docker build -f Dockerfile.scan-job -t nrisk-scan-job .
```

**Nota:** Nuclei e Subfinder exigem imagem estendida ou pre-instalação (ver plan nrisk-core-engine).

**Variáveis obrigatórias em runtime:** `TENANT_ID`, `SCAN_ID`, `DOMAIN`

---

## 2. Deploy Manual (MVP)

### API

```bash
cd backend
gcloud run deploy nrisk-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT_ID=seu-projeto
```

**Para produção:** Remover `--allow-unauthenticated` e configurar IAM; usar `--no-allow-unauthenticated`.

### Scan Job

```bash
# 1. Build e push da imagem
docker build -f backend/Dockerfile.scan-job -t gcr.io/PROJECT_ID/nrisk-scan-job ./backend
docker push gcr.io/PROJECT_ID/nrisk-scan-job

# 2. Criar Job (uma vez)
gcloud run jobs create nrisk-scan \
  --image gcr.io/PROJECT_ID/nrisk-scan-job \
  --region us-central1

# 3. Executar Job (por scan)
gcloud run jobs execute nrisk-scan \
  --region us-central1 \
  --update-env-vars TENANT_ID=org-123,SCAN_ID=uuid-scan,DOMAIN=example.com,GCP_PROJECT_ID=PROJECT_ID
```

### Firestore Rules

```bash
firebase deploy --only firestore:rules
```

(Criar projeto Firebase linkado ao GCP; `firestore.rules` em `backend/`)

---

## 3. Variáveis de Ambiente

### API

| Variável | Obrigatório | Default | Descrição |
|----------|-------------|---------|-----------|
| PORT | Não | 8080 | Porta HTTP (Cloud Run injeta automaticamente) |
| GCP_PROJECT_ID | Não | nrisk-dev | Projeto Firestore |
| ENV | Não | — | Ambiente (dev, staging, prod) para logs |

### Scan Job

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| TENANT_ID | Sim | ID do tenant |
| SCAN_ID | Sim | ID do scan (Firestore) |
| DOMAIN | Sim | Domínio alvo (validado como hostname) |
| GCP_PROJECT_ID | Não | Default: nrisk-dev |
| MAPPING_LOGIC_PATH | Não | Default: /app/mapping_logic.json |

### Local (desenvolvimento)

| Variável | Descrição |
|----------|-----------|
| GOOGLE_APPLICATION_CREDENTIALS | Caminho para service-account.json |

---

## 4. Service Accounts e IAM

| Serviço | Permissões necessárias |
|---------|------------------------|
| **API (Cloud Run)** | Firestore Data User/Editor; Identity Platform Verifier |
| **Scan Job (Cloud Run Jobs)** | Firestore Data User/Editor |

Cloud Run usa **Application Default Credentials (ADC)**; em produção, a service account do Cloud Run já possui credenciais injetadas.

---

## 5. Health Check

| Rota | Método | Auth | Uso |
|------|--------|------|-----|
| /health | GET | Não | Cloud Run startup/liveness probe |

**Response:** `200 OK` `{"status":"ok"}`

Cloud Run usa health checks automaticamente na porta configurada; `/health` pode ser configurado como liveness/startup probe se necessário.

---

## 6. Graceful Shutdown

A API implementa graceful shutdown em `SIGTERM`/`SIGINT`:
- Timeout de 30s para encerrar conexões
- Cloud Run envia SIGTERM antes de encerrar o container

---

## 7. CI/CD (Planejado)

**Status atual:** Deploy manual; sem pipeline automatizado.

**Próximos passos (nrisk-roadmap-implementacao):**
- Cloud Build ou GitHub Actions para build + deploy
- Build: `go build ./...`, testes
- Deploy: API e Scan Job em Cloud Run; Firestore rules via Firebase CLI
- SAST/DAST em pipeline

---

## 8. Artefatos

| Artefato | Localização |
|----------|-------------|
| Dockerfile API | `backend/Dockerfile` |
| Dockerfile Scan Job | `backend/Dockerfile.scan-job` |
| Firestore Rules | `backend/firestore.rules` |
| Migrations Cloud SQL | `backend/migrations/001_grc_schema.sql` |
