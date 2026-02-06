---
status: active
generated: 2026-02-05
agents:
  - type: "documentation-writer"
    role: "Revisar e melhorar redação (copy) — hero, seções, CTAs, FAQs"
  - type: "frontend-specialist"
    role: "Polimento visual, microanimações, hierarquia, UX/UI"
  - type: "code-reviewer"
    role: "Revisar alterações antes de merge"
docs:
  - "descricao-funcional-plataforma-nrisk.md"
  - "frontend.md"
  - "glossary.md"
phases:
  - id: "phase-1"
    name: "Redação e alinhamento de copy"
    prevc: "P"
  - id: "phase-2"
    name: "Polimento UX/UI e microanimações"
    prevc: "E"
  - id: "phase-3"
    name: "Validação e deploy"
    prevc: "V"
---

# n.Risk Landing — Redação e UX/UI

> Plano para melhorar redação (copy) e polimento visual/UX do site n.Risk, usando agentes especializados e boas práticas de copywriting corporativo e design.

## Objetivo e escopo

- **Objetivo:** Aumentar clareza, persuasão e qualidade visual da landing n.Risk.
- **Incluído:** Redação de todas as páginas (`NriskOverview`, `SupplyChain`, `Insurance`, `Assessments`, `Methodology`, `Contact`), CTAs, FAQs, hero sections; polimento visual (transições, hierarquia, consistência); microanimações sutis; centralização de layout.
- **Excluído:** Novas funcionalidades; alterações de backend; redesign completo.
- **Sinal de sucesso:** Textos revisados em PT-BR com tom corporativo; interface com transições suaves, hierarquia clara e feedback visual em interações.

