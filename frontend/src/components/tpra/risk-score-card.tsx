const categories = [
  { grade: "A", label: "Excelente", color: "bg-green-600", bgLight: "bg-green-50", textColor: "text-green-700" },
  { grade: "B", label: "Bom", color: "bg-lime-600", bgLight: "bg-lime-50", textColor: "text-lime-700" },
  { grade: "C", label: "Atencao", color: "bg-amber-500", bgLight: "bg-amber-50", textColor: "text-amber-700" },
  { grade: "D", label: "Critico", color: "bg-orange-600", bgLight: "bg-orange-50", textColor: "text-orange-700" },
  { grade: "E", label: "Grave", color: "bg-red-600", bgLight: "bg-red-50", textColor: "text-red-700" },
  { grade: "F", label: "Inaceitavel", color: "bg-red-900", bgLight: "bg-red-100", textColor: "text-red-900" },
];

export function RiskScoreCard() {
  return (
    <section id="solucao" className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Cyber Risk Score
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Um numero que diz tudo sobre seu fornecedor
          </h2>
          <p className="mt-4 text-lg text-muted">
            Score de 0 a 1000 com formula aberta. Sem caixa-preta, sem achismo.
            Voce e seu fornecedor veem exatamente o que impactou a nota.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: what makes it different */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Scan tecnico + Questionario</h3>
                  <p className="text-sm text-muted">60% vem do que detectamos na superficie. 40% do que o fornecedor declara e comprova.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Cross-check automatico</h3>
                  <p className="text-sm text-muted">Fornecedor diz que usa SSL? Nosso scan verifica. Inconsistencias viram bandeira vermelha.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">100% transparente</h3>
                  <p className="text-sm text-muted">Concorrentes usam &quot;ML/AI&quot; como caixa-preta. No n.Risk, voce ve a formula e cada achado que impactou a nota.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: score categories */}
          <div className="rounded-xl border border-border bg-background p-8">
            <h3 className="text-lg font-semibold">Rating A-F — Entenda em 1 segundo</h3>
            <p className="mt-1 text-sm text-muted">
              Linguagem que seguradora, board e fornecedor entendem sem precisar de relatorio de 50 paginas.
            </p>
            <div className="mt-6 space-y-3">
              {categories.map((cat) => (
                <div key={cat.grade} className={`flex items-center gap-4 rounded-lg p-3 ${cat.bgLight}`}>
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white ${cat.color}`}>
                    {cat.grade}
                  </div>
                  <span className={`font-semibold ${cat.textColor}`}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
