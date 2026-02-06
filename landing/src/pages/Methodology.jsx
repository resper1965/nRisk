import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const WHY_ITEMS = [
  {
    title: "Score defensável para decisão",
    text: "Metodologia transparente: score técnico + declarativo, ajustado pelo Fator de Confiança. Categoria A–F e penalidade crítica garantem visibilidade de risco extremo.",
  },
  {
    title: "Conferência cruzada reduz inconsistências",
    text: "Declaração vs observação por controle. Quando a empresa declara implementado e o scan aponta falha, a resposta é marcada como inconsistente — Fator de Confiança reduz o peso do declarativo.",
  },
  {
    title: "Histórico auditável",
    text: "Cada avaliação gera um instantâneo. Antes/depois, justificativas aprovadas e evolução registrados para tendência, prestação de contas e subscrição.",
  },
];

const CONCEPTS = [
  { title: "Score híbrido", desc: "Técnico (scan) + declarativo (avaliação) ajustado pelo Fator de Confiança. Categoria A–F." },
  { title: "Conferência cruzada", desc: "Declaração vs observação por controle. Inconsistências reduzem o Fator de Confiança." },
  { title: "Fator de Confiança", desc: "Métrica explícita (0–1) que reduz o peso do declarativo quando há inconsistências." },
  { title: "Penalidade crítica", desc: "Achado crítico limita o score final. Visibilidade de risco extremo para decisão." },
  { title: "Scores por eixo", desc: "Rating A–F por eixo para priorização e comunicação executiva.", example: ["Redes: B", "Criptografia: A", "Patch: C", "E-mail: B", "Headers: D", "Exposição: B"] },
  { title: "Histórico", desc: "Instantâneos, antes/depois, justificativas aprovadas. Tendência e prestação de contas." },
];

const FAQ_ITEMS = [
  { id: 1, question: "Como é calculado o score híbrido?", answer: "Combina score técnico (scan) e score declarativo (avaliação), ajustado pelo Fator de Confiança. Penalidade crítica aplica teto se houver achado crítico. O resultado é uma nota 0–1000 com categoria A–F." },
  { id: 2, question: "O que é conferência cruzada?", answer: "Comparação declaração vs observação por controle. Se a empresa declarou implementado e o scan aponta falha no mesmo controle, a resposta é marcada como inconsistente e o Fator de Confiança é reduzido." },
  { id: 3, question: "O que é Fator de Confiança?", answer: "Métrica explícita (0–1) que reduz o peso do score declarativo quando há inconsistências. Quanto mais inconsistências, menor o fator. Resultado persistido no instantâneo para decisão e auditoria." },
  { id: 4, question: "O que é penalidade crítica?", answer: "Se existir qualquer achado de severidade crítica no scan, o score final é limitado (teto), independentemente da avaliação. Garante visibilidade explícita de risco extremo para subscrição e TPRM." },
  { id: 5, question: "O que são scores por eixo?", answer: "Rating A–F por eixo (domínio técnico). Além do score global, permite priorização e comunicação executiva por categoria de controle — redes, criptografia, patch, e-mail, headers, exposição." },
  { id: 6, question: "Como funciona o histórico?", answer: "Cada avaliação gera um instantâneo. Antes/depois, justificativas aprovadas e evolução ficam registrados para tendência, prestação de contas e decisões de renovação ou qualificação." },
];

export default function Methodology() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-medium uppercase tracking-wider text-accent">
            Metodologia
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Metodologia clara. Resultado <span className="text-accent">defensável</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-6 mx-auto max-w-2xl text-lg text-gray-400">
            Para subscritores, TPRM e compliance, a n.Risk oferece uma metodologia transparente: score híbrido, conferência cruzada e histórico auditável. Confiança medida com transparência.
          </p>
          <div className="opacity-0 animate-fade-in animate-delay-300 mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/nrisk/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-accent/20 transition-smooth hover:scale-105 hover:shadow-accent/30 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Solicitar demonstração
            </Link>
            <Link
              to="/nrisk/assessments"
              className="inline-flex items-center justify-center rounded-md border-2 border-accent/50 bg-transparent px-6 py-3 text-sm font-semibold text-accent transition-smooth hover:bg-accent/10 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Ver avaliações
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Por que a metodologia importa?
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Uma metodologia transparente e defensável é essencial para decisões de subscrição, TPRM e compliance. A n.Risk combina dados técnicos e declarativos com métricas explícitas.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3 text-left">
            {WHY_ITEMS.map((item) => (
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

      <section className="scroll-mt-20 border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl text-center">
            Conceitos da metodologia
          </h2>
          <p className="mt-3 text-gray-400 text-center max-w-2xl mx-auto">
            Entenda como score, conferência cruzada e Fator de Confiança funcionam.
          </p>
          <div className="mt-12 space-y-6">
            {CONCEPTS.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border-2 border-gray-800 p-6 transition-smooth hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
              >
                <p className="font-semibold text-accent">{c.title}</p>
                <p className="mt-3 text-gray-400">{c.desc}</p>
                {c.example && (
                  <div className="mt-6 rounded-lg border-2 border-accent/20 bg-gray-800/50 p-4">
                    <ul className="space-y-2 text-sm text-gray-300">
                      {c.example.map((row) => (
                        <li key={row} className="flex gap-2">
                          <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-accent mt-1.5" />
                          {row}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Perguntas frequentes
          </h2>
          <div className="mt-10"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
