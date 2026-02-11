import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";
import NriskBrand from "../components/NriskBrand";

const WHY_ITEMS = [
  {
    title: "Visibilidade Contínua para Underwriting",
    text: "Coleta ampla de dados técnicos e declarativos com score híbrido e monitoramento em tempo real. Essencial para triagem, subscrição e renovação de apólices cyber.",
  },
  {
    title: "Ecossistema Transparente",
    text: "Score, evidências e histórico em um só lugar. Mais transparência para segurados, corretores e subscritores, eliminando o retrabalho e decisões baseadas em suposições.",
  },
  {
    title: "Cross-Check de Integridade",
    text: "Mensure a consistência entre o que o cliente declara e sua superfície de ataque real. O Fator de Confiança previne a subscrição de riscos cegos.",
  },
];

const SOLUTIONS = [
  {
    title: "Subscrição Baseada em Dados",
    desc: "Cresça a linha de cyber com rentabilidade",
    bullets: ["Triagem automatizada via API", "Precificação baseada em eixos técnicos", "Renovação com histórico de evolução"],
    href: "/nrisk/methodology",
  },
  {
    title: "Triagem e Qualificação",
    desc: "Identifique o risco real com evidência",
    bullets: ["Score híbrido (0-1000) e Rating (A-F)", "Destaque de inconsistências críticas", "Relatórios prontos para underwriting"],
    href: "/nrisk/assessments",
  },
  {
    title: "Gestão de Portfólio",
    desc: "Monitore apólices e exposição sistêmica",
    bullets: ["Visibilidade de tendência de risco", "Alertas de incidentes e vulnerabilidades", "Relatórios executivos de portfólio"],
    href: "/nrisk/supply-chain",
  },
];

const PRODUCTS = [
  { label: "TPRA Scan Outside-In", desc: "Avalie a superfície técnica de potenciais segurados instantaneamente." },
  { label: "Cross-Check Technology", desc: "Detecte inconsistências entre o questionário e a realidade técnica." },
  { label: "Avaliações Inside-Out", desc: "Questionários profundos via GRC Portal com evidências anexas." },
  { label: "Underwriter Reports", desc: "Documentação técnica exportável para comitês de risco." },
  { label: "Continuous Monitoring", desc: "Acompanhamento 24/7 da evolução do risco no portfólio." },
  { label: "Risk Scoring Engine", desc: "Motor de risco que penaliza achados críticos em tempo real." },
];

const FAQ_ITEMS = [
  { id: 1, question: "Como o n.Risk apoia o corretor de seguros?", answer: "O corretor utiliza a plataforma para qualificar o cliente antes de submeter à seguradora. Isso agiliza o processo de underwriting e garante que o cliente esteja pronto para a apólice." },
  { id: 2, question: "O que é o Fator de Confiança?", answer: "É um indicador exclusivo que mede a discrepância entre as declarações do segurado e os achados técnicos. Um baixo fator de confiança alerta o subscritor para riscos ocultos ou declarações imprecisas." },
  { id: 3, question: "Como funciona a penalidade crítica no score?", answer: "Se um risco grave é detectado no scan técnico, o score do segurado é limitado a um teto máximo, independentemente do quão positivos sejam os outros eixos. Isso força a visibilidade de riscos extremos na subscrição." },
];

export default function Insurance() {
  return (
    <div className="bg-gray-950">
      <section className="relative overflow-hidden border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20 [background-image:radial-gradient(#00ade8_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Seguradoras e Corretoras
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-100 sm:text-5xl lg:text-7xl">
            Underwriting Digital com <br className="hidden sm:block" />
            <span className="text-accent italic">Evidência Real</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-8 mx-auto max-w-3xl text-xl leading-relaxed text-gray-400">
            Elimine a incerteza em apólices de risco cibernético. A <NriskBrand /> fornece o score híbrido (Outside-In + Inside-Out) necessário para <span className="text-gray-200 font-bold">triagem, precificação e gestão de portfólio.</span>
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-12 flex flex-wrap justify-center gap-6">
            <Link
              to="/nrisk/contact"
              className="group inline-flex items-center justify-center rounded-sm bg-accent px-8 py-4 text-sm font-bold text-gray-900 shadow-[0_0_30px_rgba(0,173,232,0.2)] transition-smooth hover:scale-105 hover:shadow-[0_0_40px_rgba(0,173,232,0.4)] hover:brightness-110 uppercase tracking-widest"
            >
              Agendar Demo Underwriter
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-900 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Por que a <NriskBrand /> para o Mercado Segurador?
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            O risco cibernético é dinâmico. Questionários anuais em papel não são mais suficientes. Entregamos monitoramento contínuo e dados auditáveis.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group relative p-8 rounded-sm border-[1px] border-gray-800 bg-gray-950 transition-smooth hover:border-accent/40 hover:shadow-2xl"
              >
                <p className="font-bold text-accent uppercase text-xs tracking-widest">{item.title}</p>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Soluções para Subscrição de Risco Cibernético
          </h2>
          <div className="mt-16 grid gap-0 md:grid-cols-3 border-[1px] border-gray-800">
            {SOLUTIONS.map((sol) => (
              <div
                key={sol.title}
                className="group relative p-12 text-left transition-smooth hover:bg-accent/5 border-[1px] border-transparent hover:border-accent/20"
              >
                <div className="flex flex-col h-full">
                  <p className="font-bold text-accent uppercase text-xs tracking-widest">{sol.title}</p>
                  <p className="mt-3 text-lg font-bold text-gray-100">{sol.desc}</p>
                  <ul className="mt-6 space-y-4 flex-grow">
                    {sol.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-sm text-gray-400">
                        <span className="shrink-0 mt-1.5 h-1 w-1 bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link to={sol.href} className="mt-10 text-xs font-bold text-accent uppercase tracking-widest hover:underline">Detalhes &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-900 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-center sm:text-4xl">
            Produtos e Serviços de Underwriting
          </h2>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <div
                key={p.label}
                className="group relative rounded-sm border-[1px] border-gray-800 bg-gray-950 p-6 transition-smooth hover:border-accent/40"
              >
                <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 -translate-y-8 bg-accent/5 blur-xl transition-smooth group-hover:bg-accent/10 group-hover:blur-2xl" />
                <p className="font-bold text-gray-100">{p.label}</p>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800/50 bg-gray-950 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Dúvidas de Mercado
          </h2>
          <div className="mt-16"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
