import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-0.5 text-[1.25rem] font-medium tracking-tight">
              <span className="text-gray-100">n</span>
              <span className="text-accent leading-none">.</span>
              <span className="text-gray-100 -ml-0.5">Risk</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Transformando incerteza em evidência auditável. A maior autoridade em Score Híbrido para GRC e Risk Management.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-100">Soluções</h3>
            <ul className="mt-6 space-y-4">
              <li><Link href="/#para-quem" className="text-sm text-gray-500 transition-colors hover:text-accent">Para Seguradoras</Link></li>
              <li><Link href="/#para-quem" className="text-sm text-gray-500 transition-colors hover:text-accent">Gestão de GRC</Link></li>
              <li><Link href="/#para-quem" className="text-sm text-gray-500 transition-colors hover:text-accent">Cyber Underwriting</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-100">Produto</h3>
            <ul className="mt-6 space-y-4">
              <li><Link href="/#como-funciona" className="text-sm text-gray-500 transition-colors hover:text-accent">Como Funciona</Link></li>
              <li><Link href="/trust/demo" className="text-sm text-gray-500 transition-colors hover:text-accent">Trust Center</Link></li>
              <li><Link href="/#solucao" className="text-sm text-gray-500 transition-colors hover:text-accent">Cyber Risk Score</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-100">Compliance</h3>
            <ul className="mt-6 space-y-4">
              <li className="text-sm text-gray-500">ISO/IEC 27001</li>
              <li className="text-sm text-gray-500">LGPD & GDPR</li>
              <li className="text-sm text-gray-500">NIST Cyber Framework</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <p className="text-center text-xs font-medium tracking-widest text-gray-600 uppercase">
            © {new Date().getFullYear()} n.Risk — Gestão de riscos de alta precisão
          </p>
        </div>
      </div>
    </footer>
  );
}
