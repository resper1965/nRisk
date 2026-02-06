---
type: doc
name: prd-plataforma-nrisk
description: Product Requirements Document — Plataforma n.Risk
category: product
generated: 2026-02-05
status: filled
---

# PRD — Plataforma n.Risk

**Product Requirements Document** da plataforma de avaliação de postura cibernética n.Risk, voltada para **Cyber Insurance** e gestão de riscos de terceiros. Consolida visão, personas, estado atual, escopo MVP e roadmap com base no que já está construído e nos planos existentes. **A documentação foi ajustada para refletir e resolver os gaps em relação à landing:** os compromissos da página pública constam como escopo alvo neste PRD e nos demais docs; detalhe em [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md).

---

## 1. Visão e posicionamento

**Visão:** Postura cibernética visível quando importa — uma única plataforma para avaliar, pontuar e evidenciar risco cibernético de empresas e terceiros, com score híbrido (técnico + declarativo), Trust Center e evidências alinhadas a ISO 27001 e Cyber Insurance.

**Posicionamento:**
- **Mercado:** Cyber Insurance, gestão de riscos de terceiros (cadeia de suprimentos), conformidade (ISO 27001, NIST CSF, LGPD).
- **Diferenciação:** Combinação de scans passivos externos (DNS, SSL, exposição) com questionários de conformidade e mapeamento direto para controles ISO 27001 (e frameworks NIST CSF, LGPD no escopo alvo); score híbrido (T + C) com fator de confiança e penalidade crítica; transparência via Trust Center e Evidence Vault (upload, comentários e aprovação no escopo alvo); trilhas Bronze/Prata/Ouro (evidência obrigatória em Prata/Ouro); alertas (finding crítico, queda de score, inconsistências); monitoramento contínuo (scans agendados); justificativa de findings (cliente → avaliador); submissão apenas Admin/CISO (RBAC).

**Referência concorrente:** SecurityScorecard (Security Ratings); gaps e priorização em [nrisk-gaps-concorrencia](../plans/nrisk-gaps-concorrencia.md) e [solve-p1-gaps](../plans/solve-p1-gaps.md).

---

## 2. Objetivos estratégicos por stakeholder

| Stakeholder | Objetivo |
|-------------|----------|
| **Seguradoras** | Automatizar subscrição e monitorar risco das apólices em tempo real; relatórios para board e underwriters. |
| **Clientes (Empresas / GRC)** | Gerir segurança da cadeia de suprimentos; centralizar evidências de conformidade de fornecedores; dashboards e histórico de score. |
| **Fornecedores (Avaliados)** | Demonstrar transparência via Trust Center; responder questionários e anexar evidências; submeter justificativas de findings e acelerar vendas. |

---

## 3. Personas e casos de uso

| Persona | Necessidade | Caso de uso n.Risk |
|---------|-------------|--------------------|
| **Subscritor (Seguradora)** | Precificar risco da apólice | Analisa score final e domain_scores (A–F por eixo) antes de emitir proposta; consulta histórico de score e relatórios. |
| **Gestor de Terceiros (GRC)** | Avaliar segurança de fornecedor | Envia convite de assessment; monitora Trust Center do parceiro; recebe alertas (finding crítico, queda de score). |
| **CISO / Time TI (Avaliado)** | Corrigir falhas e provar maturidade | Responde questionários; anexa evidências (Evidence Vault); submete justificativas de findings; acompanha score e inconsistências (Cross-Check). |

---

## 4. Estado atual (o que está dado)

Resumo do que já existe na plataforma (backend, landing, APIs, regras de negócio).

### 4.1 Backend (Go)

