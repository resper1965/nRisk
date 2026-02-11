import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";
import NriskBrand from "../components/NriskBrand";

const WHY_ITEMS = [
  {
    title: "Ecossistema de Terceiros sob Controle",
    textJsx: <>Parceiros e fornecedores são sua maior superfície de ataque. A <NriskBrand /> une scan técnico com avaliações profundas — score híbrido e rastreabilidade total para gerenciar o risco de terceiros (TPRA).</>,
  },
  {
    title: "Conferência Cruzada (Cross-Check)",
    text: "Não confie apenas no que o terceiro declara. Nosso motor de Cross-Check cruza respostas de questionários com evidências técnicas reais, destacando inconsistências e pontos cegos de segurança.",
  },
  {
    title: "Questionários & Evidência Técnica",
    text: "Vá além do checklist. Gerencie questionários baseados em frameworks globais com coleta automatizada de evidências, garantindo que cada resposta seja auditável e verificada pelo scan externo.",
  },
];

const SOLUTIONS = [
  {
    title: "Qualificação de Terceiros",
    desc: "Mensure o risco antes e durante a parceria",
    bullets: ["Triagem baseada em score híbrido", "Conferência cruzada automatizada", "Monitoramento contínuo de superfície"],
    href: "/nrisk/assessments",
  },
  {
    title: "Detecção e Resposta (Supply Chain)",
    desc: "Visibilidade em tempo real sobre a cadeia",
    bullets: ["Alertas de queda de score", "Achados críticos em tempo real", "Histórico e tendência por terceiro"],
    href: "/nrisk/methodology",
  },
  {
    title: "Governance & Compliance",
    desc: "Frameworks padronizados com evidências",
    bullets: ["ISO 27001, NIST CSF, LGPD", "Cofre de evidências centralizado", "Submissão controlada e RBAC"],
    href: "/nrisk/compliance",
  },
];

const PRODUCTS = [
  { label: "TPRA Scan", desc: "Avalie a exposição técnica de qualquer terceiro fora da rede." },
  { label: "Audit Log de Evidências", desc: "Trilha de auditoria imutável para conformidade e subscrição." },
  { label: "Dashboard de Portfólio", desc: "Visão executiva de ratings (A-F) de todo o seu ecossistema." },
  { label: "Trust Center", desc: "Visibilidade configurável para demandantes e parceiros." },
  { label: "Alertas Estratégicos", desc: "Notificação de riscos críticos antes que se tornem incidentes." },
  { label: "Mapping Automático", desc: "Correlacione respostas com múltiplos padrões de mercado." },
];

const FAQ_ITEMS = [
  { id: 1, question: <>Como a <NriskBrand /> qualifica terceiros?</>, answer: <>A plataforma combina scan de superfície (Outside-In) com questionários profundos (Inside-Out). O score híbrido e a conferência cruzada detectam se o que o parceiro declara condiz com sua realidade técnica atual.</> },
  { id: 2, question: "O que é o TPRA no contexto do n.Risk?", answer: "Third-Party Risk Assessment. É o nosso framework de avaliação recorrente que garante que sua cadeia de suprimentos esteja sempre em conformidade com seus requisitos de segurança e de seguradoras." },
  { id: 3, question: "Como os questionários são validados?", answer: "Através do Fator de Confiança. Analisamos a consistência das respostas em relação às evidências anexadas e aos achados do scan técnico, gerando um indicador de integridade para o demandante." },
];

export default function SupplyChain() {
  return (
    <div className="bg-gray-950">
      <section className="relative overflow-hidden border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20 [background-image:radial-gradient(#00ade8_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Third-Party Risk (TPRA)
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-100 sm:text-5xl lg:text-7xl">
            Risco de Terceiros com <br className="hidden sm:block" />
            <span className="text-accent italic">Visibilidade Contínua</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-8 mx-auto max-w-3xl text-xl leading-relaxed text-gray-400">
            Para equipes de TPRM e GRC, a <NriskBrand /> é a única plataforma que cruza <span className="text-gray-200 font-bold">questionários profundos</span> com <span className="text-gray-200 font-bold">scan técnico</span> em tempo real. Confiança medida, não apenas declarada.
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-12 flex flex-wrap justify-center gap-6">
            <Link
              to="/nrisk/contact"
              className="group inline-flex items-center justify-center rounded-sm bg-accent px-8 py-4 text-sm font-bold text-gray-900 shadow-[0_0_30px_rgba(0,173,232,0.2)] transition-smooth hover:scale-105 hover:shadow-[0_0_40px_rgba(0,173,232,0.4)] hover:brightness-110 uppercase tracking-widest"
            >
              Qualificar Terceiro
            </Link>
            <Link
              to="/nrisk/assessments"
              className="inline-flex items-center justify-center rounded-sm border-[1px] border-accent/40 bg-transparent px-8 py-4 text-sm font-bold text-accent transition-smooth hover:bg-accent/10 hover:border-accent uppercase tracking-widest"
            >
              Ver Metodologia
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-900 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-center sm:text-4xl">
            Por que a <NriskBrand /> para seu Ecossistema?
          </h2>
          <p className="mt-4 text-gray-400 sm:text-center max-w-2xl mx-auto">
            O risco cibernético de terceiros é a maior fonte de brechas hoje. Nossa abordagem une o rigor do scan técnico à profundidade do GRC.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group relative p-8 rounded-sm border-[1px] border-gray-800 bg-gray-950 transition-smooth hover:border-accent/40 hover:shadow-2xl"
              >
                <p className="font-bold text-accent uppercase text-xs tracking-widest">{item.title}</p>
                <div className="mt-4 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">
                  {item.textJsx ?? item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Soluções para Supply Chain Cyber Risk
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
            Capacidades TPRA
          </h2>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <div
                key={p.label}
                className="group relative rounded-sm border-[1px] border-gray-800 bg-gray-950 p-6 transition-smooth hover:border-accent/40"
              >
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
            Auditando seu Ecossistema
          </h2>
          <div className="mt-16"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
