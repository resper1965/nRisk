import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "n.Risk — Avaliacao de Postura Cibernetica e Gestao de Riscos de Terceiros",
  description:
    "Plataforma de avaliacao de postura cibernetica para Cyber Insurance e gestao de riscos de terceiros (TPRA/TPRM). Score 0-1000, ISO 27001, LGPD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
