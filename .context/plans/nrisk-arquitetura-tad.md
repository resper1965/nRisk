---
status: in_progress
generated: 2026-02-04
source: Arquitetura de Solução e Design de Engenharia (TAD)
parentPlan: nrisk-mvp
agents:
  - type: "architect-specialist"
    role: "Definir boundaries de microserviços, padrões event-driven"
  - type: "backend-specialist"
    role: "BFF, API Gateway, orquestração de workers"
  - type: "frontend-specialist"
    role: "Dashboard React/Next.js, visualização de dados"
  - type: "devops-specialist"
    role: "Kubernetes/Fargate/Cloud Run, filas, containers efêmeros"
  - type: "database-specialist"
    role: "Schema PostgreSQL, NoSQL, Object Storage"
  - type: "security-auditor"
    role: "Isolamento multi-tenant, criptografia, audit trail"
docs:
  - "architecture.md"
  - "data-flow.md"
  - "security.md"
phases:
  - id: "visao-arquitetural"
    name: "Visão Arquitetural (High-Level Design)"
    prevc: "P"
  - id: "motor-scan"
    name: "Motor de Escaneamento (Scan Engine)"
    prevc: "E"
  - id: "persistencia"
    name: "Camada de Dados e Persistência"
    prevc: "P"
  - id: "integracoes"
    name: "Integrações de Terceiros"
    prevc: "E"
  - id: "security-design"
    name: "Design de Segurança (Security by Design)"
    prevc: "P"
  - id: "pipeline"
    name: "Fluxo de Processamento (Pipeline)"
    prevc: "E"
---

# Arquitetura de Solução e Design de Engenharia (TAD)

> Arquitetura de microserviços orientada a eventos para o n.Risk: scan efêmero, persistência híbrida, integrações low-touch e security by design.

## Task Snapshot

- **Primary goal:** Implementar a arquitetura técnica que suporta scan passivo, assessments, Trust Center e GRC com escalabilidade e segurança.
- **Success signal:** Pipeline end-to-end funcionando; workers efêmeros; isolamento de tenants validado.
- **Key references:**
  - [Plano MVP](./nrisk-mvp.md)
  - [Metodologia de Scoring](./nrisk-scoring-metodologia.md)
  - [Architecture](../docs/architecture.md)
  - [Data Flow](../docs/data-flow.md)
  - [Security](../docs/security.md)

---

## 1. Visão Arquitetural (High-Level Design)

**Padrão:** Microserviços Orientados a Eventos — motor de scan independente da interface de usuário.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│              React / Next.js (Dashboard, visualização de dados)               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY                                       │
│     Autenticação (MFA obrigatório) • Rate limiting • Ponto único de entrada   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BFF (Backend for Frontend)                               │
│           Node.js ou Go • Agrega scans + questionários                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌───────────┐     ┌───────────┐     ┌───────────┐
            │  Scans    │     │Questionários│    │   Score   │
            │  Service  │     │   Service   │    │   Engine  │
            └───────────┘     └───────────┘     └───────────┘
