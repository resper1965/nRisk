import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fornecedores — Gestao de Terceiros | n.Risk",
  description:
    "Gerencie fornecedores, envie assessments e monitore o Trust Center de cada parceiro.",
};

const fornecedoresDemo = [
  {
    nome: "CloudTech Solutions",
    dominio: "cloudtech.com.br",
    categoria: "A",
    score: 920,
    nivel: "Critico",
    trilha: "Ouro",
    status: "Submetido",
    inconsistencias: 0,
  },
  {
    nome: "DataProc Pagamentos",
    dominio: "dataproc.io",
    categoria: "B",
    score: 785,
    nivel: "Critico",
    trilha: "Prata",
    status: "Submetido",
    inconsistencias: 1,
  },
  {
    nome: "SecureNet Consulting",
    dominio: "securenet.com",
    categoria: "C",
    score: 640,
    nivel: "Alto",
    trilha: "Prata",
    status: "Em andamento",
    inconsistencias: 3,
  },
  {
    nome: "MarketingPro SaaS",
    dominio: "marketingpro.app",
    categoria: "D",
    score: 420,
    nivel: "Medio",
    trilha: "Bronze",
    status: "Submetido",
    inconsistencias: 5,
  },
  {
    nome: "LegacyERP Systems",
    dominio: "legacyerp.com.br",
    categoria: "E",
    score: 280,
    nivel: "Alto",
    trilha: "Bronze",
    status: "Pendente",
    inconsistencias: 8,
  },
];

const categoryColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-lime-100 text-lime-800",
  C: "bg-amber-100 text-amber-800",
  D: "bg-orange-100 text-orange-800",
  E: "bg-red-100 text-red-800",
  F: "bg-red-200 text-red-900",
};

const nivelColors: Record<string, string> = {
  Critico: "bg-red-100 text-red-700",
  Alto: "bg-orange-100 text-orange-700",
  Medio: "bg-amber-100 text-amber-700",
  Baixo: "bg-green-100 text-green-700",
};

export default function FornecedoresPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <p className="mt-1 text-muted">
            Gerencie seus fornecedores, envie assessments e monitore a postura
            de seguranca de cada parceiro.
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          + Novo Fornecedor
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Total de Fornecedores</p>
          <p className="mt-1 text-2xl font-bold">5</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Assessments Submetidos</p>
          <p className="mt-1 text-2xl font-bold text-green-600">3</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Score Medio</p>
          <p className="mt-1 text-2xl font-bold text-primary">609</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted">Inconsistencias</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">17</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="px-6 py-4 text-left font-semibold">
                Fornecedor
              </th>
              <th className="px-4 py-4 text-center font-semibold">Score</th>
              <th className="px-4 py-4 text-center font-semibold">Nivel</th>
              <th className="px-4 py-4 text-center font-semibold">Trilha</th>
              <th className="px-4 py-4 text-center font-semibold">Status</th>
              <th className="px-4 py-4 text-center font-semibold">
                Inconsistencias
              </th>
              <th className="px-4 py-4 text-center font-semibold">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fornecedoresDemo.map((f) => (
              <tr key={f.dominio} className="hover:bg-background/50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{f.nome}</p>
                    <p className="text-xs text-muted">{f.dominio}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${categoryColors[f.categoria]}`}
                    >
                      {f.categoria}
                    </span>
                    <span className="font-mono text-sm font-medium">
                      {f.score}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${nivelColors[f.nivel]}`}
                  >
                    {f.nivel}
                  </span>
                </td>
                <td className="px-4 py-4 text-center text-xs">{f.trilha}</td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`text-xs font-medium ${
                      f.status === "Submetido"
                        ? "text-green-600"
                        : f.status === "Em andamento"
                          ? "text-amber-600"
                          : "text-muted"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  {f.inconsistencias > 0 ? (
                    <span className="font-medium text-red-600">
                      {f.inconsistencias}
                    </span>
                  ) : (
                    <span className="text-green-600">0</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <Link
                    href={`/trust/${f.dominio.replace(/\./g, "-")}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Trust Center
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TPRA link */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-primary-light p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-primary">
              Metodologia TPRA
            </h3>
            <p className="mt-1 text-sm text-muted">
              Consulte a metodologia completa de avaliacao de riscos
              ciberneticos de terceiros, incluindo etapas, melhores praticas e
              metricas.
            </p>
          </div>
          <Link
            href="/grc/tpra"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Ver Metodologia
          </Link>
        </div>
      </div>
    </div>
  );
}
