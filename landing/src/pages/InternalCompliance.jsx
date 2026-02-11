import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";
import NriskBrand from "../components/NriskBrand";

const WHY_ITEMS = [
  {
    title: "Postura Interna Auditável",
    textJsx: <>A <NriskBrand /> não é apenas um dashboard, é uma lupa sobre seus controles. No portal GRC, você gerencia questionários profundos com cruzamento automático de evidências multimídia e trilhas de auditoria imutáveis.</>,
  },
  {
    title: "Mapeamento em Camadas (GRC Portal)",
    text: "Responda uma vez e mapeie para múltiplos padrões. Nossa inteligência de mapeamento correlaciona suas respostas de self-assessment com controles da ISO 27001, NIST, PCI-DSS e LGPD em tempo real.",
  },
  {
    title: "Underwriting Híbrido",
    text: "Perfeito para empresas e essencial para seguros. Combine a visão de scan fora-para-dentro com o detalhamento de dentro-para-fora. Ofereça uma visão de risco sem pontos cegos para brokers e seguradoras.",
  },
];

const SOLUTIONS = [
  {
    title: "Self-Assessment Dinâmico",
    desc: "Vá além dos campos de texto genéricos",
    bullets: ["Questionários inteligentes e contextuais", "Upload de evidências integrado por controle", "Score de maturidade por domínio técnico"],
    href: "/nrisk/assessments",
  },
  {
    title: "Third-Party Risk Management",
    desc: "Qualifique o risco de todo o seu ecossistema",
    bullets: ["Avaliação de parceiros (TPRM)", "Mapeamento de questionários de terceiros", "Histórico de evolução e recorrência"],
    href: "/nrisk/methodology",
  },
  {
    title: "Insurance Readiness",
    desc: "Acelere sua jornada de ciberseguros",
    bullets: ["Visão de risco para Underwriting", "Relatórios prontos para brokers", "Redução de prêmio baseada em evidência"],
    href: "/nrisk/assessments",
  },
];

const PRODUCTS = [
  { label: "Portal de Questionários", desc: "Fluxos de avaliação profunda com suporte a fluxos de aprovação e RBAC." },
  { label: "Mapeamento Transversal", desc: "Visibilidade única sobre aderência a normas nacionais e internacionais." },
  { label: "Evidência Imutável", desc: "Cofre centralizado para documentos, políticas e registros técnicos." },
  { label: "Relatórios Estratégicos", desc: "Insights executivos para C-Level, Conselhos e Entidades Externas." },
  { label: "Monitoramento Contínuo", desc: "Alertas para desvios de conformidade e vencimento de controles." },
  { label: "Data Integrity", desc: "Garantia de que o declarado condiz com a observação técnica real." },
];

const FAQ_ITEMS = [
  { id: 1, question: <>Como funcionam os questionários na n.Risk?</>, answer: <>Nossos questionários são projetados para capturar a profundidade operacional dos controles. Eles permitem anexar evidências, gerenciar responsáveis por domínio e geram pontuações automáticas baseadas em frameworks de mercado.</> },
  { id: 2, question: "O n.Risk substitui uma consultoria de GRC?", answer: "Nós potencializamos a consultoria. Atuamos como o portal tecnológico onde o CISO ou o Security Officer centraliza toda a gestão de evidências e conformidade, tornando o processo ágil e baseado em dados reais." },
  { id: 3, question: "Como o corretor de seguros utiliza essa página?", answer: "O corretor usa a n.Risk para avaliar se o cliente tem a maturidade necessária para uma apólice. O portal de compliance fornece os dados necessários para o underwriting, reduzindo incertezas e agilizando a emissão." },
];

