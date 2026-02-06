---
type: doc
name: glossary
description: Terminologia, entidades e regras de negócio do n.Risk
category: glossary
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Glossário e Conceitos de Domínio

## Entidades Principais

| Termo | Definição |
|-------|-----------|
| **Tenant** | Organização isolada (seguradora, empresa ou fornecedor). Identificado por `tenant_id`. |
| **Scan** | Execução de varredura em um domínio. Status: pending, running, completed, completed_with_errors. |
| **AuditFinding** | Achado técnico traduzido para controle ISO 27001 (control_id, score_deduction, recommendation). |
| **Assessment** | Sessão/rodada de questionário; agrupa respostas (assessment_answers) por tenant. |
| **Assessment Question** | Pergunta do catálogo; vinculada a control_id do mapping_logic (ISO 27001). |
| **Assessment Answer** | Resposta do usuário; answer_status: sim, nao, na, **Inconsistent** (quando scan contradiz). Regras: [regras-de-negocio-assessment.md](./regras-de-negocio-assessment.md). |
| **Logic Engine (Cross-Check)** | Função que compara findings do scan com respostas positivas; marca Inconsistent se contraditadas. |
| **Trust Center** | Página pública com selos, documentos e resumo de postura. Escopo alvo: visibilidade por perfil (RBAC); score, categoria, eixos A–F, status de evidências, histórico para demandantes. Ver [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md). |
| **Evidence Vault** | Armazenamento GCS de evidências (PDFs, imagens) em `tenants/{tid}/assessments/{aid}/evidence/`; hash SHA-256 por arquivo. Escopo alvo: comentários e aprovação por evidência; trilha de auditoria. Ver [gaps-landing-vs-aplicacao.md](./gaps-landing-vs-aplicacao.md). |
| **Trilha (Track)** | Nível de maturidade do questionário: Bronze (auto-declaração), Prata (evidência obrigatória para controles selecionados), Ouro (framework completo). Escopo alvo (FR3). |
| **RBAC** | Operador responde perguntas; apenas CISO/Admin submete assessment final (escopo alvo — FR8). Resultado visível para demandantes conforme perfil. |

## Termos Técnicos

| Termo | Definição |
|-------|-----------|
| **mapping_logic.json** | Fonte única de verdade para mapear achados (port, template_id, technical_finding) em controles ISO 27001. |
| **RawFinding** | Achado bruto antes da tradução GRC (output do parser por ferramenta). |
| **validator.IsValidHostname** | Validação de hostname (RFC 1123); usada em API e Scan Job para mitigar injeção. |
| **validator.IsValidUUID** | Validação de UUID; evita path traversal em scan_id. |
| **validator.IsSafePathSegment** | Validação de segmento de path; evita "/" e chars de controle em tenant_id. |
| **Score Técnico (T)** | Base 1000; dedução por achados conforme severidade. |
| **Score de Compliance (C)** | Percentual de aderência aos questionários; aditivo (respostas positivas somam pontos) ou base em percentual. Penalidade -10% por inconsistências. |
| **Penalidade Crítica** | Se houver achado Crítico, score final máximo = 500. |

## Severidades

| Severidade | Peso | Exemplos |
|------------|------|----------|
| Crítico | 10 | RDP/SMB expostos, CVE com exploit |
| Alto | 7 | DMARC ausente, SSL expirado |
| Médio | 4 | Headers ausentes, software desatualizado |
| Baixo | 1 | Subdomínios expostos, banners |

## Termos de Persistência

