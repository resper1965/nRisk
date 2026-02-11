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
        <section className="relative overflow-hidden bg-gray-950 px-4 py-24 sm:px-6 lg:py-32">
          <div className="absolute inset-0 z-0 opacity-20 [background-image:radial-gradient(#00ade8_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6 animate-fade-in">
                Third-Party Risk Management (TPRA)
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl lg:text-7xl animate-fade-in-up">
                Confiança que <br />
                <span className="text-accent italic font-medium">pode ser verificada.</span>
              </h1>
              <p className="mt-8 text-xl leading-relaxed text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100 transition-smooth">
                A única plataforma que cruza <span className="text-gray-100 font-bold">questionários profundos</span> com <span className="text-gray-100 font-bold">scan técnico</span> em tempo real. Score híbrido 0-1000 com evidência auditável.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row animate-fade-in-up delay-200">
                <Link
                  href="/#agendar"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm bg-accent px-10 py-4 text-base font-bold text-gray-900 shadow-[0_0_20px_rgba(0,173,232,0.1)] transition-smooth hover:scale-105 hover:shadow-[0_0_30px_rgba(0,173,232,0.3)] hover:brightness-110 uppercase tracking-widest"
                >
                  Solicitar Score Gratuito
                </Link>
                <Link
                  href="/trust/demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm border-[1px] border-accent/40 bg-transparent px-10 py-4 text-base font-bold text-accent transition-smooth hover:bg-accent/10 hover:border-accent uppercase tracking-widest"
                >
                  Explorar Trust Center
                </Link>
              </div>
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
