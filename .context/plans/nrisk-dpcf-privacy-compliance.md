---
status: in_progress
generated: 2026-02-04
source: Data Privacy & Compliance Framework (DPCF)
parentPlan: nrisk-mvp
agents:
  - type: "security-auditor"
    role: "Implementar e auditar controles de privacidade e conformidade"
  - type: "backend-specialist"
    role: "Multi-tenancy, criptografia, KMS, logs de acesso"
  - type: "database-specialist"
    role: "Segregação de dados, políticas de retenção"
  - type: "documentation-writer"
    role: "RIPD, procedimentos, Política de Privacidade"
docs:
  - "security.md"
  - "architecture.md"
  - "data-flow.md"
phases:
  - id: "classificacao"
    name: "Classificação de Dados (Data Inventory)"
    prevc: "P"
  - id: "protecao"
    name: "Controles de Segurança de Dados (Data Protection)"
    prevc: "E"
  - id: "governanca-trust"
    name: "Governança do Trust Center (Access Control)"
    prevc: "E"
  - id: "conformidade"
    name: "Conformidade Legal (LGPD e ISO 27701)"
    prevc: "P"
  - id: "sla-incident"
    name: "SLA & Incident Response"
    prevc: "P"
---

# Data Privacy & Compliance Framework (DPCF)

> Framework de privacidade e conformidade do n.Risk: classificação de dados, controles CID, governança do Trust Center, LGPD/ISO 27701, SLA e incident response.

## Task Snapshot

- **Primary goal:** Estabelecer o framework de proteção de dados que garante conformidade LGPD, isolamento multi-tenant e governança do Trust Center.
- **Success signal:** Data inventory documentado; controles CID implementados; procedimentos LGPD operacionais; SLA e incident response formalizados.
- **Key references:**
  - [Plano MVP](./nrisk-mvp.md)
  - [Arquitetura TAD](./nrisk-arquitetura-tad.md)
  - [Security](../docs/security.md)

---

## 1. Classificação de Dados (Data Inventory)

Definição clara de quais dados a plataforma processa e seu nível de criticidade.

| Categoria | Descrição | Exemplos | Criticidade |
|-----------|-----------|----------|-------------|
| **Dados Públicos** | Informações coletadas via scan passivo; disponíveis publicamente | DNS (registros A, MX, TXT), certificados SSL (domínio, CA, validade), headers HTTP públicos | Baixa |
| **Dados Privados do Cliente** | Informações fornecidas ou geradas no contexto do assessment | Respostas dos questionários, evidências de auditoria (PDFs, políticas), relatórios de risco | Alta |
| **Dados Identificáveis (PII)** | Dados pessoais sob LGPD | Nomes e e-mails de gestores que respondem aos assessments, assinaturas digitais do NDA | Alta |

### Regras de Tratamento

- **PII:** Base legal, finalidade, retenção e direito ao esquecimento obrigatórios
- **Dados Privados do Cliente:** Isolamento por tenant; acesso apenas com autorização explícita
- **Dados Públicos:** Podem ser agregados para benchmarking; sem PII

---

## 2. Controles de Segurança de Dados (Data Protection)

Garantia da tríade **CID** (Confidencialidade, Integridade, Disponibilidade).

### 2.1 Segregação de Dados (Multi-tenancy)

| Requisito | Implementação Técnica |
|-----------|------------------------|
| **Cliente A ≠ Fornecedor B** | `tenant_id` (ou `organization_id`) em todas as tabelas; política de row-level security (RLS) |
| **Isolamento no banco** | Queries filtradas por tenant; impossível acessar dados de outro tenant sem bypass explícito |
| **Trust Center** | Autorização explícita (NDA aceito, convite validado) para liberar documentos entre tenants |

### 2.2 Criptografia em Repouso e Trânsito

| Camada | Controle |
|--------|----------|
| **Trânsito** | TLS 1.3 para todas as comunicações (API, frontend, integrações) |
| **Repouso** | AES-256 para documentos no Evidence Vault (Object Storage); criptografia nativa do banco quando aplicável |

### 2.3 Gestão de Chaves (KMS)

| Aspecto | Implementação |
|---------|---------------|
| **Provedor** | AWS KMS ou GCP Cloud KMS |
| **Rotação** | Rotação automática de chaves conforme política (ex: anual); chaves gerenciadas pelo cloud provider |
| **Proteção** | Chaves nunca expostas; operações de encrypt/decrypt via API do KMS |

---

## 3. Governança do Trust Center (Access Control)

Regras para a funcionalidade "Página de Confiança" do avaliado.

### 3.1 Fluxo de NDA

