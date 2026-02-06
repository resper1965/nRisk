const practices = [
  {
    title: "Contratos com Clausulas de Seguranca",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    items: [
      "Notificacao de incidentes em ate 72h (LGPD/GDPR)",
      "Direito de auditoria presencial ou remota",
      "Requisitos minimos de seguranca (criptografia, controle de acesso, backup)",
      "Clausula de pentest periodico",
      "SLA de remediacao para vulnerabilidades criticas",
      "Clausula de subcontratacao (controle de 4th parties)",
    ],
  },
  {
    title: "Abordagem Baseada em Risco",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    items: [
      "Priorizar fornecedores por impacto potencial",
      "SolarWinds (2020): ~18.000 organizacoes comprometidas via update",
      "Kaseya (2021): ~1.500 empresas afetadas por ransomware via MSP",
      "MOVEit (2023): 2.500+ organizacoes, 67M+ registros expostos",
      "Fornecedores com score D-F recebem atencao prioritaria",
    ],
  },
  {
    title: "Uso de Frameworks Reconhecidos",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    items: [
      "ISO 27001: framework base do n.Risk; 15 dominios no spider chart",
      "NIST CSF: Identify, Protect, Detect, Respond, Recover",
      "LGPD/GDPR: controles de privacidade e Evidence Vault",
      "CIS Controls: referencia para priorizacao de controles tecnicos",
      "SOC 2: referencia para Trust Center e evidencias",
    ],
  },
  {
    title: "Auditorias Periodicas",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    items: [
      "Criticos: auditoria anual + monitoramento continuo",
      "Alto risco: auditoria a cada 18 meses",
      "Medio risco: autoavaliacao anual com verificacao por amostragem",
      "Baixo risco: autoavaliacao bienal",
      "Trilha Ouro = auditoria formal com evidencias completas",
    ],
  },
];

export function BestPractices() {
  return (
    <section id="praticas" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Melhores Praticas TPRA
          </h2>
          <p className="mt-4 text-lg text-muted">
            Praticas recomendadas integradas na plataforma n.Risk
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {practices.map((practice) => (
            <div
              key={practice.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  {practice.icon}
                </div>
                <h3 className="text-lg font-semibold">{practice.title}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {practice.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
