const metrics = [
  {
    name: "Cobertura de avaliacao",
    description: "% de fornecedores criticos avaliados",
    measurement: "Tenants com assessment submetido / total de tenants criticos",
  },
  {
    name: "Score medio do portfolio",
    description: "Media ponderada dos scores dos fornecedores",
    measurement: "Agregacao de Sf por seguradora/corretora",
  },
  {
    name: "Taxa de inconsistencia",
    description: "% de controles com cross-check inconsistente",
    measurement: "Dados do Cross-Check Engine por tenant",
  },
  {
    name: "Tempo de remediacao",
    description: "Dias entre deteccao de gap e resolucao",
    measurement: "Delta entre scan com finding e scan sem finding",
  },
  {
    name: "Evolucao da postura",
    description: "Tendencia do score ao longo do tempo",
    measurement: "Score snapshots (jornada persistida)",
  },
];

const tools = [
  {
    name: "SIG (Standardized Information Gathering)",
    description:
      "Questionario padronizado do Shared Assessments para coleta de informacoes de terceiros",
    nrisk: "Assessment hibrido com perguntas mapeadas para ISO 27001",
  },
  {
    name: "CAIQ (Consensus Assessments Initiative)",
    description:
      "Questionario da CSA para avaliacao de provedores cloud",
    nrisk: "Perguntas sobre cloud security no Question Bank",
  },
  {
    name: "VSA (Vendor Security Alliance)",
    description: "Questionario colaborativo de seguranca de fornecedores",
    nrisk: "Trilhas de maturidade cobrem escopos similares",
  },
];

export function MetricsTable() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ferramentas e Metricas TPRM
          </h2>
          <p className="mt-4 text-lg text-muted">
            Metricas quantitativas para medir e acompanhar a gestao de riscos de
            terceiros
          </p>
        </div>

        <div className="mb-12">
          <h3 className="mb-6 text-xl font-semibold">
            Metricas de Gestao TPRM
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-6 py-4 text-left font-semibold">
                    Metrica
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Descricao
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Como medir no n.Risk
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {metrics.map((metric) => (
                  <tr key={metric.name}>
                    <td className="px-6 py-4 font-medium">{metric.name}</td>
                    <td className="px-6 py-4 text-muted">
                      {metric.description}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {metric.measurement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold">
            Questionarios Padronizados
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-xl border border-border bg-background p-6"
              >
                <h4 className="font-semibold">{tool.name}</h4>
                <p className="mt-2 text-sm text-muted">{tool.description}</p>
                <div className="mt-4 rounded-lg bg-primary-light p-3">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">
                      n.Risk:{" "}
                    </span>
                    {tool.nrisk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