| Etapa | Descrição |
|-------|-----------|
| **Pré-requisito** | Visualização de documentos sensíveis exige aceite do termo de confidencialidade |
| **Registro** | Sistema registra: usuário, data/hora, versão do termo, IP (opcional) |
| **Imutabilidade** | Log de aceite armazenado de forma imutável (append-only ou blockchain interno) |
| **Revogação** | Novo termo pode invalidar acessos anteriores; histórico preservado |

### 3.2 Revogação de Acesso

| Cenário | Procedimento |
|---------|--------------|
| **Fim de negociação** | Fornecedor pode remover a visibilidade de um relatório para um cliente específico |
| **Implementação** | Flag ou tabela de permissões; revogação imediata; cliente deixa de ver o documento |
| **Auditoria** | Log de revogação (quem revogou, quando, para qual cliente) |

### 3.3 Logs de Acesso

| Evento | Registro |
|--------|----------|
| **Visualização** | Quem visualizou, qual evidência, quando |
| **Download** | Quem baixou, qual documento, quando |
| **Características** | Log imutável; retenção conforme política (ex: 5 anos para auditoria) |

---

## 4. Conformidade Legal (LGPD e ISO 27701)

### 4.1 Direito ao Esquecimento (Art. 18, VI, LGPD)

| Requisito | Implementação |
|-----------|---------------|
| **Solicitação** | Cliente pode solicitar exclusão de seus dados e scans históricos |
| **Escopo** | PII (nomes, e-mails), dados de conta; relatórios vinculados ao solicitante |
| **Procedimento** | Formulário ou canal oficial; prazo de resposta (ex: 15 dias); confirmação de exclusão |
| **Exceções** | Dados necessários para cumprimento legal, exercício de direitos, execução de contrato |

### 4.2 Retenção de Dados

| Tipo de Dado | Período de Retenção | Justificativa |
|--------------|---------------------|---------------|
| **Relatórios de Risco** | Definir (ex: 5 anos) | Renovações de apólices; requisitos regulatórios |
| **Evidências (Evidence Vault)** | Conforme contrato ou 5 anos | Auditoria; disputas |
| **Logs de acesso** | 5 anos | Auditoria; investigação de incidentes |
| **PII de gestores** | Enquanto conta ativa + período pós-rescisão (ex: 2 anos) | LGPD; base legal |

### 4.3 Relatório de Impacto à Proteção de Dados (RIPD)

| Objetivo | Descrição |
|----------|-----------|
| **Template RIPD** | Documento que demonstra que o risco à privacidade foi mapeado |
| **Conteúdo** | Descrição do tratamento, finalidades, riscos, medidas de mitigação, bases legais |
| **Momento** | Para tratamentos de alto risco (Art. 5, XVII, LGPD); revisão periódica |

---

## 5. Service Level Agreement (SLA) & Incident Response

### 5.1 Disponibilidade

| Métrica | Meta |
|---------|------|
| **Uptime do Dashboard** | 99.9% (exemplo) |
| **Janela de manutenção** | Comunicada com antecedência; não conta como downtime |
| **Exclusões** | Casos de força maior; ataques DDoS de grande escala |

### 5.2 Tempo de Notificação (Data Breach)

| Evento | Compromisso |
|--------|-------------|
| **Brecha no n.Risk** | Notificação aos clientes afetados e à ANPD em prazo definido (ex: 72h após confirmação) |
| **Procedimento** | Processo de incident response documentado; canal de comunicação; template de notificação |
| **Registro** | Log do incidente; medidas corretivas; evidências de notificação |

### 5.3 Incident Response

| Fase | Ações |
|------|-------|
| **Detecção** | Monitoramento; alertas; triagem |
| **Contenção** | Isolar sistemas afetados; bloquear vetores |
| **Erradicação** | Corrigir vulnerabilidade; remover acesso indevido |
| **Recuperação** | Restaurar serviços; validar integridade |
| **Comunicação** | Notificar clientes, ANPD; relatório pós-incidente |

---

## 6. Mapeamento com Outros Planos

| Plano | Relação |
|-------|---------|
| [nrisk-arquitetura-tad](./nrisk-arquitetura-tad.md) | TAD define isolamento multi-tenant, criptografia, audit trail |
| [nrisk-roadmap-implementacao](./nrisk-roadmap-implementacao.md) | Certificação de dados e soberania mencionadas no QA/Sec |
| [nrisk-mvp](./nrisk-mvp.md) | LGPD e Evidence Vault como NFRs |

---

## 7. Evidence & Follow-up

- [ ] Data Inventory completo (tabela de dados, fluxos, responsáveis)
- [ ] Documento de arquitetura multi-tenant (RLS, políticas)
- [ ] Política de retenção de dados (aprovada)
- [ ] Template RIPD
- [ ] Procedimento de Direito ao Esquecimento
- [ ] Procedimento de Incident Response (incl. notificação ANPD)
- [ ] SLA formal (disponibilidade, tempo de notificação)
- [ ] Política de Privacidade (site/app)
