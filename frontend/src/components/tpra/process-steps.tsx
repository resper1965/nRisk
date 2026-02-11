import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Cadastre o fornecedor",
    description: "Basta informar o dominio. Em segundos, o n.Risk inicia o scan passivo da superficie externa de ataque — sem instalar nada, sem depender do fornecedor.",
    color: "bg-blue-500",
  },
  {
    number: "2",
    title: "Envie o assessment",
    description: "Escolha a trilha certa (Bronze, Prata ou Ouro) e convide o fornecedor a responder. Questionarios mapeados para ISO 27001 com upload de evidencias.",
    color: "bg-indigo-500",
  },
  {
    number: "3",
    title: "Receba o score em minutos",
    description: "O n.Risk cruza automaticamente o que o fornecedor declarou com o que o scan encontrou. Inconsistencias aparecem na hora — sem surpresas.",
    color: "bg-cyan-500",
  },
  {
    number: "4",
    title: "Tome decisoes com dados",
    description: "Score A-F com formula transparente. Seguradora precifica a apolice, GRC decide se aprova o fornecedor, CISO sabe exatamente o que corrigir.",
    color: "bg-emerald-500",
  },
  {
    number: "5",
    title: "Monitore continuamente",
    description: "Re-scans periodicos, historico de score e alertas de deterioracao. Voce ve a postura piorar antes que vire incidente.",
    color: "bg-amber-500",
  },
];

export function ProcessSteps() {
  return (
    <section id="como-funciona" className="py-32 border-y border-white/5 bg-gray-900/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
            Simples e poderoso
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            5 passos para <span className="italic font-medium text-accent">governança total.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Do cadastro ao monitoramento contínuo — automatize o ciclo de vida do risco sem planilhas ou e-mails perdidos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="overflow-hidden rounded-sm border border-white/10 bg-gray-950/50 transition-smooth hover:border-accent/40">
              <div className="flex flex-col lg:flex-row">
                <div className={`flex items-center justify-center px-10 py-6 text-gray-900 lg:w-24 ${step.color.replace('500', '400')}`}>
                  <span className="text-3xl font-bold tracking-tighter">{step.number.padStart(2, '0')}</span>
                </div>
                <div className="flex-1 p-8">
                  <h3 className="text-lg font-bold text-gray-100 uppercase tracking-widest">{step.title}</h3>
                  <p className="mt-2 text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#agendar"
            className="inline-flex items-center justify-center rounded-sm bg-accent px-10 py-4 text-base font-bold text-gray-900 shadow-lg transition-smooth hover:scale-105 hover:brightness-110 uppercase tracking-widest"
          >
            Quero ver funcionando
          </Link>
        </div>
      </div>
    </section>
  );
}
