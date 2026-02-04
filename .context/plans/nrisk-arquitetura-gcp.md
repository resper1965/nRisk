---
status: in_progress
generated: 2026-02-04
source: Arquitetura Sugerida no GCP
parentPlan: nrisk-arquitetura-tad
agents:
  - type: "architect-specialist"
    role: "Definir componentes GCP e integrações"
  - type: "devops-specialist"
    role: "Provisionar Cloud Run, Pub/Sub, Cloud SQL, infra como código"
  - type: "security-auditor"
    role: "Identity Platform, Secret Manager, Cloud Armor, CMEK"
  - type: "backend-specialist"
    role: "Integrar workers com Pub/Sub, Cloud Tasks"
docs:
  - "architecture.md"
  - "data-flow.md"
  - "security.md"
phases:
  - id: "workers"
    name: "Camada de Execução (Cloud Run)"
    prevc: "E"
  - id: "mensageria"
    name: "Orquestração e Mensageria"
    prevc: "E"
  - id: "persistencia"
    name: "Persistência de Dados"
    prevc: "E"
  - id: "seguranca"
    name: "Segurança e Identidade"
    prevc: "E"
---

# Arquitetura Sugerida no GCP

> Especificação de infraestrutura GCP para o n.Risk: Cloud Run (workers), Pub/Sub e Cloud Tasks, Cloud SQL, Firestore, Cloud Storage (Evidence Vault), Identity Platform, Secret Manager e Cloud Armor.

## Task Snapshot

- **Primary goal:** Implementar a arquitetura do n.Risk na GCP com workers efêmeros, mensageria assíncrona, persistência híbrida e camada de segurança DevSecOps.
- **Success signal:** Workers consumindo Pub/Sub; dados persistindo em SQL/Firestore/Storage; autenticação MFA; WAF ativo.
- **Key references:**
  - [Arquitetura TAD](./nrisk-arquitetura-tad.md)
  - [DPCF (Privacy)](./nrisk-dpcf-privacy-compliance.md)
  - [Architecture](../docs/architecture.md)

---

## Visualização da Stack no GCP

| Componente | Serviço GCP | Papel no n.Risk |
|------------|-------------|-----------------|
| **Frontend** | Firebase Hosting | Hosting do Dashboard em Next.js |
| **API Backend** | Cloud Run (Go) | Lógica de negócio e gestão de questionários |
| **Scan Engine** | Cloud Run (Jobs) | Execução das ferramentas de varredura |
| **Fila de Tarefas** | Pub/Sub | Desacoplamento entre pedido de scan e execução |
| **Banco Relacional** | Cloud SQL | Gestão de Compliance e Frameworks (ISO) |
| **Logs & Observabilidade** | Cloud Logging / Error Reporting | Monitoramento de falhas nos scans |

---

## 1. Camada de Execução (The Workers)

### Cloud Run (Services + Jobs) — Escolha para o Motor de Scan

- **Cloud Run Services:** API Backend em Go (lógica de negócio, questionários).
- **Cloud Run Jobs:** Scan Engine — execução batch das ferramentas de varredura; cada job roda até conclusão e encerra.

| Aspecto | Benefício |
|---------|-----------|
| **Modelo de custo** | Paga apenas pelos segundos em que o scan está rodando |
| **Escalabilidade** | Escala de zero a mil instâncias conforme demanda |
| **Cenário** | Seguradora sobe lista grande de clientes → Cloud Run escala automaticamente |
| **Stateless/Efêmero** | Cada container encapsula ferramentas (Go, Nuclei, Nmap); ao terminar, o container encerra |

### Execução

| Componente | Descrição |
|------------|-----------|
| **Container** | Imagem com ferramentas de scan (Go, Nuclei, Nmap) |
| **Ciclo** | Container sobe → executa scan → grava resultado → termina |
| **Configuração** | CPU/memória ajustáveis por tipo de scan; timeout configurável |

---

## 2. Orquestração e Mensageria

### 2.1 Cloud Pub/Sub

| Função | Descrição |
|--------|-----------|
| **Papel** | Sistema nervoso da arquitetura; desacoplamento entre API e workers |
| **Fluxo** | API publica mensagem "Executar Scan para domínio X" → Cloud Run consome a mensagem |
| **Topicos** | Ex.: `scan-requests`, `scan-results` (para notificações/processamento downstream) |

### 2.2 Cloud Tasks

| Função | Descrição |
|--------|-----------|
| **Uso** | Rate limiting e controle de cadência |
| **Cenário** | Evitar sobrecarregar o site do cliente; distribuir requisições ao longo do tempo |
| **Integração** | Cloud Tasks enfileira tarefas; workers ou Cloud Run processam respeitando o rate |

---

## 3. Persistência de Dados

### 3.1 Cloud SQL (PostgreSQL)

