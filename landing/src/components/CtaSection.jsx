import { Link } from "react-router-dom";

export default function CtaSection({ id = "cta" }) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-gray-800 bg-gray-850 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
          Avalie seu risco com evidência e governança.
        </h2>
        <p className="mt-4 text-gray-400">
          Fale com um especialista e veja a n.Risk no seu contexto.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/nrisk/contact"
            className="inline-flex items-center justify-center rounded-md bg-[#00ade0] px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0]"
          >
            Falar com especialista
          </Link>
          <Link
            to="/nrisk/methodology"
            className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-100 shadow-sm hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0]"
          >
            Ver metodologia
          </Link>
        </div>
      </div>
    </section>
  );
}
