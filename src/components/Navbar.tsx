import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onOpenTrial: (plan?: string, mode?: 'trial' | 'demo') => void;
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar({ onOpenTrial }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0A0F1C]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] rounded-sm"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="5"
              className="fill-[#2563EB]/20 stroke-[#2563EB]"
              strokeWidth="1.5"
            />
            <path
              d="M7.5 16.5V7.5L16.5 16.5V7.5"
              stroke="url(#nexora-mark-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="nexora-mark-grad"
                x1="7.5"
                y1="7.5"
                x2="16.5"
                y2="16.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <span>NEXORA</span>
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 text-sm font-medium text-slate-300 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#2563EB] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action (Exact #2563EB Electric Blue) + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenTrial('Pro', 'trial')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-950/50 transition-colors duration-150 hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Free Trial
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-200 transition-colors hover:border-slate-700 hover:text-white md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-[#0A0F1C] px-4 py-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-slate-200 transition-colors hover:bg-slate-800/60 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial('Pro', 'trial');
              }}
              className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] cursor-pointer"
            >
              Start Free Trial
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
