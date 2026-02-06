---
type: doc
name: gaps-landing-vs-aplicacao
description: O que a landing apresenta, gaps em relação à aplicação e entregas necessárias
category: product
generated: 2026-02-05
status: filled
---

# Gaps — Landing vs Aplicação

Documento que (1) **extrai o que a página pública apresenta**, (2) **compara com a aplicação proposta** (PRD, descrição funcional, API) e (3) **descreve o que é necessário para entregar o que a página promete**. A landing está entregue e fixa; a aplicação deve evoluir para cumprir o que nela está dito.

**Documentação ajustada para refletir e resolver os gaps:** O PRD, a descrição funcional e o project-overview foram atualizados para incluir o **estado alvo** (compromissos da landing) como escopo. Os itens abaixo constam como planejados/escopo no PRD (§5, §11, FR8–FR12), na descrição funcional (§5 Estado alvo) e no project-overview (Componentes, Escopo alvo). Este documento mantém o detalhe do que a página apresenta, o status atual por área e o checklist de entregas.

**Referências:** [prd-plataforma-nrisk.md](./prd-plataforma-nrisk.md), [descricao-funcional-plataforma-nrisk.md](./descricao-funcional-plataforma-nrisk.md), [api.md](./api.md).

---

## 1. O que a página apresenta (resumo da landing)

Extração do conteúdo da landing (páginas n.Risk) — **sem alterar a página**; serve de referência do que o mercado vê e do que a aplicação deve suportar.

### 1.1 Visão e posicionamento (página)

- **Gestão de risco cibernético com evidência.** Assumir o controle do risco de terceiros em toda a cadeia de suprimentos. Detecte, priorize e remedie: score híbrido, Cross-Check e evidências em uma única plataforma. *Confiança medida, não só declarada.*
- **Por que a n.Risk:** ratings de segurança vitais para reguladores, seguradoras e empresas; monitoramento contínuo e insights em tempo real.
- **Soluções:** Cadeia de suprimentos (TPRM, Trust Center, qualificação); Seguradoras (subscrição, portfólio, triagem); Avaliações e governança (questionários por framework, cofre de evidências, Trust Center).
- **Produtos:** Score e scan de superfície; Cross-Check e Fator de Confiança; Avaliações híbridas; Trust Center (visibilidade configurável para terceiros e demandantes).
- **Monitoramento contínuo:** tendência de score, inconsistências declaração vs scan, evidências pendentes, justificativas em análise; tudo persistido e consumível por demandantes conforme RBAC.
- **Onboarding:** alinhamento de escopo (domínios, frameworks); configuração de tenant e integrações; primeira avaliação e revisão; ativação e acompanhamento.

### 1.2 Cadeia de suprimentos (página)

- Risco de terceiros com **visibilidade contínua**. n.Risk para identificar, medir e resolver riscos em fornecedores e parceiros; score híbrido e evidências.
- **Por que:** risco de terceiros fora de controle; plataforma única para TPRM e GRC (conferência cruzada, Trust Center, evidências centralizadas); **detecção contínua e alertas acionáveis** (alertas para finding crítico, queda de score e inconsistências; RBAC, instantâneos, trilha de auditoria).
- **Soluções:** Third-Party Cyber Risk Management; Detecção e resposta na cadeia (score híbrido e por eixo, **alertas configuráveis**, histórico e tendência); Questionários e avaliações (ISO 27001, NIST CSF, LGPD; cofre de evidências; submissão controlada e RBAC).
- **Produtos:** Scan e superfície de ataque; Conferência cruzada; Scores por eixo (A–F por domínio); **Trust Center** (visibilidade configurável para terceiros e demandantes); Evidências e RBAC (cofre centralizado com trilha de auditoria).
- **FAQ:** Como a n.Risk qualifica fornecedores? (scan outside-in + avaliações por framework; score híbrido e por eixo; conferência cruzada). O que terceiros veem no Trust Center? (score, categoria, eixos A–F, status de evidências e histórico conforme RBAC). Como funcionam os alertas? (configuráveis para finding crítico, queda de score e inconsistências; webhook e e-mail em roadmap).

### 1.3 Avaliações (página)

