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
    <section id="como-funciona" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Simples e poderoso
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            5 passos para eliminar pontos cegos na sua cadeia
          </h2>
          <p className="mt-4 text-lg text-muted">
            Do cadastro ao monitoramento continuo — sem planilhas, sem e-mails perdidos, sem achismo.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
              <div className="flex flex-col lg:flex-row">
                <div className={`flex items-center justify-center px-8 py-6 text-white lg:w-20 ${step.color}`}>
                  <span className="text-2xl font-bold">{step.number}</span>
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#agendar"
            className="inline-flex rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Quero ver funcionando
          </Link>
        </div>
      </div>
    </section>
  );
}
