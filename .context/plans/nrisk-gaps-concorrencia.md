---
status: in_progress
generated: 2026-02-05
parentPlan: nrisk-mvp
description: Gaps do n.Risk em relação ao concorrente SecurityScorecard (Security Ratings)
docs:
  - "correlacao-securityscorecard-nrisk.md"
  - "regras-de-negocio-assessment.md"
  - "project-overview.md"
---

# Gaps do n.Risk vs Concorrência (SecurityScorecard)

Plano de análise de gaps do n.Risk em relação ao [Security Ratings](https://securityscorecard.com/why-securityscorecard/security-ratings/) do SecurityScorecard (concorrente). Baseado na [correlação SecurityScorecard ↔ n.Risk](../docs/correlacao-securityscorecard-nrisk.md).

**Referência concorrente:** [Security Ratings — SecurityScorecard](https://securityscorecard.com/why-securityscorecard/security-ratings/) (rating A–F, 10 risk factors, use cases, metodologia ML/AI, continuous monitoring).

---

## Objetivo

- Identificar **gaps** (o que o concorrente tem e o n.Risk não tem ou tem parcialmente).
- Classificar por **prioridade** (P0/P1/P2) e **ação** (fechar / adiar / diferenciar).
- Orientar roadmap e decisões de produto sem copiar o concorrente — manter diferenciação (Cyber Insurance, cross-check, justificativa, transparência, ISO 27001).

---

## Resumo executivo

| Categoria              | Gaps principais                                                                 | Prioridade sugerida |
|------------------------|-----------------------------------------------------------------------------------|---------------------|
| **Fatores de risco**   | DNS Health, Endpoint, IP Reputation, Cubit, Hacker Chatter não cobertos no scan  | P2 (adicionar se fizer sentido para ISO/Cyber Insurance) |
| **Use case**           | Riscos na cadeia estendida (4ª/N-ésima parte); detecção automática de vendors   | P2 (pós-MVP)        |
| **Monitoramento**      | Scan sob demanda/agendado; não há “continuous monitoring” como produto           | P1                  |
| **Experiência**        | Relatórios board/subscrição; telemetria/alertas; integração (SIEM, ServiceNow)   | P1                  |
| **Remediação**         | Workflow “engajar vendor e resolver”; justificativa já existe                    | P1 (completar justificativa + opcional remediação) |
| **Metodologia**        | Concorrente: ML/AI, “best predictor of breach”; n.Risk: fórmula explícita       | Diferenciar (não fechar) |

---

## 1. Gaps por categoria

### 1.1 Fatores de risco (10 fatores SecurityScorecard vs 15 domínios n.Risk)

| Gap | Descrição | Prioridade | Ação recomendada |
|-----|-----------|------------|------------------|
| **DNS Health** | Concorrente tem eixo dedicado (DNS, passive DNS, eventos maliciosos). n.Risk tem só subdomain_exposure no scan; DNS não é eixo no spider chart. | P2 | Opcional: eixo “DNS Health” no spider (dados de DNS/DMARC já coletados); ou manter foco ISO e ignorar. |
| **Endpoint Security** | Concorrente: metadados OS, browser, plugins. n.Risk: scan externo, sem visibilidade de endpoints. | P2 | Adiar. Endpoint é fora do escopo de superfície externa; pode ser questão de questionário (inventário, EDR). |
| **IP Reputation** | Concorrente: sinkhole, OSINT malware, threat intel. n.Risk: não coberto. | P2 | Adiar ou evolução (integração com feed de reputação se fizer sentido para subscrição). |
| **Cubit Score / Hacker Chatter** | Concorrente: threat intel pública, chatter underground. n.Risk: não coberto. | P2 | Adiar. Diferenciação n.Risk é ISO + cross-check + Cyber Insurance; não precisa replicar threat intel. |
| **Rating A–F por fator** | Concorrente: nota A–F **por cada um** dos 10 fatores. n.Risk: score global A–F + **domain_scores** (15 domínios) em %. | P1 | Alinhar: garantir que spider chart / relatório mostrem “nota” ou nível por domínio (equivalente a A–F por eixo). |

**Resumo:** Fechar gap de “rating por eixo” (já temos domain_scores); demais fatores são P2 ou diferenciação consciente (não replicar tudo).

---

### 1.2 Use cases

| Gap | Descrição | Prioridade | Ação recomendada |
|-----|-----------|------------|------------------|
| **Avaliar própria organização** | Concorrente: telemetria externa + benchmark com pares. n.Risk: score S_f + spider por tenant+scan; sem benchmark setorial. | P1 | Implementar jornada persistida (já na regra); P2: benchmark setorial (média por setor) se produto quiser. |
| **Proteger supply chain** | Concorrente: rating A–F por vendor. n.Risk: rating por tenant/domínio; seguradora/corretora consomem. | ✅ | Alinhado; garantir visibilidade “por vendor/tenant” para quem compra risco. |
| **Riscos na cadeia estendida (4ª/N-ésima parte)** | Concorrente: Automatic Vendor Detection, riscos em 4th e Nth party. n.Risk: scan por domínio solicitado; sem detecção automática de vendors. | P2 | Pós-MVP. Se produto exigir “descobrir vendors automaticamente”, planejar como evolução. |
| **Decisões em cyber insurance** | Concorrente: dados e ratings para precificação e elegibilidade. n.Risk: foco principal; score + jornada + submissão para seguradora/corretora. | ✅ | Diferencial n.Risk; reforçar relatórios e dados prontos para underwriters (gap de experiência, não de posicionamento). |

---

### 1.3 Monitoramento e cadência

| Gap | Descrição | Prioridade | Ação recomendada |
|-----|-----------|------------|------------------|
| **Continuous monitoring** | Concorrente: monitoramento contínuo; histórico de rating ao longo do tempo. n.Risk: scan sob demanda (ou agendado manual); resultados persistidos mas não “contínuos” como produto. | P1 | Introduzir scans agendados (ex.: semanal/mensal por domínio) e persistir snapshot de score por data; expor “jornada no tempo” para demandantes. |
| **Cadência de patch (Patching Cadence)** | Concorrente: velocidade de atualizações e mitigação. n.Risk: CVE/outdated no scan; não mede “velocidade” de correção. | P2 | Opcional: medir “tempo até correção” entre dois scans (evolução). |

---

### 1.4 Experiência (relatórios, telemetria, integração)

| Gap | Descrição | Prioridade | Ação recomendada |
|-----|-----------|------------|------------------|
| **Board & Executive Reporting** | Concorrente: relatórios para board. n.Risk: jornada persistida definida; relatórios PDF/dashboard para board e subscrição em roadmap. | P1 | Implementar persistência de score/cross-check (já na regra); depois relatórios prontos para board e underwriters (PDF, dashboards por portfólio). |
| **Telemetria / alertas (SOCs want telemetry)** | Concorrente: além do score, threat intel acionável. n.Risk: score + findings + cross-check; sem alertas (ex.: novo finding crítico, queda de score) nem integração. | P1 | Oferecer alertas acionáveis (webhook, e-mail) e integração (SIEM, ServiceNow-type) para SOC/TPRM. |
| **Benchmark com pares** | Concorrente: comparar com industry benchmarks. n.Risk: não tem. | P2 | Pós-MVP: média por setor ou cohort para “como você se compara”. |

---

### 1.5 Remediação e colaboração

| Gap | Descrição | Prioridade | Ação recomendada |
|-----|-----------|------------|------------------|
| **Detection → resolution (SCDR)** | Concorrente: “bridge ratings and resolution”; workflows que viram sinais em ação. n.Risk: justificativa de finding (cliente → avaliador → aceite → nota acrescida) definida; workflow de remediação (prazos, responsáveis, ticketing) não. | P1 | Completar fluxo de justificativa (backend + UI); opcional: workflows de remediação (prazos, integração com ticketing). |
| **Vendor communication / MAX** | Concorrente: managed service que trabalha com vendors para resolver. n.Risk: plataforma; serviço gerenciado fora do escopo. | P2 | Adiar ou oferta futura (n.Risk como plataforma primeiro). |

---

### 1.6 Metodologia do score

| Gap | Descrição | Prioridade | Ação recomendada |
|-----|-----------|------------|------------------|
| **ML/AI e “predictor of breach”** | Concorrente: metodologia ML/AI, “13.8x breach ratio”, impacto algorítmico na previsão de breach. n.Risk: fórmula explícita S_f, F, penalidade crítica; transparência (NA, impacto na nota). | — | **Diferenciar.** Não fechar gap: n.Risk escolheu transparência e regras auditáveis; “predictor of breach” é posicionamento deles. Manter documentação da metodologia e pesos (mapping_logic, assessment_questions) para credibilidade. |

---

## 2. Priorização consolidada

### P0 (crítico para MVP / posicionamento)

- Nenhum gap P0 que bloqueie o MVP; o que concorrente tem e n.Risk não tem em P0 já está coberto por escopo (rating A–F, score por tenant+scan, questionários, Cyber Insurance, cross-check, justificativa).

### P1 (fechar no curto/médio prazo)

1. **Rating por eixo** — Garantir que spider chart / relatório mostrem nível (A–F ou equivalente) por domínio.
2. **Jornada persistida** — Persistir resultado do cross-check e ScoreBreakdown; histórico consumível por demandantes (já na regra; implementar).
3. **Continuous monitoring** — Scans agendados + snapshot de score por data; “jornada no tempo”.
4. **Relatórios board/subscrição** — PDF e dashboards para board e underwriters.
5. **Telemetria/alertas** — Alertas (novo finding crítico, queda de score) e integração (webhook, SIEM, ServiceNow-type).
6. **Justificativa de finding** — Completar fluxo (backend + UI + avaliador); opcional remediação guiada.

### P2 (adicionar se fizer sentido; pós-MVP)

1. **DNS Health** como eixo (ou manter só subdomain no scan).
2. **Benchmark setorial** (média por setor).
3. **Riscos cadeia estendida** (detecção automática de vendors / 4th party).
4. **Endpoint / IP Reputation / Hacker Chatter** — Só se produto exigir; senão manter foco em superfície externa + ISO.
5. **Remediação guiada** (workflows, integração ticketing).
6. **Managed service** (tipo MAX) — Oferta futura se desejado.

### Diferenciar (não fechar)

- **Metodologia ML/AI / “predictor of breach”** — Manter fórmula explícita e transparência como diferencial.

---

## 3. Dependências e referências

- **Correlação:** [correlacao-securityscorecard-nrisk.md](../docs/correlacao-securityscorecard-nrisk.md)
- **Regras de negócio:** [regras-de-negocio-assessment.md](../docs/regras-de-negocio-assessment.md) (persistência, jornada, RBAC, justificativa)
- **Planos relacionados:** nrisk-mvp, nrisk-assessment-hibrido, nrisk-scoring-metodologia, nrisk-assessments-hibridos-implementacao
- **Concorrente:** [Security Ratings — SecurityScorecard](https://securityscorecard.com/why-securityscorecard/security-ratings/)

---

## 4. Próximos passos

1. Validar priorização (P1/P2) com produto.
2. Incluir itens P1 no roadmap (jornada persistida, relatórios, alertas, justificativa, continuous monitoring).
3. Revisar gaps ao fechar cada entrega (ex.: após implementar jornada persistida, marcar como fechado).
4. Manter correlacao-securityscorecard-nrisk.md atualizado quando o concorrente ou o n.Risk evoluírem.
