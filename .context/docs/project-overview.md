---
type: doc
name: project-overview
description: Visão geral do n.Risk e componentes principais
category: overview
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# n.Risk — Visão Geral do Projeto

Plataforma de avaliação de postura cibernética voltada para **Cyber Insurance** e gestão de riscos de terceiros. Combina observabilidade passiva externa (scans) com conformidade declaratória (questionários) e mapeamento para controles ISO 27001 (e frameworks NIST CSF, LGPD no escopo alvo). **A documentação foi ajustada para refletir e resolver os gaps em relação à landing:** o escopo alvo está descrito neste doc e no [PRD](./prd-plataforma-nrisk.md); detalhe em [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md).

## Objetivos Estratégicos

| Stakeholder | Objetivo |
|-------------|----------|
| **Seguradoras** | Automatizar subscrição e monitorar risco das apólices em tempo real |
| **Clientes (Empresas)** | Gerir segurança da cadeia de suprimentos e centralizar evidências de conformidade |
| **Fornecedores (Avaliados)** | Demonstrar transparência via Trust Center para acelerar vendas |

## Avaliação de Riscos de Terceiros (TPRA)

A plataforma implementa o ciclo completo de **Third-Party Risk Assessment (TPRA)**, processo crítico dado que 69% das empresas relatam postura de segurança mais fraca em seus fornecedores e 20% sofreram violações de dados através deles.

| Etapa TPRA | Implementação n.Risk |
|------------|---------------------|
| **Identificação de terceiros** | Cadastro multi-tenant; priorização por criticidade (acesso a dados sensíveis/sistemas core) |
| **Due diligence** | Assessment híbrido com trilhas Bronze (20 perguntas)/Prata (35 com evidencia)/Ouro (55 framework completo); mapeadas para ISO 27001 |
| **Risk Scoring** | Score 0–1000 (A–F); fórmula transparente $S_f = (T \times 0.6) + (C \times 0.4)$ |
| **Conformidade (LGPD/GDPR)** | Cross-Check Engine; Evidence Vault com SHA-256; controles de privacidade |
| **Remediação e monitoramento** | Justificativa de finding; score snapshots; jornada persistida; re-scans periódicos |
| **Due diligence** | Assessment híbrido com trilhas Bronze/Prata/Ouro (evidência obrigatória em Prata/Ouro no escopo alvo); questionários ISO 27001 (NIST CSF, LGPD no escopo alvo) |
| **Risk Scoring** | Score 0–1000 (A–F); fórmula transparente $S_f = (T \times 0.6) + (C \times 0.4)$; domain_scores por eixo |
| **Conformidade (LGPD/GDPR)** | Cross-Check Engine; Evidence Vault (upload; comentários e aprovação no escopo alvo); controles de privacidade |
| **Remediação e monitoramento** | Justificativa de finding; score snapshots; jornada persistida; alertas (finding crítico, queda de score, inconsistências) e scans agendados no escopo alvo |

**Melhores práticas integradas:** contratos com cláusulas de segurança e pentests, abordagem baseada em risco (priorização por impacto), frameworks reconhecidos (ISO 27001, NIST), auditorias periódicas via trilhas de maturidade.

> Detalhamento completo: [tpra-avaliacao-riscos-terceiros.md](./tpra-avaliacao-riscos-terceiros.md)
> Plano de implementacao: [nrisk-tpra-implementacao.md](../plans/nrisk-tpra-implementacao.md)

## Componentes Principais

| Componente | Descrição |
|------------|-----------|
| **API Backend (Go)** | Lógica de negócio, scans, **Assessments Híbridos** (questionários + Logic Engine), multi-tenant; RBAC de submissão (Admin/CISO) no escopo alvo |
| **Scan Engine (Cloud Run Jobs)** | Execução de Nuclei, Nmap, Subfinder; mapeamento para ISO 27001 via `mapping_logic.json`; scans agendados (P1.3) no escopo alvo |
| **Trust Center** | URL pública; visibilidade por perfil (RBAC); score, categoria, eixos A–F, status de evidências, histórico — escopo alvo (compromisso da landing) |
| **Painel de Postura** | Score dinâmico (0–1000), spider chart, achados técnicos, questionários (Trilhas Bronze/Prata/Ouro), Evidence Vault (upload + comentários/aprovação no escopo alvo), inconsistências (Cross-Check) — escopo alvo |
| **Alertas** | Configuráveis para finding crítico, queda de score e inconsistências; webhook e e-mail (P1.5) — escopo alvo |
| **Relatórios** | Para diretoria e subscritores (P1.4); hoje score, eixos, histórico via API — escopo alvo |

## Stack Técnica

- **Frontend:** Next.js 15, React 19, Shadcn UI (base: resper1965/clone)
- **Backend:** Go + Gin
- **Auth:** GCP Identity Platform (Firebase Auth) + JWT com `tenant_id`
- **Persistência:** Firestore (scans, findings), Cloud SQL (GRC, questionários)
- **Infra:** Cloud Run (API + Jobs), Pub/Sub, Cloud Storage (Evidence Vault)

## Algoritmo de Scoring

$$S_f = (T \times 0.6) + (C \times 0.4)$$

- **T** = Score técnico (base 1000, dedução por achados)
- **C** = Score de compliance (questionários; aditivo; penalidade -10% por inconsistências)

**Penalidade crítica:** Se houver achado de severidade Crítica, $S_f$ não pode ultrapassar 500.

## Escopo alvo (compromissos da landing)

A landing fixa o compromisso do produto. O escopo alvo para resolver os gaps inclui: **Trust Center** (visibilidade por perfil, RBAC); **Painel de Postura** (um único painel); **alertas** (finding crítico, queda de score, inconsistências); **monitoramento contínuo** (scans agendados); **trilhas Bronze/Prata/Ouro** (evidência obrigatória em Prata/Ouro); **frameworks NIST CSF e LGPD**; **cofre de evidências** (comentários e aprovação); **RBAC de submissão** (apenas Admin/CISO); **relatórios** para diretoria e subscritores. Detalhe e checklist de entregas: [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md). Consolidação no PRD: [prd-plataforma-nrisk.md](./prd-plataforma-nrisk.md) (§11).

## Base Contextual

- **Documentação:** [.context/docs/README.md](./README.md)
- **Planos:** [.context/plans/README.md](../plans/README.md)
- **Documento mestre:** [contexto-nrisk.md](./contexto-nrisk.md)
- **Gaps e entregas (landing):** [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md)
