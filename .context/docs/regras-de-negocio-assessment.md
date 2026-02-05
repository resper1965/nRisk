---
type: doc
name: regras-de-negocio-assessment
description: Regras de negócio do módulo Assessment e Scoring (decisões produto)
category: glossary
---

# Regras de Negócio — Assessment e Scoring

Decisões de produto para o módulo de assessment híbrido, scoring e jornada de melhoria. Referência para implementação e validação.

---

## 1. Evidência obrigatória (trilhas Prata/Ouro)

**Decisão:** **B** — Reduzir score quando resposta "Sim" sem evidência em trilha Prata ou Ouro.

- Em Prata/Ouro, para perguntas com `evidence_type` diferente de `none`, resposta "Sim" **exige** evidência (upload ou link).
- Se o usuário responder "Sim" sem anexar evidência: **não bloquear** o envio; **reduzir** o score de compliance (ex.: contar parcialmente ou zero para aquela pergunta, conforme política definida na implementação).
- Objetivo: incentivar evidência sem travar a jornada.

---

## 2. Fator de confiança (F) e evidência

**Decisão:** **B** — O fator de confiança F considera **também** a falta de evidência onde ela é obrigatória.

- F hoje já penaliza **inconsistências** do cross-check (declaração vs scan).
- F deve **ainda** penalizar respostas "Sim" **sem evidência** em perguntas Prata/Ouro que exijam evidência (ex.: redução adicional em F ou tratamento na fórmula de C).
- Detalhe da fórmula (ex.: peso por “% de Sim sem evidência” em Prata/Ouro) fica para especificação técnica; a regra de negócio é: **falta de evidência obrigatória impacta F (e portanto o score final)**.

---

## 3. Escopo do assessment e correlação com SecurityScorecard (concorrente)

**Dúvida original:** Um assessment é “por tenant” ou “por scan/domínio”? Qual scan usar no dashboard?

