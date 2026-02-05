import { Link } from "react-router-dom";
import ProductMock from "../components/ProductMock";
import CtaSection from "../components/CtaSection";

const WHY_BULLETS = [
  "Pare de depender de declarações sem prova — detecte inconsistências entre o que o fornecedor diz e o que o scan encontra.",
  "Priorize com clareza: score híbrido 0–1000, Fator de Confiança e eixos técnicos para decisão em subscrição e TPRM.",
  "Remedie com rastreabilidade: evidências centralizadas, instantâneos e trilha de auditoria para compliance e subscritores.",
];

const USE_CASES = [
  {
    title: "Seguradoras",
    bullets: ["Subscrição baseada em score e eixos", "Monitoramento contínuo das apólices", "Relatórios para diretoria e subscritores"],
    result: "Subscrição e monitoramento com rastreabilidade.",
  },
  {
    title: "TPRM / GRC",
    bullets: ["Qualificação contínua de fornecedores", "Evidências centralizadas", "Alertas e Trust Center"],
    result: "Qualificação contínua e evidências centralizadas.",
  },
  {
    title: "CISO / TI",
    bullets: ["Clareza sobre priorização", "Correções comprováveis", "Justificativas e trilha de auditoria"],
    result: "Clareza, priorização e correções comprováveis.",
  },
];

const RESOURCES = [
  "Scan técnico",
  "Avaliações",
  "Cofre de evidências",
  "Cross-Check",
  "Scores por eixo",
  "Instantâneos",
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
            O problema com avaliações tradicionais
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Declarações sem evidência deixam você vulnerável. A n.Risk muda isso.
          </p>
          <ul className="mt-10 mx-auto max-w-2xl space-y-5 text-left">
            {WHY_BULLETS.map((text, i) => (
              <li key={i} className={`flex gap-3 opacity-0 animate-fade-in ${i === 0 ? "animate-delay-200" : i === 1 ? "animate-delay-300" : "animate-delay-400"}`}>
                <span className="shrink-0 mt-1.5 h-2 w-2 rounded-full bg-accent" />
                <span className="text-gray-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Feito para <span className="text-accent">quem decide</span>
          </h2>
          <p className="mt-3 text-gray-400">
            Seguradoras, equipes TPRM/GRC e CISOs confiam na n.Risk para risco de terceiros.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3 justify-items-center">
            {USE_CASES.map((uc, idx) => (
              <div
                key={uc.title}
                className={`group opacity-0 animate-scale-in rounded-xl border-2 border-gray-800 p-6 w-full max-w-sm transition-smooth hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 ${idx === 0 ? "" : idx === 1 ? "animate-delay-150" : "animate-delay-300"}`}
              >
                <p className="font-semibold text-accent">{uc.title}</p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-400">
                  {uc.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-medium text-gray-200 border-t border-gray-800 pt-4">
                  Resultado: <span className="text-accent">{uc.result}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Tudo em um só lugar
          </h2>
          <p className="mt-3 text-gray-400">
            Recursos que transformam risco cibernético em decisão acionável.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {RESOURCES.map((r, i) => (
              <span
                key={r}
                className="rounded-lg border-2 border-accent/30 bg-gray-800/80 px-4 py-2 text-sm font-medium text-gray-200 shadow-sm transition-smooth hover:border-accent hover:bg-accent/10 hover:scale-105"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Monitoramento <span className="text-accent">contínuo</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Tendência de score, inconsistências entre declaração e scan, evidências pendentes e
            justificativas em análise. Tudo persistido e consumível por demandantes conforme RBAC.
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