**Referências:**
- [descricao-funcional-plataforma-nrisk.md](../docs/descricao-funcional-plataforma-nrisk.md) — contexto de produto e personas
- [glossary.md](../docs/glossary.md) — termos de domínio
- [resper1965/clone](https://github.com/resper1965/clone) — inspiração UI (regra `frontend-ui-inspiration.mdc`)

---

## Agentes e responsabilidades

| Agente | Papel | Foco principal |
|--------|-------|----------------|
| **documentation-writer** | Revisar copy em PT-BR | Hero, subtítulos, CTAs, FAQs; tom corporativo; clareza e persuasão |
| **frontend-specialist** | Polimento visual e UX | Microanimações, transições, hierarquia, consistência, acessibilidade |
| **code-reviewer** | Garantir qualidade | Revisar alterações antes de merge; convenções e padrões |

---

## Fase 1 — Redação e alinhamento de copy (documentation-writer)

**Objetivo:** Revisar todos os textos da landing para clareza, persuasão e tom corporativo em PT-BR.

### Passos

1. **Auditar copy atual**
   - Mapear hero, subtítulos, bullets, CTAs e FAQs em cada página.
   - Identificar termos repetitivos, frases longas e inconsistências de tom.

2. **Definir guidelines de copy**
   - Tom: profissional, objetivo, confiável (B2B cyber/insurance).
   - Regras: frases curtas; benefícios antes de features; CTAs em verbo de ação.
   - Vocabulário: usar termos do [glossary.md](../docs/glossary.md) e da [descrição funcional](../docs/descricao-funcional-plataforma-nrisk.md).

3. **Reescrever por página**
   - **NriskOverview:** Hero ("Risco mensurável. Confiança para decidir."), "Por que importa", "Casos de uso típicos", "Recursos principais", "Onboarding típico".
   - **SupplyChain, Insurance, Assessments, Methodology:** Heros, títulos de seção, bullets, FAQs.
   - **Contact:** Texto de apoio e labels.
   - **CTAs:** "Falar com especialista", "Ver como funciona" — garantir consistência e clareza.

4. **Revisar FAQs**
   - Perguntas mais diretas; respostas objetivas; evitar jargão desnecessário.
   - Manter termos aceitos: Trust Center, assessment (quando fizer sentido).

**Entregáveis:** PR com alterações de copy em `landing/src/pages/*` e componentes.

**Checkpoint:** `git commit -m "docs(landing): revisão de copy em PT-BR (phase 1)"`

---

## Fase 2 — Polimento UX/UI e microanimações (frontend-specialist)

**Objetivo:** Melhorar percepção visual e usabilidade com transições, microanimações e consistência.

### 2.1 Layout e centralização

- Garantir que seções usem `text-center` onde fizer sentido (heros, títulos).
- Conteúdo principal em containers `mx-auto max-w-6xl` ou equivalente, centralizado.
- Ajustar espaçamento vertical entre seções para ritmo visual consistente.

### 2.2 Microanimações e transições

| Elemento | Melhoria proposta |
|----------|-------------------|
| **Botões** | `transition` em hover/focus; leve `scale` ou `brightness` no hover |
| **Links de nav** | `transition-colors` suave; underline ou sublinhado sutil no ativo |
| **Cards (casos de uso, etc.)** | `hover:shadow`, `hover:border-[#00ade8]/30`; transição 200–300ms |
| **Seções** | Fade-in suave ao entrar no viewport (Intersection Observer ou CSS `animation`) |
| **Accordion (FAQs)** | Transição suave de altura e opacidade ao abrir/fechar |
| **Badges/tags** | Hover leve; `transition` em borda/cor |

### 2.3 Hierarquia e consistência

- Revisar tamanhos de fonte: `h1` > `h2` > `h3` de forma consistente.
- Garantir contraste: texto em `gray-100`/`gray-300` sobre `gray-900`/`gray-950`.
- Cor de destaque `#00ade8` usada de forma consistente (links, bullets, destaques).
- Bordas e cantos: `rounded-md` ou `rounded-lg` padronizados.

### 2.4 Acessibilidade e feedback

- Garantir `focus-visible` em todos os interativos.
- Adicionar `aria-label` onde necessário (CTAs, ícones).
- Feedback visual em estados hover/active.

### 2.5 Referência de inspiração

- Consultar [resper1965/clone](https://github.com/resper1965/clone) para padrões de cards, layouts e componentes.
- Manter identidade n.Risk (tema escuro, `#00ade8`).

**Entregáveis:** PR com alterações em `landing/src/index.css`, componentes e páginas.

**Checkpoint:** `git commit -m "feat(landing): polimento UX/UI e microanimações (phase 2)"`

---

## Fase 3 — Validação e deploy

**Objetivo:** Validar alterações e publicar em produção.

### Passos

1. **Revisão de código (code-reviewer)**
   - Revisar PRs das fases 1 e 2.
   - Verificar convenções, acessibilidade e impacto em performance.

2. **Testes manuais**
   - Navegar por todas as páginas em desktop e mobile.
   - Testar transições e animações; verificar que não há layout quebrado.

3. **Deploy**
   - `cd landing && ./deploy-gcp.sh` após merge.

**Checkpoint:** `git commit -m "chore(landing): validação phase 3 concluída"`

---

## Riscos e dependências

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Animações pesadas em mobile | Baixa | Médio | Usar `prefers-reduced-motion` para desativar ou suavizar |
| Copy alterado perde nuance técnica | Média | Baixo | Validar com descrição funcional e glossary |
| Regressão de layout | Baixa | Médio | Testar responsividade antes do deploy |

**Dependências:** Nenhuma externa. Stack atual: Vite, React, Tailwind.

**Premissas:** Copy e design seguem identidade n.Risk (ness.); não há mudança de brand ou de stack.

---

## Estimativa de esforço

| Fase | Esforço | Tempo |
|------|---------|-------|
| Fase 1 — Redação | 1–2 dias | 2–3 dias |
| Fase 2 — UX/UI | 2–3 dias | 3–5 dias |
| Fase 3 — Validação | 0,5 dia | 1 dia |
| **Total** | **3,5–5,5 dias** | **~1 semana** |

---

## Plano de rollback

- **Fase 1:** Reverter commits de copy; restaurar textos anteriores.
- **Fase 2:** Reverter commits de CSS/componentes; animações podem ser desativadas via CSS se causarem problema.
- **Produção:** `gcloud run deploy` com revisão anterior se necessário.
