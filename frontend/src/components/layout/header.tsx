import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-0.5 text-[1.25rem] font-medium tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded-sm transition-transform hover:scale-[1.02]">
          <span className="text-gray-100">n</span>
          <span className="text-accent leading-none">.</span>
          <span className="text-gray-100 -ml-0.5">Risk</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#problema" className="text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-accent">
            O Problema
          </Link>
          <Link href="/#solucao" className="text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-accent">
            Solução
          </Link>
          <Link href="/#como-funciona" className="text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-accent">
            Como Funciona
          </Link>
          <Link href="/#para-quem" className="text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-accent">
            Para Quem
          </Link>
          <Link href="/trust/demo" className="text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-accent">
            Demo
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/#agendar" className="hidden text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-100 sm:block">
            Login
          </Link>
          <Link
            href="/#agendar"
            className="rounded-sm bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-900 transition-smooth hover:scale-105 hover:brightness-110"
          >
            Agendar Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
