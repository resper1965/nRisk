import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProcessSteps } from "@/components/tpra/process-steps";
import { RiskScoreCard } from "@/components/tpra/risk-score-card";
import { BestPractices } from "@/components/tpra/best-practices";
import { MetricsTable } from "@/components/tpra/metrics-table";
import Link from "next/link";

const painPoints = [
  {
    stat: "69%",
    text: "das empresas dizem que seus fornecedores tem seguranca mais fraca que a deles",
  },
  {
    stat: "20%",
    text: "sofreram violacao de dados por causa de um terceiro",
  },
  {
    stat: "+26%",
    text: "e o custo extra de um breach via supply chain",
  },
];

const incidents = [
  { name: "SolarWinds", impact: "18.000 empresas via update", year: "2020" },
  { name: "Kaseya", impact: "1.500 empresas via MSP", year: "2021" },
  { name: "MOVEit", impact: "67M registros expostos", year: "2023" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero — Lead with the pain */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-light to-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Voce confia nos seus fornecedores.{" "}
                <span className="text-primary">Deveria verificar.</span>
              </h1>
              <p className="mt-6 text-xl text-muted">
                O n.Risk mostra o risco cibernetico real de cada fornecedor em
                minutos — com scan automatico, cross-check e score transparente.
                Sem instalar nada. Sem depender deles.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/#agendar"
                  className="rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
                >
                  Agendar Demo Gratuita
                </Link>
                <Link
                  href="/trust/demo"
                  className="rounded-lg border border-border px-8 py-3.5 text-base font-medium transition-colors hover:bg-card"
                >
                  Ver Trust Center ao vivo
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted">
                Setup em minutos. Sem cartao. Sem instalacao.
              </p>
            </div>
          </div>
        </section>

        {/* Pain — Stats that hurt */}
        <section id="problema" className="border-b border-border bg-card py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-danger">
              O problema e real
            </h2>
            <p className="mb-12 text-center text-2xl font-bold">
              Seus fornecedores sao o elo mais fraco da sua seguranca
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {painPoints.map((p) => (
                <div key={p.stat} className="text-center">
                  <p className="text-5xl font-bold text-danger">{p.stat}</p>
                  <p className="mt-3 text-muted">{p.text}</p>
                </div>
              ))}
            </div>

            {/* Incident strip */}
            <div className="mt-12 rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="mb-4 text-center text-sm font-semibold text-red-800">
                Isso ja aconteceu — e vai acontecer de novo
              </p>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                {incidents.map((inc) => (
                  <div key={inc.name} className="text-center">
                    <p className="text-lg font-bold text-red-800">{inc.name}</p>
                    <p className="text-sm text-red-600">{inc.impact}</p>
                    <p className="text-xs text-red-400">{inc.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Solution — Score card */}
        <RiskScoreCard />

        {/* How it works — 5 steps */}
        <ProcessSteps />

        {/* Who is it for — Personas with pain + benefits */}
        <BestPractices />

        {/* Social proof + FAQ + Final CTA */}
        <MetricsTable />
      </main>
      <Footer />
    </>
  );
}