| Termo | Definição |
|-------|-----------|
| **Firestore** | NoSQL; hierarquia `tenants/{tid}/scans/{sid}/findings/{fid}`; scans e findings do MVP |
| **Cloud SQL** | PostgreSQL; GRC, controles, frameworks, assessments, assessment_questions, assessment_answers |
| **RLS** | Row Level Security; isolamento por `tenant_id` em `assessments` |
| **Score Category** | A–F; mapeamento A≥900, B≥750, C≥600, D≥400, E≥250, F<250 |
| **mapping_logic (Cloud SQL)** | Tabela que vincula achado técnico a control_id e impact_on_score; equivalente lógico do JSON |
| **Cloud Run Service** | API REST; escala automática; PORT injetado pelo GCP |
| **Cloud Run Job** | Scan Engine; execução batch; env vars TENANT_ID, SCAN_ID, DOMAIN |

## Termos TPRA / Gestão de Terceiros

| Termo | Definição |
|-------|-----------|
| **TPRA (Third-Party Risk Assessment)** | Processo de identificar, analisar e mitigar vulnerabilidades introduzidas por parceiros, fornecedores ou prestadores de serviços. Metodologia detalhada em [tpra-avaliacao-riscos-terceiros.md](./tpra-avaliacao-riscos-terceiros.md). |
| **TPRM (Third-Party Risk Management)** | Disciplina contínua de gestão de risco de terceiros; TPRA é o componente de avaliação dentro do TPRM. No n.Risk, engloba cadastro, assessment, scoring, remediação e monitoramento. |
| **Due Diligence** | Investigação prévia sobre a postura de segurança de um terceiro antes ou durante a relação contratual. No n.Risk: assessment híbrido + scan passivo. |
| **Cyber Risk Score** | Nota quantitativa (0–1000, categorias A–F) que traduz a postura de segurança de uma organização. No n.Risk: $S_f = (T \times 0.6) + (C \times 0.4)$. |
| **SIG (Standardized Information Gathering)** | Questionário padronizado do Shared Assessments para coleta de informações de segurança de terceiros. Referência para o Question Bank do n.Risk. |
| **CAIQ** | Consensus Assessments Initiative Questionnaire (CSA); questionário para avaliação de provedores cloud. |
| **Supply Chain Risk** | Risco cibernético originado na cadeia de suprimentos; terceiros com postura fraca amplificam a superfície de ataque da organização contratante. |
| **Fornecedor Crítico** | Terceiro com acesso a dados sensíveis (PII, financeiros) ou sistemas core; exige avaliação prioritária (trilha Prata/Ouro). |
| **Cross-Check (TPRA)** | Validação cruzada entre o que o terceiro declara (questionário) e o que o scan detecta (superfície externa). Inconsistências reduzem o fator de confiança F. |

## Referência de Mercado (Concorrente)

| Termo | Definição |
|-------|------------|
| **SecurityScorecard** | [Concorrente](https://securityscorecard.com/). **Produto comparável:** [Security Ratings](https://securityscorecard.com/why-securityscorecard/security-ratings/) — rating A–F, 10 risk factors (Network Security, DNS Health, Patching Cadence, Endpoint Security, IP Reputation, Application Security, Cubit Score, Hacker Chatter, Social Engineering, Information Leak), use cases (own org, supply chain, cyber insurance), metodologia ML/AI ("best predictor of breach"). Referência para escopo de score (rating por organização/domínio), questionários e visibilidade para seguradoras/corretores. **Não** confundir com Microsoft Secure Score. |
| **Bitsight** | Concorrente em security ratings; escala 0–100 (vs 0–1000 do n.Risk/SecurityScorecard); foco em monitoramento contínuo e TPRM. |
| **Ecotrust** | Plataforma brasileira de gestão de vulnerabilidades e risco cibernético; referência regional para TPRM. |

## Controles ISO (exemplos)

| ID | Domínio | Descrição |
|----|---------|-----------|
| C-01 | A.13.1.1 | Redes — Controle de acesso (portas críticas) |
| C-02 | A.10.1.1 | Criptografia — Certificados/TLS |
| C-03 | A.12.6.1 | Vulnerabilidades — Patch management |
| C-04 | A.13.2.1 | Comunicações — Anti-phishing (DMARC/SPF) |
