import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TPRA — Avaliacao de Riscos de Terceiros | n.Risk",
  description:
    "Metodologia completa de Third-Party Risk Assessment (TPRA) com etapas, scoring e conformidade.",
};

const etapas = [
  {
    id: "01",
    title: "Identificacao de Terceiros",
    description:
      "Catalogue todos os fornecedores e priorize por criticidade de acesso.",
    status: "active",
    items: [
      { label: "Provedores de cloud, ERPs, processadores de pagamento", level: "Critico" },
      { label: "Consultorias de TI, SaaS com integracao API", level: "Alto" },
      { label: "Ferramentas de marketing, comunicacao", level: "Medio" },
      { label: "Fornecedores sem acesso a dados/sistemas", level: "Baixo" },
    ],
  },
  {
    id: "02",
    title: "Due Diligence e Questionarios",
    description:
      "Envie assessments com nivel de rigor adequado a criticidade do fornecedor.",
    status: "active",
    items: [
      { label: "Bronze: auto-declaracao (15-20 perguntas)", level: "Triagem" },
      { label: "Prata: evidencia obrigatoria (PDF, link)", level: "Medio/Alto" },
      { label: "Ouro: framework completo ISO 27001/NIST", level: "Critico" },
    ],
  },
  {
    id: "03",
    title: "Analise de Risco (Risk Scoring)",
    description:
      "Score hibrido transparente combinando scan tecnico e compliance.",
    status: "active",
    items: [
      { label: "Score Tecnico (T): base 1000, deducao por achados", level: "60%" },
      { label: "Score Compliance (C): aditivo por questionario", level: "40%" },
      { label: "Fator de Confianca (F): penaliza inconsistencias", level: "0.5-1.0" },
    ],
  },
  {
    id: "04",
    title: "Avaliacao de Conformidade",
    description:
      "Verifique aderencia a LGPD/GDPR e frameworks ISO 27001.",
    status: "active",
    items: [
      { label: "Cross-Check: declarado vs detectado pelo scan", level: "Automatico" },
      { label: "Evidence Vault: SHA-256, isolamento por tenant", level: "Seguro" },
      { label: "Controles de privacidade: DPO, notificacao ANPD", level: "LGPD" },
    ],
  },
  {
    id: "05",
    title: "Remediacao e Monitoramento",
    description:
      "Acompanhe a evolucao da postura com monitoramento continuo.",
    status: "active",
    items: [
      { label: "Justificativa de finding para falsos positivos", level: "Workflow" },
      { label: "Score snapshots para rastreabilidade", level: "Historico" },
      { label: "Re-scans periodicos atualizam score tecnico", level: "Continuo" },
    ],
  },
];

const incidentes = [
  {
    nome: "SolarWinds",
    ano: "2020",
    impacto: "~18.000 organizacoes comprometidas via update malicioso",
    licao: "Fornecedores de software com acesso privilegiado sao vetor critico",
  },
  {
    nome: "Kaseya",
    ano: "2021",
    impacto: "~1.500 empresas afetadas por ransomware via MSP",
    licao: "Cadeia de suprimentos de TI amplifica impacto",
  },
  {
    nome: "MOVEit",
    ano: "2023",
    impacto: "2.500+ organizacoes, 67M+ registros expostos",
    licao: "Vulnerabilidades em software de transferencia de arquivos",
  },
  {
    nome: "Okta",
    ano: "2023",
    impacto: "Credenciais de suporte comprometidas afetaram clientes",
    licao: "Acesso privilegiado de terceiros a sistemas de identidade",
  },
];

const frameworks = [
  { nome: "ISO 27001", foco: "SGSI; controles Anexo A", uso: "Framework base; 15 dominios no spider chart" },
  { nome: "NIST CSF", foco: "Identify, Protect, Detect, Respond, Recover", uso: "Mapeamento cruzado planejado" },
  { nome: "LGPD/GDPR", foco: "Protecao de dados pessoais", uso: "Controles de privacidade; Evidence Vault" },
  { nome: "CIS Controls", foco: "Top 18 controles prioritarios", uso: "Priorizacao de controles tecnicos" },
  { nome: "SOC 2", foco: "Trust Services Criteria", uso: "Referencia para Trust Center" },
];

