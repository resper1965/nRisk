---
status: in_progress
generated: 2026-02-04
source: Documento 6 - Matriz de Rastreabilidade de Controles (Technical GRC Mapping)
parentPlan: nrisk-scoring-metodologia
agents:
  - type: "database-specialist"
    role: "Modelar tabelas Cloud SQL a partir da matriz técnico-normativa"
  - type: "backend-specialist"
    role: "Implementar lógica de inconsistência e motor de flags"
  - type: "frontend-specialist"
    role: "Relatório de Subscrição, spider chart, Top 3 riscos"
  - type: "security-auditor"
    role: "Validar mapeamento ISO 27001 e regras de negócio"
docs:
  - "architecture.md"
  - "data-flow.md"
  - "glossary.md"
phases:
  - id: "tabela-mapeamento"
    name: "Tabela Técnico-Normativa (Cloud SQL)"
    prevc: "P"
  - id: "logica-inconsistencia"
    name: "Regras de Inconsistência"
    prevc: "E"
  - id: "relatorio-subscricao"
    name: "Estrutura do Relatório de Subscrição"
    prevc: "P"
---

# Matriz de Rastreabilidade de Controles (Technical GRC Mapping)

> Especificação que conecta achado técnico a requisito normativo. Permite que o código "saiba" qual requisito ISO 27001 ou LGPD está testando quando executa um scan ou valida um questionário.

## Task Snapshot

- **Primary goal:** Definir a especificação que alimenta o banco de dados de lógica GRC — tabela técnico-normativa, regras de inconsistência e formato do Relatório de Subscrição.
- **Success flag:** Motor de scoring consulta matriz; inconsistências geram flags; relatório PDF/dashboard com sumário, Top 3 riscos e spider chart.
- **Key references:**
  - [Metodologia de Scoring](./nrisk-scoring-metodologia.md)
  - [Arquitetura GCP](./nrisk-arquitetura-gcp.md)
  - [PRD MVP](./nrisk-mvp.md)

---

## 1. Tabela de Mapeamento Técnico-Normativo

Estrutura que virará tabela no **Cloud SQL** e conecta:
- ID do controle
- Domínio ISO 27001
- Achado técnico (output do scan)
- Pergunta do assessment
- Peso no score

### Matriz de Exemplo (MVP)

| ID Controle | Domínio ISO 27001 | Achado Técnico (Scan) | Pergunta (Assessment) | Peso no Score |
|-------------|-------------------|------------------------|------------------------|---------------|
| **C-01** | A.13.1.1 (Redes) | Portas Críticas (RDP 3389, SMB 445) abertas para internet | "Existe controle de portas críticas?" | Crítico |
| **C-02** | A.10.1.1 (Criptografia) | SSL expira em &lt; 30 dias | "Há gestão de certificados digitais?" | Alto |
| **C-03** | A.12.6.1 (Vulnerabilidades) | Versão de software outdated | "Há patch management?" | Médio |
| **C-04** | A.13.2.1 (E-mail) | Falta de DMARC/SPF ou DMARC em `p=none` | "Possui proteção anti-phishing (DMARC/SPF)?" | Alto |

### Schema Proposto (Cloud SQL)

```sql
-- Tabela de controles (matriz técnico-normativa)
CREATE TABLE controls (
  id              VARCHAR(10) PRIMARY KEY,  -- ex: C-01
  iso_domain      VARCHAR(50) NOT NULL,     -- ex: A.13.1.1
  iso_name        VARCHAR(255),             -- ex: Redes
  scan_rule_id    VARCHAR(50),              -- referência ao achado técnico
  question_id     VARCHAR(50) NOT NULL,     -- referência à pergunta do assessment
  severity        VARCHAR(20) NOT NULL,     -- CRITICAL, HIGH, MEDIUM, LOW
  weight          INT NOT NULL              -- 10, 7, 4, 1
);

-- Tabela de regras de scan (mapeamento achado → controle)
CREATE TABLE scan_rules (
  id              VARCHAR(50) PRIMARY KEY,
  control_id      VARCHAR(10) REFERENCES controls(id),
  scan_type       VARCHAR(50),              -- port_scan, ssl_check, dns_check
  condition       JSONB                     -- ex: {"port": 3389, "open": true}
);
```

---

## 2. Definição da "Lógica de Inconsistência"

Regras de negócio para confrontar **o que o cliente declara** (assessment) com **o que o scan encontra**.

### Regra 01 (Exemplo)

| Condição | Assessment | Scan | Ação |
|----------|------------|------|------|
| **C-01** | Resposta "Sim" ("Existe controle de portas?") | Porta 3389 (RDP) aberta detectada | **Flag de Inconsistência**; reduz **Fator de Confiança** do fornecedor |

### Regras Adicionais (Expandir)

