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
      <section className="border-y border-white/5 bg-gray-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
            Padrões globais de conformidade
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {proofPoints.map((p) => (
              <div key={p.label} className="text-center group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm border border-white/10 bg-gray-900 transition-smooth group-hover:border-accent/40">
                  <svg className="h-8 w-8 text-accent/60 transition-colors group-hover:text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-100">{p.label}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-600 font-bold">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Perguntas <span className="italic font-medium text-accent">Frequentes</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-sm border border-white/5 bg-gray-900/30 p-8 transition-smooth hover:border-accent/20">
                <h3 className="font-bold text-gray-100 uppercase tracking-widest text-sm">{faq.q}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="agendar" className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-sm bg-accent px-8 py-20 text-center text-gray-900 lg:px-16">
            <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] [background-size:40px_40px]" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold sm:text-6xl tracking-tighter">
                Seu próximo fornecedor pode ser seu <br className="hidden lg:block" />
                <span className="italic">próximo incidente.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-2xl text-lg font-bold uppercase tracking-widest opacity-80">
                A postura do terceiro é a sua postura. Não espere um breach para descobrir quem é o elo mais fraco.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link
                  href="/#agendar"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm bg-gray-900 px-10 py-4 text-base font-bold text-accent transition-smooth hover:scale-105 hover:bg-black uppercase tracking-widest shadow-2xl"
                >
                  Agendar Demo
                </Link>
                <Link
                  href="/trust/demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm border-2 border-gray-900/20 bg-transparent px-10 py-4 text-base font-bold text-gray-900 transition-smooth hover:bg-gray-900/10 uppercase tracking-widest"
                >
                  Ver Trust Center
                </Link>
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] opacity-60">
                Setup em 5 minutos • Sem fricção • Precisão absoluta
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
