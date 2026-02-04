---
slug: project-structure
category: architecture
generatedAt: 2026-02-04T18:53:51.044Z
---

# How is the codebase organized?

## Project Structure

```
nRisk/
├── .context/                 # Base contextual (docs, plans, agents, skills)
│   ├── agents/               # Agent playbooks (backend-specialist, etc.)
│   ├── docs/                 # Documentação (architecture, glossary, etc.)
│   ├── plans/                # Planos (MVP, arquitetura, scoring, etc.)
│   ├── skills/               # Skills (documentation, code-review, etc.)
│   └── workflow/             # Actions e fluxo PREVC
├── backend/                  # API Go + Scan Engine
│   ├── cmd/
│   │   ├── api/              # Entrypoint API REST (Cloud Run)
│   │   └── scan-job/         # Entrypoint Core Engine (Cloud Run Jobs)
│   ├── internal/
│   │   ├── domain/           # AuditFinding, ScanResult, models
│   │   ├── engine/           # Orquestração Nuclei, Nmap, Subfinder
│   │   ├── parser/           # Tradução GRC (mapping_logic.json)
│   │   ├── controller/       # Handlers HTTP
│   │   ├── middleware/       # Auth JWT
│   │   └── repository/firestore/
│   ├── migrations/           # Schema Cloud SQL (001_grc_schema.sql)
│   ├── pkg/logger/           # Logs JSON
│   ├── mapping_logic.json    # Fonte de verdade ISO 27001
│   ├── Dockerfile            # API
│   └── Dockerfile.scan-job   # Scan Engine
├── frontend/                 # (Planejado) Dashboard Next.js — clonar resper1965/clone
├── AGENTS.md                 # Instruções para agentes
└── README.md
```

Ver [frontend.md](../frontend.md) para setup e estrutura.

## Principais diretórios

| Diretório | Propósito |
|-----------|-----------|
| `backend/cmd/api` | API REST, endpoints de scans |
| `backend/cmd/scan-job` | Core Engine, execução de ferramentas |
| `backend/internal/parser` | Parser de outputs e mapeamento GRC |
| `backend/internal/engine` | Runner de Nmap, Nuclei, Subfinder |
| `.context/plans` | Planos MVP, arquitetura, scoring |
