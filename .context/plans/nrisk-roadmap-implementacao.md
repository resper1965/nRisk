---
status: in_progress
generated: 2026-02-04
source: Plano de Implementação e Roadmap de Produto
parentPlan: nrisk-mvp
agents:
  - type: "architect-specialist"
    role: "Validar escopo técnico do MVP e alinhar fases"
  - type: "devops-specialist"
    role: "Setup infra, pipeline CI/CD, SAST/DAST"
  - type: "security-auditor"
    role: "Pentest, certificação de dados, soberania"
  - type: "backend-specialist"
    role: "Scan Engine, motor de questionários, scoring"
  - type: "frontend-specialist"
    role: "Dashboard, Trust Center, PDF"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "development-workflow.md"
  - "testing-strategy.md"
  - "security.md"
phases:
  - id: "fase-1"
    name: "Fundação (4 semanas)"
    prevc: "E"
  - id: "fase-2"
    name: "Scan Engine (6 semanas)"
    prevc: "E"
  - id: "fase-3"
    name: "GRC & Score (4 semanas)"
    prevc: "E"
  - id: "fase-4"
    name: "Trust Center (4 semanas)"
    prevc: "E"
---

# Plano de Implementação e Roadmap de Produto

> Roadmap de 18 semanas: MVP focado em validar score via domínio, 4 fases de desenvolvimento, plano QA/Sec e estratégia GTM.

## Task Snapshot

- **Primary goal:** Entregar MVP que valide a tese "Conseguimos gerar um score de risco confiável apenas com o domínio do cliente?" e preparar o n.Risk para Go-to-Market.
- **Success signal:** Pipeline de dados funcional; Scan Engine operacional; Dashboard de Assessment com Score Composto; Trust Center e Selo; Pentest concluído; Early Adopters ativos.
- **Key references:**
  - [Plano MVP](./nrisk-mvp.md)
  - [Arquitetura TAD](./nrisk-arquitetura-tad.md)
  - [Metodologia de Scoring](./nrisk-scoring-metodologia.md)

---

## 1. Estratégia de MVP (Mínimo Produto Viável)

### Tese a Validar

> **"Conseguimos gerar um score de risco confiável apenas com o domínio do cliente?"**

### Escopo do MVP

| Componente | Descrição |
|------------|-----------|
| **Core Técnico** | Discovery de ativos + scan de portas/certificados (passivo, sem exploit) |
| **Core de Negócio** | Questionário simplificado de **15 perguntas** baseado nos controles críticos da ISO 27001 |
| **Entrega** | Geração de PDF manual **ou** dashboard básico com o **Score Composto** ($S_f$) |

### Critérios de Sucesso do MVP

- Score gerado a partir de domínio + questionário
- Tempo de scan inicial < 5 minutos
- PDF ou dashboard consumíveis por seguradora/corretora em cenário real

---

## 2. Cronograma de Desenvolvimento (Phased Approach)

### Visão Geral

| Fase | Duração | Foco Principal | Entregável Chave |
|------|---------|----------------|------------------|
| **Fase 1: Fundação** | 4 semanas | Infra, API Gateway, Banco | Pipeline de dados funcional |
| **Fase 2: Scan Engine** | 6 semanas | Integração Shodan/Censys, workers | Motor de coleta automática |
| **Fase 3: GRC & Score** | 4 semanas | Questionários, algoritmo de scoring | Dashboard de Assessment |
| **Fase 4: Trust Center** | 4 semanas | Página pública, NDA, Evidence Vault | Selo de Confiança e Vault |
| **Total** | **18 semanas** | | **MVP completo** |

---

### Fase 1 — Fundação (4 semanas)

| Área | Entregas |
|------|----------|
| **Infraestrutura** | Setup em nuvem (AWS/GCP), VPC, redes |
| **API Gateway** | Ponto único de entrada, autenticação, rate limiting |
| **Banco de Dados** | PostgreSQL (usuários, empresas, estrutura base) |
| **Pipeline de Dados** | Ingestão Domínio/CNPJ; fluxo básico até fila |
| **CI/CD** | Pipeline inicial (build, deploy) |

**Entregável chave:** Pipeline de dados funcional (domínio → fila → persistência).

---

### Fase 2 — Scan Engine (6 semanas)

| Área | Entregas |
|------|----------|
| **Integrações** | APIs Shodan, Censys (reconhecimento, portas, certificados) |
| **Workers** | Containers efêmeros; consumo da fila; execução de scan |
| **Normalização** | Estruturação dos achados; classificação por severidade |
| **NFR** | Scan inicial < 5 min |

**Entregável chave:** Motor de coleta automática operacional.

