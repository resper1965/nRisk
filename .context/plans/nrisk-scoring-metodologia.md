---
status: in_progress
generated: 2026-02-04
source: Metodologia de Scoring e Avaliação de Risco
parentPlan: nrisk-mvp
agents:
  - type: "architect-specialist"
    role: "Modelar algoritmos de scoring, fórmulas e regras de dedução"
  - type: "backend-specialist"
    role: "Implementar motor de scoring, validação cruzada, cálculo de F"
  - type: "database-specialist"
    role: "Schema para matriz de validação, taxonomia, mapeamento frameworks"
  - type: "security-auditor"
    role: "Validar pesos e critérios de severidade"
  - type: "test-writer"
    role: "Casos de teste para fórmulas, inconsistências e edge cases"
docs:
  - "architecture.md"
  - "data-flow.md"
  - "glossary.md"
  - "security.md"
phases:
  - id: "taxonomia"
    name: "Taxonomia de Severidade"
    prevc: "P"
  - id: "algoritmo"
    name: "Algoritmo de Score Composto"
    prevc: "P"
  - id: "matriz-validacao"
    name: "Matriz de Validação Cruzada"
    prevc: "P"
  - id: "mapeamento"
    name: "Mapeamento de Frameworks"
    prevc: "P"
  - id: "benchmarking"
    name: "Categorização Setorial e Benchmarking"
    prevc: "P"
---

# Metodologia de Scoring e Avaliação de Risco

> Especificação da metodologia de pontuação do n.Risk: taxonomia de severidade, algoritmo composto (T, C, F), matriz de validação cruzada, mapeamento de frameworks e benchmarking setorial.

## Task Snapshot

- **Primary goal:** Definir e implementar a metodologia de scoring que unifica achados técnicos e respostas declaratórias, com validação cruzada e mapeamento a normas.
- **Success signal:** Motor de scoring produzindo $S_f$ correto; inconsistências detectadas; benchmarks setoriais disponíveis.
- **Key references:**
  - [Plano MVP n.Risk](./nrisk-mvp.md)
  - [Documentation Index](../docs/README.md)
  - [Architecture](../docs/architecture.md)

---

## 1. Taxonomia de Severidade (O Peso dos Achados)

Definição de como cada falha técnica encontrada pelo scanner impacta a pontuação.

| Severidade | Peso | Exemplos |
|------------|------|----------|
| **Crítico** | 10 | Portas de administração abertas (RDP, SMB), CVEs com exploit público, malware detectado |
| **Alto** | 7 | Falta de proteção de e-mail (DMARC/SPF), certificados SSL expirados, credenciais vazadas recentemente |
| **Médio** | 4 | Headers de segurança ausentes (HSTS, CSP), versões de software levemente desatualizadas |
| **Baixo** | 1 | Informações de versão expostas em banners, falta de boas práticas cosméticas em DNS |

### Regra de Penalidade Crítica (PRD)

Se houver **qualquer** achado Crítico, o $S_f$ não pode ultrapassar **500 pontos**, independentemente de $C$ e $F$.

---

## 2. Algoritmo de Cálculo do Score Composto

### 2.1 Score Técnico ($T$)

- **Base:** 1000 pontos
- **Método:** Dedução de pontos conforme achados e pesos
- **Fórmula (conceitual):**  
  $T = 1000 - \sum_{i} (peso_i \times f(quantidade, criticidade))$

  Onde $f$ pode ser linear, com teto por categoria ou com decaimento (ex: primeiro achado Crítico = -500, demais com peso reduzido).

### 2.2 Score de Compliance ($C$)

- **Base:** Percentual de aderência às respostas do questionário
- **Exemplo:** 80% das perguntas da ISO 27001 respondidas positivamente **e** com evidência anexada
- **Regra:** Respostas sem evidência podem contar parcialmente ou não, conforme política

### 2.3 Fator de Confiança ($F$)

- **Função:** Multiplicador que reduz a nota se houver muitas respostas sem evidências
- **Exemplo:** $F = 1 - (k \times \text{% respostas sem evidência})$, com $k$ configurável
- **Efeito:** $C_{ajustado} = C \times F$ antes de compor $S_f$

### 2.4 Score Final ($S_f$)

$$S_f = (T \times 0.6) + (C_{ajustado} \times 0.4)$$

**Com penalidade crítica:** Se existir achado Crítico,  
$S_f = \min(S_f, 500)$

---

## 3. Matriz de Validação Cruzada (A Verificação de Verdade)

Mapeamento: **Pergunta do Questionário** ↔ **Evidência Técnica (Scan)** → **Ação em conflito**

