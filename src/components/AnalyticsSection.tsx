import { useMemo, useState } from 'react';
import { ANALYTICS_SERIES } from '../data/nexoraData';

type AnalyticsKey = keyof typeof ANALYTICS_SERIES;

const SERIES_TABS: { id: AnalyticsKey; label: string }[] = [
  { id: 'revenue', label: 'Revenue Forecast' },
  { id: 'burn', label: 'Operating Margin' },
  { id: 'margins', label: 'Team Utilization' },
];

export function AnalyticsSection() {
  const [selectedKey, setSelectedKey] = useState<AnalyticsKey>('revenue');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeData = ANALYTICS_SERIES[selectedKey];
  const points = activeData.points;

  const { minVal, maxVal, primaryPath, secondaryPath, areaPath, coords } = useMemo(() => {
    const allVals = points.flatMap((p) => [p.primary, p.secondary]);
    const rawMin = Math.min(...allVals);
    const rawMax = Math.max(...allVals);
    const pad = (rawMax - rawMin) * 0.18 || 1;
    const min = Math.max(0, rawMin - pad);
    const max = rawMax + pad;

    const width = 680;
    const height = 220;
    const padX = 20;
    const padY = 18;
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    const mapped = points.map((p, idx) => {
      const x = padX + (idx / (points.length - 1)) * usableW;
      const y1 = padY + (1 - (p.primary - min) / (max - min)) * usableH;
      const y2 = padY + (1 - (p.secondary - min) / (max - min)) * usableH;
      return { ...p, x, y1, y2 };
    });

    const pPath = mapped.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y1}`).join(' ');
    const sPath = mapped.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y2}`).join(' ');
    const aPath = `${pPath} L ${mapped[mapped.length - 1].x} ${height - padY} L ${mapped[0].x} ${height - padY} Z`;

    return {
      minVal: min,
      maxVal: max,
      primaryPath: pPath,
      secondaryPath: sPath,
      areaPath: aPath,
      coords: mapped,
    };
  }, [points]);

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : coords[coords.length - 1];
  const unitSuffix = selectedKey === 'revenue' ? 'M' : '%';
  const unitPrefix = selectedKey === 'revenue' ? '$' : '';

  return (
    <section id="analytics" className="border-t border-slate-800/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-blue-400">
              Analytics &amp; Performance
            </p>
            <h2
              className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Forecast variance before it reaches your quarterly board deck.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Analytics dataset selector"
            className="inline-flex items-center gap-1 self-start rounded-xl border border-slate-800 bg-[#0D1426] p-1 lg:self-auto"
          >
            {SERIES_TABS.map((tab) => {
              const isSelected = selectedKey === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedKey(tab.id);
                    setHoveredIdx(null);
                  }}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 lg:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <h3 className="text-base font-semibold text-white">{activeData.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{activeData.subtitle}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">
                  {activeData.headlineMetric}
                </p>
                <p className="mt-0.5 text-xs text-emerald-400">{activeData.headlineDelta}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2 text-slate-200">
                  <span className="h-0.5 w-4 bg-[#2563EB]" aria-hidden="true" />
                  <span>
                    Actual ({activePoint.period}):{' '}
                    <strong className="font-mono tabular-nums text-white">
                      {unitPrefix}
                      {activePoint.primary.toFixed(2)}
                      {unitSuffix}
                    </strong>
                  </span>
                </span>
                <span className="flex items-center gap-2 text-slate-400">
                  <span
                    className="h-0.5 w-4 border-t border-dashed border-[#7C3AED]"
                    aria-hidden="true"
                  />
                  <span>
                    Baseline:{' '}
                    <strong className="font-mono tabular-nums text-slate-200">
                      {unitPrefix}
                      {activePoint.secondary.toFixed(2)}
                      {unitSuffix}
                    </strong>
                  </span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                Range: {unitPrefix}
                {minVal.toFixed(1)}
                {unitSuffix} – {unitPrefix}
                {maxVal.toFixed(1)}
                {unitSuffix}
              </span>
            </div>

            <div className="mt-4 w-full overflow-hidden">
              <svg
                viewBox="0 0 680 245"
                className="h-60 w-full overflow-visible"
                role="img"
                aria-label={activeData.title}
              >
                <defs>
                  <linearGradient id="nexora-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[0.2, 0.45, 0.7, 0.92].map((ratio) => (
                  <line
                    key={ratio}
                    x1="20"
                    x2="660"
                    y1={18 + ratio * 184}
                    y2={18 + ratio * 184}
                    stroke="rgba(148, 163, 184, 0.1)"
                    strokeWidth="1"
                  />
                ))}

                <path d={areaPath} fill="url(#nexora-area-grad)" />

                <path
                  d={secondaryPath}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  strokeOpacity="0.85"
                />

                <path
                  d={primaryPath}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {hoveredIdx !== null && (
                  <line
                    x1={activePoint.x}
                    x2={activePoint.x}
                    y1={18}
                    y2={202}
                    stroke="rgba(96, 165, 250, 0.35)"
                    strokeWidth="1"
                  />
                )}

                {coords.map((pt, idx) => {
                  const isFocused = hoveredIdx === idx;
                  return (
                    <g key={pt.period}>
                      <circle
                        cx={pt.x}
                        cy={pt.y1}
                        r={isFocused ? 5 : 3}
                        fill={isFocused ? '#60A5FA' : '#0D1426'}
                        stroke="#2563EB"
                        strokeWidth={isFocused ? 2.5 : 2}
                      />
                      <text
                        x={pt.x}
                        y={230}
                        textAnchor="middle"
                        className={`font-mono text-[11px] ${
                          isFocused ? 'fill-white font-semibold' : 'fill-slate-500'
                        }`}
                      >
                        {pt.period}
                      </text>
                      <rect
                        x={pt.x - 24}
                        y={10}
                        width={48}
                        height={225}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0D1426] p-6 lg:col-span-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-400">
                Verified Customer Benchmarks
              </p>
              <p className="mt-1.5 text-sm text-slate-300">
                Measured across 400+ multi-entity organizations running NEXORA in production.
              </p>

              <div className="mt-6 divide-y divide-slate-800/80">
                {activeData.benchmarks.map((item) => (
                  <div key={item.label} className="py-4 first:pt-0 last:pb-0">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.context}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
              <span>Methodology: Audited trailing 12-month cohort median (n = 412 workspaces)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
