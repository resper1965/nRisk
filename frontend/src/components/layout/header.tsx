import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            nR
          </div>
          <span className="text-xl font-bold tracking-tight">
            n.<span className="text-primary">Risk</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#problema" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
            O Problema
          </Link>
          <Link href="/#solucao" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
            Solucao
          </Link>
          <Link href="/#como-funciona" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
            Como Funciona
          </Link>
          <Link href="/#para-quem" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
            Para Quem
          </Link>
          <Link href="/trust/demo" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
            Demo
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/#agendar" className="hidden text-sm font-medium text-muted hover:text-foreground sm:block">
            Login
          </Link>
          <Link
            href="/#agendar"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Agendar Demo Gratuita
          </Link>
        </div>
      </div>
    </header>
  );
}