| Pergunta (Questionário) | Evidência Técnica (Scan) | Ação em Caso de Conflito |
|------------------------|--------------------------|---------------------------|
| "Possui controle de acesso para serviços críticos?" | Porta 3389 (RDP) aberta para a internet | **Inconsistência Crítica:** Zera o ponto do controle e penaliza o score geral |
| "Utiliza criptografia em toda a comunicação?" | Detecção de protocolo TLS 1.0 ou 1.1 | **Alerta de Risco:** Reduz a nota de maturidade do controle de criptografia |
| "Protege a marca contra ataques de phishing?" | Registro DMARC ausente ou em modo `p=none` | **Inconsistência:** O ponto do questionário é invalidado |

### Tipos de Ação

| Tipo | Descrição | Impacto no Score |
|------|-----------|------------------|
| **Inconsistência Crítica** | Contradição grave; controle zerado + penalidade global | Zera controle; $S_f \leq 500$ se aplicável |
| **Inconsistência** | Contradição; ponto do questionário invalidado | Controle não conta como atendido |
| **Alerta de Risco** | Possível discrepância; maturidade reduzida | Redução parcial da nota do controle |

---

## 4. Mapeamento de Frameworks (Cross-Reference)

Cada item avaliado (técnico ou manual) vincula-se aos domínios das normas:

### 4.1 ISO 27001

- **Controles do Anexo A:** A.12 (Operacional), A.13 (Comunicações), A.10 (Criptografia), etc.
- **Exemplo:** Porta RDP aberta → A.13.1.1 (Políticas de rede); DMARC ausente → A.13.2.1 (Transferência de informação)

### 4.2 NIST CSF

- **Funções:** Identify, Protect, Detect, Respond, Recover
- **Exemplo:** Headers HSTS/CSP ausentes → Protect (PR.AC); Credenciais vazadas → Identify (ID.RA)

### 4.3 LGPD

- **Itens:** Proteção de dados, vazamentos, bases legais, DPO
- **Exemplo:** Credenciais vazadas → Art. 46 (comunicação à ANPD); Evidências no Vault → Art. 37 (registro de operações)

---

## 5. Categorização Setorial (Benchmarking)

### 5.1 Agrupamento por Setor

- **Setores exemplo:** Financeiro, Saúde, Varejo, Tecnologia, Indústria, Serviços
- **Métrica:** Média do score ($S_f$) por setor, permitindo comparar o cliente com seus pares

### 5.2 Apetite de Risco por Categoria

| Categoria de Empresa | Apetite de Risco | Expectativa de Score Mínimo (exemplo) |
|----------------------|------------------|---------------------------------------|
| Grandes corporações / Reguladas | Baixo | $S_f \geq 800$ |
| Médias empresas | Médio | $S_f \geq 600$ |
| Pequenas / Startups | Alto | $S_f \geq 400$ |

- Definição de "Apetite de Risco" por categoria para calibrar subscrição e relatórios

---

## 6. Fases de Implementação (Referência ao MVP)

| Fase | Artefato | Plano MVP |
|------|----------|-----------|
| Taxonomia | Tabela de severidade, pesos, regras de dedução | Mês 1 (Scan) + Mês 3 (Scoring) |
| Algoritmo | Motor de cálculo T, C, F, $S_f$ | Mês 3 |
| Matriz de Validação | Tabela pergunta ↔ achado, ações | Mês 2 (Questionários) + Mês 3 |
| Mapeamento Frameworks | Cross-reference ISO/NIST/LGPD | Mês 3 (GRC) |
| Benchmarking | Média setorial, apetite de risco | Pós-MVP / Mês 4+ |

---

## 7. Dependências e Riscos

### Dependências

- Scanner gerando achados com severidade classificada (Mês 1)
- Questionários com vínculo a controles e evidências (Mês 2)
- Dados históricos para cálculo de média setorial (acúmulo ao longo do tempo)

### Riscos

| Risco | Mitigação |
|-------|-----------|
| Pesos desbalanceados (muito punitive ou leniente) | Calibração com beta; parâmetros configuráveis |
| Matriz de validação incompleta | Manter matriz versionada; extensível por controle |
| Benchmark setorial com poucos dados | Fallback "sem benchmark"; mínimo de amostras para exibir |

---

## 8. Evidence & Follow-up

- [ ] Especificação formal das fórmulas (notação matemática + pseudocódigo)
- [ ] Tabela completa de severidade (todos os tipos de achado do scanner)
- [ ] Matriz de validação completa (todas as perguntas mapeáveis)
- [ ] Matriz de cross-reference ISO 27001 / NIST CSF / LGPD
- [ ] Documentação de apetite de risco por setor
- [ ] Testes unitários para cada componente do algoritmo
