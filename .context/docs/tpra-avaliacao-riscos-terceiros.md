---
type: doc
name: tpra-avaliacao-riscos-terceiros
description: Metodologia de Avaliacao de Riscos Ciberneticos de Terceiros (TPRA) aplicada ao n.Risk
category: methodology
generated: 2026-02-06
status: filled
scaffoldVersion: "2.0.0"
---

# Avaliacao de Riscos Ciberneticos de Terceiros (TPRA)

> Third-Party Risk Assessment (TPRA) -- Metodologia, etapas, melhores praticas e como o n.Risk implementa cada pilar.

---

## 1. O que e TPRA

A avaliacao de riscos ciberneticos de terceiros (Third-Party Risk Assessment -- TPRA) e um processo fundamental para **identificar, analisar e mitigar vulnerabilidades introduzidas por parceiros, fornecedores ou prestadores de servicos** no ecossistema de uma organizacao.

### Por que e critico

| Dado de mercado | Fonte |
|-----------------|-------|
| **69%** das empresas relatam que seus fornecedores tem postura de seguranca mais fraca | Ponemon / SecurityScorecard |
| **20%** das organizacoes sofreram violacoes de dados atraves de terceiros | Verizon DBIR |
| Custo medio de breach via supply chain e **26% maior** que breach direto | IBM Cost of a Data Breach |

Esses numeros evidenciam que a gestao de risco de terceiros (TPRM) nao e apenas conformidade regulatoria, mas uma **estrategia de defesa ativa** que protege a reputacao e a continuidade dos negocios.

### Correlacao com n.Risk

O n.Risk foi concebido como plataforma de avaliacao de postura cibernetica para **Cyber Insurance** e **gestao de riscos de terceiros**. Cada etapa do processo TPRA tem correspondencia direta com funcionalidades da plataforma:

| Pilar TPRA | Funcionalidade n.Risk |
|------------|----------------------|
| Identificacao de terceiros | Cadastro multi-tenant; cada tenant = fornecedor/avaliado |
| Due diligence e questionarios | Assessment hibrido (Bronze/Prata/Ouro) com 20+ perguntas ISO 27001 |
| Analise de risco (Risk Scoring) | Score 0-1000 (A-F); formula $S_f = (T \times 0.6) + (C \times 0.4)$ |
| Avaliacao de conformidade | Cross-Check Engine (declarado vs detectado); mapeamento ISO 27001 |
| Remediacao e monitoramento | Justificativa de finding; score snapshots; jornada persistida |

---

## 2. Principais Etapas do Processo de Avaliacao

### 2.1 Identificacao de Terceiros

Listar todos os prestadores de servicos, priorizando os **"criticos"** -- aqueles com acesso a dados sensiveis ou sistemas core.

**Criterios de priorizacao:**

| Nivel | Criterio | Exemplos |
|-------|----------|----------|
| **Critico** | Acesso a dados PII/financeiros, sistemas core, infraestrutura | Provedores de cloud, ERPs, processadores de pagamento |
| **Alto** | Acesso a rede interna ou dados operacionais | Consultorias de TI, empresas de manutencao, SaaS com integracao API |
| **Medio** | Servicos com dados limitados | Ferramentas de marketing, plataformas de comunicacao |
| **Baixo** | Sem acesso a dados ou sistemas | Fornecedores de material de escritorio, servicos de limpeza |

**No n.Risk:** Cada terceiro critico e cadastrado como um **tenant** na plataforma. O Gestor de Terceiros (GRC) envia convites de assessment e monitora o Trust Center de cada parceiro.

### 2.2 Due Diligence e Questionarios

Enviar questionarios de seguranca (autoavaliacoes) para entender a postura de seguranca do fornecedor.

**Abordagem n.Risk -- Trilhas de Maturidade:**

| Trilha | Rigor | Evidencia | Uso tipico |
|--------|-------|-----------|------------|
| **Bronze** | Auto-declaracao (15-20 perguntas criticas) | Opcional | Triagem inicial; fornecedores de baixo risco |
| **Prata** | Evidenciada | PDF, imagem ou link obrigatorio | Fornecedores de medio/alto risco |
| **Ouro** | Framework completo (ISO 27001/NIST) | Cobertura integral dos controles | Fornecedores criticos; requisito de seguradoras |