- Avaliações padronizadas com **evidências e governança**. Questionários por framework, evidências centralizadas e **Trust Center**. *Confiança medida, não só declarada.*
- **Por que:** questionários sem evidência não bastam (conferência cruzada com achados técnicos; Fator de Confiança); **Cofre de evidências com trilha de auditoria** (upload, **comentários**, **aprovação** e integridade; **em trilhas Prata/Ouro, evidência pode ser obrigatória**; demandantes conforme RBAC); **Trust Center para terceiros** (score, categoria, eixos, status de evidências e documentos liberados; visibilidade por perfil).
- **Soluções:** Questionários por framework (ISO 27001, NIST CSF, LGPD; respostas Sim/Não/NA; conferência cruzada com scan); Cofre de evidências (upload e aprovação, trilha de auditoria, integridade); Trust Center (score e eixos por perfil, status de evidências, RBAC).
- **Produtos:** Questionários e frameworks (ISO 27001, NIST CSF, LGPD mapeados a controles); Conferência cruzada; Cofre de evidências (upload, aprovação e trilha de auditoria); Trust Center; **Submissão controlada** (Admin/CISO submete, resultados auditáveis).
- **FAQ:** Frameworks disponíveis? (ISO 27001, NIST CSF e LGPD; perguntas mapeadas a controles; novos frameworks conforme demanda). Quem pode submeter? (**Apenas Admin ou CISO**; respostas congeladas após submissão; resultados auditáveis conforme RBAC). Cofre de evidências? (upload, comentários, aprovação; trilha e integridade; **em trilhas Prata/Ouro, evidência obrigatória** para controles selecionados). O que terceiros veem no Trust Center? (score, categoria, eixos, status de evidências e documentos, conforme RBAC).

### 1.4 Metodologia (página)

- Metodologia clara. Resultado **defensável**. Score híbrido, conferência cruzada e histórico auditável.
- **Conceitos:** Score híbrido (T + C ajustado pelo Fator de Confiança; categoria A–F); Conferência cruzada (declaração vs observação por controle); Fator de Confiança (0–1; reduz peso do declarativo quando há inconsistências); Penalidade crítica (achado crítico limita score final); Scores por eixo (A–F por eixo); Histórico (instantâneos, antes/depois, justificativas aprovadas).

### 1.5 Seguradoras (página)

- Gerencie o risco cibernético em todo o **portfólio**. Score híbrido e evidências para apólices de cyber.
- **Por que:** visibilidade contínua; plataforma única para segurados, corretores e subscritores; evidência e consistência (Cross-Check e Fator de Confiança).
- **Soluções:** Subscrição contínua (triagem por score e eixos, precificação com penalidade crítica, renovação com histórico); Triagem e precificação (score híbrido 0–1000, A–F, scores por eixo, inconsistências e achados críticos); Gestão de portfólio (tendência, **alertas e eventos**, **relatórios para diretoria e subscritores**).
- **Produtos:** Score e scan de superfície; Cross-Check e Fator de Confiança; Avaliações híbridas; **Relatórios para subscritores** (score, eixos, histórico e inconsistências).
- **FAQ:** Como o score apoia a subscrição? (híbrido + A–F; triagem, precificação, renovação; scores por eixo e histórico). Penalidade crítica? (achado crítico limita score; visibilidade de risco extremo). Como seguradoras avaliam? (n.Risk agrega: score técnico, avaliações declarativas, Cross-Check, Fator de Confiança — **um único painel**). Relatórios? (**Relatórios para diretoria e subscritores estão em roadmap.** Hoje: score, eixos, inconsistências, histórico e tendência via API e interface.)

### 1.6 Contato (página)

- Contextos: subscrição, TPRM, cadeia de suprimentos ou governança. Demonstração personalizada; resposta em até 24h; sem compromisso.

---

## 2. Gaps entre a aplicação proposta e o que a página apresenta

