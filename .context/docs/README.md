# Documentation Index

Base de conhecimento do n.Risk. Comece pelo documento mestre de contexto.

**Feature em destaque:** [Assessments Híbridos](../plans/nrisk-assessment-hibrido.md) — Questionários vinculados ao mapping_logic, Logic Engine (Cross-Check), Evidence Vault, API GET/PATCH assessments.

## Documento Mestre

- **[Contexto n.Risk](./contexto-nrisk.md)** — Consolidação de planos e referências para agentes
- **[PRD — Plataforma n.Risk](./prd-plataforma-nrisk.md)** — Product Requirements Document: visão, personas, estado atual, escopo MVP e roadmap
- **[Descrição Funcional — Plataforma n.Risk](./descricao-funcional-plataforma-nrisk.md)** — Para que serve a plataforma; como são feitas as avaliações (técnica e declarativa) e as comparações (Cross-Check, domain scores, histórico)
- **[Gaps — Landing vs Aplicação](./gaps-landing-vs-aplicacao.md)** — O que a página pública apresenta; gaps em relação à aplicação; o que é necessário para entregar o que a página promete. A documentação (PRD, descrição funcional, project-overview, contexto) foi ajustada para refletir e resolver os gaps (estado alvo e compromissos da landing).

## Decisões de Arquitetura
- **[ADR-001: Stack API TypeScript / Scan Go](./adr-001-stack-api-typescript-scan-go.md)** — Go só para Scan Engine; API + assessment + frontend em Next.js (TypeScript)

## Regras de Negócio
- **[Regras de Negócio — Assessment e Scoring](./regras-de-negocio-assessment.md)** — Evidência, F, NA, escopo (SecurityScorecard), persistência, RBAC, submissão CISO, justificativa de vulnerabilidade

## Concorrente e Posicionamento
- **[Correlação SecurityScorecard ↔ n.Risk](./correlacao-securityscorecard-nrisk.md)** — Mapeamento concorrente (SCDR, TPRM, Cyber Insurance, ratings, questionários); dores, personas; diferenciação e oportunidades

## Core Guides
- [Project Overview](./project-overview.md)
- [API Reference](./api.md) · [Design](./api-design.md) · [OpenAPI](./api.openapi.yaml)
- [Architecture Notes](./architecture.md)
- [Database & Schemas](./database.md)
- [DevOps & Deploy](./devops.md)
- [Performance](./performance.md)
- [Frontend](./frontend.md)
- [Development Workflow](./development-workflow.md)
- [Testing Strategy](./testing-strategy.md)
- [Glossary & Domain Concepts](./glossary.md)
- [Data Flow & Integrations](./data-flow.md)
- [Security & Compliance Notes](./security.md)
- [Security Audit Checklist](./security-audit-checklist.md)
- [Tooling & Productivity Guide](./tooling.md)

## Repository Snapshot
*Top-level directories will appear here once the repository contains subfolders.*

## Document Map
| Guide | File | Primary Inputs |
| --- | --- | --- |
| PRD — Plataforma n.Risk | `prd-plataforma-nrisk.md` | Visão, personas, estado atual, escopo MVP, roadmap |
| Descrição Funcional — Plataforma n.Risk | `descricao-funcional-plataforma-nrisk.md` | Propósito, avaliações (técnica/declarativa), comparações (Cross-Check, domain scores, histórico) |
| Gaps — Landing vs Aplicação | `gaps-landing-vs-aplicacao.md` | Conteúdo da página; gaps; entregas necessárias para cumprir a landing |
| Project Overview | `project-overview.md` | Roadmap, README, stakeholder notes |
| API Reference | `api.md` | Endpoints, auth, validações |
| Architecture Notes | `architecture.md` | ADRs, service boundaries, dependency graphs |
| Database & Schemas | `database.md` | Firestore, Cloud SQL, migrations, RLS |
| DevOps & Deploy | `devops.md` | Containers, Cloud Run, env vars, CI/CD |
| Performance | `performance.md` | Otimizações, benchmarks sugeridos |
| Frontend | `frontend.md` | Stack, integração API, estrutura de rotas |
| Development Workflow | `development-workflow.md` | Branching rules, CI config, contributing guide |
| Testing Strategy | `testing-strategy.md` | Test configs, CI gates, known flaky suites |
| Glossary & Domain Concepts | `glossary.md` | Business terminology, user personas, domain rules |
| Data Flow & Integrations | `data-flow.md` | System diagrams, integration specs, queue topics |
| Security & Compliance Notes | `security.md` | Auth model, secrets management, compliance requirements |
| Tooling & Productivity Guide | `tooling.md` | CLI scripts, IDE configs, automation workflows |
