import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                nR
              </div>
              <span className="text-lg font-bold">
                n.<span className="text-primary">Risk</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">
              Plataforma de avaliacao de postura cibernetica para Cyber
              Insurance e gestao de riscos de terceiros.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Plataforma
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/#tpra"
                  className="text-sm text-muted hover:text-foreground"
                >
                  TPRA
                </Link>
              </li>
              <li>
                <Link
                  href="/#scoring"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Cyber Risk Score
                </Link>
              </li>
              <li>
                <Link
                  href="/trust/demo"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Trust Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Solucoes
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/grc/tpra"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Gestao de Terceiros
                </Link>
              </li>
              <li>
                <Link
                  href="/grc/fornecedores"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Fornecedores
                </Link>
              </li>
              <li>
                <Link
                  href="/#praticas"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Melhores Praticas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Frameworks
            </h3>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-muted">ISO 27001</li>
              <li className="text-sm text-muted">NIST CSF</li>
              <li className="text-sm text-muted">LGPD / GDPR</li>
              <li className="text-sm text-muted">CIS Controls</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted">
          n.Risk — Avaliacao de Postura Cibernetica e Gestao de Riscos de
          Terceiros
        </div>
      </div>
    </footer>
  );
}