| Área | Entregável | Referência |
|------|------------|------------|
| **API REST** | Gin, JWT (tenant_id), multi-tenant | [backend/](../backend/), [api.md](./api.md) |
| **Scans** | POST /scans, GET /scans/:id, listagem de scans por tenant | [scan_controller](../backend/internal/controller/scan_controller.go) |
| **Findings** | Achados por scan; mapeamento para ISO 27001 via mapping_logic.json | [finding_repository](../backend/internal/repository/firestore/finding_repository.go) |
| **Score técnico** | Base 1000, dedução por achados; ScoreToCategory (A–F) | [scoring.go](../backend/internal/assessment/scoring.go) |
| **Domain scores (P1.1)** | GET /scans/:id retorna domain_scores (score e grade A–F por domínio ISO) | [scoring.go](../backend/internal/assessment/scoring.go), [api.md](./api.md) |
| **Assessment** | Listagem de perguntas (framework ISO27001), submissão de respostas, upload de evidência (GCS) | [assessment_controller](../backend/internal/controller/assessment_controller.go) |
| **Score híbrido** | GET /assessment/score (T×0.6 + C×0.4); GET /assessment/score/full (ScoreBreakdown, cross-check, F, penalidade crítica, domain_scores) | [scoring.go](../backend/internal/assessment/scoring.go) |
| **Jornada persistida (P1.2)** | ScoreSnapshot por scan; GET /scans/:id/score-history; GET /assessment/score/full persiste snapshot | [score_snapshot_repository](../backend/internal/repository/firestore/score_snapshot_repository.go), [api.md](./api.md) |
| **Justificativa de finding (P1.6)** | POST/GET justificativas por finding; PATCH review (aprovação/rejeição); GetFullScore exclui findings com justificativa aprovada do score | [justification_controller](../backend/internal/controller/justification_controller.go), [api.md](./api.md) |
| **Scan Job** | Cloud Run Job (Go): Nuclei, Nmap, Subfinder; parser → AuditFinding; persistência em Firestore | [cmd/scan-job](../backend/cmd/scan-job), [engine](../backend/internal/engine) |

### 4.2 Persistência e infra

| Componente | Uso |
|-------------|-----|
| **Firestore** | Tenants, scans, findings, scores, score_snapshots, justifications (multi-tenant) |
| **Cloud Storage** | Evidence Vault (evidências de assessment) |
| **GCP Identity Platform** | Auth; JWT com tenant_id |
| **Cloud Run** | API (serviço), Scan Job (job) |

### 4.3 Landing e marca

| Entregável | Descrição |
|------------|-----------|
| **Landing (Next.js)** | Pasta `landing/` (Next.js 15, Tailwind, shadcn/ui); hero, soluções, para quem é, CTA; publicada em Cloud Run (nrisk.ness.com.br) |
| **Branding** | Montserrat (medium), ponto "n.**.**Risk" em #00ade8, fundo escala Gray-900 |

### 4.4 Documentação e planos

- **Documento mestre:** [contexto-nrisk.md](./contexto-nrisk.md)
- **Planos:** [.context/plans/README.md](../plans/README.md) (MVP, arquitetura GCP, scoring, assessment híbrido, gaps P1, landing, etc.)
- **API:** [api.md](./api.md), [api-design.md](./api-design.md)
- **Regras de negócio:** [regras-de-negocio-assessment.md](./regras-de-negocio-assessment.md)
- **Glossário:** [glossary.md](./glossary.md)

---

## 5. Escopo MVP e roadmap (objetivos)

Escopo alvo em 4 meses (referência: [nrisk-mvp](../plans/nrisk-mvp.md)); itens já entregues marcados.

### 5.1 Core Discovery e Scan Passivo

- [x] API de scans (POST/GET); Scan Job (Go) com mapeamento para ISO 27001
- [x] Score técnico (base 1000, dedução por achados); domain_scores (A–F por eixo) — P1.1
- [ ] Continuous monitoring (P1.3): scans agendados (ex.: semanal/mensal) + snapshot por data; visibilidade contínua e tendência — compromisso da landing
- [ ] Threat Intel Lite (bases públicas / Dark Web) — conforme roadmap

### 5.2 Motor de Questionários e Painel

- [x] Framework ISO 27001 (assessment_questions); submissão de respostas; Evidence Vault (GCS) — upload
- [x] Cross-Check (lógica de inconsistência: resposta vs achado); ScoreBreakdown e fator de confiança (F)
- [x] Jornada persistida (P1.2): ScoreSnapshot, GET score-history, GET score/full persiste snapshot
- [ ] Frameworks NIST CSF e LGPD (questionários carregáveis pela API) — compromisso da landing
- [ ] Trilhas Bronze/Prata/Ouro e delegação de perguntas (FR3) — evidência obrigatória em Prata/Ouro; conforme plano assessment
- [ ] Cofre de evidências: comentários e aprovação por evidência (trilha de auditoria) — compromisso da landing
- [ ] RBAC de submissão: apenas Admin/CISO podem submeter assessment; respostas somente leitura após submissão — compromisso da landing
- [ ] Painel de resposta (UI Next.js) — base: resper1965/clone

### 5.3 Score, Trust Center e GRC

