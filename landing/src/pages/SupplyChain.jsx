import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const WHY_ITEMS = [
  {
    title: "Risco de terceiros fora de controle",
    text: "Fornecedores e parceiros ampliam sua superfície de ataque. A n.Risk combina scan outside-in com avaliações por framework — score híbrido e scores por eixo permitem priorizar e acompanhar a evolução.",
  },
  {
    title: "Plataforma única para TPRM e GRC",
    text: "Conferência cruzada, Trust Center e evidências centralizadas. Menos retrabalho, mais transparência. Qualifique fornecedores com dados técnicos e declarativos em um só lugar.",
  },
  {
    title: "Detecção contínua e alertas acionáveis",
    text: "Alertas para finding crítico, queda de score e inconsistências. RBAC, instantâneos e justificativas aprovadas para governança e trilha de auditoria.",
  },
];

const SOLUTIONS = [
  {
    title: "Third-Party Cyber Risk Management",
    desc: "Gerencie o risco cibernético de fornecedores",
    bullets: ["Triagem e qualificação contínua", "Conferência cruzada declaração vs scan", "Trust Center para demandantes"],
    href: "/nrisk/assessments",
  },
  {
    title: "Detecção e resposta na cadeia",
    desc: "Visibilidade e priorização em tempo real",
    bullets: ["Score híbrido e scores por eixo", "Alertas configuráveis", "Histórico e tendência"],
    href: "/nrisk/methodology",
  },
  {
    title: "Questionários e avaliações",
    desc: "Frameworks padronizados com evidências",
    bullets: ["ISO 27001, NIST CSF, LGPD", "Cofre de evidências", "Submissão controlada e RBAC"],
    href: "/nrisk/assessments",
  },
];

const PRODUCTS = [
  { label: "Scan e superfície de ataque", desc: "Avalie a exposição técnica de qualquer organização fora da rede" },
  { label: "Conferência cruzada", desc: "Compare declaração vs observação por controle" },
  { label: "Scores por eixo", desc: "Rating A–F por domínio para priorização executiva" },
  { label: "Trust Center", desc: "Visibilidade configurável para terceiros e demandantes" },
  { label: "Evidências e RBAC", desc: "Cofre centralizado com trilha de auditoria" },
];

const FAQ_ITEMS = [
  { id: 1, question: "Como a n.Risk qualifica fornecedores?", answer: "Combina scan outside-in com avaliações por framework. O score híbrido e os scores por eixo permitem priorizar e acompanhar a evolução. Conferência cruzada detecta inconsistências entre o que o fornecedor declara e o que o scan encontra." },
  { id: 2, question: "O que terceiros veem no Trust Center?", answer: "Score, categoria, eixos (A–F), status de evidências e histórico conforme permissões (RBAC). Demandantes — seguradoras, clientes, parceiros — acessam apenas o que está liberado para seu perfil." },
  { id: 3, question: "Como funcionam os alertas?", answer: "Alertas configuráveis para finding crítico, queda de score e inconsistências. Integração por webhook e e-mail em roadmap. Permitem ação rápida antes que o risco se materialize." },
];

export default function SupplyChain() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-medium uppercase tracking-wider text-accent">
            Cadeia de suprimentos
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Risco de terceiros com{" "}
            <span className="text-accent">visibilidade contínua</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-6 mx-auto max-w-2xl text-lg text-gray-400">
            Para equipes de TPRM e GRC, a n.Risk é uma ferramenta para identificar, medir e resolver riscos cibernéticos em fornecedores e parceiros. Detecte inconsistências, priorize com score híbrido e evidências — dados, não só declarações.
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/nrisk/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-accent/20 transition-smooth hover:scale-105 hover:shadow-accent/30 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Solicitar demonstração
            </Link>
            <Link
              to="/nrisk/assessments"
              className="inline-flex items-center justify-center rounded-md border-2 border-accent/50 bg-transparent px-6 py-3 text-sm font-semibold text-accent transition-smooth hover:bg-accent/10 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Ver avaliações
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Por que a n.Risk para cadeia de suprimentos?
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            O risco cibernético de terceiros é uma das principais fontes de brechas. A n.Risk oferece visibilidade contínua e priorização baseada em evidências para reduzir exposição.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3 text-left">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border-2 border-gray-800 p-6 transition-smooth hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
              >
                <p className="font-semibold text-accent">{item.title}</p>
                <p className="mt-3 text-sm text-gray-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Soluções para Supply Chain Cyber Risk
          </h2>
          <p className="mt-3 text-gray-400">
            A n.Risk oferece recursos desenhados para avaliar e gerenciar risco cibernético de terceiros, ajudando equipes de TPRM e GRC a tomar decisões informadas.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SOLUTIONS.map((sol) => (
              <Link
                key={sol.title}
                to={sol.href}
                className="group block rounded-xl border-2 border-gray-800 p-6 text-left transition-smooth hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
              >
                <p className="font-semibold text-accent group-hover:text-accent">{sol.title}</p>
                <p className="mt-2 text-sm font-medium text-gray-300">{sol.desc}</p>
                <ul className="mt-4 space-y-2">
                  {sol.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-gray-400">
                      <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl text-center">
            Produtos e serviços
          </h2>
          <p className="mt-3 text-gray-400 text-center max-w-2xl mx-auto">
            Portfolio de recursos para avaliar, gerenciar e reduzir riscos cibernéticos na cadeia de suprimentos.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRODUCTS.map((p) => (
              <div
                key={p.label}
                className="rounded-lg border-2 border-accent/30 bg-gray-800/50 p-4 transition-smooth hover:border-accent/50"
              >
                <p className="font-medium text-gray-100">{p.label}</p>
                <p className="mt-1 text-sm text-gray-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Perguntas frequentes
          </h2>
          <div className="mt-10"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
