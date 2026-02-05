import { Link } from "react-router-dom";
import ProductMock from "../components/ProductMock";
import CtaSection from "../components/CtaSection";

const WHY_BULLETS = [
  "Risco cibernético visível quando importa: score híbrido e eixos para decisão.",
  "Confiança medida: Cross-Check e Fator de Confiança tornam as declarações auditáveis.",
  "Histórico e governança: instantâneos e evidências para subscrição e terceiros.",
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
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Risco cibernético com evidência
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Risco <span className="text-accent">mensurável</span>. Confiança para <span className="text-accent">decidir</span>.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-400">
            Sinais técnicos e avaliações em um só lugar: score híbrido, consistência medida e histórico auditável.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/nrisk/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-smooth hover:opacity-90 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Falar com especialista
            </Link>
            <Link
              to="/nrisk/methodology"
              className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 shadow-sm transition-smooth hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Ver como funciona
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-5xl px-4">
          <ProductMock />
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Por que importa
          </h2>
          <ul className="mt-8 mx-auto max-w-2xl space-y-4 text-left">
            {WHY_BULLETS.map((text, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 text-accent">•</span>
                <span className="text-gray-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Casos de uso típicos
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3 justify-items-center">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="rounded-lg border border-gray-800 p-5 shadow-sm w-full max-w-sm transition-smooth hover:border-accent/30 hover:shadow-md">
                <p className="font-medium text-gray-100">{uc.title}</p>
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-400">
                  {uc.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-medium text-gray-300">Resultado: {uc.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Recursos principais
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {RESOURCES.map((r) => (
              <span
                key={r}
                className="rounded-md border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 shadow-sm transition-smooth hover:border-accent/30"
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
            O que acompanhamos
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
            Onboarding típico
          </h2>
          <ol className="mt-8 list-decimal list-inside space-y-3 text-left text-gray-300">
            {ONBOARDING.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export default NriskOverview;