```

| Componente | Stack | Responsabilidade |
|------------|-------|------------------|
| **Frontend** | React ou Next.js | Dashboard, performance, visualização de dados |
| **API Gateway** | Kong / AWS API GW / Traefik | Autenticação MFA, rate limiting, roteamento |
| **BFF** | Node.js ou Go | Agregar dados de scans e questionários para o frontend |

---

## 2. Motor de Escaneamento (The Scan Engine)

**Princípios:** Stateless, Efêmero — containers que nascem, executam e terminam.

### 2.1 Worker Nodes

| Aspecto | Especificação |
|---------|---------------|
| **Runtime** | Containers Docker |
| **Orquestração** | Kubernetes ou AWS Fargate / GCP Cloud Run |
| **Ciclo de vida** | Nascimento → Execução (DNS, portas, headers) → Término |
| **Escalabilidade** | Horizontal via fila de mensagens |

### 2.2 Orquestração via Fila

| Componente | Tecnologia | Função |
|------------|------------|--------|
| **Message Queue** | RabbitMQ ou Google Pub/Sub | Filas de tarefas de scan |
| **Fluxo** | Evento "scan solicitado" → Worker livre consome → Executa reconhecimento |
| **Desacoplamento** | Seguradora/Cliente não bloqueia; worker processa assincronamente |

---

## 3. Camada de Dados e Persistência

**Estrutura híbrida** — escolha de store por tipo de dado (GRC, evidências, outputs brutos).

| Store | Uso | Exemplos |
|-------|-----|----------|
| **PostgreSQL** (Relational) | Usuários, empresas, logs de auditoria, estrutura de questionários (ISO 27001) | `users`, `companies`, `audit_logs`, `questionnaires`, `controls` |
| **MongoDB / Elasticsearch** (NoSQL) | Outputs brutos dos scans (JSONs extensos de ferramentas de rede) | Resultados de port scan, DNS, headers, Threat Intel |
| **Object Storage** (S3 / GCS) | Evidence Vault — documentos e políticas submetidos por fornecedores | PDFs, imagens; criptografia via KMS (Key Management Service) |

### Regras de Persistência

- **Criptografia:** Evidence Vault com criptografia em repouso (KMS)
- **Retenção:** Políticas conforme LGPD e requisitos de auditoria
- **Particionamento:** Por tenant (empresa/domínio) para isolamento

---

## 4. Integrações de Terceiros (Data Ingestion)

**Objetivo:** Abordagem **low-touch** (passiva) — ingestão via APIs, sem agentes nos ambientes avaliados.

| Categoria | APIs / Provedores | Uso no n.Risk |
|-----------|-------------------|---------------|
| **Reconhecimento** | Shodan, Censys, BinaryEdge | Footprint (IPs, subdomínios, serviços expostos) |
| **Vulnerabilidades** | NVD (National Vulnerability Database) | Enriquecimento de CVEs e exploits públicos |
| **Dark Web / Threat Intel** | HaveIBeenPwned, provedores de Threat Intel | Vazamentos de credenciais, exposição de dados |

### Conectores

- **Design:** Conectores assíncronos; fallback e tratamento de indisponibilidade
- **Rate limits:** Respeitar limites das APIs externas; filas e backoff

---

## 5. Design de Segurança (Security by Design)

### 5.1 Isolamento de Tenants

| Requisito | Implementação |
|-----------|---------------|
| **Multi-tenancy** | Dados do "Fornecedor A" nunca visíveis para "Cliente B" sem autorização explícita |
| **Trust Center** | Autorização explícita (NDA, convite) para liberar documentos sensíveis |
| **Modelo de dados** | Tenant ID em todas as entidades; políticas de acesso por tenant |

### 5.2 Criptografia

| Camada | Especificação |
|--------|---------------|
| **Em repouso** | AES-256 para Evidence Vault (via KMS) |
| **Em trânsito** | TLS 1.3 (NFR do PRD) |
| **Field-level** | Criptografia de campos sensíveis em questionários (dados pessoais, credenciais declaradas) |

### 5.3 Audit Trail

| Evento | Registro |
|--------|----------|
| Alterações de score | Log imutável (quem, quando, valor anterior/novo) |
| Acessos ao Evidence Vault | Log de visualização/download por documento |
| Ações críticas | Autenticação, delegação de perguntas, aprovações NDA |

---

## 6. Fluxo de Processamento (Pipeline)

```
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │  INGESTÃO   │ ──▶ │ ENRIQUECIMENTO│ ──▶ │  EXECUÇÃO   │ ──▶ │ NORMALIZAÇÃO │ ──▶ │ NOTIFICAÇÃO  │
  │ Domínio/CNPJ│     │ APIs externas │     │   Workers   │     │ Motor Score │     │ Webhook/E-mail│
  └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

| Etapa | Descrição |
|-------|-----------|
| **1. Ingestão** | Recebe Domínio/CNPJ; valida; cria job na fila |
| **2. Enriquecimento** | Busca ativos relacionados via Shodan/Censys/BinaryEdge |
| **3. Execução** | Workers checam portas, certificados, headers, Threat Intel |
| **4. Normalização** | Motor de cálculo (Metodologia de Scoring) processa achados; calcula $T$, $C$, $S_f$ |
| **5. Notificação** | Alerta cliente/seguradora via Webhook ou E-mail |

### Sla

- **Scan inicial:** &lt; 5 minutos (NFR do PRD)
- **Job score diário (FR2):** Atualização automática a cada 24h

---

## 7. Mapeamento para o MVP

| Componente TAD | Fase MVP |
|----------------|----------|
| API Gateway + BFF | Mês 1 |
| Workers + Fila | Mês 1 |
| PostgreSQL (schema base) | Mês 1–2 |
| NoSQL (outputs de scan) | Mês 1 |
| Object Storage + KMS | Mês 2 (Evidence Vault) |
| Integrações Shodan/Censys/NVD/Threat Intel | Mês 1 |
| Isolamento tenants + Audit Trail | Mês 2–3 |
| Pipeline completo | Mês 1–3 |

---

## 8. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Cold start de workers (latência) | Pool mínimo de workers; Fargate/Cloud Run com scale-to-zero configurável |
| APIs externas instáveis | Circuit breaker; cache; fallback degradado |
| Custos de Object Storage | Política de lifecycle; compressão; retenção definida |
| Vazamento entre tenants | Revisão de queries; testes de isolamento; RBAC rigoroso |

---

## 9. Evidence & Follow-up

- [ ] Diagrama C4 (Context, Container, Component)
- [ ] Contratos de API (OpenAPI) do BFF
- [ ] Schema de mensagens da fila (eventos de scan)
- [ ] Diagrama ER (PostgreSQL) e modelos NoSQL
- [ ] Política de isolamento multi-tenant (documento)
- [ ] Especificação de audit trail (campos, retenção)
