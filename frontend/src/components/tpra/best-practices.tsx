import Link from "next/link";

const personas = [
  {
    title: "Seguradoras e Corretoras",
    subtitle: "Subscreva com dados, nao com achismo",
    pain: "Voce precifica apolices cyber sem saber o risco real do segurado? Depende de questionarios que ninguem verifica?",
    benefits: [
      "Score A-F pronto para subscricao — sem relatorios manuais",
      "Cross-check automatico: se o segurado mentiu, voce sabe",
      "Historico de postura para renovacoes e sinistros",
      "Portfolio inteiro num dashboard — veja quem esta piorando",
    ],
    cta: "Precificar com dados reais",
    color: "border-blue-200 bg-blue-50",
    iconColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "Gestores GRC",
    subtitle: "Seus fornecedores sao o seu perimetro",
    pain: "Gerencia riscos de terceiros com planilha? Manda questionario por e-mail e reza pra voltar preenchido?",
    benefits: [
      "Convite com 1 clique — fornecedor responde na plataforma",
      "Scan automatico valida o que ele declarou",
      "Dashboard com todos os fornecedores, score e inconsistencias",
      "Trilhas Bronze/Prata/Ouro conforme criticidade do parceiro",
    ],
    cta: "Sair da planilha agora",
    color: "border-emerald-200 bg-emerald-50",
    iconColor: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "CISOs e Times de TI",
    subtitle: "Prove sua maturidade — sem depender de consultorias",
    pain: "Perde semanas respondendo questionarios diferentes pra cada cliente? Nao tem como mostrar que sua postura melhorou?",
    benefits: [
      "Trust Center publico com score, selos e evidencias",
      "Responda uma vez — compartilhe com todos os clientes",
      "Jornada de melhoria visivel: mostre evolucao do score",
      "Justifique findings e veja a nota subir na hora",
    ],
    cta: "Criar meu Trust Center",
    color: "border-amber-200 bg-amber-50",
    iconColor: "bg-amber-100 text-amber-700",
  },
];

export function BestPractices() {
  return (
    <section id="para-quem" className="py-32 bg-gray-900/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
            Feito pra quem decide
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            Ecossistema <span className="italic font-medium text-accent">Integrado.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Da subscrição à conformidade — uma linguagem comum para gerir o risco cibernético.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {personas.map((p) => (
            <div key={p.title} className="flex flex-col rounded-sm border border-white/10 bg-gray-950 p-10 transition-smooth hover:border-accent/40 group">
              <h3 className="text-xl font-bold text-gray-100 tracking-tight">{p.title}</h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-accent">{p.subtitle}</p>
              <p className="mt-6 text-sm italic text-gray-500 leading-relaxed border-l-2 border-accent/20 pl-4">&quot;{p.pain}&quot;</p>
              <ul className="mt-8 flex-1 space-y-4">
                {p.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400 font-medium">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/#agendar"
                className="mt-10 block rounded-sm border border-accent/40 bg-transparent px-4 py-3 text-center text-xs font-bold text-accent uppercase tracking-[0.2em] transition-smooth hover:bg-accent hover:text-gray-900 hover:border-accent"
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
