import { Link } from "react-router-dom";
import ProductMock from "../components/ProductMock";
import CtaSection from "../components/CtaSection";
import NriskBrand from "../components/NriskBrand";

const WHY_ITEMS = [
  {
    title: "Confiança Auditável, não Apenas Declarada",
    textJsx: <>Processos baseados apenas em questionários são vulneráveis. A <NriskBrand /> detecta inconsistências entre o que é declarado e a realidade técnica dos ativos, gerando um Fator de Confiança real.</>,
  },
  {
    title: "Score Híbrido 0-1000",
    text: "Mensure o risco com precisão matemática. Unimos Scan de Superfície, Avaliações por Framework e Gerenciamento de Evidências em um único indicador para decisões de GRC e Underwriting.",
  },
  {
    title: "Uma Plataforma, Múltiplas Visões",
    textJsx: <>Seja você um CISO protegendo sua rede, uma equipe de TPRM avaliando terceiros, ou uma Seguradora subcrevendo riscos, a <NriskBrand /> entrega os dados necessários para quem decide.</>,
  },
];

const SOLUTIONS = [
  {
    title: "Third-Party Risk (TPRA)",
    desc: "Gerencie o risco de todo o seu ecossistema",
    bullets: ["Monitoramento contínuo de superfície", "Conferência cruzada automatizada", "Gestão de terceiros por categoria"],
    href: "/nrisk/supply-chain",
  },
  {
    title: "Seguradoras e Corretoras",
    desc: "Avalie o risco na contratação de apólices",
    bullets: ["Subscrição baseada em evidência técnica", "Triagem e precificação de portfólio", "Redução de incerteza em seguros cyber"],
    href: "/nrisk/insurance",
  },
  {
    title: "Inner GRC Portal",
    desc: "Sua conformidade interna em um só lugar",
    bullets: ["Autoavaliação profunda (ISO, NIST, LGPD)", "Cofre de evidências imutável", "Mapeamento transversal de controles"],
    href: "/nrisk/compliance",
  },
];

const PRODUCTS = [
  { label: "Technical Score & Scan", desc: "Varredura 24/7 de exposição técnica externa e vulnerabilidades." },
  { label: "Evidence Management", desc: "Gestão centralizada de políticas, documentos e registros técnicos." },
  { label: "Cross-Check Engine", desc: "Detecção automática de discrepâncias entre scan e questionários." },
  { label: "Executive Dashboards", desc: "Visão estratégica de maturidade A-F para C-Level e Boards." },
];

const ONBOARDING = [
  { step: "Alinhamento de Escopo", desc: "Definição de domínios, terceiros e frameworks de conformidade." },
  { step: "Ativação de Tenant", desc: "Configuração do portal de GRC e início dos scans automatizados." },
  { step: "Análise de Resultados", desc: "Revisão do primeiro ciclo de score híbrido e plano de remediação." },
  { step: "Gestão Contínua", desc: "Monitoramento recorrente com alertas e atualizações de evidência." },
];

function NriskOverview() {
  return (
    <div className="bg-gray-950">
      <section className="relative overflow-hidden border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32 text-center">
        <div className="absolute inset-0 z-0 opacity-20 [background-image:radial-gradient(#00ade8_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="opacity-0 animate-fade-in text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Gestão de Risco Cibernético com Evidência
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-100 sm:text-5xl lg:text-7xl">
            Visibilidade Total do <br className="hidden sm:block" />
            <span className="text-accent italic">Risco que Realmente Importa</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-8 mx-auto max-w-3xl text-xl leading-relaxed text-gray-400">
            Da qualificação de <span className="text-gray-200 font-bold">terceiros (TPRA)</span> à <span className="text-gray-200 font-bold">conformidade interna (GRC)</span>: a <NriskBrand /> une scan técnico e evidências profundas para uma visão de risco sem pontos cegos.
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-12 flex flex-wrap justify-center gap-6">
            <Link
              to="/nrisk/contact"
              className="group inline-flex items-center justify-center rounded-sm bg-accent px-8 py-4 text-sm font-bold text-gray-900 shadow-[0_0_30px_rgba(0,173,232,0.2)] transition-smooth hover:scale-105 hover:shadow-[0_0_40px_rgba(0,173,232,0.4)] hover:brightness-110 uppercase tracking-widest"
            >
              Solicitar Demonstração
            </Link>
            <Link
              to="/nrisk/methodology"
              className="inline-flex items-center justify-center rounded-sm border-[1px] border-accent/40 bg-transparent px-8 py-4 text-sm font-bold text-accent transition-smooth hover:bg-accent/10 hover:border-accent uppercase tracking-widest"
            >
              Ver Metodologia
            </Link>
          </div>
        </div>
        <div className="opacity-0 animate-fade-in-up animate-delay-400 mx-auto mt-20 max-w-6xl px-4">
          <div className="rounded-sm border-[1px] border-gray-800 bg-gray-900/50 p-2 shadow-2xl backdrop-blur-sm">
            <ProductMock />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-950 px-4 py-16 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl text-center">
            Por que a <NriskBrand />?
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group relative p-8 rounded-sm border-[1px] border-gray-800 bg-gray-900 transition-smooth hover:border-accent/40 hover:shadow-2xl"
              >
                <p className="font-bold text-accent uppercase text-xs tracking-widest">{item.title}</p>
                <div className="mt-4 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">{item.textJsx ?? item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Soluções Integradas de Risco
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
                  <Link to={sol.href} className="mt-10 text-xs font-bold text-accent uppercase tracking-widest hover:underline">Ver Solução &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-900 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-center sm:text-4xl text-center">
            Capacidades da Plataforma
          </h2>
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {PRODUCTS.map((p) => (
              <div
                key={p.label}
                className="group relative rounded-sm border-[1px] border-gray-800 bg-gray-950 p-8 transition-smooth hover:border-accent/40"
              >
                <p className="font-bold text-gray-100">{p.label}</p>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-950 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Comece em Poucos Dias
          </h2>
          <p className="mt-4 text-gray-400">
            Processo guiado para ativar sua visibilidade de risco com agilidade.
          </p>
          <div className="mt-20 grid gap-8 sm:grid-cols-2 text-left">
            {ONBOARDING.map((item, i) => (
              <div key={i} className="group relative pl-8 border-l-[1px] border-gray-800 transition-smooth hover:border-accent">
                <span className="absolute left-0 top-0 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 border-[1px] border-gray-800 text-[10px] font-bold text-gray-500 group-hover:border-accent group-hover:text-accent">
                  {i + 1}
                </span>
                <p className="font-bold text-gray-100">{item.step}</p>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export default NriskOverview;
