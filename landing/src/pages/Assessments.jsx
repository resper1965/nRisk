import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import CtaSection from "../components/CtaSection";

const WHY_ITEMS = [
  {
    title: "Questionários sem evidência não bastam",
    text: "Avaliações declarativas precisam ser validadas. A n.Risk mapeia respostas a controles e faz conferência cruzada com achados técnicos — inconsistências reduzem o Fator de Confiança e orientam priorização.",
  },
  {
    title: "Cofre de evidências com trilha de auditoria",
    text: "Upload, comentários, aprovação e integridade garantida. Em trilhas Prata/Ouro, evidência pode ser obrigatória. Demandantes acessam conforme RBAC.",
  },
  {
    title: "Trust Center para terceiros",
    text: "Score, categoria, eixos, status de evidências e documentos liberados. Visibilidade configurável por perfil — seguradoras, clientes e parceiros veem apenas o que precisam.",
  },
];

const SOLUTIONS = [
  {
    title: "Questionários por framework",
    desc: "Frameworks padronizados com mapeamento a controles",
    bullets: ["ISO 27001, NIST CSF, LGPD", "Respostas Sim / Não / NA", "Conferência cruzada com scan"],
    href: "/nrisk/methodology",
  },
  {
    title: "Cofre de evidências",
    desc: "Evidências centralizadas com governança",
    bullets: ["Upload e aprovação", "Trilha de auditoria", "Integridade garantida"],
    href: "/nrisk/methodology",
  },
  {
    title: "Trust Center",
    desc: "Visibilidade para demandantes e terceiros",
    bullets: ["Score e eixos por perfil", "Status de evidências", "RBAC e documentação"],
    href: "/nrisk/supply-chain",
  },
];

const PRODUCTS = [
  { label: "Questionários e frameworks", desc: "ISO 27001, NIST CSF, LGPD mapeados a controles" },
  { label: "Conferência cruzada", desc: "Declaração vs scan por controle" },
  { label: "Cofre de evidências", desc: "Upload, aprovação e trilha de auditoria" },
  { label: "Trust Center", desc: "Visibilidade configurável para terceiros" },
  { label: "Submissão controlada", desc: "Admin/CISO submete, resultados auditáveis" },
];

const FAQ_ITEMS = [
  { id: 1, question: "Quais frameworks estão disponíveis?", answer: "Questionários vinculados a frameworks como ISO 27001, NIST CSF e LGPD. Perguntas mapeadas a controles para conferência cruzada com achados técnicos. Novos frameworks podem ser adicionados conforme demanda." },
  { id: 2, question: "Quem pode submeter a avaliação?", answer: "Apenas Admin ou CISO. Respostas ficam congeladas após submissão até nova rodada. Resultados auditáveis para demandantes — seguradoras, clientes e parceiros acessam conforme RBAC." },
  { id: 3, question: "O que é o Cofre de evidências?", answer: "Armazenamento seguro de evidências (upload, comentários, aprovação). Trilha de auditoria e integridade. Em trilhas Prata/Ouro, evidência pode ser obrigatória para controles selecionados." },
  { id: 4, question: "O que terceiros veem no Trust Center?", answer: "Score, categoria, eixos, status de evidências e documentos liberados, conforme RBAC. Cada perfil de demandante vê apenas o que está configurado para ele." },
];

export default function Assessments() {
  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="opacity-0 animate-fade-in text-sm font-medium uppercase tracking-wider text-accent">
            Avaliações
          </p>
          <h1 className="opacity-0 animate-fade-in animate-delay-100 mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
            Avaliações padronizadas com{" "}
            <span className="text-accent">evidências e governança</span>
          </h1>
          <p className="opacity-0 animate-fade-in animate-delay-200 mt-6 mx-auto max-w-2xl text-lg text-gray-400">
            Para equipes de TPRM, GRC e compliance, a n.Risk é uma ferramenta para avaliar fornecedores e parceiros com questionários por framework, evidências centralizadas e Trust Center. Confiança medida, não só declarada.
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
              Ver metodologia
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Por que a n.Risk para avaliações?
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Avaliações declarativas sem validação deixam você vulnerável. A n.Risk combina questionários por framework com conferência cruzada e evidências centralizadas.
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

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Soluções para Questionários e Avaliações
          </h2>
          <p className="mt-3 text-gray-400">
            A n.Risk oferece recursos desenhados para avaliar fornecedores e parceiros com transparência e evidências.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SOLUTIONS.map((sol) => (
              <Link
                key={sol.title}
                to={sol.href}
                className="group block rounded-xl border-2 border-gray-800 p-6 text-left transition-smooth hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
              >
                <p className="font-semibold text-accent group-hover:text-accent">{sol.title}</p>
                <p className="mt-2 text-sm font-medium text-gray-300">{sol.desc}</p>
                <ul className="mt-4 space-y-2">
                  {sol.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-gray-400">
                      <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 bg-gray-950 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl text-center">
            Produtos e serviços
          </h2>
          <p className="mt-3 text-gray-400 text-center max-w-2xl mx-auto">
            Portfolio de recursos para avaliações padronizadas com evidências e governança.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRODUCTS.map((p) => (
              <div
                key={p.label}
                className="rounded-lg border-2 border-accent/30 bg-gray-800/50 p-4 transition-smooth hover:border-accent/50"
              >
                <p className="font-medium text-gray-100">{p.label}</p>
                <p className="mt-1 text-sm text-gray-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
            Snapshot da avaliação
          </h2>
          <p className="mt-3 text-gray-400 text-sm">
            Exemplo de progresso, evidências e status.
          </p>
          <div className="mt-8 rounded-xl border-2 border-accent/30 bg-gray-800/80 p-6 shadow-sm transition-smooth hover:border-accent/50 hover:shadow-accent/5">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">Progresso</p>
            <p className="mt-1 text-3xl font-bold text-gray-100">72%</p>
            <p className="mt-2 text-sm text-gray-400">Status: Em andamento</p>
            <p className="mt-1 text-xs text-gray-500">Evidências pendentes: 2 | Aprovadas: 5</p>
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
