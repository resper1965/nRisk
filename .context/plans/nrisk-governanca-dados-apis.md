---
status: in_progress
generated: 2026-02-04
source: Manual de Governança de Dados e APIs
parentPlan: nrisk-mvp
agents:
  - type: "backend-specialist"
    role: "API-First, contratos OpenAPI, webhooks"
  - type: "database-specialist"
    role: "Política de retenção, lifecycle, cold storage"
  - type: "security-auditor"
    role: "OAuth2, gestão de consentimento, log de transparência"
docs:
  - "architecture.md"
  - "data-flow.md"
  - "security.md"
phases:
  - id: "api-strategy"
    name: "Estratégia de API (Connectivity Layer)"
    prevc: "E"
  - id: "retencao"
    name: "Política de Retenção e Ciclo de Vida"
    prevc: "P"
  - id: "consentimento"
    name: "Gestão de Consentimento (Privacy by Design)"
    prevc: "E"
---

# Manual de Governança de Dados e APIs

> API-First, política de retenção, gestão de consentimento e visão final do Framework Completo de Planejamento do n.Risk.

## Task Snapshot

- **Primary goal:** Estabelecer a governança de APIs e dados que permite o n.Risk escalar e integrar-se com seguradoras, clientes e ecossistema externo.
- **Success signal:** APIs documentadas e operacionais; retenção automatizada; fluxo OAuth2 e log de transparência ativos.
- **Key references:**
  - [DPCF](./nrisk-dpcf-privacy-compliance.md)
  - [Arquitetura GCP](./nrisk-arquitetura-gcp.md)
  - [Matriz GRC](./nrisk-matriz-rastreabilidade-grc.md)

---

## 1. Estratégia de API (Connectivity Layer)

**Princípio:** O n.Risk é **API-First**. Tudo o que o dashboard faz, a API também pode fazer.

### 1.1 API de Subscrição (Para Seguradoras)

| Aspecto | Descrição |
|---------|-----------|
| **Endpoint** | Ex.: `POST /api/v1/subscription/assess` ou `GET /api/v1/subscription/score/{domain\|cnpj}` |
| **Input** | CNPJ ou Domínio |
| **Output** | Score atualizado, Top 3 riscos, categoria (A–F) em JSON |
| **Uso** | Integração com sistemas de subscrição da seguradora; análise de propostas em tempo real |

**Exemplo de resposta:**
```json
{
  "domain": "empresa.com.br",
  "cnpj": "00.000.000/0001-00",
  "score": 720,
  "category": "B",
  "top3_risks": [...],
  "last_scan_at": "2026-02-01T10:00:00Z"
}
```

### 1.2 API de Trust Center (Para Clientes / Fornecedores)

| Aspecto | Descrição |
|---------|-----------|
| **Endpoint** | Ex.: `GET /api/v1/trust-center/{org_id}/badge` ou `/public/{org_slug}` |
| **Uso** | Cliente integra sua nota do n.Risk em site próprio ou portal de investidores |
| **Formato** | JSON ou widget embarcável (iframe/badge) |
| **Controle** | Dados públicos vs. protegidos conforme permissões do Trust Center |

### 1.3 Webhooks de Alerta

| Aspecto | Descrição |
|---------|-----------|
| **Evento** | Score de um cliente cai abaixo de limite pré-definido durante a vigência da apólice |
| **Fluxo** | n.Risk detecta → envia POST para URL configurada pela seguradora |
| **Payload** | `domain`, `previous_score`, `current_score`, `threshold`, `top_risks` |
| **Segurança** | Assinatura HMAC ou token no header; retry com backoff |

---

## 2. Política de Retenção e Ciclo de Vida do Dado

Dado que vulnerabilidades mudam constantemente, os dados têm "data de validade".

### 2.1 Freshness Policy

| Regra | Descrição |
|-------|-----------|
| **Validade** | Scans técnicos expiram em **30 dias** |
| **Consulta obsoleta** | Se a seguradora consultar dado mais antigo, o sistema dispara **re-scan automático** (Cloud Run Jobs) |
| **Resposta** | Retorno imediato com dado em cache (se existir) + flag `stale: true`; ou resposta assíncrona após novo scan |

### 2.2 Histórico de Maturidade

| Regra | Descrição |
|-------|-----------|
| **Snapshots** | Armazenamento de snapshots **mensais** do score e conformidade |
| **Retenção** | Até **5 anos** |
| **Uso** | Análise de sinistros, renovações plurianuais, tendências de maturidade |

