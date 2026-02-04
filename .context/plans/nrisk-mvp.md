---
status: in_progress
generated: 2026-02-04
source: PRD n.Risk – Plataforma de Cyber Risk & Assessment
agents:
  - type: "architect-specialist"
    role: "Desenhar arquitetura de microserviços, scanners efêmeros, scoring engine"
  - type: "backend-specialist"
    role: "API integradora, motor de discovery, motor de questionários"
  - type: "security-auditor"
    role: "Revisão de conformidade LGPD, criptografia AES-256, TLS 1.3"
  - type: "frontend-specialist"
    role: "Painel de postura, Trust Center, interfaces de assessment"
  - type: "database-specialist"
    role: "Schema para assessments, Evidence Vault, mapeamento ISO 27001"
  - type: "devops-specialist"
    role: "Containers efêmeros para scanners, CI/CD"
  - type: "test-writer"
    role: "Cobertura para scoring, lógica de inconsistência, NFRs"
  - type: "documentation-writer"
    role: "Relatório de Risco PDF, Trust Center público"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "development-workflow.md"
  - "testing-strategy.md"
  - "glossary.md"
  - "data-flow.md"
  - "security.md"
  - "tooling.md"
phases:
  - id: "mes-1"
    name: "Core Discovery e Scan Passivo"
    prevc: "E"
  - id: "mes-2"
    name: "Motor de Questionários e Painel de Resposta"
    prevc: "E"
  - id: "mes-3"
    name: "Scoring e Trust Center"
    prevc: "E"
  - id: "mes-4"
    name: "Beta Test Corretora/Seguradora"
    prevc: "V"
---

# n.Risk – Plataforma de Cyber Risk & Assessment

> Plataforma de avaliação de postura cibernética voltada para Cyber Insurance e gestão de riscos de terceiros. Foco em observabilidade passiva externa e conformidade declaratória.

## Task Snapshot

- **Primary goal:** Entregar MVP funcional em 4 meses com Discovery/Scan passivo, Assessments, Painel de Postura, Trust Center e GRC ISO 27001.
- **Success signal:** Beta test com corretora/seguradora parceira validando subscrição, assessment de terceiros e Trust Center.
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Plans Index](./README.md)

---

## 1. Visão Geral e Objetivos Estratégicos

| Stakeholder | Objetivo |
|-------------|----------|
| **Seguradoras** | Automatizar subscrição e monitorar risco das apólices em tempo real |
| **Clientes (Empresas)** | Gerir segurança da cadeia de suprimentos e centralizar evidências de conformidade |
| **Fornecedores (Avaliados)** | Demonstrar transparência via Trust Center para acelerar vendas |

---

## 2. Personas e Casos de Uso

| Persona | Necessidade | Caso de Uso n.Risk |
|---------|-------------|--------------------|
| **Subscritor (Seguradora)** | Precificar risco da apólice | Analisa score final antes de emitir proposta comercial |
| **Gestor de Terceiros (GRC)** | Avaliar segurança de fornecedor | Envia convite de assessment e monitora Trust Center do parceiro |
| **CISO/Time TI (Avaliado)** | Corrigir falhas e provar maturidade | Responde questionários e anexa evidências (ISO 27001) no Painel de Postura |

---

## 3. Funcionalidades MVP (Escopo)

### 3.1 Motor de Discovery e Scanning Passivo

| Componente | Descrição |
|------------|-----------|
| **Footprint Identificator** | A partir de domínio: IPs, subdomínios, ASN |
| **Non-Intrusive Scanner** | Headers HTTP, versões de serviços expostos (sem exploit), DNS (SPF/DMARC), validade SSL |
| **Threat Intel Lite** | Consulta bases públicas e Dark Web por vazamentos de credenciais do domínio |

### 3.2 Módulo de Assessments e Questionários

| Componente | Descrição |
|------------|-----------|
| **Framework Library** | Questionários ISO 27001, NIST CSF, LGPD |
| **Trilhas** | Essencial, Intermediário, Avançado |
| **Evidence Vault** | Upload de PDF/imagens atrelados a respostas |
| **Lógica de Inconsistência** | Alerta quando resposta contradiz achado do scan (ex: MFA declarado vs scan sem proteção) |

### 3.3 Painel de Postura e Trust Center

| Componente | Descrição |
|------------|-----------|
| **Score Dinâmico** | Nota 0–1000 com peso de vulnerabilidades e respostas |
| **Trust Center Público** | URL com selos de segurança e documentos públicos |
| **NDA Workflow** | Assinatura digital para liberar documentos sensíveis |

### 3.4 Módulo GRC

- Mapeamento vulnerabilidades técnicas ↔ controles Anexo A ISO 27001

---

## 4. Requisitos Funcionais (FR)

| ID | Requisito |
|----|-----------|
| **FR1** | Cadastro de empresas apenas via Domínio/CNPJ |
| **FR2** | Score técnico atualizado automaticamente a cada 24h |
| **FR3** | Delegação de perguntas do questionário para diferentes e-mails |
| **FR4** | PDF "Relatório de Risco" para seguradora com resumo executivo |

---

## 5. Requisitos Não Funcionais (NFR)

| Área | Requisito |
|------|-----------|
| **Segurança** | Criptografia AES-256 em repouso, TLS 1.3 em trânsito |
| **Escalabilidade** | Microserviços; scanners em containers efêmeros |
| **Privacidade** | LGPD rigorosa para armazenamento de evidências |
| **Performance** | Scan inicial de novo domínio &lt; 5 minutos |