Cada pergunta esta vinculada a um controle ISO 27001 via `mapping_logic.json`, garantindo rastreabilidade entre questionario e framework.

**Exemplos de perguntas do Question Bank:**

- "A organizacao possui politica de seguranca da informacao formalizada?" (C-08, A.5.1.1)
- "Fornecedores criticos de TI sao avaliados quanto a riscos de seguranca da informacao?" (C-11, A.15.1.1)
- "Existe plano de resposta a incidentes documentado e testado?" (C-10, A.16.1.1)
- "A organizacao realiza backups regulares e testa a restauracao?" (C-07, A.12.3.1)

### 2.3 Analise de Risco (Risk Scoring)

Utilizar ferramentas de monitoramento continuo para gerar uma nota de risco (**Cyber Risk Score**) com base na superficie externa de ataque.

**Metodologia n.Risk:**

O score hibrido combina evidencias tecnicas (scan) com conformidade declaratoria (questionario):

$$S_f = (T \times 0.6) + (C \times 0.4)$$

Onde:
- **T (Score Tecnico):** Base 1000, com deducoes por achados tecnicos (portas abertas, SSL expirado, DMARC ausente, CVEs, credenciais vazadas, etc.)
- **C (Score de Compliance):** Aditivo; respostas positivas somam pontos proporcionais ao `risk_weight` do controle
- **F (Fator de Confianca):** 0.5-1.0; penalizado por inconsistencias no cross-check e falta de evidencia

**Categorias de risco (Cyber Risk Score):**

| Categoria | Faixa | Interpretacao |
|-----------|-------|---------------|
| **A** | >= 900 | Risco muito baixo; postura excelente |
| **B** | >= 750 | Risco baixo; postura boa |
| **C** | >= 600 | Risco moderado; melhorias necessarias |
| **D** | >= 400 | Risco alto; remediacoes urgentes |
| **E** | >= 250 | Risco muito alto; gaps criticos |
| **F** | < 250 | Risco inaceitavel; parceria deve ser reavaliada |

**Penalidade critica:** Se houver achado de severidade Critica (ex: porta RDP exposta, CVE com exploit), o score final nao pode ultrapassar 500 (categoria D ou inferior).

**Ferramentas de mercado comparaveis:** Bitsight, SecurityScorecard, Ecotrust. O diferencial do n.Risk e a **transparencia** da formula (o avaliado ve exatamente por que a nota foi impactada) e o **cross-check** entre declaracao e scan.

### 2.4 Avaliacao de Conformidade (LGPD/GDPR)

Verificar se o terceiro cumpre as normas de protecao de dados e notifica rapidamente a empresa e a ANPD em caso de incidentes.

**Controles verificados no n.Risk:**

| Controle | Dominio ISO | Verificacao |
|----------|-------------|-------------|
| C-14 | A.18.1.4 (Compliance/Privacidade) | Questionario: politicas de privacidade, DPO nomeado, processo de notificacao ANPD |
| C-10 | A.16.1.1 (Resposta a Incidentes) | Questionario: plano de resposta; Scan: credenciais vazadas detectadas |
| C-08 | A.5.1.1 (Politicas) | Questionario: politica de seguranca formalizada e revisada |
| C-11 | A.15.1.1 (Fornecedores) | Questionario: avaliacao de fornecedores criticos de TI |

**Evidence Vault:** Evidencias de conformidade (politicas, certificados, relatorios de auditoria) sao armazenadas no cofre de evidencias com hash SHA-256 para integridade, isolamento por tenant e criptografia CMEK.

### 2.5 Remediacao e Monitoramento

Definir um plano de acao para lacunas encontradas e realizar **monitoramento continuo**, nao apenas no momento do contrato.

**Fluxo no n.Risk:**

1. **Identificacao de gaps:** Cross-Check Engine detecta inconsistencias entre declaracao e scan
2. **Justificativa de finding:** Avaliado pode submeter justificativa para findings (falso positivo ou risco aceito)
3. **Avaliacao:** Avaliador da plataforma aceita ou rejeita a justificativa
4. **Recalculo:** Se aceita, o finding deixa de penalizar e o score e recalculado
5. **Snapshot:** Resultado persistido como score_snapshot para rastreabilidade
6. **Jornada:** Historico de scores ao longo do tempo (melhoria ou piora) consumivel por seguradora/corretora