| Regra | Controle | Condição | Ação |
|-------|----------|----------|------|
| **R-01** | C-01 | Assessment "Sim" + Porta RDP/SMB aberta | Inconsistência Crítica; F reduzido |
| **R-02** | C-02 | Assessment "Sim" + SSL expirado ou &lt; 30 dias | Inconsistência; controle zerado |
| **R-03** | C-03 | Assessment "Sim" + Software outdated | Alerta de Risco; nota do controle reduzida |
| **R-04** | C-04 | Assessment "Sim" + DMARC ausente ou `p=none` | Inconsistência; ponto invalidado |

### Implementação

- **Input:** Resposta do questionário + Resultado do scan para o domínio
- **Processamento:** Para cada controle com pergunta e achado técnico mapeado, aplicar regra correspondente
- **Output:** Lista de flags de inconsistência; Fator de Confiança (F) ajustado

---

## 3. Estrutura do Relatório de Saída (The Underwriting Report)

Formato de apresentação do resultado para a **seguradora** (Relatório de Risco / PDF FR4).

### 3.1 Sumário Executivo

| Campo | Descrição |
|-------|-----------|
| **Score** | Nota 0–1000 ($S_f$) |
| **Categoria de Risco** | A (excelente) a F (crítico), baseada em faixas de score |
| **Data do Assessment** | Data da última avaliação |
| **Domínio/CNPJ** | Identificação do avaliado |

**Exemplo de Faixas (proposta):**

| Categoria | Score | Interpretação |
|-----------|-------|---------------|
| A | 900–1000 | Baixo risco |
| B | 750–899 | Risco moderado-baixo |
| C | 600–749 | Risco moderado |
| D | 400–599 | Risco elevado |
| E | 250–399 | Risco alto |
| F | 0–249 | Risco crítico |

### 3.2 Top 3 Riscos

Lista dos **3 achados mais críticos** que o cliente deve corrigir imediatamente.

| # | Risco | Controle | Severidade | Recomendação |
|---|-------|----------|------------|--------------|
| 1 | Porta RDP exposta | C-01 | Crítico | Restringir acesso ou usar VPN |
| 2 | DMARC ausente | C-04 | Alto | Implementar DMARC com política p=reject |
| 3 | Certificado SSL próximo do vencimento | C-02 | Alto | Renovar certificado |

### 3.3 Mapeamento de Conformidade (Spider Chart)

**Gráfico de teia** (radar/spider) mostrando a aderência por **domínio da ISO 27001**:

- **Eixos:** Domínios (A.10 Criptografia, A.12 Operacional, A.13 Comunicações, etc.)
- **Valor por eixo:** % de controles atendidos naquele domínio
- **Uso:** Visualização rápida de forças e fraquezas em conformidade

**Domínios sugeridos para o spider chart (MVP):**

| Domínio | Descrição |
|---------|-----------|
| A.10 | Criptografia |
| A.12 | Segurança operacional |
| A.13 | Comunicações |
| A.14 | Aquisição, desenvolvimento e manutenção |

---

## 4. Fluxo de Dados (Rastreabilidade)

```
  Scan (Cloud Run Jobs)     Assessment (Questionário)     Motor de Scoring
           │                           │                           │
           ▼                           ▼                           ▼
  Achados técnicos            Respostas por controle        Consulta matriz
  (Firestore)                 (Cloud SQL)                   (Cloud SQL)
           │                           │                           │
           └───────────────────────────┴───────────────────────────┘
                                       │
                                       ▼
                          Aplicação de regras de inconsistência
                                       │
                                       ▼
                          Cálculo T, C, F, S_f
                                       │
                                       ▼
                          Geração do Relatório de Subscrição
                          (PDF / Dashboard)
```

---

## 5. Mapeamento com Outros Planos

| Plano | Relação |
|-------|---------|
| [Metodologia de Scoring](./nrisk-scoring-metodologia.md) | Define T, C, F, $S_f$; esta matriz implementa o mapeamento técnico↔normativo |
| [Arquitetura GCP](./nrisk-arquitetura-gcp.md) | Cloud SQL armazena `controls` e `scan_rules` |
| [PRD MVP](./nrisk-mvp.md) | FR4: PDF Relatório de Risco; estrutura definida aqui |
| [Arquitetura TAD](./nrisk-arquitetura-tad.md) | Pipeline de normalização consome esta matriz |

---

## 6. Evidence & Follow-up

- [ ] Tabela completa de controles (expandir C-01 a C-N)
- [ ] Regras de inconsistência formalizadas (pseudo-código ou tabela de decisão)
- [ ] Schema final do Cloud SQL (migrations)
- [ ] Template do Relatório de Subscrição (PDF)
- [ ] Especificação do Spider Chart (lib, eixos, dados)
- [ ] Definição final das faixas de Categoria de Risco (A–F)
