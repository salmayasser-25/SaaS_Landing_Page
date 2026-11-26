import { CheckCircle2, Mail, MapPin } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface FooterProps {
  onOpenTrial: (plan?: string, mode?: 'trial' | 'demo') => void;
}

export function Footer({ onOpenTrial }: FooterProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setError('Enter a valid work email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#050914] pt-10 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Compact Pre-Footer CTA Strip */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-800/90 bg-gradient-to-r from-[#0D1426] via-[#10182E] to-[#131733] px-5 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Consolidate your operating ledger in 48 hours.
            </h2>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Start a 14-day trial with live ERP connectors or schedule a technical walkthrough.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenTrial('Pro', 'trial')}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap cursor-pointer"
            >
              Start 14-Day Trial
            </button>
            <button
              type="button"
              onClick={() => onOpenTrial('Enterprise', 'demo')}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-700 bg-[#0A0F1C] px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800 whitespace-nowrap cursor-pointer"
            >
              Schedule Demo
            </button>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="mt-10 grid grid-cols-1 gap-10 border-b border-slate-800/80 pb-10 md:grid-cols-12">
          {/* Brand + Contact Details */}
          <div className="md:col-span-4">
            <a href="#" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  className="fill-blue-600/20 stroke-blue-500"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.5 16.5V7.5L16.5 16.5V7.5"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>NEXORA</span>
            </a>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Unified financial ledger, spend governance, and operational forecasting for modern
              multi-entity teams.
            </p>

            <div className="mt-5 space-y-2 text-xs text-slate-400">
              <a
                href="mailto:hello@nexora.io"
                className="flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                <span>hello@nexora.io</span>
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span>San Francisco · London · Singapore</span>
              </p>
            </div>
          </div>

          {/* Platform Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-4">
            <div>
              <p className="text-xs font-semibold text-white">Platform</p>
              <ul className="mt-3.5 space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#features" className="transition-colors hover:text-white">
                    Capabilities
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="transition-colors hover:text-white">
                    Implementation
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="transition-colors hover:text-white">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-white">Resources</p>
              <ul className="mt-3.5 space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#testimonials" className="transition-colors hover:text-white">
                    Customer Stories
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-white">
                    Security &amp; FAQ
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenTrial('Enterprise', 'demo')}
                    className="text-left transition-colors hover:text-white cursor-pointer"
                  >
                    Architecture Review
                  </button>
                </li>
                <li>
                  <a href="mailto:security@nexora.io" className="transition-colors hover:text-white">
                    Trust &amp; SOC 2
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Release Briefing Form */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold text-white">Monthly Product Briefing</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Receive quarterly ledger benchmarks and ERP connector release notes. No marketing
              sequences.
            </p>
            {subscribed ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Subscribed. Next quarterly briefing arrives at month end.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@company.com"
                    aria-label="Work email for monthly briefing"
                    className="min-h-[40px] w-full rounded-lg border border-slate-800 bg-[#0B1222] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="min-h-[40px] rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
                {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal & Social Row */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} NEXORA Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              X (Twitter)
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
