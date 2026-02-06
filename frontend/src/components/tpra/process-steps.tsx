const steps = [
  {
    number: "01",
    title: "Identificacao de Terceiros",
    description:
      "Listar todos os prestadores de servicos, priorizando os criticos — aqueles com acesso a dados sensiveis ou sistemas core.",
    details: [
      "Provedores de cloud, ERPs, processadores de pagamento (Critico)",
      "Consultorias de TI, SaaS com integracao API (Alto)",
      "Ferramentas de marketing, plataformas de comunicacao (Medio)",
    ],
    nrisk:
      "Cada terceiro critico e cadastrado como tenant. O Gestor GRC envia convites de assessment.",
    color: "bg-blue-500",
  },
  {
    number: "02",
    title: "Due Diligence e Questionarios",
    description:
      "Enviar questionarios de seguranca para entender a postura de seguranca do fornecedor.",
    details: [
      "Bronze: auto-declaracao (15-20 perguntas criticas)",
      "Prata: evidenciada (PDF, imagem ou link obrigatorio)",
      "Ouro: framework completo ISO 27001/NIST",
    ],
    nrisk:
      "Assessment hibrido com 20+ perguntas mapeadas para ISO 27001 via mapping_logic.",
    color: "bg-indigo-500",
  },
  {
    number: "03",
    title: "Analise de Risco (Risk Scoring)",
    description:
      "Gerar nota de risco (Cyber Risk Score) com base na superficie externa de ataque e conformidade.",
    details: [
      "Score Tecnico (T): base 1000, deducao por achados",
      "Score Compliance (C): aditivo por questionarios",
      "Formula: Sf = (T x 0.6) + (C x 0.4)",
    ],
    nrisk:
      "Transparencia total: avaliado ve impacto de cada achado e inconsistencia no score.",
    color: "bg-cyan-500",
  },
  {
    number: "04",
    title: "Avaliacao de Conformidade",
    description:
      "Verificar se o terceiro cumpre normas de protecao de dados (LGPD/GDPR) e notifica incidentes.",
    details: [
      "Politicas de privacidade e DPO nomeado",
      "Plano de resposta a incidentes documentado e testado",
      "Notificacao ANPD em caso de incidente",
    ],
    nrisk:
      "Cross-Check Engine compara declaracao vs scan. Evidence Vault com SHA-256.",
    color: "bg-emerald-500",
  },
  {
    number: "05",
    title: "Remediacao e Monitoramento",
    description:
      "Definir plano de acao para lacunas e realizar monitoramento continuo, nao apenas no contrato.",
    details: [
      "Justificativa de finding para falsos positivos",
      "Score snapshots para rastreabilidade",
      "Re-scans periodicos atualizam score tecnico",
    ],
    nrisk:
      "Jornada de melhoria (ou piora) persistida e consumivel por seguradora/corretora.",
    color: "bg-amber-500",
  },
];

export function ProcessSteps() {
  return (
    <section id="etapas" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Principais Etapas do Processo TPRA
          </h2>
          <p className="mt-4 text-lg text-muted">
            Cinco etapas para uma avaliacao eficaz de riscos ciberneticos de
            terceiros
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="flex flex-col lg:flex-row">
                <div
                  className={`flex items-center justify-center px-8 py-6 text-white lg:w-24 ${step.color}`}
                >
                  <span className="text-2xl font-bold">{step.number}</span>
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted">{step.description}</p>
                  <ul className="mt-4 space-y-1">
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg bg-primary-light p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-primary">
                        No n.Risk:{" "}
                      </span>
                      {step.nrisk}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