**Referência de mercado:** [SecurityScorecard](https://securityscorecard.com/) — concorrente em supply chain cyber risk, third-party risk management, security ratings, questionários e cyber insurance. Oferece ratings por organização, detecção contínua, questionários/assessments e visibilidade para seguradoras e corretores.

**Correlação com SecurityScorecard:**

- O **rating de segurança** (score) agrega:
  - **Fatores técnicos** (o que o scan vê: portas, SSL, DMARC, CVEs, etc.)
  - **Fatores declarativos** (questionários, evidências, políticas)
- O indicador pode ser calculado **por escopo**: por domínio, por organização (vendor) ou por portfólio (seguradora). Ex.: “rating do domínio exemplo.com” vs “rating do tenant/vendor”.

**Regra adotada (a fixar em produto):**

- **Assessment (respostas ao questionário):** um conjunto de respostas por **tenant** (como hoje). O tenant pode ter múltiplos domínios/scans, mas as **respostas** são compartilhadas (uma “declaração” da organização).
- **Score (rating):** é calculado **por combinação tenant + scan** (ou tenant + domínio). Ou seja:
  - **T (técnico)** vem de um scan concreto (ex.: scan do domínio `exemplo.com`).
  - **C (compliance)** vem das respostas do tenant.
  - **S_f** = f(T do scan X, C do tenant, F, penalidades).
- **Dashboard / consumidores:** podem ver:
  - “Score do tenant” = score do **último scan** ou do scan **escolhido** (ex.: por domínio).
  - Ou múltiplos scores (um por domínio/scan) para o mesmo tenant — análogo a monitorar vários vendors/domínios no SecurityScorecard.
- Em resumo: **uma “declaração” (assessment) por tenant; vários ratings possíveis (um por scan/domínio)**. A decisão de qual scan exibir como “o” score (último, por domínio, etc.) é de UX/produto e deve ser documentada no fluxo de cada consumidor (cliente, seguradora, corretora).

---

## 4. NA (não aplicável) e transparência do impacto no score

**Decisão:** NA é **aceito**, mas **impacta diretamente no score**; ao final do assessment, **quem responde precisa entender por que a nota foi impactada**.

- Resposta **NA** em uma pergunta:
  - É válida (não bloqueada).
  - **Impacta o score** (ex.: não soma pontos no modelo aditivo; pode reduzir o máximo possível do eixo/domínio).
- **Obrigatório em produto:** ao finalizar ou visualizar o resultado, o respondente deve ver de forma clara:
  - Quais respostas foram NA.
  - Como cada NA (e demais respostas) impactou o score (ex.: “esta pergunta em NA reduziu o score de compliance em X” ou “não contou para o eixo Y”).
- Objetivo: **transparência** — o respondente entende o “porquê” da nota (NA incluído).

---

## 5. Persistência e jornada de melhoria

**Decisão:** Os **resultados devem persistir**; a **jornada de melhoria (ou piora) da postura** deve ser **consumível pelos demandantes** (cliente, seguradora, corretora, etc.).

- **Persistir:**
  - Resultado do cross-check (inconsistências, validações).
  - ScoreBreakdown completo (T, C, F, S_f, categoria, scores por domínio).
  - Momento em que foi calculado (timestamp) e contexto (ex.: assessment_id, scan_id).
- **Jornada:**
  - Histórico de scores e/ou de snapshots de assessment ao longo do tempo (ex.: por submissão, por scan).
  - Consumível por:
    - **Cliente (avaliado):** ver evolução da própria postura.
    - **Seguradora / corretora:** ver evolução do avaliado para subscrição, renovação ou acompanhamento.
- Implementação: definir modelo de dados (ex.: tabela/subrecurso “score_snapshots” ou “assessment_results”) e políticas de retenção e acesso (RBAC) para cada tipo de demandante.

---

## 6. Achado técnico sem entrada no mapping (mapping_logic.json)

**Dúvida original:** O que fazer quando o scan encontra um problema que **não está mapeado** em `mapping_logic.json`?

**Cenário:** Ex.: nova CVE ou um achado genérico que ainda não tem linha no JSON (sem `control_id`, sem severidade definida no mapping).

**Regra:**

- **Score técnico (T):** o achado **pode** reduzir T (ex.: usando uma severidade padrão “medium” ou “low” e uma dedução genérica), para que nada “suma” do score técnico. Detalhe (dedução padrão, severidade padrão) é definido na implementação.
- **Cross-check:** achados **sem** `control_id` (não mapeados) **não entram** no cross-check. O cross-check só compara “resposta declarativa vs achado **por controle**”; sem controle mapeado, não há comparação.
- **Resumo:** Achado não mapeado → **afeta só T** (com regra padrão); **não** gera inconsistência no cross-check. O mapping_logic continua sendo a fonte de verdade para “o que é qual controle e com qual severidade”.

---

## 7. Submissão final (CISO) — passo a passo

**Dúvida original:** O que exatamente acontece quando o CISO clica em “Submeter” (POST /assessment/submit)?

**Fluxo descrito (regra de negócio):**

1. **Autorização:** Apenas usuário com papel **CISO** (ou Admin) pode chamar a ação de submissão.
2. **Validação:** Sistema verifica se o assessment está em estado submetível (ex.: não já submetido, ou regras de mínimo de respostas atendidas, se houver).
3. **Cálculo final:** Recalcula score completo (T, C, F, S_f, categoria, domínios) com as respostas e o scan vigente (se houver), e aplica regras de evidência e NA.
4. **Persistência:**
   - Grava **snapshot** do resultado (ScoreBreakdown, cross-check, inconsistências) vinculado ao assessment e ao scan (se aplicável).
   - Marca o assessment como **submetido** (ex.: status `submitted`, campo `submitted_at`, `submitted_by`).
5. **Trava (opcional):** Respostas do assessment submetido ficam **somente leitura** até que se abra uma **nova rodada** (ex.: novo assessment ou “reabrir para edição” conforme política).
6. **Visibilidade:** O resultado submetido passa a ser **consumível pelos demandantes** (seguradora, corretora) conforme RBAC (ex.: seguradora só vê resultado final).
7. **Auditoria:** Registrar quem submeteu, quando e qual versão do score foi persistida.

Implementação pode dividir isso em eventos (ex.: “assessment.submitted”) e workers (persistência, notificação), mas a **regra de negócio** é essa sequência.

---

## 8. RBAC — quem vê score e resultado

**Decisão:** **Operador** pode acompanhar o score (e o cross-check) durante a elaboração; **seguradora** vê só o resultado final.

- **Operador:** Pode ver score (e inconsistências/cross-check) em **tempo real** enquanto responde e antes da submissão (rascunho). Objetivo: acompanhar impacto das respostas e corrigir antes de submeter.
- **CISO:** Pode ver o mesmo que o operador e, além disso, **submeter** o assessment (ver fluxo acima).
- **Seguradora (e corretora):** Acesso **apenas** ao resultado **final** (assessment submetido): score, categoria, resumo de inconsistências e jornada (conforme regra 5), sem editar respostas nem ver rascunhos.

---

## 9. Justificativa de vulnerabilidade (exceção pelo avaliador)

**Regra nova:** Em alguns casos, um achado apontado pelo scan pode ser **uma característica aceita** (ex.: falso positivo ou risco aceito). O **cliente** pode submeter uma **justificativa**; um **avaliador da plataforma** (n.Risk) decide aceitar ou não. **Se aceita:** a nota é **acrescida** (o achado deixa de penalizar ou penaliza menos).

**Fluxo:**

1. Cliente (tenant) vê um finding no relatório/dashboard que considera incorreto ou aceitável.
2. Cliente submete uma **justificativa** (texto, opcionalmente anexos) vinculada ao finding (e ao scan/assessment).
3. A justificativa entra em fila para o **avaliador** (papel da plataforma n.Risk, interno ou parceiro).
4. Avaliador **aceita** ou **rejeita** a justificativa.
5. **Se aceita:**
   - O finding deixa de contar para o score (ou passa a contar com peso reduzido, conforme política).
   - O score é **recalculado** e o novo resultado **persistido** (snapshot), refletindo o acréscimo na nota.
6. Cliente e demandantes (seguradora, etc.) veem o resultado atualizado (com a exceção aplicada) e, se desejado, o histórico (ex.: “finding X justificado e aceito em data Y”).

**Persistência sugerida:** Justificativas (texto, status, avaliador, data); vínculo finding ↔ justificativa; flag ou regra “finding não penaliza” / “peso reduzido” para o cálculo de T (e eventualmente cross-check). A jornada de melhoria (regra 5) pode incluir eventos “justificativa aceita” para transparência.

---

## Resumo das decisões

| # | Tema | Decisão |
|---|------|--------|
| 1 | Evidência Prata/Ouro | Reduzir score se "Sim" sem evidência (não bloquear) |
| 2 | F e evidência | F considera também falta de evidência obrigatória |
| 3 | Escopo assessment | Uma declaração (respostas) por tenant; score calculado por tenant + scan; Secure Score por escopo |
| 4 | NA | NA aceito; impacta score; transparência do impacto ao respondente |
| 5 | Persistência | Resultados e jornada persistidos; consumíveis por cliente, seguradora, corretora |
| 6 | Achado sem mapping | Afeta só T (regra padrão); não entra no cross-check |
| 7 | Submissão CISO | Fluxo: autorização → validação → cálculo → persistência snapshot → travar → visibilidade demandantes → auditoria |
| 8 | RBAC | Operador acompanha score; seguradora só resultado final |
| 9 | Justificativa de finding | Cliente justifica → avaliador aceita/rejeita → se aceita, nota acrescida e persistida |

---

## Referências

- [contexto-nrisk.md](./contexto-nrisk.md)
- [nrisk-assessment-hibrido.md](../plans/nrisk-assessment-hibrido.md)
- [nrisk-scoring-metodologia.md](../plans/nrisk-scoring-metodologia.md)
- [glossary.md](./glossary.md)