### 2.3 Cold Storage

| Regra | Descrição |
|-------|-----------|
| **Cenário** | Empresas que cancelaram o serviço |
| **Ação** | Dados movidos para **GCP Archive Storage** por **6 meses** |
| **Objetivo** | Compliance legal; possibilidade de recuperação em disputas |
| **Após 6 meses** | Exclusão definitiva (salvo exigência legal contrária) |

---

## 3. Gestão de Consentimento (Privacy by Design)

Garantir que a Seguradora A não veja dados do Fornecedor B sem permissão explícita.

### 3.1 Token de Autorização

| Aspecto | Descrição |
|---------|-----------|
| **Padrão** | OAuth2 (ou tokens de curta duração) |
| **Fluxo** | Fornecedor gera "chave de visualização" temporária para um auditor específico |
| **Escopo** | Acesso limitado a documentos/relatórios autorizados |
| **Validade** | Ex.: 7 ou 30 dias; revogável a qualquer momento |

### 3.2 Log de Transparência

| Aspecto | Descrição |
|---------|-----------|
| **Relatório** | "Quem consultou meu Trust Center nos últimos 90 dias" |
| **Disponível para** | Fornecedor (titular dos dados) |
| **Conteúdo** | Quem (organização/usuário), quando, qual documento/relatório |
| **Base legal** | LGPD Art. 18 (transparência); direito de acesso do titular |

---

## 4. Estrutura do Ecossistema n.Risk (Visão Final)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ECOSSISTEMA n.Risk                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEGURADORAS           │  FORNECEDORES (Avaliados)   │  CLIENTES GRC        │
│  - API Subscrição      │  - Trust Center             │  - API Trust Center  │
│  - Webhooks            │  - Token de Autorização     │  - Widget/Badge      │
│  - Dashboard           │  - Log de Transparência     │  - Convites          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CAMADA DE DADOS: Freshness 30d │ Snapshots 5 anos │ Cold Storage 6 meses  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Resumo da Jornada de Documentação — Framework Completo

| # | Documento | Escopo |
|---|-----------|--------|
| **1** | [PRD](./nrisk-mvp.md) | Escopo, visão, personas, FRs/NFRs, roadmap |
| **2** | [Metodologia de Scoring](./nrisk-scoring-metodologia.md) | Lógica matemática (T, C, F, $S_f$), taxonomia, matriz de validação |
| **3** | [TAD (Arquitetura)](./nrisk-arquitetura-tad.md) | Engenharia e infraestrutura (microserviços, workers, persistência) |
| **4** | [Arquitetura GCP](./nrisk-arquitetura-gcp.md) | Cloud Run, Pub/Sub, Cloud SQL, Firestore, Storage, Identity, Armor |
| **5** | [Roadmap](./nrisk-roadmap-implementacao.md) | Plano de entrega em 4 fases (18 semanas) |
| **6** | [DPCF](./nrisk-dpcf-privacy-compliance.md) | Privacidade e segurança (LGPD, CID, isolamento) |
| **7** | [Matriz de Rastreabilidade](./nrisk-matriz-rastreabilidade-grc.md) | Vínculo técnico ↔ ISO 27001, regras de inconsistência |
| **8** | **API & Governance** (este documento) | Como o produto escala e se integra |

---

## 6. Mapeamento com Outros Planos

| Plano | Relação |
|-------|---------|
| [DPCF](./nrisk-dpcf-privacy-compliance.md) | Retenção, consentimento e log de transparência complementam o framework de privacidade |
| [Arquitetura GCP](./nrisk-arquitetura-gcp.md) | Re-scan via Cloud Run; Archive Storage para cold storage |
| [Matriz GRC](./nrisk-matriz-rastreabilidade-grc.md) | API de Subscrição retorna Top 3 riscos da matriz |

---

## 7. Evidence & Follow-up

- [ ] Especificação OpenAPI das APIs (Subscrição, Trust Center, Webhooks)
- [ ] Política de retenção formalizada e aprovada
- [ ] Implementação de lifecycle no GCP (Archive Storage, exclusão)
- [ ] Fluxo OAuth2 / tokens de autorização documentado
- [ ] Especificação do relatório "Quem consultou meu Trust Center"
- [ ] Índice mestre de todos os documentos do framework
