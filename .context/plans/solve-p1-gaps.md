---
status: filled
generated: 2026-02-05
parentPlan: nrisk-gaps-concorrencia
description: Implementar os 6 itens P1 do plano de gaps vs SecurityScorecard
docs:
  - "nrisk-gaps-concorrencia.md"
  - "regras-de-negocio-assessment.md"
  - "correlacao-securityscorecard-nrisk.md"
  - "project-overview.md"
  - "architecture.md"
  - "data-flow.md"
  - "api-design.md"
agents:
  - type: "architect-specialist"
    role: "Definir padrões para jornada persistida, alertas e continuous monitoring"
  - type: "backend-specialist"
    role: "API de scores/domínios, snapshots, agendamento, webhooks, justificativa"
  - type: "frontend-specialist"
    role: "Spider/relatório A–F por eixo, dashboards board/subscrição, fluxo justificativa"
  - type: "database-specialist"
    role: "Esquemas para histórico de score, snapshots, eventos de alerta"
  - type: "devops-specialist"
    role: "Jobs agendados (Cloud Scheduler), integração webhook/SIEM"
  - type: "feature-developer"
    role: "Implementar features P1 conforme especificação"
  - type: "test-writer"
    role: "Testes para scoring, persistência, alertas e justificativa"
  - type: "documentation-writer"
    role: "Atualizar api.md, data-flow, regras de negócio"
  - type: "security-auditor"
    role: "Revisar webhooks, RBAC e dados expostos em relatórios"
  - type: "code-reviewer"
    role: "Revisar PRs de cada entrega P1"
phases:
  - id: "phase-1"
    name: "Discovery & Alignment"
    prevc: "P"
  - id: "phase-2"
    name: "Implementation & Iteration"
    prevc: "E"
  - id: "phase-3"
    name: "Validation & Handoff"
    prevc: "V"
---

# Resolver gaps P1 (n.Risk vs SecurityScorecard) Plan

> Implementar os 6 itens P1 do plano nrisk-gaps-concorrencia: (1) rating A–F por eixo no spider/relatório, (2) jornada persistida (cross-check + ScoreBreakdown + histórico), (3) continuous monitoring (scans agendados + snapshot por data), (4) relatórios board/subscrição (PDF, dashboards), (5) telemetria/alertas (webhook, integração), (6) justificativa de finding (fluxo backend + UI + avaliador).

## Task Snapshot
- **Primary goal:** Fechar os 6 gaps P1 do n.Risk em relação ao SecurityScorecard (Security Ratings), mantendo diferenciação (ISO 27001, Cyber Insurance, transparência do score).
- **Success signal:** (1) Spider/relatório exibem nível A–F por domínio; (2) Cross-check e ScoreBreakdown persistidos e consumíveis por demandantes; (3) Scans agendados com snapshot de score por data; (4) Relatórios PDF/dashboards para board e underwriters; (5) Alertas (finding crítico, queda de score) e integração webhook/SIEM; (6) Fluxo de justificativa de finding (backend + UI + avaliador) completo.
- **Key references:**
  - [Gaps vs Concorrência](./nrisk-gaps-concorrencia.md) — fonte dos 6 itens P1
  - [Regras de negócio assessment](../docs/regras-de-negocio-assessment.md)
  - [Documentation Index](../docs/README.md)
  - [Plans Index](./README.md)

## Os 6 itens P1 (resumo)
| # | Item | Entregável principal |
|---|------|----------------------|
| 1 | **Rating por eixo** | Spider chart / relatório com nível A–F (ou equivalente) por domínio (domain_scores já existem; expor como “nota” por eixo). |
| 2 | **Jornada persistida** | Persistir resultado cross-check + ScoreBreakdown; histórico consumível por demandantes (API + modelo de dados). |
| 3 | **Continuous monitoring** | Scans agendados (ex.: semanal/mensal por domínio) + snapshot de score por data; “jornada no tempo”. |
| 4 | **Relatórios board/subscrição** | PDF e dashboards prontos para board e underwriters (portfólio, tendência). |
| 5 | **Telemetria/alertas** | Alertas (novo finding crítico, queda de score); webhook + integração tipo SIEM/ServiceNow. |
| 6 | **Justificativa de finding** | Fluxo completo: backend (estado, transições) + UI (cliente → avaliador) + opcional remediação guiada. |

