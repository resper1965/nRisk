const BARS = [
  { label: "Redes", value: 72 },
  { label: "Criptografia", value: 64 },
  { label: "Patch", value: 56 },
  { label: "E-mail", value: 48 },
  { label: "Headers", value: 40 },
  { label: "Exposição", value: 32 },
];

export default function ProductMock() {
  return (
    <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-6 shadow-xl transition-smooth hover:border-accent/20">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border-2 border-accent/30 bg-gray-800/80 p-4 shadow-sm transition-smooth hover:border-accent/50">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Score híbrido</p>
          <p className="mt-1 text-2xl font-bold text-gray-100">0–1000</p>
          <p className="mt-0.5 text-xs text-gray-500">Categoria A–F</p>
        </div>
        <div className="rounded-lg border-2 border-accent/30 bg-gray-800/80 p-4 shadow-sm transition-smooth hover:border-accent/50">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Fator de Confiança</p>
          <p className="mt-1 text-2xl font-bold text-gray-100">0–1</p>
          <p className="mt-0.5 text-xs text-gray-500">reduz o peso do declarativo quando há inconsistências</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border-2 border-gray-800 bg-gray-800/80 p-4 shadow-sm transition-smooth hover:border-accent/20">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Scores por eixo</p>
        <ul className="mt-2 space-y-2">
          {BARS.map(({ label, value }) => (
            <li key={label} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-gray-400">{label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-700">
                <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${value}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-lg border-2 border-gray-800 bg-gray-800/80 p-4 shadow-sm transition-smooth hover:border-accent/20">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Eventos</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /><span className="text-gray-300">Finding crítico</span></li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /><span className="text-gray-300">Queda de score</span></li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /><span className="text-gray-300">Inconsistência detectada</span></li>
        </ul>
      </div>
      <div className="mt-4 rounded-lg border-2 border-gray-800 bg-gray-800/80 p-4 shadow-sm transition-smooth hover:border-accent/20">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Tendência</p>
        <div className="mt-2 flex items-end gap-1 h-12">
          {[40, 55, 48, 62, 58, 70, 68].map((h, i) => (
            <div key={i} className="w-full rounded bg-accent/80 transition-all duration-300 hover:bg-accent" style={{ height: `${h}%`, minHeight: 8 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