- [x] Algoritmo S_f = (T×0.6)+(C×0.4); penalidade crítica; domain_scores; ScoreBreakdown
- [x] Justificativa de finding (P1.6): submissão, listagem, revisão (aprovação/rejeição); exclusão do score quando aprovada
- [ ] Trust Center público (URL; visibilidade por perfil/RBAC; score, categoria, eixos A–F, status de evidências, histórico) — compromisso da landing
- [ ] Painel de Postura (score dinâmico, spider chart, histórico; um único painel para decisão) — compromisso da landing
- [ ] Mapeamento vulns ↔ Anexo A ISO 27001 (matriz GRC) — [nrisk-matriz-rastreabilidade-grc](../plans/nrisk-matriz-rastreabilidade-grc.md)

### 5.4 Relatórios, alertas e telemetria

- [ ] Relatórios board/subscrição (P1.4): PDF, dashboards para portfólio e tendência; relatórios para diretoria e subscritores — compromisso da landing
- [ ] Telemetria/alertas (P1.5): motor de alertas (finding crítico, queda de score, inconsistências); configuração por tenant; webhook e e-mail — compromisso da landing; integração SIEM/ServiceNow conforme roadmap

### 5.5 Beta e go-to-market

- [x] Landing pública (nrisk.ness.com.br); branding definido
- [ ] Beta com corretora/seguradora parceira; validação de subscrição, assessment de terceiros, Trust Center
- [ ] Ajustes de UX e relatórios conforme feedback

---

## 6. Requisitos funcionais (seleção)

| ID | Requisito | Status |
|----|-----------|--------|
| FR1 | Cadastro de empresas apenas via Domínio/CNPJ | Escopo |
| FR2 | Score técnico atualizado automaticamente (ex.: 24h) | Parcial (scan sob demanda; P1.3 continuous monitoring) |
| FR3 | Trilhas Bronze/Prata/Ouro; delegação de perguntas; evidência obrigatória em Prata/Ouro para controles selecionados | Escopo (assessment); compromisso da landing |
| FR4 | PDF "Relatório de Risco" para seguradora com resumo executivo; relatórios para diretoria e subscritores | Escopo (P1.4); compromisso da landing |
| FR5 | Rating A–F por eixo no spider/relatório (domain_scores) | Entregue (P1.1) |
| FR6 | Histórico de score (jornada persistida) consumível por demandantes | Entregue (P1.2) |
| FR7 | Justificativa de finding (cliente submete → avaliador aprova/rejeita); finding aprovado não penaliza score | Entregue (P1.6) |
| FR8 | Submissão de assessment apenas por Admin/CISO; respostas somente leitura após submissão (RBAC) | Escopo; compromisso da landing |
| FR9 | Cofre de evidências: comentários e aprovação por evidência; trilha de auditoria | Escopo; compromisso da landing |
| FR10 | Trust Center público: visibilidade por perfil (RBAC); score, categoria, eixos A–F, status de evidências, histórico | Escopo; compromisso da landing |
| FR11 | Alertas configuráveis (finding crítico, queda de score, inconsistências); webhook e e-mail (P1.5) | Escopo; compromisso da landing |
| FR12 | Questionários por frameworks ISO 27001, NIST CSF e LGPD (carregáveis pela API) | Parcial (só ISO 27001); NIST/LGPD compromisso da landing |

---

## 7. Requisitos não funcionais (NFR)

| Área | Requisito |
|------|-----------|
| **Segurança** | Criptografia em repouso (GCP); TLS em trânsito; JWT com tenant_id; RBAC (operador/CISO/avaliador) |
| **Privacidade** | LGPD para evidências e PII; [nrisk-dpcf-privacy-compliance](../plans/nrisk-dpcf-privacy-compliance.md) |
| **Escalabilidade** | API e Scan Job em Cloud Run; scanners em job efêmero; Firestore/GCS multi-tenant |
| **Performance** | Scan inicial &lt; 5 min (NFR referência); API stateless; Evidence Vault com hash SHA-256 |
| **Observabilidade** | Logs estruturados (JSON); telemetria e alertas (P1.5) em roadmap |

---

## 8. Algoritmo de scoring (resumo)

- **Score técnico (T):** Base 1000; dedução por achados (severidade → score_deduction); opcional recálculo excluindo findings com justificativa aprovada (P1.6).
- **Score de compliance (C):** Modelo aditivo (risk_weight); ajustado pelo fator de confiança F (cross-check).
- **Score híbrido:** \( S_f = (T \times 0{,}6) + (C \times 0{,}4) \); categoria A–F (900+ A, 750+ B, 600+ C, 400+ D, 250+ E, &lt;250 F).
- **Penalidade crítica:** Se houver achado de severidade Crítica, \( S_f \) não pode ultrapassar 500.
- **Domain scores:** Score e grade A–F por domínio ISO (agregação de findings por iso_domain) — P1.1.

