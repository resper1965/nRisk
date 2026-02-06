---
type: doc
name: descricao-funcional-plataforma-nrisk
description: Descrição funcional da plataforma n.Risk — propósito, avaliações e comparações
category: product
generated: 2026-02-05
status: filled
---

# Descrição Funcional da Plataforma n.Risk

Documento que descreve **para que a plataforma serve**, **como as avaliações são feitas** e **como as comparações** (técnico vs declarativo, histórico, domain scores) funcionam. Baseado no PRD, nas regras de negócio e na implementação atual. **A documentação foi ajustada para refletir e resolver os gaps em relação à landing:** o estado alvo (compromissos da página) está descrito abaixo e no [PRD](./prd-plataforma-nrisk.md); detalhe em [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md).

---

## 1. Para que a plataforma serve

O **n.Risk** é uma plataforma de **avaliação de postura cibernética** voltada a:

- **Cyber Insurance** — subscrição e monitoramento de risco de apólices; relatórios para board e underwriters.
- **Gestão de riscos de terceiros** — avaliação de fornecedores na cadeia de suprimentos; centralização de evidências de conformidade.
- **Conformidade** — alinhamento a ISO 27001, NIST CSF e LGPD (escopo alvo); evidências auditáveis e Trust Center.

**Visão:** Postura cibernética visível quando importa — uma única plataforma para **avaliar**, **pontuar** e **evidenciar** risco cibernético de empresas e terceiros, com score híbrido (técnico + declarativo), Trust Center e evidências alinhadas a ISO 27001 e Cyber Insurance.

**Quem usa:**

| Persona | Uso principal |
|---------|----------------|
| **Seguradoras / Subscritores** | Analisar score e domain_scores (A–F por eixo) antes de emitir proposta; consultar histórico e relatórios. |
| **Gestores de Terceiros (GRC)** | Enviar convite de assessment; monitorar Trust Center do parceiro; receber alertas (finding crítico, queda de score). |
| **CISO / TI (empresa avaliada)** | Responder questionários; anexar evidências; submeter justificativas de findings; acompanhar score e inconsistências (Cross-Check). |

---

## 2. Como as avaliações são feitas

As avaliações combinam **dois eixos**: o que o **scan técnico** encontra (portas, SSL, DMARC, CVEs, etc.) e o que a **empresa declara** no questionário de conformidade. O resultado é um **score híbrido** e uma **jornada persistida** (histórico de scores).

### 2.1 Avaliação técnica (scan)

1. **Disparo:** Cliente (ou API) solicita scan para um domínio; é criado um registro de scan (status `pending`).
2. **Execução:** O **Scan Job** (Cloud Run Job) roda ferramentas (Nuclei, Nmap, Subfinder) contra o domínio.
3. **Tradução:** Os achados brutos são mapeados para controles ISO 27001 via **mapping_logic.json** (porta, template_id, technical_finding → control_id, severidade, score_deduction).
4. **Persistência:** Findings são gravados em Firestore (`tenants/{tid}/scans/{sid}/findings/{fid}`).
5. **Score técnico (T):** Base 1000; dedução por achado conforme severidade (Crítico 10, Alto 7, Médio 4, Baixo 1). Achados com **justificativa aprovada** não entram no cálculo de T.
6. **Domain scores:** Os findings são agregados por **iso_domain** (eixo ISO 27001); para cada domínio calcula-se score 0–1000 e **grade A–F** (rating por eixo), consumível no relatório e no spider chart.

**Severidades (peso no score):**

| Severidade | Peso | Exemplos |
|------------|------|----------|
| Crítico | 10 | RDP/SMB expostos, CVE com exploit |
| Alto | 7 | DMARC ausente, SSL expirado |
| Médio | 4 | Headers ausentes, software desatualizado |
| Baixo | 1 | Subdomínios expostos, banners |

### 2.2 Avaliação declarativa (assessment)

