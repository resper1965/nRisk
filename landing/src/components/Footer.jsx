import { Link } from "react-router-dom";
import NessBrand from "./NessBrand";
import NriskBrand from "./NriskBrand";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-800 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">
            © {year} <NessBrand /> Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500">
            powered by{" "}
            <a
              href="https://ness.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-accent rounded"
            >
              <NessBrand />
            </a>
          </p>
        </div>
        <nav className="flex gap-6">
          <Link to="/nrisk" className="text-sm text-gray-400 transition-smooth hover:text-gray-100">
            <NriskBrand />
          </Link>
          <Link to="/nrisk/contact" className="text-sm text-gray-400 transition-smooth hover:text-gray-100">
            Contato
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
