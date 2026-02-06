import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Trust Center | n.Risk",
  description: "Pagina publica de transparencia de seguranca do fornecedor.",
};

const demoData = {
  empresa: "CloudTech Solutions",
  dominio: "cloudtech.com.br",
  categoria: "A",
  score: 920,
  trilha: "Ouro",
  ultimoScan: "2026-02-05",
  selos: [
    { nome: "ISO 27001", status: "Certificado", validade: "2027-03" },
    { nome: "LGPD Compliance", status: "Aderente", validade: "Continuo" },
    { nome: "SOC 2 Type II", status: "Em andamento", validade: "-" },
  ],
  dominios: [
    { nome: "Seguranca de Rede", score: 95, controle: "A.13.1.1" },
    { nome: "Criptografia", score: 100, controle: "A.10.1.1" },
    { nome: "Gestao de Vulnerabilidades", score: 88, controle: "A.12.6.1" },
    { nome: "Seguranca de E-mail", score: 100, controle: "A.13.2.1" },
    { nome: "Controle de Acesso", score: 92, controle: "A.9.1.1" },
    { nome: "Monitoramento", score: 85, controle: "A.12.4.1" },
    { nome: "Backup e Recuperacao", score: 90, controle: "A.12.3.1" },
    { nome: "Politicas de Seguranca", score: 95, controle: "A.5.1.1" },
    { nome: "Seguranca de Pessoas", score: 88, controle: "A.7.2.2" },
    { nome: "Resposta a Incidentes", score: 82, controle: "A.16.1.1" },
    { nome: "Continuidade de Negocios", score: 85, controle: "A.17.1.1" },
    { nome: "Fornecedores", score: 90, controle: "A.15.1.1" },
    { nome: "Desenvolvimento Seguro", score: 92, controle: "A.14.2.1" },
    { nome: "Compliance/Privacidade", score: 95, controle: "A.18.1.4" },
    { nome: "Seguranca Fisica", score: 88, controle: "A.11.1.1" },
  ],
  documentos: [
    { nome: "Politica de Seguranca da Informacao", tipo: "PDF", publico: true },
    { nome: "Certificado ISO 27001", tipo: "PDF", publico: true },
    { nome: "Relatorio de Pentest (NDA)", tipo: "PDF", publico: false },
    { nome: "Plano de Resposta a Incidentes", tipo: "PDF", publico: false },
  ],
};

export default function TrustCenterPage() {
  return (
    <>
      <Header />
      <main className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
              Trust Center Verificado
            </div>
            <h1 className="text-3xl font-bold">{demoData.empresa}</h1>
            <p className="mt-1 text-muted">{demoData.dominio}</p>
          </div>

          {/* Score card */}
          <div className="mb-8 rounded-xl border border-border bg-card p-8">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-green-100 text-5xl font-bold text-green-700">
                  {demoData.categoria}
                </div>
                <p className="mt-2 text-sm text-muted">Categoria</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold">{demoData.score}</p>
                <p className="mt-1 text-sm text-muted">
                  Cyber Risk Score (0-1000)
                </p>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Trilha:</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      {demoData.trilha}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Ultimo scan:</span>
                    <span className="text-sm font-medium">
                      {demoData.ultimoScan}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted">Formula:</span>
                    <span className="font-mono text-sm">
                      Sf = (T x 0.6) + (C x 0.4)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seals */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Selos e Certificacoes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {demoData.selos.map((selo) => (
                <div
                  key={selo.nome}
                  className="rounded-xl border border-border bg-card p-4 text-center"
                >
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary-light">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <h3 className="mt-3 font-semibold">{selo.nome}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {selo.status}
                  </p>
                  <p className="text-xs text-muted">
                    Validade: {selo.validade}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ISO Domains - spider chart substitute */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">
              Score por Dominio ISO 27001
            </h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="space-y-3">
                {demoData.dominios.map((d) => (
                  <div key={d.controle} className="flex items-center gap-4">
                    <span className="w-48 flex-shrink-0 text-sm">
                      {d.nome}
                    </span>
                    <div className="flex-1">
                      <div className="h-4 rounded-full bg-background">
                        <div
                          className={`h-4 rounded-full ${
                            d.score >= 90
                              ? "bg-green-500"
                              : d.score >= 75
                                ? "bg-lime-500"
                                : d.score >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${d.score}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right font-mono text-sm font-medium">
                      {d.score}%
                    </span>
                    <span className="w-16 text-right text-xs text-muted">
                      {d.controle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Documentos</h2>
            <div className="rounded-xl border border-border bg-card">
              <div className="divide-y divide-border">
                {demoData.documentos.map((doc) => (
                  <div
                    key={doc.nome}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">{doc.nome}</p>
                        <p className="text-xs text-muted">{doc.tipo}</p>
                      </div>
                    </div>
                    {doc.publico ? (
                      <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
                        Download
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Requer NDA
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TPRA notice */}
          <div className="rounded-xl border border-primary/20 bg-primary-light p-6 text-center">
            <p className="text-sm text-muted">
              Este Trust Center e parte da plataforma{" "}
              <span className="font-semibold text-primary">n.Risk</span> de
              avaliacao de postura cibernetica e gestao de riscos de terceiros
              (TPRA/TPRM). Score gerado pela formula transparente Sf = (T x
              0.6) + (C x 0.4) com cross-check automatizado.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
