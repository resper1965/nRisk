"use client";

import { useState } from "react";

const ACCENT = "#00ade0";

function Logo({ className = "" }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      n<span style={{ color: ACCENT }}>.</span>Risk
    </span>
  );
}

function AnchorLink({ href, children, className = "" }) {
  return (
    <a
      href={href}
      className={`text-sm text-slate-600 hover:text-slate-900 transition-colors ${className}`}
    >
      {children}
    </a>
  );
}

function AccordionItem({ id, question, answer, isOpen, onToggle }) {
  const buttonId = `faq-${id}`;
  const panelId = `faq-panel-${id}`;
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-slate-800 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0]"
        >
          {question}
          <span
            className={`ml-2 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-500" aria-hidden>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="overflow-hidden"
      >
        <p className="pb-4 text-sm text-slate-600">{answer}</p>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    id: 1,
    question: "O que é avaliado sem acesso interno?",
    answer:
      "A n.Risk realiza avaliação outside-in: scans de superfície (DNS, SSL, portas, exposição) e questionários declarativos. Não exige instalação em rede interna nem credenciais de sistemas.",
  },
  {
    id: 2,
    question: "Como funcionam os assessments e evidências?",
    answer:
      "Questionários por frameworks (ex.: ISO 27001, NIST CSF). Respostas Sim/Não/NA. Em trilhas Prata/Ouro, perguntas podem exigir anexo de evidência (Evidence Vault). Submissão controlada por Admin/CISO; resultados auditáveis.",
  },
  {
    id: 3,
    question: "O que o Cross-Check mede?",
    answer:
      "O Cross-Check compara o que a empresa declara (respostas ao questionário) com o que o scan observa, por controle. Se declarou implementado e o scan aponta falha no mesmo controle, a resposta é marcada como inconsistente.",
  },
  {
    id: 4,
    question: "O que é fator de confiança?",
    answer:
      "Multiplicador (0–1) que reduz o peso do score declarativo quando há inconsistências entre declaração e observação. Quanto mais inconsistências, menor o fator; o score final reflete essa penalização.",
  },
  {
    id: 5,
    question: "O que são eixos (domain scores)?",
    answer:
      "Além do score global, a n.Risk apresenta eixos por domínio (ex.: Redes, Criptografia, Patch). Cada eixo recebe rating A–F, facilitando priorização e comunicação executiva.",
  },
  {
    id: 6,
    question: "Qual a frequência de atualização?",
    answer:
      "Scans podem ser agendados (ex.: semanal ou mensal). Cada avaliação gera um snapshot; o histórico fica disponível para tendência e prestação de contas.",
  },
  {
    id: 7,
    question: "Como tratar divergências e justificativas?",
    answer:
      "O cliente pode submeter justificativa para um achado (ex.: falso positivo ou risco aceito). Um avaliador da plataforma aprova ou rejeita. Se aprovado, o achado deixa de penalizar o score.",
  },
  {
    id: 8,
    question: "Quais são os próximos passos após a demo?",
    answer:
      "Após a demo guiada, alinhamos escopo (domínios, frameworks, integrações) e definimos plano de adoção. Suporte técnico e onboarding conforme contrato.",
  },
];

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* 1) Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="#" className="text-[1.625rem]">
            <Logo />
          </a>
          <nav className="flex flex-wrap items-center gap-6">
            <AnchorLink href="#visao">Visão</AnchorLink>
            <AnchorLink href="#assessments">Assessments</AnchorLink>
            <AnchorLink href="#cross-check">Cross-Check</AnchorLink>
            <AnchorLink href="#eixos">Eixos</AnchorLink>
            <AnchorLink href="#historico">Histórico</AnchorLink>
            <AnchorLink href="#integracoes">Integrações</AnchorLink>
            <AnchorLink href="#faq">FAQ</AnchorLink>
          </nav>
          <a
            href="#cta-final"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0]"
          >
            Solicitar demo
          </a>
        </div>
      </header>

      <main className="scroll-smooth">
        {/* 2) Hero */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Cyber risk, com evidência.
                </p>
                <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Risco cibernético mensurável. Confiança para decidir.
                </h1>
                <p className="mt-6 max-w-xl text-lg text-slate-600">
                  A n<span style={{ color: ACCENT }}>.</span>Risk consolida sinais técnicos e assessments por
                  questionários para entregar score híbrido, eixos de risco e evolução histórica — com
                  rastreabilidade e governança.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href="#cta-final"
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                  >
                    Solicitar demo
                  </a>
                  <a
                    href="#visao"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0]"
                  >
                    Ver como funciona
                  </a>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase text-slate-500">Score híbrido</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">0–1000</p>
                    <p className="mt-0.5 text-xs text-slate-500">Categoria A–F</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase text-slate-500">Fator de confiança</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">0–1</p>
                    <p className="mt-0.5 text-xs text-slate-500">reduz o score quando há inconsistências</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium uppercase text-slate-500">Tendência</p>
                  <div className="mt-2 flex items-end gap-1">
                    {[40, 55, 48, 62, 58, 70, 68].map((h, i) => (
                      <div
                        key={i}
                        className="w-full rounded bg-slate-200"
                        style={{ height: `${h}%`, minHeight: 8 }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium uppercase text-slate-500">Eventos</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    <li>Finding crítico</li>
                    <li>Queda de score</li>
                    <li>Inconsistência detectada</li>
                  </ul>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium uppercase text-slate-500">Eixos</p>
                  <ul className="mt-2 space-y-2">
                    {["Redes", "Criptografia", "Patch", "E-mail", "Headers", "Exposição"].map((label, i) => (
                      <li key={label} className="flex items-center gap-2">
                        <span className="w-20 shrink-0 text-xs text-slate-600">{label}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded bg-slate-100">
                          <div
                            className="h-full rounded bg-slate-300"
                            style={{ width: `${70 - i * 8}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3) Visão */}
        <section id="visao" className="scroll-mt-20 border-b border-slate-100 bg-slate-50/30 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Uma visão única do risco.
            </h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              Cyber insurance ganha subscrição e monitoramento baseados em score e evidência. Terceiros
              passam a ser qualificados com cadeia de fornecedores e evidências centralizadas. Conformidade
              (ISO 27001, LGPD) e Trust Center completam a visão executiva.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Score híbrido explicável",
                "Evidência e rastreabilidade",
                "Comparação e consistência",
                "Tendência e priorização",
              ].map((title) => (
                <div
                  key={title}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-800">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4) O problema */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Sem comparação, não há confiança.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <p className="text-slate-700">Questionários sem validação perdem valor.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <p className="text-slate-700">Sinais técnicos sem contexto não sustentam governança.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <p className="text-slate-700">Risco de terceiros exige monitoramento contínuo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5) O que a n.Risk entrega */}
        <section className="border-b border-slate-100 bg-slate-50/30 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              O que a n.Risk entrega
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Score híbrido e categoria",
                "Eixos de risco para priorização",
                "Cross-Check e fator de confiança",
                "Assessments com evidências",
                "Histórico com snapshots",
                "Alertas e trilha de auditoria",
              ].map((title) => (
                <div
                  key={title}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-800">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6) Assessments */}
        <section id="assessments" className="scroll-mt-20 border-b border-slate-100 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Assessments padronizados, com evidências.
            </h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              Questionários por frameworks (ex.: ISO 27001, NIST CSF, LGPD). Respostas Sim/Não/NA. Evidência
              anexada quando exigida. Submissão controlada (Admin/CISO) e resultados auditáveis.
            </p>
            <div className="mt-10 flex flex-wrap gap-8">
              <div className="min-w-[280px] rounded-lg border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
                <p className="text-xs font-medium uppercase text-slate-500">Assessment</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">72%</p>
                <p className="text-xs text-slate-500">Progresso</p>
                <p className="mt-3 text-sm text-slate-600">Status: Em andamento</p>
                <p className="mt-1 text-xs text-slate-500">Evidências pendentes: 2</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7) Cross-Check */}
        <section id="cross-check" className="scroll-mt-20 border-b border-slate-100 bg-slate-50/30 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Cross-Check: declaração versus observação.
            </h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              Quando uma resposta declara controle implementado e o scan aponta exposição no mesmo
              controle, a n.Risk registra inconsistência. O fator de confiança ajusta o peso do
              declarativo.
            </p>
            <div className="mt-10 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 font-medium text-slate-700">Controle</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Declarado</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Observado</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Próxima ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 text-slate-700">A.13.1.1</td>
                    <td className="px-4 py-3 text-slate-600">Sim</td>
                    <td className="px-4 py-3 text-slate-600">Falha</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">Inconsistente</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">Revisar ou justificar</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 text-slate-700">A.10.1.1</td>
                    <td className="px-4 py-3 text-slate-600">Sim</td>
                    <td className="px-4 py-3 text-slate-600">Ok</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800">Consistente</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 8) Eixos */}
        <section id="eixos" className="scroll-mt-20 border-b border-slate-100 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Eixos de risco para orientar investimento.
            </h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              Além do score global, a n.Risk apresenta eixos (domain scores) com rating A–F,
              facilitando priorização e comunicação executiva.
            </p>
            <div className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <ul className="space-y-4">
                {[
                  { name: "Redes", grade: "B", pct: 78 },
                  { name: "Criptografia", grade: "A", pct: 92 },
                  { name: "Patch", grade: "C", pct: 65 },
                  { name: "E-mail / DMARC", grade: "B", pct: 80 },
                  { name: "Headers", grade: "D", pct: 45 },
                  { name: "Exposição", grade: "B", pct: 75 },
                ].map((item) => (
                  <li key={item.name} className="flex items-center gap-4">
                    <span className="w-32 shrink-0 text-sm text-slate-700">{item.name}</span>
                    <span className="w-8 shrink-0 text-sm font-medium text-slate-800">{item.grade}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded bg-slate-100">
                      <div
                        className="h-full rounded bg-slate-300"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 9) Histórico */}
        <section id="historico" className="scroll-mt-20 border-b border-slate-100 bg-slate-50/30 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Histórico e jornada de melhoria.
            </h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              Cada avaliação gera um snapshot. A evolução fica registrada para comparação antes/depois
              e para prestação de contas.
            </p>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase text-slate-500">Timeline</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>Jan — Score 720 (C)</li>
                  <li>Fev — Score 780 (B)</li>
                  <li>Mar — Score 820 (B)</li>
                  <li>Abr — Score 850 (B)</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase text-slate-500">Tendência</p>
                <div className="mt-3 flex items-end gap-1">
                  {[65, 72, 78, 82, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded bg-slate-200"
                      style={{ height: `${h}%`, minHeight: 24 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10) Casos de uso */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Casos de uso
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <p className="font-medium text-slate-900">Cyber insurance</p>
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                  <li>Subscrição baseada em score e eixos</li>
                  <li>Monitoramento contínuo das apólices</li>
                  <li>Relatórios para board e underwriters</li>
                </ul>
                <p className="mt-4 text-sm font-medium text-slate-700">
                  Resultado: subscrição e monitoramento com rastreabilidade.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <p className="font-medium text-slate-900">Risco de terceiros (TPRM/GRC)</p>
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                  <li>Qualificação contínua de fornecedores</li>
                  <li>Evidências centralizadas</li>
                  <li>Alertas e Trust Center</li>
                </ul>
                <p className="mt-4 text-sm font-medium text-slate-700">
                  Resultado: qualificação contínua e evidências centralizadas.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <p className="font-medium text-slate-900">CISO/TI</p>
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                  <li>Clareza sobre priorização</li>
                  <li>Correções comprováveis</li>
                  <li>Justificativas e trilha de auditoria</li>
                </ul>
                <p className="mt-4 text-sm font-medium text-slate-700">
                  Resultado: clareza, priorização e correções comprováveis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 11) Integrações */}
        <section id="integracoes" className="scroll-mt-20 border-b border-slate-100 bg-slate-50/30 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Integrações para operação.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {["SIEM/SOC", "Ticketing", "GRC", "Webhooks", "E-mail", "API"].map((label) => (
                <span
                  key={label}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="mt-8 text-sm text-slate-600">
              Roadmap: alertas (webhook, e-mail), relatórios PDF e integrações com SIEM e GRC em
              evolução.
            </p>
          </div>
        </section>

        {/* 12) Segurança e privacidade */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Segurança por padrão.
            </h2>
            <ul className="mt-8 space-y-4">
              <li className="flex gap-3">
                <span className="shrink-0 text-[#00ade0]">•</span>
                <span className="text-slate-700">Avaliação outside-in (não intrusiva quando aplicável)</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-[#00ade0]">•</span>
                <span className="text-slate-700">Segregação por tenant e RBAC</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-[#00ade0]">•</span>
                <span className="text-slate-700">Trilha de auditoria e evidências</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 13) FAQ */}
        <section id="faq" className="scroll-mt-20 border-b border-slate-100 bg-slate-50/30 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              FAQ
            </h2>
            <div className="mt-10 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem
                  key={item.id}
                  id={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={faqOpen === item.id}
                  onToggle={() => setFaqOpen(faqOpen === item.id ? null : item.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 14) CTA final + Form + Footer */}
        <section
          id="cta-final"
          className="scroll-mt-20 border-b border-slate-100 bg-slate-50 px-4 py-16 sm:px-6 lg:py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Avalie seu risco com evidência e governança.
            </h2>
            <p className="mt-4 text-slate-600">
              Solicite uma demo guiada e veja a n<span style={{ color: ACCENT }}>.</span>Risk no seu
              contexto.
            </p>
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="mt-10 text-left">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="lead-nome" className="block text-sm font-medium text-slate-700">
                      Nome
                    </label>
                    <input
                      id="lead-nome"
                      name="nome"
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-[#00ade0] focus:outline-none focus:ring-1 focus:ring-[#00ade0]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-email" className="block text-sm font-medium text-slate-700">
                      E-mail
                    </label>
                    <input
                      id="lead-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-[#00ade0] focus:outline-none focus:ring-1 focus:ring-[#00ade0]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-empresa" className="block text-sm font-medium text-slate-700">
                      Empresa
                    </label>
                    <input
                      id="lead-empresa"
                      name="empresa"
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-[#00ade0] focus:outline-none focus:ring-1 focus:ring-[#00ade0]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                >
                  Solicitar demo
                </button>
              </form>
            ) : (
              <p className="mt-10 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                Recebido. Entraremos em contato.
              </p>
            )}
          </div>
        </section>

        <footer className="px-4 py-12 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} n.Risk. Todos os direitos reservados.
              </p>
              <p className="text-xs text-slate-400">
                powered by{" "}
                <a
                  href="https://ness.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#00ade0]"
                >
                  ness.
                </a>
              </p>
            </div>
            <nav className="flex gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700">
                LGPD
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700">
                Termos
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700">
                Contato
              </a>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
}
