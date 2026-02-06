import { Link } from "react-router-dom";
import ProductMock from "../components/ProductMock";
import CtaSection from "../components/CtaSection";

const WHY_ITEMS = [
  {
    title: "Declarações sem prova deixam você vulnerável",
    text: "Avaliações tradicionais dependem do que o fornecedor diz. A n.Risk detecta inconsistências entre declaração e scan técnico — Cross-Check e Fator de Confiança tornam a confiança auditável.",
  },
  {
    title: "Priorize com clareza, remedie com rastreabilidade",
    text: "Score híbrido 0–1000, categoria A–F e eixos técnicos para decisão em subscrição e TPRM. Evidências centralizadas, instantâneos e trilha de auditoria para compliance e subscritores.",
  },
  {
    title: "Uma plataforma para quem decide",
    text: "Seguradoras, equipes TPRM/GRC e CISOs confiam na n.Risk para risco de terceiros. Detecte, priorize e remedie em um só lugar — dados, não só declarações.",
  },
];

const SOLUTIONS = [
  {
    title: "Cadeia de suprimentos",
    desc: "Risco de terceiros com visibilidade contínua",
    bullets: ["TPRM e detecção contínua", "Conferência cruzada e Trust Center", "Qualificação de fornecedores"],
    href: "/nrisk/supply-chain",
  },
  {
    title: "Seguradoras e corretoras",
    desc: "Avalie o risco na contratação de apólices de cyber",
    bullets: ["Subscrição baseada em score e evidências", "Monitoramento de portfólio", "Triagem e precificação"],
    href: "/nrisk/insurance",
  },
  {
    title: "Avaliações e governança",
    desc: "Questionários por framework com evidências centralizadas",
    bullets: ["ISO 27001, NIST CSF, LGPD", "Cofre de evidências", "Trust Center para terceiros"],
    href: "/nrisk/assessments",
  },
];

const PRODUCTS = [
  { label: "Score e scan de superfície", desc: "Avalie a exposição técnica de qualquer organização" },
  { label: "Cross-Check e Fator de Confiança", desc: "Consistência entre declaração e realidade técnica" },
  { label: "Avaliações híbridas", desc: "Técnico + declarativo com evidências centralizadas" },
  { label: "Trust Center", desc: "Visibilidade configurável para terceiros e demandantes" },
];

const ONBOARDING = [
  "Alinhamento de escopo (domínios, frameworks).",
  "Configuração de tenant e integrações.",
  "Primeira avaliação e revisão de resultados.",
  "Ativação e acompanhamento contínuo.",
];

function NriskOverview() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-medium uppercase tracking-wider text-accent">
            Gestão de risco cibernético com evidência
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Assuma o controle do risco de terceiros em toda a{" "}
            <span className="text-accent">cadeia de suprimentos</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-6 mx-auto max-w-2xl text-lg text-gray-400">
            Detecte, priorize e remedie: score híbrido, Cross-Check e evidências em uma única plataforma.{" "}
            <span className="text-accent font-medium">Confiança medida, não só declarada.</span>
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/nrisk/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-accent/20 transition-smooth hover:scale-105 hover:shadow-accent/30 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Solicitar demonstração
            </Link>
            <Link
              to="/nrisk/methodology"
              className="inline-flex items-center justify-center rounded-md border-2 border-accent/50 bg-transparent px-6 py-3 text-sm font-semibold text-accent transition-smooth hover:bg-accent/10 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Ver como funciona
            </Link>
          </div>
        </div>
        <div className="opacity-0 animate-fade-in-up animate-delay-400 mx-auto mt-16 max-w-5xl px-4">
          <ProductMock />
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Por que a n.Risk?
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Ratings de segurança são vitais para reguladores, seguradoras e empresas. A n.Risk oferece monitoramento contínuo e insights em tempo real para avaliar e gerenciar riscos cibernéticos de forma eficaz.
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
            Soluções para risco de terceiros
          </h2>
          <p className="mt-3 text-gray-400">
            A n.Risk oferece recursos desenhados para avaliar e gerenciar risco cibernético em diferentes contextos — TPRM, subscrição de cyber e governança.
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
            Portfolio de recursos para avaliar, gerenciar e reduzir riscos cibernéticos.
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

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Monitoramento <span className="text-accent">contínuo</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Tendência de score, inconsistências entre declaração e scan, evidências pendentes e justificativas em análise. Tudo persistido e consumível por demandantes conforme RBAC — para subscrição, TPRM e compliance.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Comece em poucos dias
          </h2>
          <p className="mt-3 text-gray-400">
            Onboarding guiado para você estar operando rápido.
          </p>
          <ol className="mt-8 list-decimal list-inside space-y-4 text-left text-gray-300">
            {ONBOARDING.map((step, i) => (
              <li key={i} className="pl-2 border-l-2 border-accent/50">{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export default NriskOverview;
