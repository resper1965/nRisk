import { useState } from "react";

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="rounded-sm border-[1px] border-gray-800 bg-gray-950 px-4 shadow-sm">
      {items.map(({ id, question, answer }) => (
        <div key={id} className="border-b-[1px] border-gray-800 last:border-b-0">
          <h3>
            <button
              type="button"
              aria-expanded={openId === id}
              aria-controls={"faq-panel-" + id}
              id={"faq-" + id}
              onClick={() => setOpenId(openId === id ? null : id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenId(openId === id ? null : id);
                }
              }}
              className="flex w-full items-center justify-between py-5 text-left text-sm font-bold text-gray-100 transition-smooth hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded-sm"
            >
              {question}
              <span
                className={"ml-2 shrink-0 transition-transform duration-200 " + (openId === id ? "rotate-180" : "")}
                aria-hidden
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </h3>
          <div
            id={"faq-panel-" + id}
            role="region"
            aria-labelledby={"faq-" + id}
            hidden={openId !== id}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-gray-400">{answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