export default function TPRAPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/grc/fornecedores" className="hover:text-foreground">
            GRC
          </Link>
          <span>/</span>
          <span>TPRA</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">
          Avaliacao de Riscos de Terceiros (TPRA)
        </h1>
        <p className="mt-2 text-lg text-muted">
          Third-Party Risk Assessment — Metodologia completa para identificar,
          analisar e mitigar vulnerabilidades introduzidas por parceiros e
          fornecedores.
        </p>
      </div>

      {/* Stats alert */}
      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h3 className="font-semibold text-amber-800">
          Por que TPRA e fundamental
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-700">69%</p>
            <p className="mt-1 text-sm text-amber-600">
              das empresas relatam postura mais fraca em fornecedores
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-700">20%</p>
            <p className="mt-1 text-sm text-amber-600">
              sofreram violacoes de dados atraves de terceiros
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-700">+26%</p>
            <p className="mt-1 text-sm text-amber-600">
              custo de breach via supply chain vs breach direto
            </p>
          </div>
        </div>
      </div>

      {/* 5 Steps */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">
          5 Etapas do Processo de Avaliacao
        </h2>
        <div className="space-y-4">
          {etapas.map((etapa) => (
            <div
              key={etapa.id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                  {etapa.id}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{etapa.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {etapa.description}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {etapa.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-background p-3"
                      >
                        <span className="text-sm">{item.label}</span>
                        <span className="ml-2 flex-shrink-0 rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                          {item.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supply chain incidents */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">
          Casos de Referencia — Supply Chain Attacks
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {incidentes.map((inc) => (
            <div
              key={inc.nome}
              className="rounded-xl border border-red-200 bg-red-50 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-red-800">
                  {inc.nome}
                </h3>
                <span className="rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800">
                  {inc.ano}
                </span>
              </div>
              <p className="mt-2 text-sm text-red-700">{inc.impacto}</p>
              <p className="mt-3 text-sm font-medium text-red-800">
                Licao: {inc.licao}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Frameworks */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Frameworks Utilizados</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-4 text-left font-semibold">
                  Framework
                </th>
                <th className="px-6 py-4 text-left font-semibold">Foco</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Uso no n.Risk
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {frameworks.map((fw) => (
                <tr key={fw.nome}>
                  <td className="px-6 py-4 font-medium">{fw.nome}</td>
                  <td className="px-6 py-4 text-muted">{fw.foco}</td>
                  <td className="px-6 py-4 text-muted">{fw.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best practices summary */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Melhores Praticas</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">
              Contratos com Clausulas de Seguranca
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Notificacao de incidentes em ate 72h (LGPD/GDPR)</li>
              <li>Direito de auditoria presencial ou remota</li>
              <li>Clausula de pentest periodico</li>
              <li>SLA de remediacao para vulnerabilidades criticas</li>
              <li>Controle de subcontratacao (4th parties)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Auditorias Periodicas</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Fornecedores criticos: auditoria anual + monitoramento</li>
              <li>Alto risco: auditoria a cada 18 meses</li>
              <li>Medio risco: autoavaliacao anual por amostragem</li>
              <li>Baixo risco: autoavaliacao bienal</li>
              <li>Trilha Ouro n.Risk = auditoria formal</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Questionarios Padronizados</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>SIG (Standardized Information Gathering)</li>
              <li>CAIQ (Consensus Assessments Initiative - CSA)</li>
              <li>VSA (Vendor Security Alliance)</li>
              <li>n.Risk Question Bank (ISO 27001 mapped)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Metricas TPRM</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Cobertura de avaliacao (% criticos avaliados)</li>
              <li>Score medio do portfolio</li>
              <li>Taxa de inconsistencia (cross-check)</li>
              <li>Tempo de remediacao</li>
              <li>Evolucao da postura (score snapshots)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* TPRM as active defense */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-8 text-white">
        <h2 className="text-2xl font-bold">TPRM como Estrategia de Defesa Ativa</h2>
        <p className="mt-3 text-blue-100">
          A gestao de risco de terceiros vai alem de compliance. E uma
          estrategia que protege a cadeia de suprimentos, reduz superficie
          de ataque, acelera resposta a incidentes, viabiliza seguro
          cibernetico e demonstra maturidade em LGPD/GDPR e frameworks
          reconhecidos.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/grc/fornecedores"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-blue-50"
          >
            Gerenciar Fornecedores
          </Link>
        </div>
      </div>
    </div>
  );
}