| Área | Página apresenta | Aplicação hoje | Gap |
|------|------------------|----------------|-----|
| Frameworks | ISO 27001, **NIST CSF**, **LGPD** | Apenas **ISO 27001** | Sim |
| Trust Center | Recurso disponível (visibilidade, RBAC, o que terceiros veem) | **Roadmap** (não implementado) | Sim |
| Alertas | Alertas configuráveis (finding crítico, queda de score, inconsistências); webhook/e-mail em roadmap | **Roadmap** (P1.5); não há API de alertas | Sim |
| Trilhas Prata/Ouro | Evidência obrigatória em Prata/Ouro; trilha de auditoria | Trilhas **não implementadas** (FR3) | Sim |
| Monitoramento / visibilidade contínua | Visibilidade contínua; detecção contínua; insights em tempo real | Scans **sob demanda** (P1.3 em roadmap) | Sim |
| Cofre de evidências | Upload, **comentários**, **aprovação**, integridade | Apenas **upload** (GCS); sem comentários/aprovação de evidência | Parcial |
| Submissão | Apenas Admin ou CISO submete; respostas congeladas | Regra na doc; API não restringe por role | Possível gap |
| Painel / interface | Um único painel; dados via API e interface | Só **API** + landing; Painel de Postura em roadmap | Sim |
| Relatórios | Em roadmap (diretoria/subscritores); hoje via API e interface | Alinhado — roadmap | Não |

### 2.1 Frameworks: NIST CSF e LGPD

- **Página:** "ISO 27001, NIST CSF, LGPD"; "Questionários vinculados a frameworks como ISO 27001, NIST CSF e LGPD".
- **Aplicação:** Apenas ISO 27001 (assessment_questions.json; loader por framework ID). LGPD aparece em perguntas do ISO; não há questionário separado NIST CSF ou LGPD.
- **Gap:** Três frameworks comunicados; aplicação oferece um. **Entregar:** questionários NIST CSF e LGPD (ou equivalente) carregáveis pela API e UI, ou documentar escopo atual e ajustar apenas comunicação futura.

### 2.2 Trust Center

- **Página:** Trust Center como produto (visibilidade configurável; score, categoria, eixos A–F, status de evidências e histórico conforme RBAC; o que terceiros veem).
- **Aplicação:** Trust Center público em roadmap; sem endpoint público de Trust Center.
- **Gap:** Página descreve como recurso atual; aplicação não tem. **Entregar:** Trust Center público (URL, visibilidade por perfil/RBAC, score, eixos, status de evidências, histórico) — ver PRD e plano frontend/Trust Center.

### 2.3 Alertas

- **Página:** Detecção contínua e alertas acionáveis; alertas configuráveis para finding crítico, queda de score e inconsistências; webhook e e-mail em roadmap.
- **Aplicação:** P1.5 (telemetria/alertas) em roadmap; sem controller/endpoint de alertas.
- **Gap:** Alertas como recurso; não existem na aplicação. **Entregar:** P1.5 — motor de alertas (finding crítico, queda de score, inconsistências), configuração por tenant, integração webhook/e-mail.

### 2.4 Trilhas Bronze/Prata/Ouro

- **Página:** Em trilhas Prata/Ouro, evidência pode ser obrigatória; trilha de auditoria; submissão controlada e RBAC.
- **Aplicação:** FR3 (trilhas e delegação) não entregue; não há conceito de trilha no assessment.
- **Gap:** Trilhas e evidência obrigatória por trilha comunicadas; não implementadas. **Entregar:** FR3 — modelo de trilhas (Bronze/Prata/Ouro), evidência obrigatória por trilha, persistência e regras no Logic Engine.

### 2.5 Monitoramento / visibilidade contínua

- **Página:** Visibilidade contínua; detecção contínua; monitoramento contínuo e insights em tempo real.
- **Aplicação:** Scans sob demanda (POST /scans); P1.3 (scans agendados) em roadmap.
- **Gap:** Página sugere continuidade; aplicação é sob demanda. **Entregar:** P1.3 — scans agendados (ex.: semanal/mensal), snapshots por data, visibilidade de tendência contínua.

### 2.6 Cofre de evidências: comentários e aprovação

- **Página:** Upload, comentários, aprovação e integridade; upload e aprovação; trilha de auditoria.
- **Aplicação:** Evidence Vault com upload (GCS); sem comentários nem aprovação de evidência (aprovação existe para justificativas de finding).
- **Gap:** Comentários e aprovação no cofre prometidos; só upload existe. **Entregar:** Fluxo de comentários e aprovação por evidência (estados, auditoria), exposto na API e na UI.

### 2.7 Submissão apenas CISO/Admin

