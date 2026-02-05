import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const FAQ_ITEMS = [
  { id: 1, question: "Como é calculado o score híbrido?", answer: "Combina score técnico (scan) e score declarativo (assessment), ajustado pelo Fator de Confiança. Penalidade crítica aplica teto se houver achado crítico." },
  { id: 2, question: "O que é conferência cruzada?", answer: "Comparação declaração vs observação por controle. Se a empresa declarou implementado e o scan aponta falha no mesmo controle, a resposta é marcada como inconsistente." },
  { id: 3, question: "O que é Fator de Confiança?", answer: "Métrica explícita (0–1) que reduz o peso do score declarativo quando há inconsistências. Resultado persistido no instantâneo." },
  { id: 4, question: "O que é penalidade crítica?", answer: "Se existir qualquer achado de severidade crítica, o score final é limitado (teto), independentemente do assessment. Garante visibilidade de risco extremo." },
  { id: 5, question: "O que são scores por eixo?", answer: "Rating A–F por eixo (domínio). Além do score global, permite priorização e comunicação executiva por categoria de controle." },
  { id: 6, question: "Como funciona o histórico?", answer: "Cada assessment gera um instantâneo. Antes/depois, justificativas aprovadas e evolução ficam registrados para tendência e prestação de contas." },
];

export default function Methodology() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Metodologia clara. Resultado defensável.
          </h1>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Score híbrido</h2>
            <p className="mt-4 text-gray-400">Técnico (scan) + declarativo (assessment) ajustado pelo Fator de Confiança. Categoria A–F.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Conferência cruzada</h2>
            <p className="mt-4 text-gray-400">Declaração vs observação por controle. Inconsistências reduzem o Fator de Confiança.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Fator de Confiança</h2>
            <p className="mt-4 text-gray-400">Métrica explícita (0–1) que reduz o peso do declarativo quando há inconsistências.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Penalidade crítica</h2>
            <p className="mt-4 text-gray-400">Achado crítico limita o score final. Visibilidade de risco extremo para decisão.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Scores por eixo</h2>
            <p className="mt-4 text-gray-400">Rating A–F por eixo para priorização e comunicação executiva.</p>
            <div className="mt-6 rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm">
              <ul className="space-y-2 text-sm text-gray-300">
                {["Redes: B", "Criptografia: A", "Patch: C", "E-mail: B", "Headers: D", "Exposição: B"].map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Histórico</h2>
            <p className="mt-4 text-gray-400">Instantâneos, antes/depois, justificativas aprovadas. Tendência e prestação de contas.</p>
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Perguntas frequentes</h2>
          <div className="mt-10"><Accordion items={FAQ_ITEMS} /></div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
