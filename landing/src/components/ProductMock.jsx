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
    <div className="rounded-sm border-[1px] border-gray-800 bg-gray-950 p-6 shadow-2xl transition-smooth hover:border-accent/20">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border-[1px] border-accent/20 bg-gray-900/50 p-4 shadow-sm transition-smooth hover:border-accent/40">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Score híbrido</p>
          <p className="mt-1 text-2xl font-bold text-gray-100 tracking-tight">0–1000</p>
          <p className="mt-0.5 text-[10px] text-gray-500 uppercase tracking-tighter">Categoria A–F</p>
        </div>
        <div className="rounded-sm border-[1px] border-accent/20 bg-gray-900/50 p-4 shadow-sm transition-smooth hover:border-accent/40">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Fator de Confiança</p>
          <p className="mt-1 text-2xl font-bold text-gray-100 tracking-tight">0–1</p>
          <p className="mt-0.5 text-[10px] text-gray-500 uppercase tracking-tighter italic">Ponderação por inconsistência</p>
        </div>
      </div>
      <div className="mt-4 rounded-sm border-[1px] border-gray-800 bg-gray-900/50 p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Scores por eixo</p>
        <ul className="space-y-2.5">
          {BARS.map(({ label, value }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-[10px] font-bold uppercase text-gray-500 leading-none">{label}</span>
              <div className="h-1.5 flex-1 overflow-hidden bg-gray-800/50">
                <div className="h-full bg-accent transition-all duration-700" style={{ width: `${value}%` }} />
              </div>
              <span className="text-[10px] font-mono text-gray-600">{value}%</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-sm border-[1px] border-gray-800 bg-gray-900/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Eventos</p>
          <ul className="space-y-2 text-[10px] font-bold uppercase">
            <li className="flex items-center gap-2"><span className="h-1 w-1 bg-red-500" /><span className="text-gray-400">Finding crítico</span></li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 bg-amber-500" /><span className="text-gray-400">Queda de score</span></li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 bg-accent" /><span className="text-gray-400">Inconsistência</span></li>
          </ul>
        </div>
        <div className="rounded-sm border-[1px] border-gray-800 bg-gray-900/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Tendência</p>
          <div className="flex items-end gap-1 h-10">
            {[40, 55, 48, 62, 58, 70, 68].map((h, i) => (
              <div key={i} className="w-full bg-accent/40 transition-all duration-300 hover:bg-accent" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
