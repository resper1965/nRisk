import Link from "next/link";

const menuItems = [
  {
    section: "GRC",
    items: [
      { label: "TPRA", href: "/grc/tpra", icon: "shield" },
      { label: "Fornecedores", href: "/grc/fornecedores", icon: "building" },
    ],
  },
  {
    section: "Subscritor",
    items: [
      { label: "Dashboard", href: "/subscritor", icon: "chart" },
    ],
  },
  {
    section: "CISO",
    items: [
      { label: "Postura", href: "/ciso", icon: "lock" },
    ],
  },
];

const icons: Record<string, React.ReactNode> = {
  shield: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  building: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  chart: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  lock: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
};

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/5 bg-gray-950">
      <div className="flex h-16 items-center px-6 border-b border-white/5">
        <Link href="/" className="group flex items-center gap-0.5 text-[1.125rem] font-medium tracking-tight">
          <span className="text-gray-100">n</span>
          <span className="text-accent leading-none">.</span>
          <span className="text-gray-100 -ml-0.5">Risk</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-8">
        {menuItems.map((group) => (
          <div key={group.section} className="mb-8">
            <h3 className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {group.section}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-gray-400 transition-smooth hover:bg-white/5 hover:text-accent group"
                  >
                    <span className="transition-colors group-hover:text-accent">
                      {icons[item.icon]}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-6">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-100"
        >
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
