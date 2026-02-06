import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProcessSteps } from "@/components/tpra/process-steps";
import { RiskScoreCard } from "@/components/tpra/risk-score-card";
import { BestPractices } from "@/components/tpra/best-practices";
import { MetricsTable } from "@/components/tpra/metrics-table";
import Link from "next/link";

const stats = [
  { value: "69%", label: "das empresas relatam postura de seguranca mais fraca em fornecedores" },
  { value: "20%", label: "sofreram violacoes de dados atraves de terceiros" },
  { value: "26%", label: "maior o custo de breach via supply chain vs direto" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-light to-background py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary-light px-4 py-1.5 text-sm font-medium text-primary">
                Third-Party Risk Assessment (TPRA)
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Avaliacao de Riscos Ciberneticos de{" "}
                <span className="text-primary">Terceiros</span>
              </h1>
              <p className="mt-6 text-lg text-muted">
                Identifique, analise e mitigue vulnerabilidades introduzidas por
                parceiros, fornecedores e prestadores de servicos no ecossistema
                da sua organizacao. Plataforma completa de TPRA com score
                transparente, cross-check e conformidade LGPD/ISO 27001.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/grc/tpra"
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Conhecer a Plataforma
                </Link>
                <Link
                  href="#etapas"
                  className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-card"
                >
                  Ver Etapas do Processo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section id="tpra" className="border-b border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">Por que TPRA e critico</h2>
              <p className="mt-2 text-muted">
                A gestao de risco de terceiros (TPRM) nao e apenas conformidade — e uma estrategia de defesa ativa
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.value} className="text-center">
                  <p className="text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cycle diagram */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ciclo Continuo TPRA
              </h2>
              <p className="mt-4 text-lg text-muted">
                TPRM protege a cadeia de suprimentos, reduz superficie de
                ataque, acelera resposta a incidentes e viabiliza seguro
                cibernetico
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Identificacao",
                    desc: "Cadastro multi-tenant",
                    color: "border-blue-500 bg-blue-50",
                    textColor: "text-blue-700",
                  },
                  {
                    step: "2",
                    title: "Due Diligence",
                    desc: "Assessment hibrido",
                    color: "border-indigo-500 bg-indigo-50",
                    textColor: "text-indigo-700",
                  },
                  {
                    step: "3",
                    title: "Scoring",
                    desc: "Score A-F transparente",
                    color: "border-cyan-500 bg-cyan-50",
                    textColor: "text-cyan-700",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`rounded-xl border-2 p-6 text-center ${item.color}`}
                  >
                    <div
                      className={`text-3xl font-bold ${item.textColor}`}
                    >
                      {item.step}
                    </div>
                    <h3 className={`mt-2 font-semibold ${item.textColor}`}>
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="my-4 flex justify-center">
                <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    step: "5",
                    title: "Monitoramento",
                    desc: "Re-scan + snapshots",
                    color: "border-amber-500 bg-amber-50",
                    textColor: "text-amber-700",
                  },
                  {
                    step: "4",
                    title: "Conformidade",
                    desc: "Cross-check, LGPD, ISO",
                    color: "border-emerald-500 bg-emerald-50",
                    textColor: "text-emerald-700",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`rounded-xl border-2 p-6 text-center ${item.color}`}
                  >
                    <div
                      className={`text-3xl font-bold ${item.textColor}`}
                    >
                      {item.step}
                    </div>
                    <h3 className={`mt-2 font-semibold ${item.textColor}`}>
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ProcessSteps />
        <RiskScoreCard />
        <BestPractices />
        <MetricsTable />

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-12 text-center text-white">
              <h2 className="text-3xl font-bold">
                Proteja sua cadeia de suprimentos
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Comece a avaliar a postura cibernetica dos seus fornecedores com
                o n.Risk. Score transparente, cross-check automatizado e
                conformidade LGPD/ISO 27001.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/grc/tpra"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-blue-50"
                >
                  Acessar Plataforma
                </Link>
                <Link
                  href="/trust/demo"
                  className="rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Ver Trust Center Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
