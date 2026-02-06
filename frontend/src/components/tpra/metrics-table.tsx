import Link from "next/link";

const proofPoints = [
  { icon: "shield", label: "ISO 27001", desc: "15 dominios mapeados" },
  { icon: "lock", label: "LGPD/GDPR", desc: "Evidence Vault criptografado" },
  { icon: "scan", label: "Scan passivo", desc: "Nuclei + Nmap + Subfinder" },
  { icon: "check", label: "Cross-check", desc: "Declarado vs detectado" },
];

const faqs = [
  {
    q: "O fornecedor precisa instalar algo?",
    a: "Nao. O scan e 100% passivo e externo. O fornecedor so precisa responder o questionario na plataforma.",
  },
  {
    q: "Quanto tempo leva pra ter o primeiro score?",
    a: "O scan inicial leva menos de 5 minutos. Com o questionario preenchido, o score hibrido sai na hora.",
  },
  {
    q: "Como e diferente de SecurityScorecard ou Bitsight?",
    a: "Transparencia total: voce ve a formula e cada achado. Score hibrido (scan + questionario) ao inves de so tecnico. Cross-check automatico para pegar inconsistencias.",
  },
  {
    q: "Funciona pra LGPD?",
    a: "Sim. Controles de privacidade mapeados, Evidence Vault com SHA-256, isolamento por tenant e criptografia em repouso.",
  },
  {
    q: "E se o fornecedor discordar de um achado?",
    a: "Ele pode justificar. Se o avaliador aceitar, a nota e recalculada na hora. Tudo rastreavel.",
  },
];

export function MetricsTable() {
  return (
    <>
      {/* Social proof strip */}
      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted">
            Construido sobre padroes que o mercado confia
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {proofPoints.map((p) => (
              <div key={p.label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="mt-2 font-semibold">{p.label}</p>
                <p className="text-xs text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="agendar" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-12 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Seu proximo fornecedor pode ser seu proximo incidente
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              69% das empresas dizem que seus fornecedores tem seguranca mais
              fraca. Nao espere um breach pra descobrir quem sao os seus.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/#agendar"
                className="rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-blue-50"
              >
                Agendar Demo Gratuita
              </Link>
              <Link
                href="/trust/demo"
                className="rounded-lg border border-white/30 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Ver Trust Center ao vivo
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              Setup em minutos. Sem cartao de credito. Sem instalacao.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
