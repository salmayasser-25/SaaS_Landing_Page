import { useState } from 'react';
import { TESTIMONIALS_DATA, TestimonialItem } from '../data/nexoraData';

function AvatarImage({ item }: { item: TestimonialItem }) {
  const [hasError, setHasError] = useState(false);
  const initials = item.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  if (hasError) {
    return (
      <div
        aria-label={item.name}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-gradient-to-br from-blue-900/60 to-violet-900/60 font-display text-sm font-bold text-white"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={item.avatar}
      alt={`${item.name}, ${item.role} at ${item.company}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="h-12 w-12 shrink-0 rounded-xl border border-slate-700/80 object-cover"
    />
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-t border-slate-800/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-violet-400">Customer Outcomes</p>
          <h2
            className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Verified operational results from finance and delivery leaders.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS_DATA.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 sm:p-7"
            >
              <div>
                <p className="font-mono text-xs font-semibold text-emerald-400">
                  {item.metric}
                </p>
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-200">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 flex items-center gap-3.5 border-t border-slate-800/80 pt-5">
                <AvatarImage item={item} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {item.role} · {item.company}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">{item.industry}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
