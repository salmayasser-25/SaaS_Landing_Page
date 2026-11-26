import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  Search,
  Settings,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  CashFlowPoint,
  CapacityPoint,
  DashboardTabId,
  getDashboardViewData,
  LEDGER_ENTRIES,
  OverviewPoint,
  SpendPoint,
  TimeframeKey,
} from '../data/nexoraData';

const SIDEBAR_TABS: { id: DashboardTabId; label: string; icon: typeof Layers }[] = [
  { id: 'overview', label: 'Operating Overview', icon: Layers },
  { id: 'cashflow', label: 'Cash & Treasury', icon: Wallet },
  { id: 'operations', label: 'Spend & Approvals', icon: BarChart3 },
  { id: 'capacity', label: 'Team Capacity', icon: Users },
];

const TIMEFRAMES: TimeframeKey[] = ['7D', '30D', '90D', '12M'];
const STATUS_FILTERS: ('All' | 'Settled' | 'In Review' | 'Flagged')[] = [
  'All',
  'Settled',
  'In Review',
  'Flagged',
];

type UtilityPanel = null | 'settings' | 'help';

function formatChartMoneyK(val: number) {
  if (val >= 1000) return `$${(val / 1000).toFixed(2)}M`;
  return `$${val.toLocaleString()}K`;
}

