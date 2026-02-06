const categories = [
  {
    grade: "A",
    range: ">= 900",
    label: "Risco muito baixo",
    description: "Postura excelente",
    color: "bg-green-600",
    textColor: "text-green-600",
    bgLight: "bg-green-50",
  },
  {
    grade: "B",
    range: ">= 750",
    label: "Risco baixo",
    description: "Postura boa",
    color: "bg-lime-600",
    textColor: "text-lime-600",
    bgLight: "bg-lime-50",
  },
  {
    grade: "C",
    range: ">= 600",
    label: "Risco moderado",
    description: "Melhorias necessarias",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    bgLight: "bg-amber-50",
  },
  {
    grade: "D",
    range: ">= 400",
    label: "Risco alto",
    description: "Remediacoes urgentes",
    color: "bg-orange-600",
    textColor: "text-orange-600",
    bgLight: "bg-orange-50",
  },
  {
    grade: "E",
    range: ">= 250",
    label: "Risco muito alto",
    description: "Gaps criticos",
    color: "bg-red-600",
    textColor: "text-red-600",
    bgLight: "bg-red-50",
  },
  {
    grade: "F",
    range: "< 250",
    label: "Risco inaceitavel",
    description: "Parceria deve ser reavaliada",
    color: "bg-red-900",
    textColor: "text-red-900",
    bgLight: "bg-red-50",
  },
];

export function RiskScoreCard() {
  return (
    <section id="scoring" className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Cyber Risk Score
          </h2>
          <p className="mt-4 text-lg text-muted">
            Score hibrido 0-1000 que combina evidencias tecnicas com
            conformidade declaratoria
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-8">
            <h3 className="text-lg font-semibold">Formula do Score</h3>
            <div className="mt-6 rounded-lg bg-primary-light p-6 text-center">
              <p className="font-mono text-2xl font-bold text-primary">
                S<sub>f</sub> = (T x 0.6) + (C x 0.4)
              </p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  T
                </div>
                <div>
                  <p className="font-medium">Score Tecnico (60%)</p>
                  <p className="text-sm text-muted">
                    Base 1000, com deducoes por achados (portas abertas, SSL
                    expirado, DMARC ausente, CVEs, credenciais vazadas)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  C
                </div>
                <div>
                  <p className="font-medium">Score de Compliance (40%)</p>
                  <p className="text-sm text-muted">
                    Aditivo; respostas positivas somam pontos proporcionais ao
                    risk_weight do controle ISO 27001
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  F
                </div>
                <div>
                  <p className="font-medium">Fator de Confianca</p>
                  <p className="text-sm text-muted">
                    0.5-1.0; penalizado por inconsistencias no cross-check e
                    falta de evidencia
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Penalidade Critica: Se houver achado de severidade Critica
                (ex: porta RDP exposta, CVE com exploit), o score final nao
                pode ultrapassar 500.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-8">
            <h3 className="text-lg font-semibold">Categorias de Risco</h3>
            <div className="mt-6 space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.grade}
                  className={`flex items-center gap-4 rounded-lg p-3 ${cat.bgLight}`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white ${cat.color}`}
                  >
                    {cat.grade}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${cat.textColor}`}>
                        {cat.label}
                      </span>
                      <span className="font-mono text-sm text-muted">
                        {cat.range}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-8">
          <h3 className="text-lg font-semibold">
            Diferencial n.Risk vs Mercado
          </h3>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold">
                    Aspecto
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    n.Risk
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Mercado (referencia)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-medium">Escala</td>
                  <td className="px-4 py-3">0-1000 (categorias A-F)</td>
                  <td className="px-4 py-3 text-muted">
                    Varia: 0-100 (Bitsight), 0-1000 (SecurityScorecard)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Composicao</td>
                  <td className="px-4 py-3">
                    Hibrido: tecnico (60%) + compliance (40%)
                  </td>
                  <td className="px-4 py-3 text-muted">
                    Geralmente so tecnico (scan externo)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Transparencia</td>
                  <td className="px-4 py-3">
                    Formula publica; avaliado ve impacto de cada achado
                  </td>
                  <td className="px-4 py-3 text-muted">
                    Tipicamente caixa fechada (&quot;ML/AI&quot;)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Cross-check</td>
                  <td className="px-4 py-3">
                    Declarado vs detectado; inconsistencias visiveis
                  </td>
                  <td className="px-4 py-3 text-muted">
                    Questionarios separados do rating
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
