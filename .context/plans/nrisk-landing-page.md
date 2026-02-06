---
status: filled
generated: 2026-02-05
agents:
  - type: "frontend-specialist"
    role: "Implementar UI da landing (hero, seções, CTAs) e responsividade"
  - type: "documentation-writer"
    role: "Textos de produto, copy e consistência com glossário n.Risk"
  - type: "architect-specialist"
    role: "Definir localização da landing (pasta/repo) e integração com projeto principal"
docs:
  - "project-overview.md"
  - "contexto-nrisk.md"
  - "glossary.md"
  - "frontend.md"
phases:
  - id: "phase-1"
    name: "Discovery & Conteúdo"
    prevc: "P"
  - id: "phase-2"
    name: "Implementação"
    prevc: "E"
  - id: "phase-3"
    name: "Validação e Deploy"
    prevc: "V"
---

# Landing page n.Risk (inspirada em ness.com.br)

> Plano para construir uma **landing page do produto n.Risk** em **repositório ou pasta separada do projeto principal** (backend/ e app de produto). Estrutura e tom inspirados em [ness.com.br](https://ness.com.br).

## Princípio: não misturar com o projeto principal

- A landing é **somente apresentação do produto** (hero, soluções, CTAs).
- **Não** faz parte do backend (Go) nem do futuro app de painel/Trust Center (Next.js).
- Opções de localização:
  1. **Pasta no mesmo repo:** `landing/` na raiz do nRisk (ex.: site estático ou Next.js só para landing).
  2. **Repositório separado:** ex. `nrisk-landing` ou `nrisk-website` (recomendado se deploy for em domínio/Cloud diferente).
- Decisão de pasta vs repo fica na Phase 1 (Discovery).

---

## Referência: ness.com.br

| Elemento | ness.com.br | Adaptação n.Risk |
|----------|--------------|------------------|
| **Hero** | "Invisible when everything works. Present when it matters most." + "We operate today. We improve now." | Tagline sobre postura cibernética visível quando importa; foco em Cyber Insurance e terceiros. |
| **CTAs hero** | "Talk to an expert" / "View solutions" | "Fale com um especialista" / "Conheça a plataforma" (ou "Ver soluções"). |
| **Seção soluções** | "our solutions" — cards (n.secops, n.infraops, n.devarch, …) com título, descrição curta, "Learn more →" | "Nossas soluções" ou "O que oferecemos": avaliação de postura, score híbrido, Trust Center, Evidence Vault, etc. |
| **Seção verticais** | "our verticals" (forense.io, trustness.) | "Para quem é" ou "Verticais": Seguradoras, Empresas (cadeia de suprimentos), Fornecedores (Trust Center). |
| **CTA final** | "Ready to transform your IT? Talk to our experts…" | "Pronto para dar visibilidade ao risco cibernético?" + CTA para contato/demo. |

Fonte de conteúdo do produto: [project-overview.md](../docs/project-overview.md), [contexto-nrisk.md](../docs/contexto-nrisk.md), [glossary.md](../docs/glossary.md).

---

## Task Snapshot

- **Objetivo:** Ter uma landing page pública do n.Risk, responsiva, com hero, seções de valor e CTAs, **sem misturar código com o backend ou o app principal**.
- **Sinal de sucesso:**
  - Landing acessível em URL definida (ex. nrisk.com.br ou subdomínio).
  - Estrutura clara tipo ness.com.br (hero → soluções/valor → verticais → CTA).
  - Textos alinhados ao posicionamento (Cyber Insurance, terceiros, score, Trust Center).
  - Performance e SEO básicos (títulos, meta, cores/contraste).
- **Referências:**
  - [Documentation Index](../docs/README.md)
  - [Project Overview](../docs/project-overview.md)
  - [Contexto n.Risk](../docs/contexto-nrisk.md)
  - [ness.com.br](https://ness.com.br) (estrutura e tom)

---

## Estrutura de conteúdo sugerida (wireframe)

1. **Header:** Logo n.Risk, navegação (Soluções, Para quem é, Contato), CTA "Fale com um especialista".
2. **Hero:** Tagline principal + subtagline + dois botões (primário: contato/demo; secundário: conhecer soluções).
3. **Seção "O que oferecemos" (soluções):** Cards com ícone/título, descrição curta, link "Saiba mais". Ex.: Avaliação de postura, Score híbrido, Trust Center, Evidence Vault, Scans + questionários.
4. **Seção "Para quem é" (verticais):** Seguradoras, Empresas (cadeia de suprimentos), Fornecedores (transparência).
5. **CTA final:** Frase de fechamento + botão "Fale com um especialista" ou "Agendar demo".
6. **Footer:** Links (produto, contato, privacidade), ©.

---

## Stack e localização

- **Recomendação:** Site estático (HTML/CSS/JS) ou Next.js em modo estático/export, para não depender de backend.
- **Onde colocar:**
  - **Opção A:** Pasta `landing/` na raiz do repositório nRisk (monorepo; CI pode fazer deploy só da pasta).
  - **Opção B:** Repositório separado (ex. `nrisk-landing`) com seu próprio deploy (Vercel, Cloud Storage + Load Balancer, etc.).
- **Design:** Inspiração visual em ness.com.br (tipografia, espaçamento, blocos); paleta e logo n.Risk. Pode usar CSS puro ou Tailwind; sem necessidade de design system do app principal.

---

## Riscos e dependências

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Conteúdo impreciso em relação ao produto | Média | Médio | Revisar com project-overview e glossary; doc writer valida copy. |
| Misturar rotas/estado da landing com app principal | Baixa | Alto | Manter landing em pasta/repo separado; sem import do backend ou do app. |
| Deploy acoplado ao mesmo pipeline do backend | Baixa | Médio | Deploy da landing em job/site separado (ex. outro Cloud Run service ou Vercel). |

- **Dependências internas:** Apenas documentação (project-overview, contexto-nrisk, glossary). Nenhuma dependência do backend ou do app de painel.
- **Premissas:** Landing é somente marketing/institucional; login e produto ficam no app principal (futuro).

---

## Fases de trabalho

### Phase 1 — Discovery & Conteúdo (P)

1. **Definir localização:** Decidir pasta `landing/` no repo atual vs repositório separado; documentar no plano.
2. **Copy e estrutura:** Escrever taglines, títulos de seções e textos dos cards com base em project-overview e ness.com.br; validar com glossary.
3. **Referência visual:** Capturar blocos e ordem de ness.com.br (hero, grid de soluções, verticais, CTA); definir se há wireframe em ferramenta ou só doc.

**Checkpoint:** ✅ Decisão: pasta `landing/` na raiz do repo. Copy e estrutura em `landing/COPY.md`.

### Phase 2 — Implementação (E)

1. **Setup:** Criar `landing/` (ou repo) com stack escolhida (estático ou Next.js estático); sem dependências do `backend/`.
2. **Implementar seções:** Header, hero, soluções (cards), verticais, CTA final, footer.
3. **Estilo:** Layout responsivo; inspiração ness.com.br; acessibilidade básica (contraste, títulos, links).
4. **SEO:** Título, meta description, Open Graph mínimo.

**Checkpoint:** ✅ Implementado: `landing/index.html`, `landing/styles.css`, `landing/README.md` (rodar local + deploy). SEO: título, meta description, Open Graph.

### Phase 3 — Validação e Deploy (V)

1. **Revisão:** Code review (frontend-specialist); checagem de copy (documentation-writer).
2. **Testes manuais:** Navegação, links, responsividade, performance (Lighthouse opcional).
3. **Deploy:** Configurar pipeline ou job separado para publicar a landing (domínio/subdomínio definido).
4. **Documentação:** Atualizar README do repositório (ou do repo landing) com URL da landing e como contribuir.

**Checkpoint:** Commit final de documentação; evidência de deploy (URL, screenshot ou link no README).

---

## Rollback

- **Se a landing estiver em `landing/`:** Remover pasta `landing/` e qualquer job de deploy associado; reverter commits da landing.
- **Se a landing estiver em repo separado:** Desativar deploy ou arquivar o repo; nenhum impacto no repositório principal nRisk.
- **Dados:** Nenhum; landing não persiste dados do produto.

---

## Evidência e follow-up

- [ ] Decisão de localização (pasta vs repo) registrada no plano ou em `landing/README.md`.
- [ ] Copy e estrutura (Phase 1) revisados e commitados.
- [ ] Landing acessível em URL de produção.
- [ ] README do projeto principal (ou do repo landing) atualizado com link para a landing e instruções de deploy.
