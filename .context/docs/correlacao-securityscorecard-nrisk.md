---
type: doc
name: correlacao-securityscorecard-nrisk
description: Correlação entre SecurityScorecard (concorrente) e n.Risk
category: overview
---

# Correlação SecurityScorecard ↔ n.Risk

Documento que mapeia o **produto Security Ratings** do [SecurityScorecard](https://securityscorecard.com/) (concorrente) com o n.Risk: use cases, fatores de risco, metodologia e oportunidades de diferenciação.

**Referência principal do concorrente:** [Security Ratings — SecurityScorecard](https://securityscorecard.com/why-securityscorecard/security-ratings/) (rating A–F, 10 fatores de risco, use cases, metodologia).

---

## 1. Produto Security Ratings (SecurityScorecard)

### O que é (conforme o site)

- **Security ratings** = avaliações objetivas da postura de cibersegurança de uma organização, representadas por **notas em letra (A–F)**. Oferecem uma visão clara e quantificável do risco cibernético e ajudam a identificar ameaças e incidentes cedo.
- Usados por dezenas de milhares de empresas; foco em supply chain e proteção de superfícies.
- **Diferencial declarado:** “Best predictor of breach” (13.8x breach ratio); metodologia **ML/AI** para identificar issues preditivos de breach e **impacto algorítmico** na previsão de breach (em contraste com ratings baseados em julgamento).
- **Monitoramento contínuo** para postura resiliente, gestão de vulnerabilidades e resposta rápida.

### Use cases (o que um security rating pode fazer por você)

| Use case SecurityScorecard | Correlação n.Risk |
|----------------------------|-------------------|
| **Avaliar a postura da própria organização** — Telemetria externa para identificar riscos e comparar com pares (Security & Risk Operations) | Score S_f (T + C) por tenant + scan; spider chart por domínio; operador/CISO acompanham score e cross-check |
| **Proteger a supply chain contra riscos cibernéticos** — Rating A–F para insights rápidos em ameaças da cadeia; entender vulnerabilidades de terceiros (Supply Chain Cyber Risk) | Rating A–F por tenant/domínio; seguradora/corretora consomem score e jornada do avaliado; Trust Center para transparência |
| **Encontrar riscos desconhecidos na cadeia estendida** — Riscos em 4ª e N-ésima parte; pontos de entrada vulneráveis (Automatic Vendor Detection) | Hoje: scan por domínio solicitado. Detecção automática de vendors/4th party fora do MVP |
| **Decisões melhores em cyber insurance** — Seguradoras usam dados e ratings para precificação e elegibilidade; minimizar risco financeiro (Cyber Insurance) | **Foco n.Risk:** subscrição, corretores, underwriters; score e jornada persistidos consumíveis por seguradora/corretora |

### Os 10 Risk Factors (SecurityScorecard — cada um com rating A–F)

| Fator SecurityScorecard | Descrição (site) | Correlação n.Risk |
|-------------------------|------------------|-------------------|
| **Network Security** | Conjuntos de dados públicos: portas de alto risco ou inseguras na rede | ✅ Portas (RDP, SMB, DB, SSH, FTP, Telnet) em `mapping_logic`; controle C-01 (Segurança de Rede) |
| **DNS Health** | Configurações DNS; histórico passive DNS; eventos maliciosos | 🔶 Subdomínios (subdomain_exposure) no scan; DNS não é eixo dedicado no spider chart |
| **Patching Cadence** | Velocidade de atualizações de segurança e mitigação de vulnerabilidades | ✅ CVE, critical_cve, outdated_software; controle C-03 (Gestão de Vulnerabilidades) |
| **Endpoint Security** | Metadados: OS, browser, plugins ativos | ⬜ Não coberto no scan externo atual (foco em superfície externa) |
| **IP Reputation** | Sinkhole, feeds OSINT de malware, threat intelligence de terceiros | ⬜ Não coberto no MVP |
| **Application Security** | CVE exploráveis, bases black hat, achados em buscadores | ✅ Nuclei (templates), CVEs, painéis expostos, directory listing, information disclosure; controle C-13 (Desenvolvimento Seguro) |
| **Cubit Score** | Bases públicas de threat intel; IPs sinalizados | ⬜ Não coberto no MVP |
| **Hacker Chatter** | Análise de chatter underground; riscos externos e internos | ⬜ Não coberto no MVP |
| **Social Engineering** | Susceptibilidade a phishing/engenharia social | ✅ DMARC, SPF, DKIM (anti-phishing); controle C-04 (Segurança de E-mail); questionário (conscientização) |
| **Information Leak** | Chatter + deep web; credenciais comprometidas em circulação | ✅ Achado `leaked_credentials` em `mapping_logic`; controle C-10 (Resposta a Incidentes) |

**Resumo:** n.Risk cobre, no scan + questionário, uma parte dos fatores (Network, Patching/Vuln, Application, Email/Phishing, Information Leak); não cobre DNS como eixo próprio, Endpoint, IP Reputation, Cubit, Hacker Chatter. A **taxonomia** do n.Risk é por **controles ISO 27001** (15 domínios no spider chart), não pelos 10 fatores do SecurityScorecard; a **ideia** (múltiplas dimensões + nota composta A–F) é análoga.

### Metodologia do rating (SecurityScorecard)

- **Nota em letra A–F** por fator e nota geral.
- **Abordagem ML/AI** para identificar issues preditivos de breach e determinar impacto de forma algorítmica na previsão de breach (vs ratings baseados em julgamento).
- **Monitoramento contínuo** para postura resiliente, priorização de vulnerabilidades e decisões informadas em TPRM.

### Outras ofertas do ecossistema (contexto)

- **SCDR** — Detecção e resposta na supply chain; colaboração com vendors; “from passive monitoring to active remediation”.
- **MAX (managed service)** — Equipe que trabalha diretamente com vendors para remediar.
- **Dores** que o ecossistema endereça: detection without resolution, vendor communication bottlenecks, fragmented ownership (TPRM vs SOC), vendor volume, prolonged exposure, “SOCs want telemetry not just scores”.

---

## 2. Mapeamento geral SecurityScorecard → n.Risk

O **produto comparável direto** é [Security Ratings](https://securityscorecard.com/why-securityscorecard/security-ratings/) (use cases e 10 fatores acima). Abaixo, mapeamento de conceitos do ecossistema.

| Conceito SecurityScorecard | Correlação n.Risk | Status |
|----------------------------|-------------------|--------|
| **Security Ratings (A–F, 10 fatores)** | Score 0–1000 + categoria A–F (S_f = T×0,6 + C×0,4); rating por tenant + scan/domínio; spider chart por **15 domínios ISO** (não 10 fatores) | ✅ Implementado / em evolução |
| **Third-Party Risk Management** | Gestão de risco de terceiros para seguradoras, corretores e empresas (cadeia de suprimentos); tenant = organização avaliada | ✅ Visão de produto |
| **Questionnaires & Assessments** | Assessment híbrido: questionário (20 perguntas, 15 controles ISO), trilhas Bronze/Prata/Ouro, evidência obrigatória em Prata/Ouro | ✅ Em implementação |
| **Cyber Insurance** | Foco explícito: **Seguradoras** (subscrição, apólices), **Corretores**, **Avaliados** (Trust Center); RBAC: operador, CISO; demandantes: cliente, seguradora, corretora | ✅ Diferencial de posicionamento |
| **External Attack Surface / EASM** | Scan Engine (Nuclei, Nmap, Subfinder) em domínio externo; achados mapeados para ISO 27001 via `mapping_logic.json` | ✅ Implementado |
| **Vulnerability Intelligence** | Achados técnicos (CVEs, portas, SSL, DMARC, etc.) com severidade e dedução no score; mapeamento para controles | ✅ Implementado |
| **Trust & Collaboration** | Trust Center (URL pública, selos, documentos); Evidence Vault; **justificativa de finding** → avaliador aceita/rejeita → nota acrescida (colaboração avaliado–plataforma) | ✅ Regra de negócio definida |
| **Cross-check (declarado vs detectado)** | Logic Engine: compara respostas “Sim” com findings do scan por controle; inconsistência reduz F e impacta score; transparência (NA, impacto na nota) | ✅ Implementado / documentado |
| **Board & Executive Reporting** | Jornada de melhoria (ou piora) persistida; consumível por demandantes; relatórios para subscrição/due diligence (roadmap) | 🔶 Persistência definida; relatórios em roadmap |
| **Regulatory Compliance** | Mapeamento ISO 27001; LGPD/DPCF em plano; compliance como eixo do score (C) e domínios no spider chart | ✅/🔶 Em progresso |
| **Automatic Vendor Detection** | Hoje: scan por domínio (manual/solicitado). Detecção automática de vendors não é escopo MVP | ⬜ Fora do escopo atual |
| **STRIKE / threat intelligence em tempo real** | Scan sob demanda (ou agendado); não há feed contínuo de threat intel externo | ⬜ Gap; possível evolução (integração feeds) |
| **SOCs want telemetry, not just scores** | Hoje: score + findings + cross-check. Telemetria acionável (alertas, integração SIEM/ticketing) é evolução | 🔶 Oportunidade |
| **Vendor communication / remediation** | Justificativa de finding (cliente → avaliador → aceite → nota acrescida). Workflow de “engajar vendor e resolver” (tipo MAX) não é escopo MVP | 🔶 Parcial (justificativa); remediação guiada em roadmap |
| **Managed service (MAX)** | n.Risk é plataforma; serviço gerenciado (equipe n.Risk remediando com cliente) pode ser oferta futura | ⬜ Fora do escopo atual |

**Legenda:** ✅ alinhado / em curso | 🔶 parcial ou em roadmap | ⬜ fora do escopo ou gap conhecido

---

## 3. Diferenciação n.Risk vs SecurityScorecard (Security Ratings)

| Aspecto | SecurityScorecard (Security Ratings) | n.Risk |
|---------|----------------------------------------|--------|
| **Referência** | [Security Ratings](https://securityscorecard.com/why-securityscorecard/security-ratings/) — 10 risk factors, A–F, 70k+ empresas | Score 0–1000 + A–F; 15 domínios ISO no spider chart |
| **Metodologia do score** | **ML/AI**: “best predictor of breach” (13.8x); impacto algorítmico na previsão de breach; caixa mais fechada | **Fórmula explícita**: S_f = (T×0,6) + (C×0,4); T e C calculáveis; F (confiança) por inconsistências; penalidade crítica; **transparência** (NA, impacto na nota) |
| **Fatores / eixos** | 10 fatores (Network, DNS, Patching, Endpoint, IP Reputation, App Sec, Cubit, Hacker Chatter, Social Eng., Information Leak) | 15 domínios ISO 27001 (Rede, Criptografia, Vuln, E-mail, Acesso, Monitoramento, Backup, Políticas, Pessoas, Incidentes, Continuidade, Fornecedores, Dev Seguro, Compliance/Privacidade, Física) |
| **Posicionamento Cyber Insurance** | Um dos use cases (precificação e elegibilidade) | **Foco principal**: subscrição, corretores, avaliados; score e jornada consumíveis por seguradora/corretora |
| **Cross-check declarado vs scan** | Questionários + ratings (modelo não detalhado no material) | **Logic Engine explícito**: “Sim” vs findings por controle; inconsistência reduz F; cliente vê por que a nota foi impactada |
| **Justificativa de finding** | Não destacado no material de Security Ratings | **Regra de produto**: cliente justifica → avaliador aceita/rejeita → se aceito, nota acrescida (exceção rastreável) |
| **Jornada persistida** | Continuous monitoring, histórico | **Jornada de melhoria (ou piora)** persistida e consumível por demandantes (cliente, seguradora, corretora) |
| **Framework** | Múltiplos (SOC 2, etc.) | **ISO 27001** como base; LGPD/DPCF; `mapping_logic.json` e questionário alinhados a controles |
| **Cobertura técnica** | 10 fatores (incl. DNS, Endpoint, IP Rep, Hacker Chatter, etc.) | Scan externo (portas, SSL, DMARC, CVE, headers, painéis, credenciais vazadas, etc.); sem DNS/Endpoint/Hacker Chatter como eixos no MVP |

---

## 4. Oportunidades para n.Risk (inspiradas no concorrente)

1. **Comunicação e remediação** — Reforçar fluxo “cliente justifica → avaliador decide → nota atualizada” e, no futuro, workflows de remediação (prazos, responsáveis, integração com ticketing).
2. **Telemetria e alertas** — Além do score, oferecer alertas acionáveis (ex.: novo finding crítico, queda de score) e integração (webhook, SIEM, ServiceNow-type) para SOC/TPRM.
3. **Relatórios para board e subscrição** — Jornada persistida já está na regra; evoluir para relatórios prontos para board e para underwriters (PDF, dashboards por portfólio).
4. **Continuous monitoring** — Manter “um rating por scan/domínio”; evoluir para scans agendados ou sob demanda frequente, com histórico de score por data (jornada no tempo).
5. **Trust & Collaboration** — Trust Center + Evidence Vault + justificativas já vão nessa direção; destacar “uma fonte de verdade” para o avaliado e para a seguradora/corretora.

---

## 5. Metodologia TPRA — Posicionamento do n.Risk

O n.Risk implementa o ciclo completo de **Third-Party Risk Assessment (TPRA)**, diferenciando-se do mercado pela transparência e pelo modelo híbrido. Detalhamento em [tpra-avaliacao-riscos-terceiros.md](./tpra-avaliacao-riscos-terceiros.md).

| Etapa TPRA | SecurityScorecard | n.Risk | Diferencial n.Risk |
|------------|-------------------|--------|-------------------|
| **Identificação** | Automatic Vendor Detection; portfolio de vendors | Cadastro multi-tenant; convites de assessment | Foco em fornecedores críticos; priorização explícita por acesso a dados/sistemas |
| **Due Diligence** | Questionnaires & Assessments (genéricos) | Assessment híbrido: trilhas Bronze/Prata/Ouro com evidência obrigatória | Trilhas progressivas; evidência SHA-256; Evidence Vault isolado |
| **Risk Scoring** | ML/AI; "best predictor of breach"; caixa fechada | $S_f = (T \times 0.6) + (C \times 0.4)$; fórmula pública | Transparência total: avaliado vê impacto de cada achado e inconsistência |
| **Conformidade** | Múltiplos frameworks (SOC 2, etc.) | ISO 27001 + LGPD; 15 domínios no spider chart | Cross-check automático declarado vs detectado; mapeamento direto para controles |
| **Monitoramento** | Continuous monitoring; SCDR | Re-scans + score snapshots + jornada persistida | Justificativa de finding com workflow de aceite; jornada consumível por seguradora |

**Dados de mercado que reforçam a necessidade de TPRA:**
- 69% das empresas relatam postura de segurança mais fraca em fornecedores
- 20% sofreram violações de dados através de terceiros
- Casos como SolarWinds, Kaseya e MOVEit demonstram o impacto de supply chain attacks

---

## 6. Referências

- **[Security Ratings — SecurityScorecard](https://securityscorecard.com/why-securityscorecard/security-ratings/)** — Produto concorrente: rating A–F, 10 risk factors, use cases (own org, supply chain, extended chain, cyber insurance), metodologia ML/AI, "best predictor of breach".
- [SecurityScorecard](https://securityscorecard.com/) — Site do concorrente (SCDR, TPRM, Cyber Insurance, Questionnaires & Assessments).
- [tpra-avaliacao-riscos-terceiros.md](./tpra-avaliacao-riscos-terceiros.md) — Metodologia TPRA completa: etapas, melhores práticas, ferramentas e métricas.
- [regras-de-negocio-assessment.md](./regras-de-negocio-assessment.md) — Regras de negócio do assessment e scoring.
- [project-overview.md](./project-overview.md) — Visão geral do n.Risk.
- [glossary.md](./glossary.md) — Terminologia e referência de mercado.
