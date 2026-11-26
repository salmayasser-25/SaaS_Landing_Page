import { FEATURES_DATA } from '../data/nexoraData';

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-slate-800/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-blue-400">Platform Capabilities</p>
          <h2
            className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Six core systems built to replace fragmented operating spreadsheets.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Every module reads from the same canonical ledger, so finance, procurement, and delivery
            leads act on identical verified numbers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES_DATA.map((feature) => (
            <article
              key={feature.index}
              className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 transition-colors duration-200 hover:border-slate-700"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs font-semibold text-blue-400">
                    {feature.index}.
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums text-slate-300">
                    {feature.metricValue}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
                  {feature.title}
                </h3>

                <p className="mt-1.5 text-sm font-medium text-violet-300">{feature.outcome}</p>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-800/80 pt-4">
                <p className="text-xs font-medium text-slate-400">{feature.mechanism.label}</p>
                <div className="mt-3 space-y-2.5">
                  {feature.mechanism.rows.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-baseline justify-between gap-3 text-[13px]"
                    >
                      <span className="text-slate-300">{row.name}</span>
                      <div className="flex items-baseline gap-2.5 shrink-0">
                        <span className="font-mono font-medium tabular-nums text-white">
                          {row.value}
                        </span>
                        <span className="text-xs text-slate-400">{row.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t border-slate-800/60 pt-3 text-xs leading-relaxed text-slate-400">
                  {feature.metricLabel}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