- **Página:** Apenas Admin ou CISO submete; respostas congeladas após submissão.
- **Aplicação:** NFR RBAC; API de assessment não verifica role para submissão.
- **Gap:** Regra documentada; implementação a confirmar. **Entregar:** RBAC de submissão (endpoint ou regra que restringe submissão a Admin/CISO); respostas somente leitura após submissão.

### 2.8 Painel / interface de produto

- **Página:** Um único painel para decisão; score, eixos, inconsistências, histórico e tendência via API e interface.
- **Aplicação:** API REST + landing; Painel de Postura em roadmap.
- **Gap:** Interface de produto implícita; hoje só API. **Entregar:** Painel de Postura (dashboard com score dinâmico, spider chart, histórico, inconsistências) — ver plano frontend/UI.

---

## 3. O que está alinhado (sem remover funcionalidade já descrita)

- **Score híbrido, Cross-Check, Fator de Confiança, penalidade crítica, domain_scores (A–F):** implementados e coerentes com a página.
- **Justificativa de finding (cliente submete → avaliador aprova):** implementado.
- **Histórico de score (jornada persistida):** GET score-history; snapshots; alinhado.
- **Relatórios:** Página diz que relatórios para diretoria/subscritores estão em roadmap; hoje via API e interface — alinhado com PRD.
- **Terminologia:** Conferência cruzada = Cross-Check; Fator de Confiança = F — consistente.

---

## 4. O que é necessário para entregar o que a página promete

Checklist de entregas para a aplicação cumprir o que a landing apresenta. Não remove nenhuma funcionalidade já descrita nos docs; adiciona o que falta.

| # | Entregável | Descrição breve | Referência |
|---|------------|-----------------|------------|
| 1 | **Trust Center** | URL pública; visibilidade por perfil (RBAC); score, categoria, eixos A–F, status de evidências, histórico; o que terceiros veem conforme perfil. | PRD 5.3; plano Trust Center |
| 2 | **Alertas (P1.5)** | Motor de alertas: finding crítico, queda de score, inconsistências; configuração por tenant; webhook e e-mail. | PRD 5.4 |
| 3 | **Scans agendados / monitoramento contínuo (P1.3)** | Scans periódicos (ex.: semanal/mensal); snapshots por data; visibilidade de tendência contínua. | PRD 5.1 |
| 4 | **Trilhas Bronze/Prata/Ouro (FR3)** | Modelo de trilhas; evidência obrigatória em Prata/Ouro para controles selecionados; delegação de perguntas se escopo. | PRD 5.2; nrisk-assessment-hibrido |
| 5 | **Frameworks NIST CSF e LGPD** | Questionários NIST CSF e LGPD (ou mapeamento equivalente) carregáveis pela API; ou decisão explícita de escopo apenas ISO 27001 e comunicação. | assessment_questions; loader |
| 6 | **Cofre de evidências: comentários e aprovação** | Fluxo de comentários e aprovação por evidência; estados e trilha de auditoria; API e UI. | Evidence Vault; storage |
| 7 | **RBAC de submissão** | Apenas Admin/CISO podem submeter assessment; respostas somente leitura após submissão; checagem na API. | regras-de-negocio-assessment |
| 8 | **Painel de Postura** | Interface de produto: score dinâmico, spider chart (domain_scores), histórico, inconsistências, evidências; consumo da API. | PRD 5.3; frontend; nrisk-ui-base-clone |
| 9 | **Relatórios para diretoria e subscritores (P1.4)** | PDF e/ou dashboards para portfólio e tendência; em roadmap na página — manter alinhado. | PRD 5.4 |

**Priorização sugerida (para cumprir a página):** Trust Center (diferencial e FAQ) → Painel de Postura (interface única) → Alertas (P1.5) → Scans agendados (P1.3) → Trilhas (FR3) → Cofre comentários/aprovação e RBAC de submissão → Frameworks NIST/LGPD → Relatórios P1.4.

---

## 5. Referências

| Documento | Uso |
|-----------|-----|
| [prd-plataforma-nrisk.md](./prd-plataforma-nrisk.md) | Estado atual, escopo MVP, roadmap |
| [descricao-funcional-plataforma-nrisk.md](./descricao-funcional-plataforma-nrisk.md) | Como avaliações e comparações funcionam |
| [api.md](./api.md) | Endpoints existentes |
| [contexto-nrisk.md](./contexto-nrisk.md) | Base unificada e planos |
