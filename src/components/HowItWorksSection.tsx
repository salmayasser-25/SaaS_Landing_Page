import { Check } from 'lucide-react';
import { useState } from 'react';
import { WORKFLOW_STEPS } from '../data/nexoraData';

export function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStep = WORKFLOW_STEPS[activeIndex];

  return (
    <section
      id="how-it-works"
      className="border-t border-slate-800/70 bg-[#080D19] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-violet-400">How It Works</p>
          <h2
            className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Live across every entity in 48 hours without engineering overhead.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Inspect each rollout phase to see how NEXORA connects to your accounting, billing, and
            payroll systems.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-5 lg:col-span-6">
            {WORKFLOW_STEPS.map((step, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border p-6 sm:p-8 text-left transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#2563EB]/70 bg-[#10182E] shadow-lg shadow-blue-950/30'
                      : 'border-slate-800/90 bg-[#0D1426] hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        isSelected ? 'text-blue-400' : 'text-slate-300'
                      }`}
                    >
                      {step.number}. {step.title}
                    </span>
                    <span className="font-mono text-xs text-slate-400 whitespace-nowrap">
                      {step.duration}
                    </span>
                  </div>
                  <p className="mt-3.5 text-sm leading-relaxed text-slate-300">{step.summary}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="border-b border-slate-800/80 pb-4">
                <p className="font-mono text-xs text-blue-400">{currentStep.duration}</p>
                <h3 className="mt-1 text-xl font-bold text-white">{currentStep.title}</h3>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-300">{currentStep.detail}</p>

              <ul className="mt-6 space-y-3">
                {currentStep.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-slate-800/80 pt-5">
              <p className="text-xs font-semibold text-slate-400">
                {currentStep.configSnippet.header}
              </p>
              <dl className="mt-3 divide-y divide-slate-800/60">
                {currentStep.configSnippet.fields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm"
                  >
                    <dt className="text-slate-400">{field.key}</dt>
                    <dd className="font-mono font-medium text-white text-right">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