---

## 6. Algoritmo de Scoring

$$S_f = (T \times 0.6) + (C \times 0.4)$$

- **T** = Score Técnico
- **C** = Score de Compliance (questionários)

**Penalidade crítica:** Se houver falha de severidade "Crítica" (ex: porta de banco aberta), $S_f$ não pode ultrapassar 500 pontos.

---

## 7. Roadmap e Fases de Trabalho

### Mês 1 — Core Discovery e Scan Passivo

**Entregas:**
- API integradora para scanners
- Footprint Identificator (domínio → IPs, subdomínios, ASN)
- Non-Intrusive Scanner (headers, versões, DNS, SSL)
- Threat Intel Lite (bases públicas + Dark Web)
- Containers efêmeros para execução de scans
- NFR: scan inicial &lt; 5 min

**Steps:**
1. Definir contratos da API de scan (entrada: domínio/CNPJ; saída: achados estruturados)
2. Implementar Footprint Identificator
3. Implementar Non-Intrusive Scanner
4. Integrar Threat Intel Lite
5. Pipeline de orquestração de scanners em containers

---

### Mês 2 — Motor de Questionários e Painel de Resposta

**Entregas:**
- Framework Library (ISO 27001, NIST CSF, LGPD)
- Trilhas Essencial, Intermediário, Avançado
- Evidence Vault (upload PDF/imagens)
- Lógica de Inconsistência (resposta vs achado de scan)
- Painel de resposta do cliente
- FR3: delegação de perguntas por e-mail

**Steps:**
1. Modelar questionários e relacionamento com controles ISO
2. Implementar Evidence Vault com conformidade LGPD
3. Implementar lógica de inconsistência
4. UI de preenchimento e delegação

---

### Mês 3 — Algoritmo de Scoring e Trust Center

**Entregas:**
- Motor de scoring (Fórmula $S_f$, penalidade crítica)
- FR2: atualização automática de score técnico a cada 24h
- Painel de Postura com score dinâmico
- Trust Center público (URL, selos, documentos)
- NDA Workflow (assinatura digital)
- FR4: PDF Relatório de Risco
- Módulo GRC: mapeamento vulns ↔ Anexo A ISO 27001

**Steps:**
1. Implementar algoritmo de scoring com pesos configuráveis
2. Job de atualização diária do score técnico
3. Trust Center público e NDA Workflow
4. Geração de PDF Relatório de Risco
5. Mapeamento técnico para controles ISO

---

### Mês 4 — Beta Test Corretora/Seguradora

**Entregas:**
- Beta com corretora/seguradora parceira
- Validação de subscrição, assessment de terceiros, Trust Center
- Ajustes de UX e relatórios conforme feedback

**Steps:**
1. Onboarding da corretora/seguradora parceira
2. Cenários de teste end-to-end (subscritor, GRC, CISO)
3. Coleta de feedback e priorização de ajustes
4. Documentação de handoff e operação

---

## 8. Risk Assessment

### Identified Risks

| Risk | Probabilidade | Impacto | Mitigação |
|------|---------------|---------|-----------|
| Integração Dark Web instável | Média | Alto | Fallback para bases públicas; tratamento gracioso de falhas |
| LGPD em Evidence Vault | Média | Alto | Revisão jurídica; criptografia e retenção mínima |
| Scan &gt; 5 min em domínios grandes | Média | Médio | Paralelização; otimização de queries; timeout configurável |

### Dependencies

- **Externas:** APIs de Threat Intel, serviços de validação SSL/DNS, provedor de assinatura digital
- **Técnicas:** Infra para containers efêmeros, armazenamento criptografado

### Assumptions

- Domínio/CNPJ são suficientes para identificação inicial de empresas
- Corretora/seguradora parceira disponível para beta no Mês 4
- Frameworks (ISO 27001, NIST CSF, LGPD) podem ser modelados como questionários estruturados

---

## 9. Resource Estimation

| Fase | Effort | Calendar | Team |
|------|--------|----------|------|
| Mês 1 | ~15 person-days | 4 semanas | 2 devs |
| Mês 2 | ~15 person-days | 4 semanas | 2 devs |
| Mês 3 | ~15 person-days | 4 semanas | 2 devs |
| Mês 4 | ~8 person-days | 4 semanas | 1–2 devs + parceiro |
| **Total** | **~53 person-days** | **16 semanas** | **2 devs** |

### Required Skills

- Backend (APIs, workers, jobs)
- Segurança e conformidade (LGPD, criptografia)
- Infra (containers, escalabilidade)
- Frontend (painéis, Trust Center)

---

## 10. Rollback Plan

### Triggers

- Falha crítica em scan causando indisponibilidade
- Violação de privacidade em Evidence Vault
- Score incorreto afetando decisões de subscrição

### Procedures

- **Mês 1–2:** Revert de deploys; desabilitar scanners via feature flag
- **Mês 3–4:** Rollback de Trust Center/PDF; manter dados; correção em hotfix

---

## 11. Evidence & Follow-up

- [ ] Documentar contratos de API (OpenAPI)
- [ ] Evidências de conformidade LGPD para Evidence Vault
- [ ] Relatório de beta com corretora/seguradora
- [ ] Métricas de performance (tempo de scan, uptime)