Detalhes: [nrisk-scoring-metodologia](../plans/nrisk-scoring-metodologia.md), [glossary.md](./glossary.md).

---

## 9. Stack técnica (resumo)

| Camada | Tecnologia |
|--------|------------|
| **Backend (API + lógica)** | Go 1.22+, Gin; hoje em `backend/`; alvo ADR-001: migração para Next.js (API Routes) quando houver app único |
| **Scan Engine** | Go (Cloud Run Job); Nuclei, Nmap, Subfinder; mapping_logic.json → ISO 27001 |
| **Frontend (painel / Trust Center)** | Next.js 15, React 19, Shadcn UI (base: resper1965/clone) — em construção |
| **Landing** | Next.js 15, Tailwind, shadcn/ui; Cloud Run (nrisk.ness.com.br) |
| **Auth** | GCP Identity Platform (Firebase Auth); JWT com tenant_id |
| **Persistência** | Firestore (scans, findings, scores, snapshots, justifications); Cloud SQL (GRC/assessments em plano); GCS (Evidence Vault) |
| **Infra** | GCP: Cloud Run (API + Job), Pub/Sub (planejado para jobs agendados), Cloud Storage |

---

## 10. Sinais de sucesso

- **Produto:** Seguradora/corretora parceira usando a plataforma para subscrição e monitoramento de terceiros; avaliados respondendo questionários e mantendo Trust Center atualizado.
- **Técnico:** Score e domain_scores estáveis; histórico de score e justificativas consumíveis via API; landing e API em produção (GCP) com SLA aceitável.
- **Negócio:** Redução de tempo de subscrição; aumento de transparência na cadeia de terceiros; evidências e justificativas auditáveis.

---

## 11. Compromissos da landing (escopo alvo para resolver gaps)

A landing pública fixa o compromisso do produto. A documentação foi ajustada para refletir e resolver os gaps; os itens abaixo constam como **escopo alvo** neste PRD e nos planos.

| Compromisso | Onde no PRD / plano | Status |
|-------------|---------------------|--------|
| Trust Center (visibilidade por perfil, RBAC, score, eixos, evidências, histórico) | §5.3; FR10 | Planejado |
| Painel de Postura (um único painel; score, spider chart, histórico) | §5.3 | Planejado |
| Alertas (finding crítico, queda de score, inconsistências; webhook/e-mail) | §5.4; FR11; P1.5 | Planejado |
| Monitoramento contínuo (scans agendados; visibilidade e tendência) | §5.1; P1.3 | Planejado |
| Trilhas Bronze/Prata/Ouro (evidência obrigatória em Prata/Ouro) | §5.2; FR3 | Planejado |
| Frameworks NIST CSF e LGPD (questionários carregáveis) | §5.2; FR12 | Planejado |
| Cofre de evidências: comentários e aprovação | §5.2; FR9 | Planejado |
| RBAC de submissão (apenas Admin/CISO submetem) | §5.2; FR8 | Planejado |
| Relatórios para diretoria e subscritores | §5.4; FR4; P1.4 | Planejado |

Detalhe do que a página apresenta, status atual e checklist de entregas: [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md).

---

## 12. Referências cruzadas

| Documento | Conteúdo |
|------------|----------|
| [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md) | O que a página apresenta; gaps; entregas necessárias |
| [contexto-nrisk.md](./contexto-nrisk.md) | Base unificada; hierarquia de planos; regras para agentes |
| [project-overview.md](./project-overview.md) | Visão geral; componentes; escopo alvo; scoring |
| [nrisk-mvp](../plans/nrisk-mvp.md) | PRD original; fases em 4 meses; entregas por mês |
| [solve-p1-gaps](../plans/solve-p1-gaps.md) | 6 itens P1 (rating eixo, jornada persistida, continuous monitoring, relatórios, alertas, justificativa) |
| [nrisk-gaps-concorrencia](../plans/nrisk-gaps-concorrencia.md) | Gaps vs SecurityScorecard; priorização P1/P2 |
| [api.md](./api.md) | Referência de endpoints REST |
| [glossary.md](./glossary.md) | Terminologia e entidades de domínio |
