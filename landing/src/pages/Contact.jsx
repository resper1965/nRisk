import { useState } from "react";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      <section className="border-b border-gray-800 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-100 sm:text-4xl">
            Contato
          </h1>
          <p className="mt-4 text-gray-400">
            Preencha o formulário. Entraremos em contato.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <div>
                <label htmlFor="contact-nome" className="block text-sm font-medium text-gray-400">
                  Nome
                </label>
                <input
                  id="contact-nome"
                  name="nome"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 text-gray-100 shadow-sm focus:border-[#00ade0] focus:outline-none focus:ring-1 focus:ring-[#00ade0]"
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
                  className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 text-gray-100 shadow-sm focus:border-[#00ade0] focus:outline-none focus:ring-1 focus:ring-[#00ade0]"
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
                  className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 text-gray-100 shadow-sm focus:border-[#00ade0] focus:outline-none focus:ring-1 focus:ring-[#00ade0]"
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
                  className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 text-gray-100 shadow-sm focus:border-[#00ade0] focus:outline-none focus:ring-1 focus:ring-[#00ade0]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[#00ade0] px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0]"
              >
                Enviar
              </button>
            </form>
          ) : (
            <p className="mt-10 rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-sm font-medium text-gray-200">
              Recebido. Entraremos em contato.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Contact;
