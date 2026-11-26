import { CheckCircle2, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface TrialModalProps {
  isOpen: boolean;
  initialPlan: string;
  initialMode: 'trial' | 'demo';
  onClose: () => void;
}

export function TrialModal({
  isOpen,
  initialPlan,
  initialMode,
  onClose,
}: TrialModalProps) {
  const [mode, setMode] = useState<'trial' | 'demo'>(initialMode);
  const [plan, setPlan] = useState(initialPlan);
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setPlan(initialPlan);
      setSubmitted(false);
      setError('');
    }
  }, [isOpen, initialPlan, initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (!company.trim()) {
      setError('Please enter your company or organization name.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nexora-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0D1426] p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-400">NEXORA Workspace</p>
            <h2 id="nexora-modal-title" className="mt-1 text-xl font-bold text-white">
              {mode === 'trial' ? 'Start Your 14-Day Free Trial' : 'Schedule Live Demo'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition-colors hover:border-slate-700 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-white">
                    {mode === 'trial'
                      ? `${plan} Workspace Provisioned`
                      : 'Demo Request Confirmed'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-200/90">
                    {mode === 'trial'
                      ? `We sent an activation link for ${company} to ${workEmail}. Your sandbox ERP and multi-entity ledger are ready.`
                      : `Our solutions team will send calendar times for ${company} to ${workEmail} within one business hour.`}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
            >
              Return to Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {/* Mode Switcher */}
            <div
              role="tablist"
              aria-label="Request type"
              className="grid grid-cols-2 gap-1 rounded-lg border border-slate-800 bg-[#0A0F1C] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'trial'}
                onClick={() => setMode('trial')}
                className={`rounded-md py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'trial'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                14-Day Trial
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'demo'}
                onClick={() => setMode('demo')}
                className={`rounded-md py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'demo'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Demo
              </button>
            </div>

            <div>
              <label htmlFor="nexora-name" className="block text-xs font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="nexora-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={mode === 'trial' ? 'Sarah Connor' : 'David Morales'}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A0F1C] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="nexora-email" className="block text-xs font-medium text-slate-300">
                Work Email
              </label>
              <input
                id="nexora-email"
                type="email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder={mode === 'trial' ? 'sarah@acme.com' : 'dmorales@northstar.io'}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A0F1C] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nexora-company" className="block text-xs font-medium text-slate-300">
                  Company
                </label>
                <input
                  id="nexora-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={mode === 'trial' ? 'Acme Industries' : 'Northstar Freight'}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A0F1C] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="nexora-plan" className="block text-xs font-medium text-slate-300">
                  Target Tier
                </label>
                <select
                  id="nexora-plan"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A0F1C] px-3 py-2.5 text-sm text-white focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] cursor-pointer"
            >
              {mode === 'trial' ? 'Create Trial Workspace' : 'Request Demo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
