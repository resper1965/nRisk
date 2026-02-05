import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const SOLUTIONS = ["Triagem inicial", "Subscrição contínua", "Visão de portfólio"];
const PRODUCTS = ["Score híbrido", "Penalidade crítica", "Scores por eixo", "Histórico", "Relatórios"];

const FAQ_ITEMS = [
  { id: 1, question: "Como o score apoia a subscrição?", answer: "Score híbrido (técnico + declarativo) e categoria A-F permitem triagem e precificação. Scores por eixo e histórico apoiam decisão e renovação." },
  { id: 2, question: "O que é penalidade crítica?", answer: "Se existir qualquer achado de severidade crítica, o score final é limitado (teto), independentemente do assessment. Garante visibilidade de risco extremo." },
  { id: 3, question: "Quais relatórios estão disponíveis?", answer: "Relatórios para diretoria e subscritores estão em roadmap. Hoje: score, eixos, inconsistências e histórico via API e interface." },
];

export default function Insurance() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Subscrição com sinais e evidências.
          </h1>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Soluções</h2>
          <ul className="mt-8 space-y-2">
            {SOLUTIONS.map((s) => (
              <li key={s} className="flex gap-2"><span className="text-[#00ade0]">•</span><span className="text-gray-300">{s}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Produtos e serviços</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {PRODUCTS.map((p) => (
              <span key={p} className="rounded-md border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 shadow-sm">{p}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Achados críticos e score</h2>
          <p className="mt-4 text-gray-400">
            A existência de qualquer achado de severidade crítica limita o score final, independentemente do assessment. Subscrição e monitoramento ganham visibilidade explícita de risco extremo.
          </p>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Perguntas frequentes</h2>
          <div className="mt-10"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