/** 1. Standard Bar Chart for Operating Overview */
function OverviewBarChart({ data }: { data: OverviewPoint[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.flatMap((d) => [d.revenue, d.expense])) * 1.15;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Recognized Revenue vs. Operating Spend
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Standard grouped comparison · Hover a period to inspect margin
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#2563EB]" aria-hidden="true" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#7C3AED]" aria-hidden="true" />
            Operating Spend
          </span>
        </div>
      </div>

      <div
        className="mt-5 grid h-48 items-end gap-3 pt-4"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
      >
        {data.map((pt, idx) => {
          const revH = Math.max(8, Math.round((pt.revenue / maxVal) * 100));
          const expH = Math.max(8, Math.round((pt.expense / maxVal) * 100));
          const isHovered = hoveredIdx === idx;
          const marginPct = (((pt.revenue - pt.expense) / pt.revenue) * 100).toFixed(1);

          return (
            <div
              key={pt.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex h-full flex-col justify-end"
            >
              {isHovered && (
                <div className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-slate-700 bg-[#0A0F1C] px-2.5 py-1.5 text-xs shadow-xl whitespace-nowrap">
                  <p className="font-semibold text-white">{pt.label}</p>
                  <p className="font-mono tabular-nums text-blue-300">
                    Rev: {formatChartMoneyK(pt.revenue)}
                  </p>
                  <p className="font-mono tabular-nums text-violet-300">
                    Spend: {formatChartMoneyK(pt.expense)}
                  </p>
                  <p className="font-mono tabular-nums text-emerald-400">Margin: {marginPct}%</p>
                </div>
              )}
              <div className="flex h-36 items-end justify-center gap-1.5 sm:gap-2">
                <div
                  className={`w-full max-w-[28px] rounded-t-md transition-colors duration-150 ${
                    isHovered ? 'bg-blue-400' : 'bg-[#2563EB]'
                  }`}
                  style={{ height: `${revH}%` }}
                />
                <div
                  className={`w-full max-w-[28px] rounded-t-md transition-colors duration-150 ${
                    isHovered ? 'bg-violet-400' : 'bg-[#7C3AED]/85'
                  }`}
                  style={{ height: `${expH}%` }}
                />
              </div>
              <span className="mt-2 text-center font-mono text-xs text-slate-400">{pt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 2. Smooth Line Chart for Cash & Treasury */
function CashSmoothLineChart({ data }: { data: CashFlowPoint[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { smoothPath, points, minCash, maxCash } = useMemo(() => {
    const vals = data.map((d) => d.netCash);
    const min = Math.min(...vals) * 0.96;
    const max = Math.max(...vals) * 1.03;
    const w = 640;
    const h = 160;
    const padX = 28;
    const padY = 18;
    const usableW = w - padX * 2;
    const usableH = h - padY * 2;

    const coords = data.map((d, i) => {
      const x = data.length === 1 ? w / 2 : padX + (i / (data.length - 1)) * usableW;
      const y = padY + (1 - (d.netCash - min) / Math.max(1, max - min)) * usableH;
      return { ...d, x, y };
    });

    // Smooth cubic bezier path
    let path = '';
    coords.forEach((pt, i) => {
      if (i === 0) {
        path = `M ${pt.x} ${pt.y}`;
      } else {
        const prev = coords[i - 1];
        const midX = (prev.x + pt.x) / 2;
        path += ` C ${midX} ${prev.y}, ${midX} ${pt.y}, ${pt.x} ${pt.y}`;
      }
    });

    return { smoothPath: path, points: coords, minCash: min, maxCash: max };
  }, [data]);

  const activePt = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Cumulative Cash &amp; Treasury Balance</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Smooth cash progression · Range {formatChartMoneyK(Math.round(minCash))} –{' '}
            {formatChartMoneyK(Math.round(maxCash))}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#2563EB]" aria-hidden="true" />
            Net Liquidity Curve
          </span>
        </div>
      </div>

      <div className="relative mt-5 h-48 w-full">
        {activePt && (
          <div className="pointer-events-none absolute top-0 right-2 z-20 rounded-lg border border-slate-700 bg-[#0A0F1C] px-3 py-1.5 text-xs shadow-xl">
            <p className="font-semibold text-white">{activePt.label}</p>
            <p className="font-mono tabular-nums text-blue-300">
              Balance: {formatChartMoneyK(activePt.netCash)}
            </p>
            <p className="font-mono tabular-nums text-emerald-400">
              Net Flow: +{formatChartMoneyK(activePt.inflow - activePt.outflow)}
            </p>
          </div>
        )}

        <svg viewBox="0 0 640 190" className="h-full w-full overflow-visible">
          {[0.2, 0.5, 0.8].map((r) => (
            <line
              key={r}
              x1="28"
              x2="612"
              y1={18 + r * 124}
              y2={18 + r * 124}
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="1"
            />
          ))}

          <path
            d={smoothPath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={pt.label}>
                {isHovered && (
                  <line
                    x1={pt.x}
                    x2={pt.x}
                    y1={14}
                    y2={156}
                    stroke="rgba(37, 99, 235, 0.4)"
                    strokeWidth="1"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#60A5FA' : '#0F182D'}
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                <text
                  x={pt.x}
                  y={180}
                  textAnchor="middle"
                  className={`font-mono text-[11px] ${
                    isHovered ? 'fill-white font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {pt.label}
                </text>
                <rect
                  x={pt.x - 35}
                  y={0}
                  width={70}
                  height={185}
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
  );
}

/** 3. Stacked Bar Chart for Spend & Approvals */
function SpendStackedBarChart({ data }: { data: SpendPoint[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxTotal = Math.max(...data.map((d) => d.cloud + d.payroll + d.vendors)) * 1.15;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Approved Spend Breakdown by Category</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Stacked composition across cost centers · Hover period for split
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#2563EB]" aria-hidden="true" />
            Payroll
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#7C3AED]" aria-hidden="true" />
            Cloud Infra
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-sky-400" aria-hidden="true" />
            Vendors
          </span>
        </div>
      </div>

      <div
        className="mt-5 grid h-48 items-end gap-4 pt-4"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
      >
        {data.map((pt, idx) => {
          const total = pt.payroll + pt.cloud + pt.vendors;
          const totalH = Math.max(14, Math.round((total / maxTotal) * 100));
          const payrollPct = Math.round((pt.payroll / total) * 100);
          const cloudPct = Math.round((pt.cloud / total) * 100);
          const vendorPct = Math.max(5, 100 - payrollPct - cloudPct);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={pt.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex h-full flex-col justify-end items-center"
            >
              {isHovered && (
                <div className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-slate-700 bg-[#0A0F1C] px-2.5 py-1.5 text-xs shadow-xl whitespace-nowrap">
                  <p className="font-semibold text-white">
                    {pt.label} · {formatChartMoneyK(total)}
                  </p>
                  <p className="font-mono tabular-nums text-blue-300">
                    Payroll: {formatChartMoneyK(pt.payroll)}
                  </p>
                  <p className="font-mono tabular-nums text-violet-300">
                    Cloud: {formatChartMoneyK(pt.cloud)}
                  </p>
                  <p className="font-mono tabular-nums text-sky-300">
                    Vendors: {formatChartMoneyK(pt.vendors)}
                  </p>
                </div>
              )}

              <div className="flex h-36 w-full items-end justify-center">
                <div
                  className={`flex w-full max-w-[46px] flex-col overflow-hidden rounded-t-md transition-opacity ${
                    isHovered ? 'opacity-100 ring-1 ring-blue-400/50' : 'opacity-95'
                  }`}
                  style={{ height: `${totalH}%` }}
                >
                  <div className="bg-sky-400" style={{ height: `${vendorPct}%` }} />
                  <div className="bg-[#7C3AED]" style={{ height: `${cloudPct}%` }} />
                  <div className="bg-[#2563EB]" style={{ height: `${payrollPct}%` }} />
                </div>
              </div>
              <span className="mt-2 text-center font-mono text-xs text-slate-400">{pt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 4. Area Chart for Team Capacity */
function CapacityAreaChart({ data }: { data: CapacityPoint[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { billablePath, billableArea, availablePath, points } = useMemo(() => {
    const maxHours = Math.max(...data.map((d) => d.availableHours)) * 1.12;
    const w = 640;
    const h = 160;
    const padX = 28;
    const padY = 18;
    const usableW = w - padX * 2;
    const usableH = h - padY * 2;
    const baseLineY = h - padY;

    const coords = data.map((d, i) => {
      const x = data.length === 1 ? w / 2 : padX + (i / (data.length - 1)) * usableW;
      const yBill = padY + (1 - d.billableHours / maxHours) * usableH;
      const yAvail = padY + (1 - d.availableHours / maxHours) * usableH;
      return { ...d, x, yBill, yAvail };
    });

    const bLine = coords
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.yBill}`)
      .join(' ');
    const aLine = coords
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.yAvail}`)
      .join(' ');
    const bArea = `${bLine} L ${coords[coords.length - 1].x} ${baseLineY} L ${coords[0].x} ${baseLineY} Z`;

    return {
      billablePath: bLine,
      billableArea: bArea,
      availablePath: aLine,
      points: coords,
    };
  }, [data]);

  const activePt = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Billable Utilization vs. Capacity</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Area chart comparing logged billable hours against total team capacity
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#7C3AED]" aria-hidden="true" />
            Billable Hours
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t border-dashed border-slate-400" aria-hidden="true" />
            Total Capacity
          </span>
        </div>
      </div>

      <div className="relative mt-5 h-48 w-full">
        {activePt && (
          <div className="pointer-events-none absolute top-0 right-2 z-20 rounded-lg border border-slate-700 bg-[#0A0F1C] px-3 py-1.5 text-xs shadow-xl">
            <p className="font-semibold text-white">{activePt.label}</p>
            <p className="font-mono tabular-nums text-violet-300">
              Billable: {activePt.billableHours.toLocaleString()}h
            </p>
            <p className="font-mono tabular-nums text-slate-300">
              Capacity: {activePt.availableHours.toLocaleString()}h ({activePt.utilizationPct}%)
            </p>
          </div>
        )}

        <svg viewBox="0 0 640 190" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="nexora-cap-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          <path d={billableArea} fill="url(#nexora-cap-area)" />
          <path
            d={availablePath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <path d={billablePath} fill="none" stroke="#7C3AED" strokeWidth="2.5" />

          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={pt.label}>
                <circle
                  cx={pt.x}
                  cy={pt.yBill}
                  r={isHovered ? 5.5 : 3.5}
                  fill={isHovered ? '#A78BFA' : '#0F182D'}
                  stroke="#7C3AED"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={180}
                  textAnchor="middle"
                  className={`font-mono text-[11px] ${
                    isHovered ? 'fill-white font-semibold' : 'fill-slate-400'
                  }`}
                >
                  {pt.label}
                </text>
                <rect
                  x={pt.x - 35}
                  y={0}
                  width={70}
                  height={185}
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
  );
}

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>('overview');
  const [timeframe, setTimeframe] = useState<TimeframeKey>('30D');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Settled' | 'In Review' | 'Flagged'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [utilityPanel, setUtilityPanel] = useState<UtilityPanel>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [fxCurrency, setFxCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');

  const viewData = useMemo(
    () => getDashboardViewData(activeTab, timeframe),
    [activeTab, timeframe]
  );

  const filteredEntries = useMemo(() => {
    return LEDGER_ENTRIES.filter((entry) => {
      const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        entry.entity.toLowerCase().includes(q) ||
        entry.department.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    }).map((entry) => ({
      ...entry,
      scaledAmount: Math.round(entry.baseAmount * viewData.multiplier),
    }));
  }, [statusFilter, searchQuery, viewData.multiplier]);

  const activeTabLabel = SIDEBAR_TABS.find((t) => t.id === activeTab)?.label ?? 'Operating Overview';

  return (
    <section aria-label="Interactive NEXORA Dashboard Preview" className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0D1426] shadow-2xl shadow-blue-950/35">
          {/* Top Bar inside Dashboard */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-[#10182E] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              </div>
              <div className="h-4 w-px bg-slate-800" aria-hidden="true" />
              <div className="text-xs sm:text-sm text-slate-400">
                <span className="font-medium text-slate-200">NEXORA Workspace</span>
                <span aria-hidden="true" className="mx-2 text-slate-600">/</span>
                <span>{activeTabLabel}</span>
              </div>
            </div>

            {/* Interactive Timeframe Segmented Control */}
            <div
              role="group"
              aria-label="Dashboard timeframe"
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0A0F1C] p-1"
            >
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Workspace Body: Full-height Sidebar + Main Viewport */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Sidebar with Top Modules, Middle Entities, and Bottom Settings / Help / User Profile */}
            <aside className="flex flex-col justify-between border-b border-slate-800/80 bg-[#090E1B] p-3 lg:col-span-3 lg:border-r lg:border-b-0 lg:p-4">
              <div>
                <p className="px-2.5 pb-2 text-xs font-medium text-slate-500">Workspace Views</p>
                <nav aria-label="Dashboard modules" className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
                  {SIDEBAR_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setUtilityPanel(null);
                        }}
                        className={`flex min-h-[40px] items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'border border-[#2563EB]/40 bg-[#2563EB]/15 text-blue-300'
                            : 'border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Consolidated Entities Summary */}
                <div className="mt-6 hidden border-t border-slate-800/80 pt-4 lg:block">
                  <p className="px-2.5 pb-2.5 text-xs font-medium text-slate-500">
                    Consolidated Entities
                  </p>
                  <div className="space-y-2.5 px-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">North America Core</span>
                      <span className="font-mono tabular-nums text-slate-400">USD</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">EMEA Operations Ltd.</span>
                      <span className="font-mono tabular-nums text-slate-400">EUR</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">APAC Logistics Hub</span>
                      <span className="font-mono tabular-nums text-slate-400">SGD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer: Settings, Help Center, User Profile (Eliminates empty sidebar void) */}
              <div className="mt-4 border-t border-slate-800/80 pt-3 lg:mt-6">
                <div className="flex flex-wrap items-center gap-1 lg:flex-col lg:items-stretch">
                  <button
                    type="button"
                    onClick={() =>
                      setUtilityPanel((prev) => (prev === 'settings' ? null : 'settings'))
                    }
                    className={`flex min-h-[36px] items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      utilityPanel === 'settings'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Settings className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Workspace Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUtilityPanel((prev) => (prev === 'help' ? null : 'help'))}
                    className={`flex min-h-[36px] items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      utilityPanel === 'help'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Help Center</span>
                  </button>
                </div>

                {/* User Profile Row */}
                <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-[#0E1527] px-3 py-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/20 font-mono text-xs font-semibold text-blue-300">
                    CV
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">Claire Vance</p>
                    <p className="truncate text-[11px] text-slate-400">VP Finance · Admin</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Dashboard Content Viewport */}
            <div className="p-4 sm:p-6 lg:col-span-9">
              {/* Inline Utility Panel when Settings or Help Center is clicked */}
              {utilityPanel === 'settings' && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#2563EB]/40 bg-[#111B33] p-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">Workspace Ledger Preferences</p>
                    <p className="text-slate-400">
                      Reporting Currency: <strong className="text-slate-200">{fxCurrency}</strong> ·
                      15-min Auto-Sync:{' '}
                      <strong className="text-slate-200">
                        {autoSyncEnabled ? 'Enabled' : 'Paused'}
                      </strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Reporting currency"
                      value={fxCurrency}
                      onChange={(e) => setFxCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}
                      className="rounded-md border border-slate-700 bg-[#0A0F1C] px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setAutoSyncEnabled((v) => !v)}
                      className="rounded-md border border-slate-700 bg-[#0A0F1C] px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-800 cursor-pointer"
                    >
                      {autoSyncEnabled ? 'Pause Sync' : 'Resume Sync'}
                    </button>
                    <button
                      type="button"
                      aria-label="Close settings panel"
                      onClick={() => setUtilityPanel(null)}
                      className="rounded-md p-1.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {utilityPanel === 'help' && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#7C3AED]/40 bg-[#131733] p-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">NEXORA Support &amp; Documentation</p>
                    <p className="text-slate-300">
                      Direct Controller Desk: <span className="font-mono">support@nexora.io</span> ·
                      Median enterprise response: 12 minutes.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close help panel"
                    onClick={() => setUtilityPanel(null)}
                    className="rounded-md p-1.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* 4-column View-Specific & Timeframe-Scaled KPI Strip — zero text truncation */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
                {viewData.kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl border border-slate-800/90 bg-[#10182E] p-4"
                  >
                    <p className="text-xs font-medium leading-snug text-slate-400">{kpi.label}</p>
                    <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-white sm:text-2xl">
                      {kpi.value}
                    </p>
                    <p
                      className={`mt-1.5 text-xs leading-snug ${
                        kpi.tone === 'positive'
                          ? 'text-emerald-400'
                          : kpi.tone === 'violet'
                            ? 'text-violet-300'
                            : 'text-blue-300'
                      }`}
                    >
                      {kpi.delta}
                    </p>
                  </div>
                ))}
              </div>

              {/* Distinct Visualization per Dashboard Module */}
              <div className="mt-5 rounded-xl border border-slate-800/90 bg-[#10182E] p-4 sm:p-5">
                {activeTab === 'overview' && <OverviewBarChart data={viewData.overviewSeries} />}
                {activeTab === 'cashflow' && <CashSmoothLineChart data={viewData.cashSeries} />}
                {activeTab === 'operations' && <SpendStackedBarChart data={viewData.spendSeries} />}
                {activeTab === 'capacity' && <CapacityAreaChart data={viewData.capacitySeries} />}
              </div>

              {/* Searchable & Filterable High-Density Ledger Table (Scaled coherently by Timeframe) */}
              <div className="mt-5 rounded-xl border border-slate-800/90 bg-[#10182E]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3">
                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter entity, ID, or entry..."
                      aria-label="Filter ledger entries"
                      className="w-full rounded-lg border border-slate-700/80 bg-[#0A0F1C] py-1.5 pr-3 pl-8 text-xs text-slate-100 placeholder:text-slate-500 focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0A0F1C] p-1">
                    {STATUS_FILTERS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          statusFilter === status
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                    <p className="text-sm font-medium text-slate-200">
                      No ledger entries match &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Reset filters to inspect all live multi-entity transactions.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('All');
                      }}
                      className="mt-3 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800/80 text-slate-400">
                          <th className="px-4 py-2.5 font-medium">Entry</th>
                          <th className="px-4 py-2.5 font-medium">Entity</th>
                          <th className="px-4 py-2.5 font-medium">Status</th>
                          <th className="px-4 py-2.5 text-right font-medium">Variance</th>
                          <th className="px-4 py-2.5 text-right font-medium">
                            Amount ({timeframe})
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredEntries.map((row) => (
                          <tr
                            key={row.id}
                            className="h-11 transition-colors hover:bg-slate-800/35"
                          >
                            <td className="px-4 py-2">
                              <div className="font-medium text-slate-100">{row.category}</div>
                              <div className="font-mono text-[11px] text-slate-500">
                                {row.id} · {row.owner}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-slate-300">{row.entity}</div>
                              <div className="text-[11px] text-slate-500">{row.department}</div>
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`inline-flex items-center gap-1.5 font-medium ${
                                  row.status === 'Settled'
                                    ? 'text-emerald-400'
                                    : row.status === 'In Review'
                                      ? 'text-amber-300'
                                      : 'text-rose-400'
                                }`}
                              >
                                {row.status === 'Settled' && (
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                )}
                                {row.status === 'In Review' && (
                                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                )}
                                {row.status === 'Flagged' && (
                                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                )}
                                {row.status}
                              </span>
                            </td>
                            <td
                              className={`px-4 py-2 text-right font-mono tabular-nums ${
                                row.variance.startsWith('+')
                                  ? 'text-amber-300'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {row.variance}
                            </td>
                            <td className="px-4 py-2 text-right font-mono font-medium tabular-nums text-white">
                              ${row.scaledAmount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-2.5 text-xs text-slate-400">
                  <span>
                    Showing {filteredEntries.length} of {LEDGER_ENTRIES.length} entries scaled to{' '}
                    {timeframe}
                  </span>
                  <a
                    href="#features"
                    className="inline-flex items-center gap-1 font-medium text-blue-400 hover:text-blue-300"
                  >
                    <span>Explore automation rules</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
