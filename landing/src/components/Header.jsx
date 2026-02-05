import { NavLink, Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/nrisk" className="text-[1.625rem] font-semibold tracking-tight hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0] rounded">
      n<span className="text-[#00ade0]">.</span>Risk
    </Link>
  );
}

const navItems = [
  { to: "/nrisk", label: "Visão geral" },
  { to: "/nrisk/supply-chain", label: "Cadeia de suprimentos" },
  { to: "/nrisk/insurance", label: "Seguradoras" },
  { to: "/nrisk/assessments", label: "Avaliações" },
  { to: "/nrisk/methodology", label: "Metodologia" },
  { to: "/nrisk/contact", label: "Contato" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm supports-[backdrop-filter]:bg-gray-900/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex flex-wrap items-center gap-6">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0] rounded " +
                (isActive ? "text-gray-100 font-medium" : "text-gray-400 hover:text-gray-100")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/nrisk/contact"
          className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-100 shadow-sm hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00ade0]"
        >
          Falar com especialista
        </Link>
      </div>
    </header>
  );
}

export default Header;
