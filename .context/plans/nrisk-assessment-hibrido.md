---
status: in_progress
generated: 2026-02-04
parentPlan: nrisk-mvp
agents:
  - type: "architect-specialist"
    role: "Modelar trilhas, score C aditivo, matriz cross-check"
  - type: "backend-specialist"
    role: "Question Bank, Evidence Vault, Cross-Check Engine, RBAC"
  - type: "database-specialist"
    role: "Schema para trilhas, evidências com hash, estado de submissão"
  - type: "security-auditor"
    role: "Isolamento tenant, hash SHA-256, RBAC"
  - type: "feature-developer"
    role: "Implementar trilhas, endpoints, integração scan"
  - type: "test-writer"
    role: "Testes cross-check, score C, RBAC"
docs:
  - "architecture.md"
  - "data-flow.md"
  - "glossary.md"
  - "security.md"
  - "nrisk-scoring-metodologia.md"
phases:
  - id: "trilhas"
    name: "Trilhas de Maturidade"
    prevc: "P"
  - id: "question-bank"
    name: "Question Bank Estendido"
    prevc: "P"
  - id: "evidence-vault"
    name: "Evidence Vault com Hash"
    prevc: "E"
  - id: "cross-check"
    name: "Cross-Check Engine"
    prevc: "E"
  - id: "score-compliance"
    name: "Score C Aditivo e Penalidades"
    prevc: "E"
  - id: "rbac"
    name: "RBAC e Submissão Final"
    prevc: "E"
  - id: "validacao"
    name: "Validação e Documentação"
    prevc: "V"
---

# Módulo de Assessment Híbrido

> Transforma o n.Risk de um scanner em plataforma de governança: combina declarações sobre processos internos (RH, backups, gestão de chaves) com validação técnica do motor de scan.

## Task Snapshot

- **Primary goal:** Implementar o Assessment Híbrido com trilhas de maturidade (Bronze/Prata/Ouro), Question Bank vinculado ao `mapping_logic.json`, Evidence Vault com integridade SHA-256, Cross-Check Engine (declarado vs detectado) e score de compliance aditivo com RBAC.
- **Success signal:** Seguradora escolhe trilha; Operador responde; CISO submete; sistema calcula score C aditivo; inconsistências geram bandeiras vermelhas e penalidade -10%.
- **Key references:**
  - [Metodologia de Scoring](./nrisk-scoring-metodologia.md)
  - [Architecture](../docs/architecture.md)
  - [Mapping Logic](../../backend/mapping_logic.json)
  - [Assessment Declarativo atual](../../backend/assessment_questions.json)

---

## 1. Visão Geral

O módulo permite que empresas respondam sobre **processos internos** não visíveis pelo scan (políticas de RH, backups, gestão de chaves), enquanto o motor técnico valida o que é possível (portas abertas, SSL, DMARC, etc.). O diferencial competitivo é o **Cross-Check**: comparar o declarado com o detectado.

---

## 2. Estrutura dos Questionários (Trilhas de Maturidade)

| Trilha | Descrição | Rigor | Evidência |
|--------|-----------|-------|-----------|
| **Bronze** | Auto-declaração | 15–20 perguntas críticas | Opcional; foco Sim/Não |
| **Prata** | Evidenciada | Exige upload para respostas positivas | PDF, Imagem ou Link obrigatório |
| **Ouro** | Full Framework | Mapeamento completo ISO 27001 ou NIST | Cobertura integral dos controles |

**Implementação:** Campo `track` no questionário (bronze | silver | gold). Cada trilha define subconjunto de perguntas e regras de obrigatoriedade de evidência.

---

## 3. Componentes Funcionais

### 3.1 Gerenciador de Perguntas (Question Bank)

Perguntas vinculadas aos controles em `mapping_logic.json`.

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `id` | string | Identificador único (ex: Q-01) |
| `text` | string | Texto da pergunta |
| `control_id` | string | Vínculo com mapping_logic (ex: C-01) |
| `iso_domain` | string | Domínio ISO (ex: A.13.1.1) |
| `risk_weight` | int | Peso de risco 0–5 (pontos aditivos se Sim) |
| `evidence_type` | enum | `pdf` \| `image` \| `link` \| `none` |
| `track` | enum | Trilhas em que aparece: `bronze` \| `silver` \| `gold` |

**Migração:** Estender `assessment_questions.json` com `risk_weight`, `evidence_type`, `track`. Manter compatibilidade com implementação atual.

### 3.2 Evidence Vault (Cofre de Evidências)

Para respostas "Sim", o usuário deve ter opção (Bronze) ou obrigatoriedade (Prata/Ouro) de subir prova.

| Requisito | Implementação |
|-----------|---------------|
| Armazenamento | GCP Cloud Storage; path `tenants/{tenant_id}/evidence/{question_id}_{filename}` |
| Isolamento | Bucket ou prefixo por tenant; nunca cross-tenant |
| Integridade | SHA-256 do arquivo ao upload; persistir em Firestore/Cloud SQL |
| Verificação | Endpoint opcional para revalidar hash contra arquivo armazenado |

**Schema evidência:**

```json
{
  "id": "ev-uuid",
  "tenant_id": "...",
  "question_id": "Q-01",
  "answer_id": "...",
  "object_path": "gs://bucket/tenants/xxx/evidence/...",
  "sha256": "a1b2c3...",
  "mime_type": "application/pdf",
  "uploaded_at": "ISO8601"
}
```

### 3.3 Cross-Check Engine (Validação Cruzada)

Compara **declaração do usuário** vs **resultado do scan**.

