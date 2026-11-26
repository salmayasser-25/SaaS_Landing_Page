import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenTrial: (plan?: string, mode?: 'trial' | 'demo') => void;
}

export function Hero({ onOpenTrial }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(ellipse_70%_55%_at_50%_-5%,rgba(37,99,235,0.22),rgba(124,58,237,0.12)_50%,transparent_80%)]"
      />
      <div aria-hidden="true" className="nexora-grid-bg pointer-events-none absolute inset-0 -z-20 opacity-65" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-medium tracking-wide text-blue-300/90 sm:text-sm">
            <span>Unified Financial Ledger</span>
            <span aria-hidden="true" className="mx-2.5 text-slate-600">·</span>
            <span>Spend Governance</span>
            <span aria-hidden="true" className="mx-2.5 text-slate-600">·</span>
            <span>Capacity Forecasting</span>
          </p>

          <h1
            className="font-bold tracking-tight text-white"
            style={{
              fontSize: 'clamp(2.35rem, 4.6vw, 3.85rem)',
              lineHeight: 1.08,
              textWrap: 'balance',
            }}
          >
            One ledger for modern operations.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            NEXORA unifies multi-entity accounting, spend approvals, and team capacity in a single
            command platform—giving finance and operations leaders verified live numbers.
          </p>

          {/* Two CTAs — Primary uses exact #2563EB */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => onOpenTrial('Pro', 'trial')}
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/60 transition-colors duration-150 hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] sm:w-auto whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onOpenTrial('Pro', 'demo')}
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-[#0F1629] px-6 py-3 text-sm font-semibold text-slate-100 transition-colors duration-150 hover:border-slate-500 hover:bg-slate-800/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] sm:w-auto whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 text-[#7C3AED]" aria-hidden="true" />
              <span>Book Live Demo</span>
            </button>
          </div>

          {/* Trust Markers */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <span>SOC 2 Type II Certified</span>
            <span aria-hidden="true" className="text-slate-700">/</span>
            <span>99.98% Uptime SLA</span>
            <span aria-hidden="true" className="text-slate-700">/</span>
            <span>40+ ERP &amp; HRIS Syncs</span>
            <span aria-hidden="true" className="text-slate-700">/</span>
            <span>No Card Required</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
