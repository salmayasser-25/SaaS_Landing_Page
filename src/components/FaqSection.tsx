import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FAQ_DATA } from '../data/nexoraData';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="border-t border-slate-800/70 bg-[#080D19] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-blue-400">
            Frequently Asked Questions
          </p>
          <h2
            className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Answers on security, ERP integration, and rollout timelines.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  className="flex min-h-[56px] w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-blue-300 cursor-pointer"
                >
                  <span className="text-base font-semibold text-white">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div id={`faq-panel-${item.id}`} className="pb-6 pr-8 text-sm leading-relaxed text-slate-300">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
