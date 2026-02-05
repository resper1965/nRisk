import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const PRODUCT_LINE = ["TPRM", "Detecção contínua", "Intelligence", "Avaliações"];
const OUTCOMES = ["Priorização", "Redução de risco", "Relatórios executivos"];
const FEATURES = ["Conferência cruzada", "Scores por eixo", "Alertas", "Trust Center", "Evidências"];
const CAPABILITIES = ["RBAC", "Instantâneos", "Justificativas aprovadas", "APIs / Webhooks"];

const FAQ_ITEMS = [
  { id: 1, question: "Como a n.Risk qualifica fornecedores?", answer: "Combina scan outside-in com avaliações por framework. O score híbrido e os scores por eixo permitem priorizar e acompanhar a evolução." },
  { id: 2, question: "O que terceiros veem no Trust Center?", answer: "Score, categoria, eixos (A–F), status de evidências e histórico conforme permissões (RBAC)." },
  { id: 3, question: "Como funcionam os alertas?", answer: "Alertas configuráveis para finding crítico, queda de score e inconsistências. Integração por webhook e e-mail em roadmap." },
];

export default function SupplyChain() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Risco de terceiros com visibilidade contínua
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Visibilidade contínua sobre fornecedores e parceiros.
          </p>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Linha de produto</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {PRODUCT_LINE.map((item) => (
              <span key={item} className="rounded-md border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 shadow-sm">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Resultados</h2>
          <p className="mt-4 text-gray-400">Orientados a decisão.</p>
          <ul className="mt-6 space-y-2">
            {OUTCOMES.map((o) => (
              <li key={o} className="flex gap-2"><span className="text-accent">•</span><span className="text-gray-300">{o}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Recursos</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {FEATURES.map((f) => (
              <span key={f} className="rounded-md border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 shadow-sm">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Capacidades críticas</h2>
          <ul className="mt-8 space-y-2">
            {CAPABILITIES.map((c) => (
              <li key={c} className="flex gap-2"><span className="text-accent">•</span><span className="text-gray-300">{c}</span></li>
            ))}
          </ul>
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