| Controle | Declaração | Scan | Status |
|----------|------------|------|--------|
| A.10.1 (Cripto) | "Sim, usamos SSL em tudo." | Certificado expirado em dev.empresa.com | **Inconsistente** (Bandeira Vermelha) |
| A.13.1 (Rede) | "Portas de admin fechadas." | Porta 3389 (RDP) aberta | **Inconsistente** |
| A.13.2 (Email) | "Protegemos contra Phishing." | DMARC ativo e correto | **Validado** (Bandeira Verde) |

**Implementação:**

- Tabela/matriz: `question_id` + `control_id` ↔ lista de `technical_finding` em `mapping_logic.json`
- Para cada resposta "Sim" com controle vinculado: buscar findings do scan para aquele `control_id`
- Se encontrar finding crítico/alto → status **Inconsistente**; senão → **Validado**
- Resultado exposto em `GET /api/v1/assessment/cross-check?scan_id=...`

---

## 4. Cálculo do Score de Compliance ($C$)

**Diferença fundamental:** O score técnico deduz pontos; o score de compliance é **aditivo**.

| Regra | Descrição |
|-------|-----------|
| Base | 0 pontos |
| Resposta "Sim" | Soma pontos = `risk_weight` × fator (ex: 20 pts por peso) |
| Resposta "Sim" sem evidência (Prata/Ouro) | Conta parcialmente ou zero (conforme política) |
| Resposta "Não" ou "N/A" | 0 pontos para aquela pergunta |
| **Penalidade Inconsistência** | Se scan desmente: controle perde pontos + **multiplicador Falta de Confiança -10%** no score total |

**Fórmula (conceitual):**

$$C_{bruto} = \sum_{i \in \text{Sim válido}} (\text{risk\_weight}_i \times k)$$

$$C_{ajustado} = C_{bruto} \times (1 - 0.10 \times \text{n\_inconsistencias})$$

Com teto: $C \leq C_{max}$ (ex: 500 pts para compliance puro).

**Score final** (conforme nrisk-scoring-metodologia):

$$S_f = (T \times 0.6) + (C_{ajustado} \times 0.4)$$

Se achado crítico no scan: $S_f = \min(S_f, 500)$.

---

## 5. Requisitos Técnicos de Multi-tenancy

| Requisito | Implementação |
|-----------|---------------|
| **Isolamento** | Todas as queries filtram por `tenant_id`; respostas e evidências nunca vazam entre tenants |
| **RBAC** | Dois papéis: **Operador** (responde perguntas) e **CISO/Admin** (submete assessment final para seguradora) |
| **Submissão final** | Apenas CISO pode chamar `POST /api/v1/assessment/submit`; bloqueia edições posteriores até nova rodada |
| **Auditoria** | Registrar quem respondeu e quem submeteu; timestamps |

**Custom claims Firebase:** Incluir `role` (operator | ciso) além de `tenant_id`.

---

## 6. Agent Lineup

| Agent | Foco |
|-------|------|
| **Architect** | Modelar trilhas, fórmulas $C$, matriz cross-check |
| **Backend** | Question Bank, Evidence Vault, Cross-Check Engine, RBAC |
| **Database** | Schema trilhas, evidências com hash, estado submissão |
| **Security** | Isolamento tenant, hash SHA-256, RBAC |
| **Feature Developer** | Implementar trilhas, endpoints, integração scan |
| **Test Writer** | Testes cross-check, score C, RBAC |

---

## 7. Fases de Implementação

### Fase 1 — Trilhas de Maturidade
- Definir enum `track` e mapeamento Bronze/Silver/Gold
- Estender `assessment_questions.json` com `track`, `risk_weight`, `evidence_type`
- Endpoint `GET /api/v1/assessment?framework=ISO27001&track=bronze`

### Fase 2 — Question Bank Estendido
- Parser carrega novos atributos
- Validação: evidência obrigatória em Prata/Ouro quando resposta "Sim"

### Fase 3 — Evidence Vault com Hash
- Calcular SHA-256 no upload
- Persistir `sha256` junto à evidência
- Documentar path e hash em Firestore

### Fase 4 — Cross-Check Engine
- Matriz pergunta ↔ technical_finding (a partir de mapping_logic)
- Serviço: dado scan_id + tenant_id, retornar lista de controles com status Validado/Inconsistente
- Endpoint `GET /api/v1/assessment/cross-check?scan_id=...`

### Fase 5 — Score C Aditivo e Penalidades
- Implementar `ComputeComplianceScore` (aditivo)
- Aplicar multiplicador -10% por inconsistência
- Integrar ao score híbrido existente

### Fase 6 — RBAC e Submissão Final
- Middleware verificar `role` em custom claims
- `POST /api/v1/assessment/submit` apenas para role `ciso`
- Estado `submitted_at` no assessment do tenant

### Fase 7 — Validação e Documentação
- Testes E2E para fluxo completo
- Atualizar `architecture.md`, `glossary.md`, `data-flow.md`

---

## 8. Riscos e Dependências

| Risco | Mitigação |
|-------|-----------|
| Matriz cross-check incompleta | Versionar; começar com controles já mapeados no mapping_logic |
| RBAC depende de custom claims | Documentar setup Identity Platform; fallback "operator" se role ausente |
| Hash em arquivos grandes | Stream SHA-256 durante upload; não carregar arquivo inteiro em memória |

**Dependências:**
- `mapping_logic.json` como fonte de truth para control_id ↔ technical_finding
- Scan completado com findings persistidos para Cross-Check
- Identity Platform com custom claims `tenant_id`, `role`

---

## 9. Evidências e Follow-up

- [ ] Especificação das fórmulas $C$ em pseudocódigo
- [ ] Matriz cross-check (question_id ↔ technical_finding)
- [ ] Schema Firestore/Cloud SQL para evidências com hash
- [ ] Documentação RBAC e custom claims
- [ ] Testes unitários: ComputeComplianceScore, Cross-Check, RBAC
