import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const FRAMEWORKS = ["ISO 27001", "NIST CSF", "LGPD"];

const FAQ_ITEMS = [
  { id: 1, question: "Quais frameworks estão disponíveis?", answer: "Questionários vinculados a frameworks como ISO 27001, NIST CSF e LGPD. Perguntas mapeadas a controles para conferência cruzada com achados técnicos." },
  { id: 2, question: "Quem pode submeter a avaliação?", answer: "Apenas Admin ou CISO. Respostas ficam congeladas após submissão até nova rodada. Resultados auditáveis para demandantes." },
  { id: 3, question: "O que é o Cofre de evidências?", answer: "Armazenamento seguro de evidências (upload, comentários, aprovação). Trilha de auditoria e integridade. Em trilhas Prata/Ouro, evidência pode ser obrigatória." },
  { id: 4, question: "O que terceiros veem no Trust Center?", answer: "Score, categoria, eixos, status de evidências e documentos liberados, conforme RBAC." },
];

export default function Assessments() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Avaliações padronizadas com evidências e governança
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Questionários por framework, evidências centralizadas e Trust Center.
          </p>
        </div>
      </section>

      <section className="scroll-mt-20 border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Questionários por framework</h2>
          <p className="mt-4 text-gray-400">Exemplos: ISO 27001, NIST CSF, LGPD. Respostas Sim / Não / NA.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {FRAMEWORKS.map((f) => (
              <span key={f} className="rounded-md border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 shadow-sm">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Cofre de evidências</h2>
          <p className="mt-4 text-gray-400">Upload de evidências, comentários, aprovação e trilha de auditoria. Integridade garantida.</p>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Submissão controlada</h2>
          <p className="mt-4 text-gray-400">Apenas Admin ou CISO pode submeter. Respostas congeladas até nova rodada. Resultados consumíveis por demandantes conforme RBAC.</p>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Trust Center</h2>
          <p className="mt-4 text-gray-400">O que terceiros veem: score, eixos, evidências e status. Visibilidade configurável por perfil.</p>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">Snapshot da avaliação (exemplo)</h2>
          <div className="mt-8 rounded-lg border border-gray-800 bg-gray-800 p-5 shadow-sm">
            <p className="text-xs font-medium uppercase text-gray-500">Progresso</p>
            <p className="mt-1 text-2xl font-semibold text-gray-100">72%</p>
            <p className="mt-2 text-sm text-gray-400">Status: Em andamento</p>
            <p className="mt-1 text-xs text-gray-500">Evidências pendentes: 2 | Aprovadas: 5</p>
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