## Agent Lineup
| Agent | Role in this plan | First responsibility focus |
| --- | --- | --- |
| Architect Specialist | Definir padrões para jornada persistida, eventos de alerta e modelo de snapshots; alinhar com nrisk-assessment-hibrido e ADR-001. | [Architect](../agents/architect-specialist.md) |
| Backend Specialist | API de domain_scores/rating por eixo, persistência cross-check/ScoreBreakdown, snapshots por data, agendamento de scans, webhooks, fluxo de justificativa (estados, RBAC). | [Backend](../agents/backend-specialist.md) |
| Frontend Specialist | Spider/relatório com A–F por domínio, dashboards board/subscrição, PDF export, fluxo UI de justificativa (cliente → avaliador). | [Frontend](../agents/frontend-specialist.md) |
| Database Specialist | Esquemas para histórico de score, snapshots por scan/date, tabela/coleção de eventos para alertas; índices para consultas por tenant/domínio/data. | [Database](../agents/database-specialist.md) |
| Devops Specialist | Jobs agendados (Cloud Scheduler + Pub/Sub ou equivalente), configuração de webhooks, documentação de integração SIEM. | [Devops](../agents/devops-specialist.md) |
| Feature Developer | Implementar features P1 conforme especificação (itens 1–6). | [Feature Developer](../agents/feature-developer.md) |
| Test Writer | Testes para scoring por domínio, persistência de jornada, disparo de alertas, fluxo de justificativa e RBAC. | [Test Writer](../agents/test-writer.md) |
| Documentation Writer | Atualizar api.md, data-flow, regras-de-negocio-assessment e glossary com novos conceitos (snapshot, alerta, justificativa). | [Documentation](../agents/documentation-writer.md) |
| Security Auditor | Revisar webhooks (assinatura, secrets), RBAC em relatórios/alertas e dados expostos em PDF/dashboards. | [Security](../agents/security-auditor.md) |
| Code Reviewer | Revisar PRs de cada entrega P1 (qualidade, estilo, alinhamento com plano). | [Code Reviewer](../agents/code-reviewer.md) |

## Documentation Touchpoints
| Guide | File | Primary Inputs |
| --- | --- | --- |
| Project Overview | [project-overview.md](../docs/project-overview.md) | Roadmap, README, stakeholder notes |
| Architecture Notes | [architecture.md](../docs/architecture.md) | ADRs, service boundaries, dependency graphs |
| Development Workflow | [development-workflow.md](../docs/development-workflow.md) | Branching rules, CI config, contributing guide |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | Test configs, CI gates, known flaky suites |
| Glossary & Domain Concepts | [glossary.md](../docs/glossary.md) | Business terminology, user personas, domain rules |
| Data Flow & Integrations | [data-flow.md](../docs/data-flow.md) | System diagrams, integration specs, queue topics |
| Security & Compliance Notes | [security.md](../docs/security.md) | Auth model, secrets management, compliance requirements |
| Tooling & Productivity Guide | [tooling.md](../docs/tooling.md) | CLI scripts, IDE configs, automation workflows |

## Risk Assessment

### Identified Risks
| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| Dependência de assessments híbridos (Cloud SQL, Logic Engine) | Medium | High | Alinhar com nrisk-assessments-hibridos-implementacao; jornada persistida pode usar Firestore inicialmente se Cloud SQL atrasar. |
| Migração API para Next.js (ADR-001) em curso | Medium | Medium | Backend Specialist e Frontend Specialist alinharem com ADR-001; APIs novas podem ser desenhadas já pensando em consumidor Next.js. |
| Scans agendados exigem infra (Cloud Scheduler, custo) | Low | Medium | Definir cadência padrão (ex.: semanal) e limites por tenant; documentar custo em devops. |
| Webhooks/alertas: segurança e rate limit | Medium | High | Security Auditor revisar assinatura (HMAC), secrets e rate limit; documentar em security.md. |
| Insufficient test coverage em fluxos novos | Low | Medium | Incluir critérios de aceite com testes em cada item P1; Test Writer em Phase 2. |

### Dependencies
- **Internal:** nrisk-assessment-hibrido (cross-check, ScoreBreakdown), nrisk-scoring-metodologia (domain_scores, A–F), backend API Go (ou Next.js conforme ADR-001), Firestore/Cloud SQL conforme plano de dados.
- **External:** Nenhum crítico; integração SIEM/ServiceNow é opcional (webhook genérico primeiro).
- **Technical:** Domain_scores e scoring já existem no backend; é necessário expor “nota por eixo”, persistir snapshots e eventos, e implementar agendamento e webhooks.