export default function InternalCompliance() {
  return (
    <div className="bg-gray-950">
      <section className="relative overflow-hidden border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20 [background-image:radial-gradient(#00ade8_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Deep Gap Analysis
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-100 sm:text-5xl lg:text-7xl">
            Sua Postura de Risco, <br className="hidden sm:block" />
            <span className="text-accent italic">Auditada e Sob Controle</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-8 mx-auto max-w-3xl text-xl leading-relaxed text-gray-400">
            Do <span className="text-gray-200 font-bold">Third-Party Risk (TPRA)</span> ao <span className="text-gray-200 font-bold">Self-Assessment</span>: Um portal GRC completo que une visibilidade técnica e questionários profundos baseados em evidências.
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-12 flex flex-wrap justify-center gap-6">
            <Link
              to="/nrisk/contact"
              className="group inline-flex items-center justify-center rounded-sm bg-accent px-8 py-4 text-sm font-bold text-gray-900 shadow-[0_0_30px_rgba(0,173,232,0.2)] transition-smooth hover:scale-105 hover:shadow-[0_0_40px_rgba(0,173,232,0.4)] hover:brightness-110 uppercase tracking-widest"
            >
              Iniciar Autoavaliação
            </Link>
            <Link
              to="/nrisk/methodology"
              className="inline-flex items-center justify-center rounded-sm border-[1px] border-accent/40 bg-transparent px-8 py-4 text-sm font-bold text-accent transition-smooth hover:bg-accent/10 hover:border-accent uppercase tracking-widest"
            >
              Conheça a Metodologia
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-900 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                O único portal que une <br /> <span className="text-accent">Diferentes Dimensões de Risco</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                O gerenciamento de GRC tradicional falha por ser estático. A <NriskBrand /> traz agilidade e integração técnica para que sua equipe tenha a visibilidade necessária de dentro para fora, e de fora para dentro.
              </p>
              <div className="mt-10 space-y-8">
                {WHY_ITEMS.map((item) => (
                  <div key={item.title} className="group relative pl-6 border-l-[1px] border-gray-700 transition-smooth hover:border-accent">
                    <p className="font-bold text-accent uppercase text-xs tracking-widest">{item.title}</p>
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">{item.textJsx ?? item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-sm border-[1px] border-gray-800 bg-gray-950 p-4 shadow-3xl lg:translate-x-8">
              <div className="absolute -inset-4 z-0 rounded-sm bg-gradient-to-tr from-accent/10 to-transparent opacity-50 blur-2xl" />
              <div className="relative z-10 flex h-full items-center justify-center overflow-hidden rounded-sm border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="p-8 text-center">
                  <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4">Portal GRC Preview</p>
                  <div className="space-y-3">
                    <div className="h-2 w-48 rounded-full bg-gray-800 animate-pulse" />
                    <div className="h-2 w-32 rounded-full bg-gray-800 animate-pulse delay-75" />
                    <div className="h-2 w-40 rounded-full bg-gray-800 animate-pulse delay-150" />
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="aspect-video rounded-sm border border-gray-700 bg-gray-800/50" />
                    <div className="aspect-video rounded-sm border border-gray-700 bg-gray-800/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Soluções de Risco Transversal
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Da subscrição de seguros à auditoria interna, a <NriskBrand /> oferece os instrumentos para uma gestão de conformidade moderna.
          </p>
          <div className="mt-16 grid gap-0 md:grid-cols-3 border-[1px] border-gray-800">
            {SOLUTIONS.map((sol) => (
              <div
                key={sol.title}
                className="group relative p-10 text-left transition-smooth hover:bg-accent/5 border-[1px] border-transparent hover:border-accent/20"
              >
                <div className="flex flex-col h-full">
                  <p className="font-bold text-accent uppercase text-xs tracking-widest">{sol.title}</p>
                  <p className="mt-3 text-lg font-bold text-gray-100">{sol.desc}</p>
                  <ul className="mt-6 space-y-3 flex-grow">
                    {sol.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-sm text-gray-400">
                        <span className="shrink-0 mt-1.5 h-1 w-1 bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link to={sol.href} className="mt-8 text-xs font-bold text-accent uppercase tracking-widest hover:underline">Saiba Mais &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800/50 bg-gray-900 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-center sm:text-4xl">
            Capacidades do Portal
          </h2>
          <p className="mt-4 text-gray-400 sm:text-center max-w-2xl mx-auto">
            Eleve o nível da sua governança cibernética com recursos desenhados para o rigor profissional.
          </p>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <div
                key={p.label}
                className="group relative overflow-hidden rounded-sm border-[1px] border-gray-800 bg-gray-950 p-6 transition-smooth hover:border-accent/40"
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
            Protocolos de Suporte
          </h2>
          <div className="mt-16"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
