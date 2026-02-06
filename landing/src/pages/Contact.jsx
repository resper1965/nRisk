import { useState } from "react";
import CtaSection from "../components/CtaSection";
import NriskBrand from "../components/NriskBrand";

const BENEFITS = [
  {
    title: "Demonstração personalizada",
    textJsx: <>Veja como a <NriskBrand /> se aplica ao seu contexto — subscrição de cyber, TPRM, cadeia de suprimentos ou governança.</>,
  },
  {
    title: "Resposta em até 24h",
    text: "Nossa equipe retorna em breve para agendar uma conversa e entender suas necessidades.",
  },
  {
    title: "Sem compromisso",
    textJsx: <>Uma conversa para explorar se a <NriskBrand /> faz sentido para você. Sem pressão comercial.</>,
  },
];

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">Contato</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl lg:text-5xl">
              Fale com um <span className="text-accent">especialista</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-400">
              Pronto para assumir o controle do seu risco cibernético? Converse com nossa equipe e veja como a <NriskBrand /> se aplica ao seu contexto — subscrição, TPRM, cadeia de suprimentos ou governança.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 text-center">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border-2 border-gray-800 p-6 transition-smooth hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
              >
                <p className="font-semibold text-accent">{b.title}</p>
                <p className="mt-3 text-sm text-gray-400">{b.textJsx ?? b.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-xl mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-nome" className="block text-sm font-medium text-gray-400">
                    Nome
                  </label>
                  <input
                    id="contact-nome"
                    name="nome"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border-2 border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 shadow-sm transition-smooth focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-400">
                    E-mail
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full rounded-lg border-2 border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 shadow-sm transition-smooth focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="contact-empresa" className="block text-sm font-medium text-gray-400">
                    Empresa
                  </label>
                  <input
                    id="contact-empresa"
                    name="empresa"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border-2 border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 shadow-sm transition-smooth focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="contact-mensagem" className="block text-sm font-medium text-gray-400">
                    Mensagem
                  </label>
                  <textarea
                    id="contact-mensagem"
                    name="mensagem"
                    rows={4}
                    placeholder="Conte-nos sobre seu interesse: subscrição de cyber, TPRM, avaliação de fornecedores..."
                    className="mt-1 block w-full rounded-lg border-2 border-gray-700 bg-gray-800/50 px-4 py-3 text-gray-100 shadow-sm transition-smooth placeholder-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-accent px-4 py-3.5 text-sm font-semibold text-gray-900 shadow-lg shadow-accent/20 transition-smooth hover:scale-[1.02] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                >
                  Enviar
                </button>
              </form>
            ) : (
              <div className="rounded-xl border-2 border-accent/30 bg-gray-800/50 px-6 py-8 text-center">
                <p className="font-semibold text-accent text-lg">Mensagem recebida</p>
                <p className="mt-3 text-gray-400">Retornaremos em até 24 horas com os próximos passos para uma demonstração personalizada.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export default Contact;
