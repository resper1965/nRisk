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

Plataforma de avaliação de postura cibernética voltada para **Cyber Insurance** e gestão de riscos de terceiros. Combina observabilidade passiva externa (scans) com conformidade declaratória (questionários) e mapeamento para controles ISO 27001.

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
| **Due diligence** | Assessment híbrido com trilhas Bronze/Prata/Ouro; 20+ perguntas mapeadas para ISO 27001 |
| **Risk Scoring** | Score 0–1000 (A–F); fórmula transparente $S_f = (T \times 0.6) + (C \times 0.4)$ |
| **Conformidade (LGPD/GDPR)** | Cross-Check Engine; Evidence Vault com SHA-256; controles de privacidade |
| **Remediação e monitoramento** | Justificativa de finding; score snapshots; jornada persistida; re-scans periódicos |

**Melhores práticas integradas:** contratos com cláusulas de segurança e pentests, abordagem baseada em risco (priorização por impacto), frameworks reconhecidos (ISO 27001, NIST), auditorias periódicas via trilhas de maturidade.

> Detalhamento completo: [tpra-avaliacao-riscos-terceiros.md](./tpra-avaliacao-riscos-terceiros.md)

## Componentes Principais

| Componente | Descrição |
|------------|-----------|
| **API Backend (Go)** | Lógica de negócio, scans, **Assessments Híbridos** (questionários + Logic Engine), multi-tenant |
| **Scan Engine (Cloud Run Jobs)** | Execução de Nuclei, Nmap, Subfinder; mapeamento para ISO 27001 via `mapping_logic.json` |
| **Trust Center** | URL pública com selos de segurança e documentos |
| **Painel de Postura** | Score dinâmico (0–1000), achados técnicos, **questionários** (Trilhas Bronze/Prata/Ouro), Evidence Vault, inconsistências (Cross-Check) |

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

## Base Contextual

- **Documentação:** [.context/docs/README.md](./README.md)
- **Planos:** [.context/plans/README.md](../plans/README.md)
- **Documento mestre:** [contexto-nrisk.md](./contexto-nrisk.md)
