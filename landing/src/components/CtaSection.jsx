import { Link } from "react-router-dom";
import NriskBrand from "./NriskBrand";

export default function CtaSection({ id = "cta" }) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-gray-800 bg-gradient-to-b from-gray-850 to-gray-900 px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl lg:text-4xl">
          Pronto para assumir o controle do seu risco cibernético?
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Converse com um especialista e veja como a <NriskBrand /> se aplica ao seu contexto — subscrição, TPRM ou governança.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Link
            to="/nrisk/contact"
            className="inline-flex items-center justify-center rounded-sm bg-accent px-8 py-4 text-sm font-bold text-gray-900 shadow-[0_0_20px_rgba(0,173,232,0.15)] transition-smooth hover:scale-105 hover:shadow-[0_0_30px_rgba(0,173,232,0.3)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent uppercase tracking-widest"
          >
            Agendar Demo
          </Link>
          <Link
            to="/nrisk/methodology"
            className="inline-flex items-center justify-center rounded-sm border-[1px] border-accent/40 bg-transparent px-8 py-4 text-sm font-bold text-accent transition-smooth hover:bg-accent/10 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent uppercase tracking-widest"
          >
            Ver Metodologia
          </Link>
        </div>
      </div>
    </section>
  );
}
