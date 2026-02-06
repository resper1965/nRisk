import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

function Logo() {
  return (
    <Link to="/nrisk" className="text-[1.625rem] font-semibold tracking-tight transition-smooth hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded">
      n<span className="text-accent">.</span>Risk
    </Link>
  );
}

const segmentosItems = [
  { to: "/nrisk/supply-chain", label: "Cadeia de suprimentos" },
  { to: "/nrisk/insurance", label: "Seguradoras e corretoras" },
];

const navItems = [
  { to: "/nrisk", label: "Visão geral" },
  { to: "/nrisk/assessments", label: "Avaliações" },
  { to: "/nrisk/methodology", label: "Metodologia" },
  { to: "/nrisk/contact", label: "Contato" },
];

function SegmentosDropdown() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isSegmentoActive = segmentosItems.some(({ to }) => location.pathname === to);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`text-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded flex items-center gap-1 ${
          isSegmentoActive ? "text-gray-100 font-medium" : "text-gray-400 hover:text-gray-100"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Segmentos
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`absolute top-full left-0 z-50 mt-1 pt-1 min-w-[220px] rounded-lg border-2 border-gray-800 bg-gray-900 py-2 shadow-xl transition-smooth ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {segmentosItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 text-sm transition-smooth hover:bg-gray-800 ${
                isActive ? "text-accent font-medium" : "text-gray-300"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm supports-[backdrop-filter]:bg-gray-900/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex flex-wrap items-center gap-6">
          <NavLink
            to="/nrisk"
            className={({ isActive }) =>
              "text-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded " +
              (isActive ? "text-gray-100 font-medium" : "text-gray-400 hover:text-gray-100")
            }
          >
            Visão geral
          </NavLink>
          <SegmentosDropdown />
          {navItems.slice(1).map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "text-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded " +
                (isActive ? "text-gray-100 font-medium" : "text-gray-400 hover:text-gray-100")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/nrisk/contact"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-smooth hover:scale-105 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
        >
          Solicitar demonstração
        </Link>
      </div>
    </header>
  );
}

export default Header;
