import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Subscritor | n.Risk",
  description:
    "Painel do subscritor para avaliar risco de apolices ciberneticas.",
};

const portfolio = [
  { empresa: "CloudTech Solutions", score: 920, categoria: "A", premium: "Baixo" },
  { empresa: "DataProc Pagamentos", score: 785, categoria: "B", premium: "Moderado" },
  { empresa: "SecureNet Consulting", score: 640, categoria: "C", premium: "Alto" },
  { empresa: "MarketingPro SaaS", score: 420, categoria: "D", premium: "Muito Alto" },
  { empresa: "LegacyERP Systems", score: 280, categoria: "E", premium: "Recusado" },
];

const categoryColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-lime-100 text-lime-800",
  C: "bg-amber-100 text-amber-800",
  D: "bg-orange-100 text-orange-800",
  E: "bg-red-100 text-red-800",
  F: "bg-red-200 text-red-900",
};

export default function SubscritorPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold">Dashboard do Subscritor</h1>
      <p className="mt-1 text-muted">
        Avalie o risco cibernetico de apolices com base no score TPRA dos
        fornecedores.
      </p>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Portfolio</p>
          <p className="mt-1 text-2xl font-bold">5 empresas</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Score Medio</p>
          <p className="mt-1 text-2xl font-bold text-primary">609</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Risco Aceitavel (A-C)</p>
          <p className="mt-1 text-2xl font-bold text-green-600">3</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Atencao Urgente (D-F)</p>
          <p className="mt-1 text-2xl font-bold text-red-600">2</p>
        </div>
      </div>

      {/* TPRA context */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h3 className="font-semibold text-amber-800">
          Avaliacao TPRA para Subscricao
        </h3>
        <p className="mt-2 text-sm text-amber-700">
          69% das empresas relatam postura de seguranca mais fraca em
          fornecedores e 20% sofreram violacoes de dados atraves de terceiros.
          O score hibrido n.Risk (Sf = T x 0.6 + C x 0.4) combina scan tecnico
          com conformidade declaratoria para decisoes de subscricao mais
          informadas.
        </p>
      </div>

      {/* Portfolio table */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-6 py-4 text-left font-semibold">Empresa</th>
              <th className="px-4 py-4 text-center font-semibold">Score</th>
              <th className="px-4 py-4 text-center font-semibold">
                Categoria
              </th>
              <th className="px-4 py-4 text-center font-semibold">
                Premium Indicado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {portfolio.map((p) => (
              <tr key={p.empresa}>
                <td className="px-6 py-4 font-medium">{p.empresa}</td>
                <td className="px-4 py-4 text-center font-mono">
                  {p.score}
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${categoryColors[p.categoria]}`}
                  >
                    {p.categoria}
                  </span>
                </td>
                <td className="px-4 py-4 text-center text-sm">
                  {p.premium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score explanation */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold">Metodologia de Scoring</h3>
        <p className="mt-2 text-sm text-muted">
          O Cyber Risk Score do n.Risk utiliza formula transparente: Score
          Tecnico (base 1000, deducao por achados de portas, SSL, DMARC, CVEs)
          com peso 60% + Score de Compliance (aditivo por questionario ISO
          27001) com peso 40%. Penalidade critica: achados de severidade critica
          limitam o score maximo a 500 (categoria D ou inferior). O cross-check
          automatico compara declaracoes vs evidencias tecnicas para gerar um
          fator de confianca.
        </p>
      </div>
    </div>
  );
}