1. **Catálogo:** Perguntas do framework (ex.: ISO 27001) estão vinculadas a **control_id** do mapping (assessment_questions).
2. **Respostas:** O tenant responde a cada pergunta com **sim**, **não** ou **NA** (não aplicável). Em trilhas Prata/Ouro, respostas "sim" em perguntas que exigem evidência devem ter arquivo anexado (Evidence Vault — GCS).
3. **Score de compliance (C):** Modelo **aditivo**: base 0, soma pontos por resposta "sim" conforme risk_weight da pergunta; normalizado para escala 0–1000. Respostas "não" e "NA" não somam (e NA impacta o máximo possível do eixo; o respondente deve ver de forma transparente o impacto no score).
4. **Cross-Check (Logic Engine):** O sistema **compara** as respostas "sim" com os findings do scan **por control_id**. Se para um controle a empresa declarou "sim" (ex.: "Temos DMARC configurado") e o scan encontrou falha (ex.: DMARC ausente), a resposta é marcada como **Inconsistent**.
5. **Fator de confiança (F):** F é um multiplicador (0–1) que reduz o score de compliance quando há **inconsistências** (e, nas regras de negócio, também quando há "sim" sem evidência obrigatória em Prata/Ouro). Fórmula: C_ajustado = C × F.
6. **Submissão:** Apenas CISO (ou Admin) pode **submeter** o assessment. Ao submeter: cálculo final, persistência de **snapshot** (ScoreBreakdown, cross-check, inconsistências), status `submitted`; respostas ficam somente leitura até nova rodada; resultado fica visível para demandantes (seguradora, corretora) conforme RBAC.

### 2.3 Score final híbrido e penalidade

- **Fórmula:** \( S_f = (T \times 0{,}6) + (C_{ajustado} \times 0{,}4) \).
- **Penalidade crítica:** Se existir **qualquer** achado de severidade Crítica, \( S_f \) é limitado a **no máximo 500**.
- **Categoria (rating A–F):**  
  A ≥ 900, B ≥ 750, C ≥ 600, D ≥ 400, E ≥ 250, F &lt; 250.

O **ScoreBreakdown** completo (T, C bruto, C ajustado, F, S_f, categoria, penalidade crítica, domain_scores, inconsistências) é persistido em **score_snapshots** e consumível via API (ex.: GET /assessment/score/full, GET /scans/:id/score-history).

---

## 3. Como as comparações são feitas

As "comparações" no n.Risk ocorrem em três frentes: **declaração vs scan** (Cross-Check), **por domínio/eixo** (domain scores) e **no tempo** (histórico de score).

### 3.1 Comparação declaração vs scan (Cross-Check)

- **Objetivo:** Detectar quando o que a empresa **declara** no questionário contradiz o que o **scan** encontra.
- **Regra:** Para cada pergunta vinculada a um **control_id**, se a resposta é "sim" e existe **finding** do scan para esse mesmo control_id, o sistema marca a resposta como **Inconsistent** (e inclui no resultado do cross-check).
- **Efeito:** Inconsistências entram no cálculo do **fator de confiança F**, reduzindo o score de compliance (C_ajustado = C × F). O ScoreBreakdown expõe a lista de inconsistências para o respondente e, após submissão, para os demandantes conforme RBAC.
- **Achado não mapeado:** Se um finding não tem entrada no mapping_logic (sem control_id), ele **não** entra no Cross-Check; afeta apenas o score técnico T (com regra padrão de severidade).

### 3.2 Comparação por domínio / eixo (domain scores)

- **Objetivo:** Mostrar desempenho **por eixo** (domínio ISO 27001), para relatório, spider chart e priorização.
- **No scan:** Os findings são agregados por **iso_domain**; para cada domínio calcula-se score (base 1000 − deduções) e **grade A–F** (domain_scores no GET /scans/:id).
- **No score full:** Para o spider chart, o sistema calcula **aderência por categoria/domínio** combinando questionário e scan: por domínio conta total de perguntas, respostas "sim", e se há findings; aplica redutor por severidade (ex.: critical 0.3, high 0.5, medium 0.7, low 0.9). Resultado: percentual por eixo, permitindo comparar eixos entre si.

### 3.3 Comparação no tempo (histórico e jornada)