**Monitoramento continuo:** Scans podem ser re-executados periodicamente (sob demanda ou agendados) para atualizar o score tecnico. Cada execucao gera novo snapshot, permitindo acompanhar a evolucao da postura.

---

## 3. Melhores Praticas

### 3.1 Contratos com Clausulas de Seguranca

Incluir requisitos explicitos de seguranca da informacao nos contratos com terceiros:

- **Clausulas minimas recomendadas:**
  - Obrigacao de notificacao de incidentes em ate 72h (alinhado LGPD/GDPR)
  - Direito de auditoria (presencial ou remota)
  - Requisitos minimos de seguranca (criptografia, controle de acesso, backup)
  - Clausula de pentest (testes de intrusao) periodicos
  - SLA de remediacao para vulnerabilidades criticas
  - Clausula de subcontratacao (controle de 4th parties)

- **No n.Risk:** O Trust Center do avaliado exibe publicamente selos de seguranca, documentos de compliance e o rating (A-F), facilitando a due diligence contratual. A seguradora/corretora consome o score final para decisoes de subscricao.

### 3.2 Abordagem Baseada em Risco

Focar esforcos nos fornecedores com maior potencial de impacto caso sofram um ataque.

**Exemplos de incidentes de referencia:**

| Caso | Impacto | Licao |
|------|---------|-------|
| **SolarWinds (2020)** | ~18.000 organizacoes comprometidas via update malicioso | Fornecedores de software com acesso privilegiado sao vetor critico |
| **Kaseya (2021)** | ~1.500 empresas afetadas por ransomware via MSP | Cadeia de suprimentos de TI amplifica impacto |
| **MOVEit (2023)** | 2.500+ organizacoes, 67M+ registros expostos | Vulnerabilidades em software de transferencia de arquivos |
| **Okta (2023)** | Credenciais de suporte comprometidas afetaram clientes | Acesso privilegiado de terceiros a sistemas de identidade |

**No n.Risk:** A priorizacao e feita pelo score (A-F) e pela criticidade do tenant. Fornecedores com score D-F ou com achados criticos recebem atencao prioritaria. O Gestor de Terceiros (GRC) usa o painel para identificar os maiores riscos no portfolio.

### 3.3 Uso de Frameworks

Basear a avaliacao em frameworks reconhecidos para garantir cobertura e comparabilidade:

| Framework | Foco | Uso no n.Risk |
|-----------|------|---------------|
| **ISO 27001** | SGSI; controles Anexo A | Framework base; 15 dominios no spider chart; `mapping_logic.json` |
| **NIST CSF** | Identify, Protect, Detect, Respond, Recover | Roadmap; mapeamento cruzado com ISO planejado |
| **LGPD/GDPR** | Protecao de dados pessoais | Controles de privacidade (C-14); Evidence Vault; DPCF |
| **CIS Controls** | Top 18 controles prioritarios | Referencia para priorizacao de controles tecnicos |
| **SOC 2** | Trust Services Criteria | Referencia para Trust Center e evidencias |

### 3.4 Auditorias Periodicas

Auditores devem verificar fisicamente ou remotamente o estado das instalacoes e a qualidade dos processos de seguranca:

- **Frequencia recomendada:**
  - Fornecedores criticos: auditoria anual + monitoramento continuo
  - Fornecedores de alto risco: auditoria a cada 18 meses
  - Fornecedores de medio risco: autoavaliacao anual com verificacao por amostragem
  - Fornecedores de baixo risco: autoavaliacao bienal

- **No n.Risk:** As trilhas de maturidade (Bronze/Prata/Ouro) representam niveis progressivos de auditoria. A trilha Ouro exige cobertura integral dos controles com evidencias, equivalente a uma auditoria formal. O cross-check automatizado substitui parte da verificacao manual ao comparar declaracoes com evidencias tecnicas do scan.

---

## 4. Ferramentas e Metricas

### 4.1 Cyber Risk Score