| Uso | Dados |
|-----|-------|
| **Core do sistema** | Dados da ISO 27001, usuários, hierarquia de fornecedores |
| **Modelo** | Relacional; schema estruturado |
| **Requisitos** | Alta disponibilidade; backups automáticos |

### 3.2 Firestore (NoSQL)

| Uso | Dados |
|-----|-------|
| **Resultados de scans** | Outputs brutos das ferramentas; JSON variável por cliente |
| **Vantagem** | Flexibilidade de schema; suporta documentos com estrutura diferente |
| **Consultas** | Índices para busca por domínio, data, tenant |

### 3.3 Cloud Storage (Evidence Vault)

| Aspecto | Especificação |
|---------|---------------|
| **Função** | Evidence Vault do Trust Center — documentos e políticas submetidos por fornecedores |
| **Criptografia** | **CMEK (Customer-Managed Encryption Keys)** — nem o Google tem acesso aos documentos |
| **Segregação** | Buckets ou prefixos por tenant; políticas de acesso por organização |
| **Integração** | Signed URLs para download controlado; logs de acesso via Cloud Audit Logs |

---

## 4. Segurança e Identidade (O Diferencial DevSecOps)

### 4.1 Identity Platform

| Aspecto | Descrição |
|---------|-----------|
| **Função** | Autenticação de clientes e seguradoras |
| **MFA** | MFA obrigatório (TOTP, SMS ou authenticator app) |
| **Integração** | Frontend e API validam tokens; roles e permissões por tenant |

### 4.2 Secret Manager

| Aspecto | Descrição |
|---------|-----------|
| **Uso** | Armazenar chaves de API (Shodan, Censys, HaveIBeenPwned, etc.) |
| **Acesso** | Aplicações acessam via IAM; chaves nunca em código ou variáveis de ambiente em texto plano |
| **Rotação** | Suporte a versões; rotação sem redeploy quando possível |

### 4.3 Cloud Armor

| Aspecto | Descrição |
|---------|-----------|
| **Função** | WAF (Web Application Firewall) para o Dashboard |
| **Proteção** | Bloqueia ataques comuns (SQLi, XSS, DDoS em camada 7) |
| **Objetivo** | Evitar que atacantes comprometam o n.Risk para acessar dados de vulnerabilidades de terceiros |
| **Configuração** | Regras customizadas; rate limiting; allow/deny por IP ou geolocalização |

---

## 5. Diagrama de Componentes

```
                    ┌─────────────────────────────────────┐
                    │           API / BFF                  │
                    └─────────────────┬───────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │  Cloud Pub/Sub  │    │   Cloud SQL     │    │    Firestore    │
    │ (scan-requests) │    │  (PostgreSQL)   │    │ (scan results)  │
    └────────┬────────┘    └─────────────────┘    └─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │   Cloud Run     │ ◄── Secret Manager (Shodan, Censys, etc.)
    │  (Scan Workers) │
    └────────┬────────┘
             │
             ├──────────────────────────────► Firestore (resultados)
             │
             └──────────────────────────────► Cloud Tasks (rate limiting)
```

---

## 6. Mapeamento TAD → GCP

| Componente TAD | Serviço GCP |
|----------------|-------------|
| Frontend (React/Next.js) | **Firebase Hosting** |
| API / BFF | **Cloud Run (Go)** |
| Workers efêmeros (K8s/Fargate) | **Cloud Run (Jobs)** |
| Fila de mensagens (RabbitMQ/Pub/Sub) | **Cloud Pub/Sub** |
| Rate limiting | **Cloud Tasks** |
| PostgreSQL | **Cloud SQL** |
| NoSQL (MongoDB/ES) | **Firestore** |
| Object Storage (S3) | **Cloud Storage** |
| KMS (criptografia) | **CMEK** no Cloud Storage |
| Autenticação MFA | **Identity Platform** |
| Secrets | **Secret Manager** |
| WAF | **Cloud Armor** |
| Logs & Observabilidade | **Cloud Logging / Error Reporting** |

---

## 7. Riscos e Considerações

| Risco | Mitigação |
|-------|-----------|
| Cold start do Cloud Run | Min instances > 0 para caminho crítico; ou aceitar latência inicial |
| Custo de Firestore em escala | Avaliar BigQuery para analytics; Firestore para acesso operacional |
| CMEK: perda de chave | Backup e procedimento de recuperação documentados |
| Cloud Armor: falsos positivos | Regras em modo monitor antes de enforce; tuning de regras |

---

## 8. Evidence & Follow-up

- [ ] Diagrama de arquitetura GCP (infra como código — Terraform/Pulumi)
- [ ] Políticas IAM por serviço (princípio do menor privilégio)
- [ ] Configuração CMEK e procedimento de rotação
- [ ] Checklist de segurança (Identity Platform, Secret Manager, Cloud Armor)
- [ ] Estimativa de custos por fase (Cloud Run, Pub/Sub, Storage, etc.)
