# n.Risk

Plataforma de avaliação de postura cibernética para **Cyber Insurance** e gestão de riscos de terceiros. Combina scans passivos (Nuclei, Nmap, Subfinder) com questionários de conformidade e mapeamento para ISO 27001.

## Estrutura

```
nRisk/
├── .context/           # Base contextual (docs, plans, agents)
├── backend/            # API Go + Scan Engine
│   ├── cmd/api/        # API REST (Cloud Run)
│   ├── cmd/scan-job/   # Core Engine (Cloud Run Jobs)
│   └── mapping_logic.json
└── AGENTS.md           # Instruções para agentes
```

## Stack

- **Backend:** Go + Gin
- **Auth:** GCP Identity Platform (JWT + tenant_id)
- **Persistência:** Firestore, Cloud SQL
- **Infra:** Cloud Run, Pub/Sub

## Início Rápido

```bash
cd backend
export GCP_PROJECT_ID=seu-projeto
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json
go run ./cmd/api
```

## Documentação

- **Contexto completo:** [.context/docs/contexto-nrisk.md](.context/docs/contexto-nrisk.md)
- **Planos:** [.context/plans/README.md](.context/plans/README.md)

## Repositório

- **GitHub:** https://github.com/resper1965/nRisk