Metricas quantitativas que traduzem a postura de seguranca em um numero comparavel:

| Aspecto | n.Risk | Mercado (referencia) |
|---------|--------|---------------------|
| **Escala** | 0-1000 (categorias A-F) | Varia: 0-100 (Bitsight), 0-1000 (SecurityScorecard) |
| **Composicao** | Hibrido: tecnico (60%) + compliance (40%) | Geralmente so tecnico (scan externo) |
| **Transparencia** | Formula publica; avaliado ve impacto de cada achado | Tipicamente caixa fechada ("ML/AI") |
| **Cross-check** | Declarado vs detectado; inconsistencias visíveis | Questionarios separados do rating |

### 4.2 Questionarios Padronizados

| Ferramenta/Padrao | Descricao | Correlacao n.Risk |
|-------------------|-----------|-------------------|
| **SIG (Standardized Information Gathering)** | Questionario padronizado do Shared Assessments para coleta de informacoes de terceiros | Assessment hibrido com perguntas mapeadas para ISO 27001 |
| **CAIQ (Consensus Assessments Initiative Questionnaire)** | Questionario da CSA para avaliacao de provedores cloud | Perguntas sobre cloud security no Question Bank |
| **VSA (Vendor Security Alliance)** | Questionario colaborativo de seguranca de fornecedores | Trilhas de maturidade cobrem escopos similares |

### 4.3 Metricas de Gestao TPRM

| Metrica | Descricao | Como medir no n.Risk |
|---------|-----------|---------------------|
| **Cobertura de avaliacao** | % de fornecedores criticos avaliados | Tenants com assessment submetido / total de tenants criticos |
| **Score medio do portfolio** | Media ponderada dos scores dos fornecedores | Agregacao de $S_f$ por seguradora/corretora (roadmap) |
| **Taxa de inconsistencia** | % de controles com cross-check inconsistente | Dados do Cross-Check Engine por tenant |
| **Tempo de remediacao** | Dias entre deteccao de gap e resolucao | Delta entre scan com finding e scan sem finding |
| **Evolucao da postura** | Tendencia do score ao longo do tempo | Score snapshots (jornada persistida) |

---

## 5. TPRM como Estrategia de Defesa Ativa

A gestao de risco de terceiros (TPRM) vai alem de compliance. E uma **estrategia de defesa ativa** que:

1. **Protege a cadeia de suprimentos:** Identifica elos fracos antes que sejam explorados
2. **Reduz superficie de ataque:** Exige padroes minimos de seguranca de todos os parceiros
3. **Acelera resposta a incidentes:** Mapeamento previo de terceiros permite containment mais rapido
4. **Viabiliza seguro cibernetico:** Dados de TPRM sao insumo direto para subscricao e precificacao
5. **Demonstra maturidade:** Compliance com LGPD/GDPR e frameworks reconhecidos

### Ciclo Continuo TPRA no n.Risk

```
Identificacao          Due Diligence          Scoring
(Cadastro tenant) --> (Assessment hibrido) --> (Score A-F)
       ^                                          |
       |                                          v
  Monitoramento  <-- Remediacao <--------- Conformidade
  (Re-scan +          (Justificativas,      (Cross-check,
   snapshots)          plano de acao)        LGPD, ISO)
```

---

## 6. Referencias

- [project-overview.md](./project-overview.md) -- Visao geral do n.Risk
- [correlacao-securityscorecard-nrisk.md](./correlacao-securityscorecard-nrisk.md) -- Analise competitiva e mapeamento TPRM
- [regras-de-negocio-assessment.md](./regras-de-negocio-assessment.md) -- Regras de negocio do assessment e scoring
- [nrisk-assessment-hibrido.md](../plans/nrisk-assessment-hibrido.md) -- Modulo de Assessment Hibrido
- [nrisk-scoring-metodologia.md](../plans/nrisk-scoring-metodologia.md) -- Algoritmo de scoring
- [glossary.md](./glossary.md) -- Terminologia e conceitos de dominio
- [security.md](./security.md) -- Seguranca e conformidade
- [nrisk-dpcf-privacy-compliance.md](../plans/nrisk-dpcf-privacy-compliance.md) -- LGPD e Evidence Vault
