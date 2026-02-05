export default function ProductMock() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase text-gray-500">Score híbrido</p>
          <p className="mt-1 text-2xl font-semibold text-gray-100">0–1000</p>
          <p className="mt-0.5 text-xs text-gray-500">Categoria A–F</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase text-gray-500">Fator de Confiança</p>
          <p className="mt-1 text-2xl font-semibold text-gray-100">0–1</p>
          <p className="mt-0.5 text-xs text-gray-500">reduz o peso do declarativo quando há inconsistências</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm">
        <p className="text-xs font-medium uppercase text-gray-500">Scores por eixo</p>
        <ul className="mt-2 space-y-2">
          {["Redes", "Criptografia", "Patch", "E-mail", "Headers", "Exposição"].map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-gray-400">{label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded bg-gray-700">
                <div className="h-full rounded bg-gray-600" style={{ width: `${70 - i * 8}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm">
        <p className="text-xs font-medium uppercase text-gray-500">Eventos</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-300">
          <li>Finding crítico</li>
          <li>Queda de score</li>
          <li>Inconsistência detectada</li>
        </ul>
      </div>
      <div className="mt-4 rounded-lg border border-gray-800 bg-gray-800 p-4 shadow-sm">
        <p className="text-xs font-medium uppercase text-gray-500">Tendência</p>
        <div className="mt-2 flex items-end gap-1">
          {[40, 55, 48, 62, 58, 70, 68].map((h, i) => (
            <div key={i} className="w-full rounded bg-gray-600" style={{ height: `${h}%`, minHeight: 8 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