- **Objetivo:** Jornada de melhoria (ou piora) da postura consumível por cliente, seguradora e corretora.
- **Persistência:** Cada cálculo completo (e ao obter GET /assessment/score/full) gera um **ScoreSnapshot** (ScoreBreakdown, timestamp, assessment_id, scan_id).
- **Consumo:** GET /scans/:id/score-history (e equivalentes por assessment) permitem comparar scores ao longo do tempo (último scan, por domínio, tendência).
- **Justificativas:** Quando o cliente submete uma justificativa para um finding e o avaliador **aprova**, o finding deixa de contar no T; um novo snapshot reflete o acréscimo na nota — a comparação "antes/depois" fica visível no histórico.

---

## 4. Resumo dos fluxos

| O quê | Como |
|-------|------|
| **Avaliação técnica** | Scan (Nuclei, Nmap, Subfinder) → mapping_logic.json → AuditFinding → T (base 1000 − deduções); domain_scores (A–F por iso_domain). |
| **Avaliação declarativa** | Perguntas (control_id) → respostas (sim/não/NA) + evidência (Prata/Ouro) → C (aditivo, 0–1000). |
| **Comparação declaração vs scan** | Cross-Check por control_id → Inconsistent → F → C_ajustado = C × F. |
| **Score final** | \( S_f = (T \times 0{,}6) + (C_{ajustado} \times 0{,}4) \); penalidade crítica cap 500; categoria A–F. |
| **Comparação no tempo** | ScoreSnapshot por cálculo/submissão; score-history por scan/assessment; justificativas aprovadas alteram T e geram novo snapshot. |

---

## 5. Estado alvo (para resolver os gaps da landing)

A landing pública fixa o compromisso do produto. A documentação reflete o **estado alvo** além do já implementado. Nenhuma funcionalidade já descrita foi removida.

| Capacidade | Descrição (estado alvo) | Status |
|------------|--------------------------|--------|
| **Frameworks** | Questionários ISO 27001, NIST CSF e LGPD carregáveis pela API; perguntas mapeadas a controles para Cross-Check | ISO 27001 entregue; NIST CSF e LGPD planejados |
| **Trust Center** | URL pública; visibilidade por perfil (RBAC); score, categoria, eixos A–F, status de evidências, histórico para demandantes | Planejado |
| **Trilhas Bronze/Prata/Ouro** | Evidência obrigatória em Prata/Ouro para controles selecionados; delegação de perguntas (FR3) | Planejado |
| **Alertas** | Configuráveis para finding crítico, queda de score e inconsistências; webhook e e-mail (P1.5) | Planejado |
| **Monitoramento contínuo** | Scans agendados (ex.: semanal/mensal); visibilidade e tendência contínuas (P1.3) | Planejado |
| **Cofre de evidências** | Upload (entregue); comentários e aprovação por evidência; trilha de auditoria | Upload entregue; comentários/aprovação planejados |
| **Submissão** | Apenas Admin ou CISO podem submeter assessment; respostas somente leitura após submissão (RBAC) | Regra documentada; checagem na API planejada |
| **Painel de Postura** | Um único painel: score dinâmico, spider chart, histórico, inconsistências; consumo da API | Planejado |
| **Relatórios** | Para diretoria e subscritores (P1.4); hoje score, eixos, histórico via API | Planejado |

O que a página apresenta em detalhe, o status atual por área e o checklist de entregas estão em [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md). O escopo alvo está consolidado no [PRD](./prd-plataforma-nrisk.md) (§11 Compromissos da landing).

---

## 6. Referências

| Documento | Conteúdo |
|-----------|----------|
| [prd-plataforma-nrisk.md](./prd-plataforma-nrisk.md) | PRD; visão; escopo MVP; algoritmo resumido |
| [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md) | O que a página apresenta; gaps; entregas necessárias |
| [contexto-nrisk.md](./contexto-nrisk.md) | Base unificada; planos; stack |
| [regras-de-negocio-assessment.md](./regras-de-negocio-assessment.md) | Evidência, F, NA, persistência, RBAC, justificativa |
| [glossary.md](./glossary.md) | Terminologia; entidades; severidades |
| [data-flow.md](./data-flow.md) | Fluxo de scan e de assessments |
| [nrisk-scoring-metodologia.md](../plans/nrisk-scoring-metodologia.md) | Metodologia de scoring; taxonomia; fórmula |