---

### Fase 3 — GRC & Score (4 semanas)

| Área | Entregas |
|------|----------|
| **Questionário** | 15 perguntas (controles críticos ISO 27001) |
| **Motor de Scoring** | Algoritmo $S_f = (T \times 0.6) + (C \times 0.4)$; penalidade crítica |
| **Matriz de Validação** | Lógica de inconsistência (pergunta vs achado técnico) |
| **Dashboard** | Interface de Assessment com Score Composto |
| **PDF** | Geração de Relatório de Risco (resumo executivo) |

**Entregável chave:** Dashboard de Assessment com Score Composto.

---

### Fase 4 — Trust Center (4 semanas)

| Área | Entregas |
|------|----------|
| **Página Pública** | URL do avaliado com selos de segurança e documentos públicos |
| **NDA Workflow** | Fluxo de assinatura digital para liberar documentos sensíveis |
| **Evidence Vault** | Upload de evidências (PDF/imagens) com criptografia KMS |
| **Selo de Confiança** | Badge/Widget para o avaliado exibir em site próprio |

**Entregável chave:** Selo de Confiança e Evidence Vault operacionais.

---

## 3. Plano de Qualidade e Segurança (QA/Sec)

> O n.Risk é uma plataforma de segurança — deve ser referência em práticas seguras.

### 3.1 SAST/DAST no Pipeline

| Ferramenta | Uso | Momento |
|------------|-----|---------|
| **SonarQube** (ou similar) | Análise estática de código | Todo commit/PR |
| **Trivy** | Scan de vulnerabilidades em imagens Docker | Build de containers |
| **Integração** | Bloquear merge em falhas críticas | CI/CD |

### 3.2 Pentest do n.Risk

| Atividade | Descrição |
|-----------|-----------|
| **Pentest interno** | Invasão controlada na própria plataforma antes do lançamento |
| **Escopo** | API, frontend, autenticação, isolamento de tenants, Evidence Vault |
| **Momento** | Após Fase 4; antes de Go-to-Market amplo |

### 3.3 Certificação de Dados

| Requisito | Implementação |
|-----------|---------------|
| **Soberania de dados** | Armazenamento de evidências em região compatível com LGPD (ex: Brasil) |
| **Criptografia** | AES-256 em repouso; TLS 1.3 em trânsito |
| **Retenção** | Política de retenção definida e documentada |

---

## 4. Estratégia de Go-to-Market (GTM)

### 4.1 Parceria com Corretoras

| Modelo | Descrição |
|--------|-----------|
| **Serviço gratuito** | Oferecer n.Risk como "Diagnóstico de Risco" gratuito para corretoras |
| **Objetivo** | Atrair novos clientes de seguro; gerar leads qualificados |
| **Entregável** | Score + PDF para uso em propostas |

### 4.2 Modelo de Créditos

| Modelo | Descrição |
|--------|-----------|
| **Pacotes de Risk Reports** | Seguradoras compram pacotes de relatórios para análise de propostas |
| **Uso** | Cada "Risk Report" = 1 avaliação (domínio + questionário) consumida |

### 4.3 Programa Early Adopters

| Modelo | Descrição |
|--------|-----------|
| **Seleção** | 5 fornecedores de TI para usar o Trust Center gratuitamente |
| **Objetivo** | Validar UX; obter feedback; casos de uso reais |
| **Compromisso** | Feedback estruturado; depoimentos; referência |

---

## 5. Mapeamento com Outros Planos

| Plano | Relação |
|-------|---------|
| [nrisk-mvp](./nrisk-mvp.md) | Cronograma MVP (Mês 1–4) alinha com Fases 1–4; Roadmap refinado |
| [nrisk-arquitetura-tad](./nrisk-arquitetura-tad.md) | TAD define como implementar cada fase |
| [nrisk-scoring-metodologia](./nrisk-scoring-metodologia.md) | Fase 3 implementa a metodologia de scoring |

---

## 6. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Atraso em integrações Shodan/Censys | Plan B com APIs alternativas; mock para desenvolvimento |
| Pentest com achados críticos | Buffer na Fase 4; priorização de correções |
| Early Adopters indisponíveis | Lista de espera; outreach ampliado |

---

## 7. Evidence & Follow-up

- [ ] Documento de tese do MVP (validação de hipótese)
- [ ] Definição das 15 perguntas do questionário (mapeamento ISO 27001)
- [ ] Checklist SAST/DAST no CI/CD
- [ ] Termo de referência do Pentest
- [ ] Documento de soberania de dados (LGPD)
- [ ] Pitch e materiais para corretoras e Early Adopters
