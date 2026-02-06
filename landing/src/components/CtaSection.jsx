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
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/nrisk/contact"
            className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-gray-900 shadow-lg shadow-accent/25 transition-smooth hover:scale-105 hover:shadow-accent/35 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          >
            Solicitar demonstração
          </Link>
          <Link
            to="/nrisk/methodology"
            className="inline-flex items-center justify-center rounded-md border-2 border-accent/50 bg-transparent px-8 py-3.5 text-base font-semibold text-accent transition-smooth hover:bg-accent/10 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          >
            Ver metodologia
          </Link>
        </div>
      </div>
    </section>
  );
}
