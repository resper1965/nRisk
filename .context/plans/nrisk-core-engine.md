---
status: implemented
generated: 2026-02-04
source: Core Engine n.Risk - Scan Engine em Go
parentPlan: nrisk-scan-engine-ai2pentest
agents:
  - type: "backend-specialist"
    role: "Wrapper Go, execução de ferramentas, parsers"
  - type: "architect-specialist"
    role: "Estrutura de pastas, pipeline de dados"
  - type: "security-auditor"
    role: "Mapeamento ISO 27001, isolamento tenant"
docs:
  - "architecture.md"
  - "data-flow.md"
phases:
  - id: "engine"
    name: "internal/engine - Orquestração"
    prevc: "C"
  - id: "parser"
    name: "internal/parser - Tradução GRC"
    prevc: "C"
  - id: "repository"
    name: "internal/repository - Firestore"
    prevc: "C"
---

# Core Engine n.Risk - Scan Engine em Go

> Wrapper Go que orquestra Nuclei, Subfinder e Nmap, traduz achados via `mapping_logic.json` e persiste em Firestore multi-tenant. Compatível com GCP Cloud Run Jobs.

## Task Snapshot

- **Primary goal:** Core Engine completo em Go para scans efêmeros, parser inteligente baseado em mapping_logic.json, persistência em `/tenants/{tenantId}/scans/{scanId}/findings/{findingId}`.
- **Success signal:** `go build ./cmd/scan-job` compila; variáveis TENANT_ID, SCAN_ID, DOMAIN executam scan e gravam findings no Firestore.
- **Key references:**
  - [AI2PentestTool](https://github.com/penligent/AI2PentestTool)
  - [mapping_logic.json](../../backend/mapping_logic.json)
  - [Scan Engine Plan](./nrisk-scan-engine-ai2pentest.md)
  - [Arquitetura GCP](./nrisk-arquitetura-gcp.md)

---

## Estrutura Implementada

```
backend/
├── cmd/
│   ├── api/           # API REST (existente)
│   └── scan-job/      # Core Engine entrypoint
├── internal/
│   ├── domain/
│   │   └── audit_finding.go
│   ├── engine/        # Orquestração de ferramentas
│   │   └── runner.go
│   ├── parser/        # Tradução GRC (mapping_logic.json)
│   │   ├── mapping.go
│   │   └── parsers.go
│   └── repository/
│       └── firestore/
│           ├── finding_repository.go
│           └── score_repository.go
├── mapping_logic.json # Fonte de verdade para ISO 27001
├── Dockerfile
└── Dockerfile.scan-job
```

---

## 1. Scanner Wrapper (internal/engine)

- **Runner**: Executa nmap, nuclei, subfinder em subprocessos.
- **Isolamento**: Apenas ferramentas disponíveis no PATH são usadas.
- **Tenant**: `tenant_id` recebido via env `TENANT_ID` e tagueado em todos os logs.
- **Cloud Run Jobs**: Compatível; variáveis `TENANT_ID`, `SCAN_ID`, `DOMAIN`, `GCP_PROJECT_ID`.

### Comandos por ferramenta

| Ferramenta | Comando | Output |
|------------|---------|--------|
| nmap | `nmap -sV -Pn -p 22,80,443,3389,445 --open -oG - {{domain}}` | Grepable |
| nuclei | `nuclei -u https://{{domain}} -jsonl -silent` | JSONL |
| subfinder | `subfinder -d {{domain}} -silent` | Linhas texto |

---

## 2. Parser Inteligente (internal/parser)

- **mapping_logic.json**: Única fonte de verdade para traduzir `technical_finding`, `port`, `template_id` em controles ISO 27001.
- **Lookup**: `FindByTechnicalFinding`, `FindByPort`, `FindByTemplateID`.
- **AuditFinding**: Gera objeto com `control_id`, `iso_domain`, `score_deduction`, `recommendation`.

### Mapeamentos (exemplos)

| technical_finding | control_id | score_deduction |
|-------------------|------------|-----------------|
| open_rdp_port | C-01 | 500 |
| open_smb_port | C-01 | 500 |
| expired_ssl | C-02 | 200 |
| missing_dmarc | C-04 | 200 |
| subdomain_exposure | C-03 | 20 |

---

## 3. Persistência (internal/repository/firestore)

- **Findings**: `tenants/{tenantId}/scans/{scanId}/findings/{findingId}`
- **Score**: Atualização em `tenants/{tenantId}/scans/{scanId}` com `score`, `score_category`, `status`, `finished_at`.
- **Cálculo**: Base 1000, subtrai `score_deduction` de cada finding.

---

## 4. Segurança e Logs

- Logs estruturados JSON para Cloud Logging, com `tenant_id` e `tool_name` em cada entrada.
- Tratamento de erros: ferramenta falha → log Warn; output inválido → finding ignorado (não mapeado).
- Firestore rules: `tenants/{tenantId}/scans/{scanId}/findings/{findingId}` com `isTenantMember`.

---

## 5. Deploy

```bash
# Build scan-job
docker build -f Dockerfile.scan-job -t gcr.io/PROJECT/scan-job .

# Cloud Run Job (exemplo)
gcloud run jobs create nrisk-scan \
  --image gcr.io/PROJECT/scan-job \
  --set-env-vars TENANT_ID=xxx,SCAN_ID=yyy,DOMAIN=example.com,GCP_PROJECT_ID=PROJECT
```

---

## Próximos passos

- Integrar Pub/Sub para receber mensagens de scan (desacoplamento).
- Adicionar nuclei e subfinder ao Dockerfile.scan-job (imagem estendida).
- Testes unitários para parser e engine.
