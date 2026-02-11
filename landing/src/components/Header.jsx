import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

function Logo() {
  return (
    <Link to="/nrisk" className="group flex items-center gap-0.5 text-[1.625rem] font-medium tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded-sm transition-transform hover:scale-[1.02]">
      <span className="text-gray-100">n</span>
      <span className="text-accent leading-none">.</span>
      <span className="text-gray-100 -ml-0.5">Risk</span>
    </Link>
  );
}

const solutionsItems = [
  { to: "/nrisk/supply-chain", label: "Third-Party Risk (TPRA)" },
  { to: "/nrisk/compliance", label: "Internal Compliance (Deep Gap)" },
];

const segmentosItems = [
  { to: "/nrisk/insurance", label: "Seguradoras e corretoras" },
];

const navItems = [
  { to: "/nrisk", label: "Visão geral" },
  { to: "/nrisk/assessments", label: "Protocolos" },
  { to: "/nrisk/methodology", label: "Metodologia" },
  { to: "/nrisk/contact", label: "Agendar" },
];

function SolutionsDropdown() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isSolutionActive = solutionsItems.some(({ to }) => location.pathname === to);

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
          isSolutionActive ? "text-gray-100 font-medium" : "text-gray-400 hover:text-gray-100"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Soluções
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`absolute top-full left-0 z-50 mt-1 min-w-[240px] rounded-sm border-[1px] border-gray-700 bg-gray-950 py-2 shadow-2xl transition-smooth ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
      >
        {solutionsItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 text-sm transition-smooth hover:bg-accent/10 ${
                isActive ? "text-accent font-bold" : "text-gray-400 hover:text-gray-100"
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
        className={`text-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded-sm flex items-center gap-1 ${
          isSegmentoActive ? "text-gray-100 font-bold" : "text-gray-400 hover:text-gray-100"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Segmentos
        <svg className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`absolute top-full left-0 z-50 mt-1 min-w-[220px] rounded-sm border-[1px] border-gray-700 bg-gray-950 py-2 shadow-2xl transition-smooth ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
      >
        {segmentosItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 text-sm transition-smooth hover:bg-accent/10 ${
                isActive ? "text-accent font-bold" : "text-gray-400 hover:text-gray-100"
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
    <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex flex-wrap items-center gap-8">
          <NavLink
            to="/nrisk"
            className={({ isActive }) =>
              "text-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded-sm " +
              (isActive ? "text-gray-100 font-bold" : "text-gray-400 hover:text-gray-100")
            }
          >
            Visão geral
          </NavLink>
          <SolutionsDropdown />
          <SegmentosDropdown />
          {navItems.slice(1).map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "text-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded-sm " +
                (isActive ? "text-gray-100 font-bold" : "text-gray-400 hover:text-gray-100")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <a
            href="https://nrisk-frontend-209466672892.us-central1.run.app"
            className="text-sm font-bold text-gray-100 transition-smooth hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent border-b border-transparent hover:border-accent pb-0.5"
          >
            Entrar
          </a>
          <Link
            to="/nrisk/contact"
            className="inline-flex items-center justify-center rounded-sm bg-accent px-5 py-2.5 text-sm font-bold text-gray-900 shadow-[0_0_20px_rgba(0,173,232,0.15)] transition-smooth hover:scale-105 hover:shadow-[0_0_30px_rgba(0,173,232,0.3)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent uppercase tracking-wider"
          >
            Agendar Demo
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
