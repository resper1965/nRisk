# Contexto n.Risk — Base Unificada do Projeto

> Documento mestre que consolida planos e documentação do n.Risk para referência de agentes e desenvolvedores.

## Visão Geral

O **n.Risk** é uma plataforma de avaliação de postura cibernética para Cyber Insurance e gestão de riscos de terceiros. Combina scans passivos (Nuclei, Nmap, Subfinder), questionários de conformidade e mapeamento para ISO 27001.

## Hierarquia de Planos

```
nrisk-mvp (PRD, escopo 4 meses)
├── nrisk-arquitetura-gcp (infra GCP)
├── nrisk-scoring-metodologia (algoritmo S_f, taxonomia)
│   └── nrisk-matriz-rastreabilidade-grc (controles ISO)
├── nrisk-assessment-hibrido (trilhas, Question Bank, Cross-Check, RBAC)
│   └── nrisk-assessments-hibridos-implementacao (Cloud SQL, Logic Engine, API)
├── nrisk-scan-engine-ai2pentest (wrapper ferramentas)
│   └── nrisk-core-engine (implementação Go)
├── nrisk-dpcf-privacy-compliance (LGPD, Evidence Vault)
├── nrisk-governanca-dados-apis (APIs e governança)
├── nrisk-backend-boilerplate (API Go)
├── nrisk-ui-base-clone (Dashboard, Trust Center)
└── nrisk-roadmap-implementacao (cronograma)
```

## Planos e Referências

| Plano | Objetivo | Status |
|-------|----------|--------|
| [nrisk-mvp](../plans/nrisk-mvp.md) | PRD, escopo MVP 4 meses | Em progresso |
| [nrisk-arquitetura-gcp](../plans/nrisk-arquitetura-gcp.md) | Stack GCP (Cloud Run, Pub/Sub, Firestore, CMEK) | Em progresso |
| [nrisk-core-engine](../plans/nrisk-core-engine.md) | Scan Engine em Go, parser GRC | Implementado |
| [nrisk-scan-engine-ai2pentest](../plans/nrisk-scan-engine-ai2pentest.md) | Manifesto de ferramentas (Nuclei, Nmap, Subfinder) | Base |
| [nrisk-scoring-metodologia](../plans/nrisk-scoring-metodologia.md) | Algoritmo T, C, F; penalidade crítica | Em progresso |
| [nrisk-matriz-rastreabilidade-grc](../plans/nrisk-matriz-rastreabilidade-grc.md) | Mapeamento técnico → ISO 27001 | Em progresso |
| [nrisk-dpcf-privacy-compliance](../plans/nrisk-dpcf-privacy-compliance.md) | LGPD, classificação de dados, Evidence Vault | Em progresso |
| [nrisk-backend-boilerplate](../plans/nrisk-backend-boilerplate.md) | API Go + Gin, Firestore, JWT | Implementado |
| [nrisk-assessment-hibrido](../plans/nrisk-assessment-hibrido.md) | Trilhas Bronze/Prata/Ouro, Cross-Check, RBAC | Em progresso |
| [nrisk-assessments-hibridos-implementacao](../plans/nrisk-assessments-hibridos-implementacao.md) | Cloud SQL, Logic Engine, API GET/PATCH assessments | Em progresso |

## Documentação

| Doc | Conteúdo |
|-----|----------|
| [project-overview](./project-overview.md) | Visão geral, stack, scoring |
| [api](./api.md) | Referência de endpoints REST |
| [api-design](./api-design.md) | Princípios, formato de erro, versionamento |
| [architecture](./architecture.md) | Componentes GCP, estrutura de código |
| [database](./database.md) | Esquemas Firestore e Cloud SQL, índices, RLS |
| [devops](./devops.md) | Deploy, containers, env vars, CI/CD planejado |
| [performance](./performance.md) | Otimizações (Auth singleton, Scan paralelo, WriteBatch) |
| [frontend](./frontend.md) | Stack, integração API, estrutura de rotas |
| [data-flow](./data-flow.md) | Fluxo de scan, integrações |
| [glossary](./glossary.md) | Terminologia, entidades, severidades |
| [security](./security.md) | Auth, criptografia, LGPD |
| [security-audit-checklist](./security-audit-checklist.md) | Checklist de auditoria de segurança |
| [development-workflow](./development-workflow.md) | Branching, commits, deploy |
| [testing-strategy](./testing-strategy.md) | Cobertura, casos críticos |
| [tooling](./tooling.md) | Go, Docker, GCP, ai-context |

## Regras para Agentes

1. **Decisões arquiteturais:** Consultar `nrisk-arquitetura-gcp.md` e `nrisk-mvp.md`
2. **Scoring e GRC:** Consultar `nrisk-scoring-metodologia.md` e `nrisk-matriz-rastreabilidade-grc.md`
3. **Scan Engine:** Consultar `nrisk-core-engine.md`; `mapping_logic.json` é fonte de verdade
4. **Assessments Híbridos:** Consultar `nrisk-assessment-hibrido.md` e `nrisk-assessments-hibridos-implementacao.md`; Logic Engine (Cross-Check), Cloud SQL, Evidence Vault
5. **Privacidade:** Consultar `nrisk-dpcf-privacy-compliance.md` para Evidence Vault e PII

## Estrutura do Repositório

```
nRisk/
├── .context/           # Base contextual (docs, plans, agents, skills)
├── backend/            # API Go + Scan Job
│   ├── cmd/api/        # Entrypoint API
│   ├── cmd/scan-job/   # Entrypoint Core Engine
│   ├── internal/       # engine, parser, repository, domain
│   └── mapping_logic.json
├── AGENTS.md           # Instruções para agentes
└── README.md           # Visão geral do repositório
```
