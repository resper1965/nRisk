import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Painel de Postura — CISO | n.Risk",
  description:
    "Painel do CISO para acompanhar postura cibernetica, responder assessments e gerenciar evidencias.",
};

const scoreHistory = [
  { data: "2026-01-05", score: 650, categoria: "C" },
  { data: "2026-01-15", score: 710, categoria: "B" },
  { data: "2026-01-25", score: 740, categoria: "B" },
  { data: "2026-02-05", score: 785, categoria: "B" },
];

const inconsistencias = [
  {
    controle: "A.10.1.1 (Criptografia)",
    declaracao: "Sim — SSL em todos os servicos",
    scan: "Certificado expirado em dev.empresa.com",
    status: "Inconsistente",
  },
  {
    controle: "A.13.1.1 (Rede)",
    declaracao: "Sim — Portas de admin fechadas",
    scan: "Porta 3389 (RDP) aberta",
    status: "Inconsistente",
  },
  {
    controle: "A.13.2.1 (Email)",
    declaracao: "Sim — Protecao contra Phishing",
    scan: "DMARC ativo e correto",
    status: "Validado",
  },
  {
    controle: "A.12.6.1 (Vulnerabilidades)",
    declaracao: "Sim — Patch management ativo",
    scan: "Sem CVEs criticas detectadas",
    status: "Validado",
  },
];

const findings = [
  { achado: "Certificado SSL expirado (dev.empresa.com)", severidade: "Alto", deducao: -70, justificado: false },
  { achado: "Porta RDP (3389) exposta", severidade: "Critico", deducao: -100, justificado: false },
  { achado: "Headers de seguranca ausentes (X-Frame-Options)", severidade: "Medio", deducao: -40, justificado: true },
  { achado: "Software desatualizado (Apache 2.4.49)", severidade: "Medio", deducao: -40, justificado: false },
];

export default function CISOPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold">Painel de Postura</h1>
      <p className="mt-1 text-muted">
        Acompanhe sua postura cibernetica, responda assessments e gerencie
        evidencias.
      </p>

      {/* Score overview */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted">Score Atual</p>
          <p className="mt-1 text-3xl font-bold">785</p>
          <span className="inline-flex items-center rounded-md bg-lime-100 px-2 py-0.5 text-xs font-bold text-lime-800">
            B
          </span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted">Score Tecnico (T)</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">750</p>
          <p className="text-xs text-muted">Peso: 60%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted">Score Compliance (C)</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">838</p>
          <p className="text-xs text-muted">Peso: 40%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted">Trilha</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">Prata</p>
          <p className="text-xs text-muted">Evidencia obrigatoria</p>
        </div>
      </div>

      {/* Score history */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Jornada de Postura</h2>
        <p className="text-sm text-muted">
          Evolucao do score ao longo do tempo (score snapshots)
        </p>
        <div className="mt-4 overflow-x-auto">
          <div className="flex items-end gap-4">
            {scoreHistory.map((h) => (
              <div key={h.data} className="flex flex-col items-center">
                <span className="text-sm font-bold">{h.score}</span>
                <div
                  className="mt-1 w-16 rounded-t-lg bg-primary"
                  style={{ height: `${(h.score / 1000) * 200}px` }}
                />
                <span className="mt-2 text-xs text-muted">{h.data}</span>
                <span
                  className={`mt-1 rounded px-1.5 py-0.5 text-xs font-bold ${
                    h.categoria === "B"
                      ? "bg-lime-100 text-lime-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {h.categoria}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-check results */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Cross-Check (Declarado vs Detectado)
        </h2>
        <p className="text-sm text-muted">
          Comparacao automatica entre suas declaracoes e os achados do scan
        </p>
        <div className="mt-4 space-y-3">
          {inconsistencias.map((inc) => (
            <div
              key={inc.controle}
              className={`rounded-lg border p-4 ${
                inc.status === "Inconsistente"
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{inc.controle}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    inc.status === "Inconsistente"
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {inc.status}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted">Declaracao</p>
                  <p className="text-sm">{inc.declaracao}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Scan</p>
                  <p className="text-sm">{inc.scan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Findings with justification */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Achados Tecnicos</h2>
        <p className="text-sm text-muted">
          Achados do scan com impacto no score. Voce pode submeter
          justificativas para achados que considere falsos positivos ou riscos
          aceitos.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Achado</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Severidade
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Impacto no Score
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Justificativa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {findings.map((f) => (
                <tr key={f.achado}>
                  <td className="px-4 py-3">{f.achado}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        f.severidade === "Critico"
                          ? "bg-red-100 text-red-800"
                          : f.severidade === "Alto"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {f.severidade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-red-600">
                    {f.deducao}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {f.justificado ? (
                      <span className="text-xs text-green-600">Aceita</span>
                    ) : (
                      <button className="rounded bg-primary px-2 py-1 text-xs text-white hover:bg-primary-dark">
                        Justificar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TPRA link */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-primary-light p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-primary">
              Metodologia TPRA
            </h3>
            <p className="mt-1 text-sm text-muted">
              Entenda como seu score e calculado e como a avaliacao de riscos de
              terceiros funciona.
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
