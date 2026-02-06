import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const WHY_ITEMS = [
  {
    title: "Visibilidade contínua do risco cibernético",
    text: "Coleta ampla de dados técnicos e declarativos, com score híbrido e monitoramento em tempo real para triagem, subscrição e renovação.",
  },
  {
    title: "Plataforma única para segurados, corretores e subscritores",
    text: "Score, evidências e histórico em um só lugar. Mais transparência, menos retrabalho e decisões baseadas em dados.",
  },
  {
    title: "Evidência e consistência para apólices de risco cibernético",
    text: "Cross-Check e Fator de Confiança medem a consistência entre declarações e scan. Subscrição com visibilidade de risco extremo.",
  },
];

const SOLUTIONS = [
  {
    title: "Subscrição contínua",
    desc: "Cresça a linha de cyber com lucratividade",
    bullets: ["Triagem baseada em score e eixos", "Precificação com penalidade crítica", "Renovação com histórico e tendência"],
    href: "/nrisk/methodology",
  },
  {
    title: "Triagem e precificação",
    desc: "Identifique e classifique o risco com evidência",
    bullets: ["Score híbrido 0–1000, categoria A–F", "Scores por eixo técnico", "Inconsistências e achados críticos"],
    href: "/nrisk/assessments",
  },
  {
    title: "Gestão de portfólio",
    desc: "Monitore apólices e exposição",
    bullets: ["Visibilidade de tendência", "Alertas e eventos", "Relatórios para diretoria e subscritores"],
    href: "/nrisk/supply-chain",
  },
];

const PRODUCTS = [
  { label: "Score e scan de superfície", desc: "Avalie a exposição técnica de qualquer organização" },
  { label: "Cross-Check e Fator de Confiança", desc: "Consistência entre declaração e realidade técnica" },
  { label: "Avaliações híbridas", desc: "Técnico + declarativo com evidências centralizadas" },
  { label: "Relatórios para subscritores", desc: "Score, eixos, histórico e inconsistências" },
];

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Como o score apoia a subscrição de apólices de risco cibernético?",
    answer: "O score híbrido (técnico + declarativo) e a categoria A–F permitem triagem rápida, precificação e decisão de renovação. Scores por eixo e histórico apoiam análise mais granular e acompanhamento contínuo do portfólio.",
  },
  {
    id: 2,
    question: "O que é penalidade crítica?",
    answer: "Se existir qualquer achado de severidade crítica no scan técnico, o score final é limitado (teto), independentemente da avaliação declarativa. Isso garante visibilidade explícita de risco extremo na subscrição e no monitoramento de apólices.",
  },
  {
    id: 3,
    question: "Como as seguradoras avaliam o risco para apólices de cyber?",
    answer: "Avaliam fatores como medidas de segurança, incidentes passados e riscos do setor. A n.Risk agrega: score técnico (scan), avaliações declarativas, Cross-Check para inconsistências e Fator de Confiança — tudo em um único painel para decisão informada.",
  },
  {
    id: 4,
    question: "Quais relatórios estão disponíveis?",
    answer: "Relatórios para diretoria e subscritores estão em roadmap. Hoje: score, eixos, inconsistências, histórico e tendência via API e interface, prontos para integrar ao fluxo de subscrição.",
  },
];

export default function Insurance() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-medium uppercase tracking-wider text-accent">Seguradoras</p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Gerencie o risco cibernético em todo o seu{" "}
            <span className="text-accent">portfólio</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-6 mx-auto max-w-2xl text-lg text-gray-400">
            Para seguradoras e corretoras de seguro, a n.Risk é uma ferramenta para avaliar o risco na contratação de uma apólice de risco cibernético. Identifique, meça e resolva ameaças com score híbrido e evidências — dados, não só declarações.
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-10">
            <Link
              to="/nrisk/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-accent/20 transition-smooth hover:scale-105 hover:shadow-accent/30 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Solicitar demonstração
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Por que a n.Risk para apólices de risco cibernético?
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Ratings de segurança são vitais para reguladores, seguradoras e empresas. A n.Risk oferece monitoramento contínuo e insights em tempo real para avaliar e gerenciar riscos cibernéticos de forma eficaz.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3 text-left">
            {WHY_ITEMS.map((item, i) => (
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
            Soluções para subscrição de risco cibernético
          </h2>
          <p className="mt-3 text-gray-400">
            A n.Risk oferece recursos desenhados para avaliar e melhorar a subscrição de cyber, ajudando seguradoras a tomar decisões informadas e segurados a atender requisitos de segurança.
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
            Portfolio de recursos para avaliar, gerenciar e reduzir riscos cibernéticos na subscrição.
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
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl text-center">
            Achados críticos e score
          </h2>
          <p className="mt-4 text-gray-400 text-center">
            A existência de qualquer achado de severidade crítica no scan limita o score final, independentemente da avaliação declarativa. Subscrição e monitoramento ganham visibilidade explícita de risco extremo para apólices de risco cibernético.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl text-center">
            Perguntas frequentes
          </h2>
          <div className="mt-10"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
