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
    <section id="solucao" className="bg-gray-950 py-32 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
            Cyber Risk Score
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            Decifre o risco em <span className="italic font-medium text-accent">um segundo.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Score proprietário de 0 a 1000 com metodologia transparente.
            Fim da caixa-preta: entenda exatamente o que impacta a postura de cada fornecedor.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: what makes it different */}
          <div className="space-y-4">
            <div className="rounded-sm border border-white/10 bg-gray-900/50 p-6 transition-smooth hover:border-accent/40">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-100 uppercase tracking-widest text-sm">Scan Técnico + Questionário</h3>
                  <p className="mt-1 text-sm text-gray-500">O equilíbrio perfeito entre dados observados e declaração comprovada por evidência.</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-white/10 bg-gray-900/50 p-6 transition-smooth hover:border-accent/40">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-100 uppercase tracking-widest text-sm">Cross-check automático</h3>
                  <p className="mt-1 text-sm text-gray-500">Mapeamento dinâmico de inconsistências entre falas e fatos técnicos detectados.</p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-white/10 bg-gray-900/50 p-6 transition-smooth hover:border-accent/40">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-100 uppercase tracking-widest text-sm">100% Transparente</h3>
                  <p className="mt-1 text-sm text-gray-500">Fórmulas abertas e justificativas claras para cada ponto subtraído ou adicionado.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: score categories */}
          <div className="rounded-sm border border-white/10 bg-gray-900/50 p-8">
            <h3 className="text-lg font-bold text-gray-100 tracking-wider uppercase">Rating A-F — Decisão Imediata</h3>
            <p className="mt-2 text-sm text-gray-500">
              Linguagem universal para board, compliance e fornecedores. Decisões baseadas em risco, não em achismo.
            </p>
            <div className="mt-8 space-y-2">
              {categories.map((cat) => (
                <div key={cat.grade} className="flex items-center gap-4 rounded-sm border border-white/5 bg-gray-950/50 p-3 transition-smooth hover:bg-white/5">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm text-lg font-bold text-white shadow-sm ${cat.color}`}>
                    {cat.grade}
                  </div>
                  <span className={`text-sm font-bold tracking-widest uppercase ${cat.textColor.replace('700', '400')}`}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
