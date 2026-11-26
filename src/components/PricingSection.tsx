import { Check } from 'lucide-react';
import { useState } from 'react';
import { PRICING_TIERS } from '../data/nexoraData';

interface PricingSectionProps {
  onSelectPlan: (planName: string, billing: 'annual' | 'monthly') => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [billing, setBilling] = useState<'annual' | 'monthly'>('annual');

  return (
    <section
      id="pricing"
      className="border-t border-slate-800/70 bg-[#080D19] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-blue-400">Pricing</p>
            <h2
              className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Predictable workspace pricing with unlimited executive viewers.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Every plan includes read-only board access, SOC 2 security controls, and guided chart
              of accounts mapping.
            </p>
          </div>

          <div
            role="group"
            aria-label="Billing cadence"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-[#0D1426] p-1 shrink-0"
          >
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                billing === 'annual'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Annual · Save 20%
            </button>
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const activePrice =
              billing === 'annual' ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div
                key={tier.id}
                className={`flex flex-col justify-between rounded-2xl border p-6 sm:p-7 ${
                  tier.featured
                    ? 'border-[#2563EB]/70 bg-[#10182E] shadow-xl shadow-blue-950/40'
                    : 'border-slate-800/90 bg-[#0D1426]'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    {tier.featured && (
                      <span className="text-xs font-semibold text-blue-400">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-400">{tier.audience}</p>

                  <div className="mt-6 border-b border-slate-800/80 pb-6">
                    {activePrice !== null ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-4xl font-bold tabular-nums text-white">
                          ${activePrice}
                        </span>
                        <span className="text-xs text-slate-400">{tier.priceNote}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-mono text-3xl font-bold text-white">
                          Custom
                        </span>
                        <p className="mt-1 text-xs text-slate-400">{tier.priceNote}</p>
                      </div>
                    )}
                  </div>

                  <dl className="mt-5 divide-y divide-slate-800/60 border-b border-slate-800/80 pb-5">
                    {tier.quotas.map((q) => (
                      <div
                        key={q.label}
                        className="flex items-center justify-between gap-3 py-2 text-xs"
                      >
                        <dt className="text-slate-400">{q.label}</dt>
                        <dd className="font-mono font-medium tabular-nums text-slate-100">
                          {q.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-5 space-y-3">
                    {tier.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]"
                          aria-hidden="true"
                        />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(tier.name, billing)}
                  className={`mt-8 flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                    tier.featured
                      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                      : 'border border-slate-700 bg-[#0A0F1C] text-white hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  {tier.ctaLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