### Assumptions
- Schema de score e domain_scores permanece estável; extensões (snapshot por data, eventos) são aditivas.
- Produto valida prioridade dos 6 itens P1; ordem de implementação pode ser ajustada (ex.: justificativa antes de relatórios PDF).
- ADR-001: frontend e API podem migrar para Next.js; Scan Engine permanece em Go — novas APIs devem ser consumíveis por ambos durante transição.

## Resource Estimation

### Time Allocation (estimativa por item P1)
| Item P1 | Esforço estimado | Observação |
| --- | --- | --- |
| 1. Rating por eixo | 1–2 pd | Expor domain_scores como A–F no relatório/spider; backend já tem dados. |
| 2. Jornada persistida | 3–5 pd | Modelo de dados + API + consumo por demandantes; depende de onde cross-check/ScoreBreakdown são calculados. |
| 3. Continuous monitoring | 3–5 pd | Agendamento (Cloud Scheduler) + snapshot por data + API “jornada no tempo”. |
| 4. Relatórios board/subscrição | 4–6 pd | PDF + dashboards; frontend e possivelmente serviço de geração de PDF. |
| 5. Telemetria/alertas | 3–4 pd | Eventos (finding crítico, queda score), webhook, documentação SIEM. |
| 6. Justificativa de finding | 4–6 pd | Backend (estados, RBAC) + UI (fluxo cliente → avaliador); regras em regras-de-negocio-assessment. |
| **Total (ordem de grandeza)** | **18–28 pd** | Fases 1+3 adicionam ~3–5 pd (discovery + validação). |

### Time by Phase
| Phase | Estimated Effort | Calendar Time |
| --- | --- | --- |
| Phase 1 - Discovery & Alignment | 2–3 pd | 3–5 days |
| Phase 2 - Implementation & Iteration | 18–28 pd (por item P1) | 4–8 weeks (depende de paralelismo) |
| Phase 3 - Validation & Handoff | 2–4 pd | 3–5 days |
| **Total** | **~22–35 pd** | **~5–10 weeks** |

### Required Skills
- Backend: Go (API atual), conhecimento de Firestore/Cloud SQL, desenho de eventos e webhooks.
- Frontend: React/Next.js (quando migrado), geração/export de PDF, dashboards.
- Infra: GCP (Cloud Scheduler, Pub/Sub), configuração de webhooks e segurança.
- Domínio: regras de negócio de assessment (cross-check, justificativa, RBAC) em regras-de-negocio-assessment.md.

## Working Phases
### Phase 1 — Discovery & Alignment
**Steps**
1. **Alinhar com planos existentes:** Revisar nrisk-assessments-hibridos-implementacao (Cloud SQL, Logic Engine), nrisk-scoring-metodologia (domain_scores, A–F) e regras-de-negocio-assessment (persistência, justificativa, RBAC). Owner: Architect + Backend.
2. **Definir modelo de dados para P1:** (a) Snapshots de score por scan/date; (b) eventos para alertas (finding crítico, queda de score); (c) estados e transições da justificativa de finding. Owner: Database + Architect.
3. **Definir contrato de webhook/alertas:** Payload, assinatura (HMAC), rate limit e documentação para integração SIEM. Owner: Backend + Security Auditor.
4. **Priorizar ordem de implementação dos 6 itens:** Validar com produto; sugerida: (1) rating por eixo → (2) jornada persistida → (6) justificativa → (3) continuous monitoring → (5) alertas → (4) relatórios board/subscrição. Owner: Product/Architect.
5. **Capturar dúvidas abertas:** Ex.: cadência padrão de scans agendados, formato PDF desejado para board, limites por tenant em alertas.

**Commit Checkpoint**
- Commit com decisões de Phase 1: `chore(plan): complete phase 1 discovery — solve-p1-gaps` (atualizar solve-p1-gaps.md com ordem de itens e modelo de dados acordado).

### Phase 2 — Implementation & Iteration
**Steps**
1. **P1.1 — Rating por eixo:** Expor domain_scores como nível A–F (ou equivalente) no spider/relatório; API já retorna domain_scores; frontend/relatório mapear % → letra. Backend + Frontend.
2. **P1.2 — Jornada persistida:** Persistir cross-check + ScoreBreakdown por assessment/scan; API para demandantes consultarem histórico (por tenant/domínio/data). Backend + Database; alinhar com nrisk-assessments-hibridos-implementacao.
3. **P1.6 — Justificativa de finding:** Implementar fluxo completo: estados (submitted, approved, rejected), RBAC (cliente submete, avaliador aprova/rejeita), backend + UI. Backend + Frontend; regras em regras-de-negocio-assessment.
4. **P1.3 — Continuous monitoring:** Scans agendados (Cloud Scheduler + Pub/Sub ou job recorrente); ao final de cada scan, persistir snapshot de score por data; API “jornada no tempo” (histórico de scores por domínio). Devops + Backend + Database.
5. **P1.5 — Telemetria/alertas:** Emitir eventos (novo finding crítico, queda de score); endpoint ou job que envia webhook; documentar payload e HMAC para SIEM. Backend + Security Auditor + Documentation.
6. **P1.4 — Relatórios board/subscrição:** PDF export e dashboards por portfólio para board e underwriters; dados já disponíveis via jornada persistida e snapshots. Frontend + possivelmente serviço de geração PDF.
7. **Review e testes:** Code Reviewer em cada PR; Test Writer cobre cenários críticos (scoring, persistência, alertas, justificativa); Documentation Writer atualiza api.md, data-flow, glossary.

**Commit Checkpoint**
- Commits por item P1 concluído (ex.: `feat(scoring): P1.1 rating A–F por eixo no relatório`); ao fim da fase, commit de resumo: `chore(plan): complete phase 2 implementation — solve-p1-gaps`.

### Phase 3 — Validation & Handoff
**Steps**
1. **Testes de aceite:** Validar os 6 sucessos do Task Snapshot (spider A–F, jornada consumível, scans agendados + snapshot, relatórios PDF/dashboards, alertas/webhook, fluxo justificativa). Test Writer + QA.
2. **Revisão de segurança:** Security Auditor confirma webhooks (HMAC, secrets), RBAC em relatórios e justificativa, e dados em PDF. Security Auditor.
3. **Documentação final:** Atualizar contexto-nrisk.md e README de planos se necessário; api.md, data-flow, regras-de-negocio-assessment e glossary atualizados. Documentation Writer.
4. **Evidências:** Logs de alertas de exemplo, exemplo de PDF/dashboard, link para doc de integração webhook/SIEM; registrar em solve-p1-gaps ou em workflow/docs.

**Commit Checkpoint**
- Commit com evidências e doc: `chore(plan): complete phase 3 validation — solve-p1-gaps`.

## Rollback Plan

### Rollback Triggers
- Bugs críticos em scoring ou persistência (domain_scores, snapshots, cross-check).
- Degradação de performance em relatórios/PDF ou em consultas de histórico.
- Problemas de integridade (snapshots inconsistentes, eventos de alerta duplicados).
- Vulnerabilidades em webhooks (vazamento de secrets, falta de assinatura).
- Erros em produção acima do limite aceitável (ex.: falha em scans agendados).

### Rollback Procedures
#### Phase 1 Rollback
- **Action:** Descartar branch de discovery; reverter alterações em solve-p1-gaps.md e docs tocados.
- **Data Impact:** Nenhum (sem mudança em produção).
- **Estimated Time:** < 1 hora.

#### Phase 2 Rollback
- **Action:** Reverter commits por item P1 (feature flags ou branches por item facilitam); migrações de banco: reverter migrations e restaurar snapshot pré-migração se necessário (Firestore/Cloud SQL).
- **Data Impact:** Novos dados (snapshots, eventos, estados de justificativa) podem ficar órfãos; definir política (manter só leitura ou limpar em rollback).
- **Estimated Time:** 2–4 horas por item P1 revertido; rollback total 1–2 dias se vários itens já em produção.

#### Phase 3 Rollback
- **Action:** Rollback de deploy (Cloud Run/Next.js) para versão anterior; desativar jobs agendados e webhooks se forem causa do problema.
- **Data Impact:** Dados já persistidos permanecem; sincronizar se houver cache ou filas (ex.: eventos de alerta não reprocessados).
- **Estimated Time:** 1–2 horas.

### Post-Rollback Actions
1. Documentar motivo no incident report e atualizar solve-p1-gaps.md com lições aprendidas.
2. Comunicar impacto a produto e demandantes (ex.: relatórios ou alertas indisponíveis).
3. Post-mortem para definir correção e critérios para novo deploy.
4. Atualizar plano (ordem de itens, riscos, rollback) antes de retry.

## Evidence & Follow-up
- **Artifacts:** PRs por item P1, resultados de testes (unit + integração), exemplo de payload de webhook, exemplo de PDF/dashboard, doc de integração SIEM.
- **Follow-up:** Revisar gaps P2 em nrisk-gaps-concorrencia após fechar P1; manter correlacao-securityscorecard-nrisk atualizado.
