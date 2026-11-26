export type DashboardTabId = 'overview' | 'cashflow' | 'operations' | 'capacity';
export type TimeframeKey = '7D' | '30D' | '90D' | '12M';

export interface DashboardKpi {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'neutral' | 'violet';
}

export interface OverviewPoint {
  label: string;
  revenue: number;
  expense: number;
}

export interface CashFlowPoint {
  label: string;
  netCash: number;
  inflow: number;
  outflow: number;
}

export interface SpendPoint {
  label: string;
  cloud: number;
  payroll: number;
  vendors: number;
}

export interface CapacityPoint {
  label: string;
  billableHours: number;
  availableHours: number;
  utilizationPct: number;
}

export interface LedgerEntry {
  id: string;
  module: DashboardTabId;
  entity: string;
  department: string;
  category: string;
  owner: string;
  baseAmount: number;
  variance: string;
  status: 'Settled' | 'In Review' | 'Flagged';
}

export interface FeatureItem {
  index: string;
  title: string;
  outcome: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  mechanism: {
    label: string;
    rows: { name: string; value: string; note: string }[];
  };
}

export interface WorkflowStep {
  number: string;
  title: string;
  summary: string;
  detail: string;
  duration: string;
  checklist: string[];
  configSnippet: {
    header: string;
    fields: { key: string; value: string }[];
  };
}

export interface PricingTier {
  id: 'basic' | 'pro' | 'enterprise';
  name: string;
  audience: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  priceNote: string;
  featured?: boolean;
  ctaLabel: string;
  quotas: { label: string; value: string }[];
  capabilities: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  avatar: string;
  metric: string;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Timeframe multipliers keep every KPI, chart series, and ledger entry
 * mathematically consistent as the user switches between 7D, 30D, 90D, and 12M.
 */
export const TIMEFRAME_CONFIG: Record<
  TimeframeKey,
  {
    label: string;
    multiplier: number;
    periodLabels: string[];
  }
> = {
  '7D': {
    label: 'Last 7 Days',
    multiplier: 1,
    periodLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  '30D': {
    label: 'Last 30 Days',
    multiplier: 4.3,
    periodLabels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
  },
  '90D': {
    label: 'Last 90 Days',
    multiplier: 12.9,
    periodLabels: ['Month 1', 'Month 2', 'Month 3'],
  },
  '12M': {
    label: 'Last 12 Months',
    multiplier: 52,
    periodLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
};

export function getDashboardViewData(tab: DashboardTabId, timeframe: TimeframeKey) {
  const m = TIMEFRAME_CONFIG[timeframe].multiplier;

  // Generate timeframe-consistent series for each distinct chart type
  const overviewSeriesByTf: Record<TimeframeKey, OverviewPoint[]> = {
    '7D': [
      { label: 'Mon', revenue: 46, expense: 30 },
      { label: 'Tue', revenue: 49, expense: 31 },
      { label: 'Wed', revenue: 52, expense: 32 },
      { label: 'Thu', revenue: 50, expense: 31 },
      { label: 'Fri', revenue: 58, expense: 34 },
      { label: 'Sat', revenue: 31, expense: 23 },
      { label: 'Sun', revenue: 32, expense: 23 },
    ],
    '30D': [
      { label: 'Wk 1', revenue: 312, expense: 205 },
      { label: 'Wk 2', revenue: 334, expense: 214 },
      { label: 'Wk 3', revenue: 352, expense: 224 },
      { label: 'Wk 4', revenue: 369, expense: 234 },
    ],
    '90D': [
      { label: 'Month 1', revenue: 1290, expense: 840 },
      { label: 'Month 2', revenue: 1365, expense: 876 },
      { label: 'Month 3', revenue: 1447, expense: 916 },
    ],
    '12M': [
      { label: 'Q1', revenue: 3680, expense: 2450 },
      { label: 'Q2', revenue: 3940, expense: 2580 },
      { label: 'Q3', revenue: 4290, expense: 2720 },
      { label: 'Q4', revenue: 4626, expense: 2858 },
    ],
  };

  const overviewSeries = overviewSeriesByTf[timeframe];

  // Sum directly from chart series so Revenue - Spend = Net Margin holds 100% accurately
  const periodRevenue = overviewSeries.reduce((acc, pt) => acc + pt.revenue, 0);
  const periodExpense = overviewSeries.reduce((acc, pt) => acc + pt.expense, 0);
  const periodNetFlow = periodRevenue - periodExpense;
  const netMarginPct = ((periodNetFlow / periodRevenue) * 100).toFixed(1);

  const baseCashReserve = 4250; // $4.25M opening reserve
  const endingCash = Math.round(baseCashReserve + periodNetFlow * 0.45);

  const periodBillableHours = Math.round(640 * m);
  const periodAvailableHours = Math.round(730 * m);
  const utilizationPct = ((periodBillableHours / periodAvailableHours) * 100).toFixed(1);

  const pendingPoCount = timeframe === '7D' ? 6 : timeframe === '30D' ? 14 : timeframe === '90D' ? 28 : 42;
  const approvedSpend = Math.round(periodExpense * 0.86);

  const formatMoneyK = (kAmount: number) => {
    if (kAmount >= 1000) {
      return `$${(kAmount / 1000).toFixed(2)}M`;
    }
    return `$${kAmount.toLocaleString()}K`;
  };

  const kpisByTab: Record<DashboardTabId, DashboardKpi[]> = {
    overview: [
      {
        label: `Revenue (${timeframe})`,
        value: formatMoneyK(periodRevenue),
        delta: '+11.4% vs prior period',
        tone: 'positive',
      },
      {
        label: `Operating Spend (${timeframe})`,
        value: formatMoneyK(periodExpense),
        delta: '-2.1% under budget',
        tone: 'positive',
      },
      {
        label: `Net Margin (${timeframe})`,
        value: `${netMarginPct}%`,
        delta: `${formatMoneyK(periodNetFlow)} net profit`,
        tone: 'violet',
      },
      {
        label: 'Closing Cash',
        value: formatMoneyK(endingCash),
        delta: `+${formatMoneyK(Math.round(periodNetFlow * 0.45))} reserve added`,
        tone: 'neutral',
      },
    ],
    cashflow: [
      {
        label: `Cash Inflow (${timeframe})`,
        value: formatMoneyK(periodRevenue),
        delta: '98.6% invoice collection',
        tone: 'positive',
      },
      {
        label: `Cash Disbursed (${timeframe})`,
        value: formatMoneyK(periodExpense),
        delta: 'Zero late vendor fees',
        tone: 'neutral',
      },
      {
        label: `Net Cash Flow (${timeframe})`,
        value: `+${formatMoneyK(periodNetFlow)}`,
        delta: '28.4 months runway',
        tone: 'positive',
      },
      {
        label: 'Ending Liquidity',
        value: formatMoneyK(endingCash),
        delta: 'USD, EUR, SGD accounts',
        tone: 'violet',
      },
    ],
    operations: [
      {
        label: `Approved Spend (${timeframe})`,
        value: formatMoneyK(approvedSpend),
        delta: '99.2% policy compliant',
        tone: 'positive',
      },
      {
        label: 'Pending PO Reviews',
        value: String(pendingPoCount),
        delta: '38 min median turnaround',
        tone: 'neutral',
      },
      {
        label: `Vendor Savings (${timeframe})`,
        value: formatMoneyK(Math.round(14 * m)),
        delta: 'Duplicate renewals blocked',
        tone: 'positive',
      },
      {
        label: 'Flagged Variances',
        value: timeframe === '7D' ? '1' : timeframe === '30D' ? '2' : timeframe === '90D' ? '4' : '6',
        delta: 'Threshold > 8% over plan',
        tone: 'violet',
      },
    ],
    capacity: [
      {
        label: `Billable Hours (${timeframe})`,
        value: `${periodBillableHours.toLocaleString()}h`,
        delta: `of ${periodAvailableHours.toLocaleString()}h available`,
        tone: 'positive',
      },
      {
        label: 'Team Utilization',
        value: `${utilizationPct}%`,
        delta: '+3.2 pts vs target band',
        tone: 'violet',
      },
      {
        label: `Delivery Margin (${timeframe})`,
        value: '41.8%',
        delta: `${formatMoneyK(Math.round(periodRevenue * 0.418))} gross profit`,
        tone: 'positive',
      },
      {
        label: 'Active Workstreams',
        value: timeframe === '7D' ? '18' : timeframe === '30D' ? '22' : timeframe === '90D' ? '27' : '34',
        delta: '94% on-schedule milestones',
        tone: 'neutral',
      },
    ],
  };

  // Cash & Treasury: smooth cumulative cash line series
  let runningCash = baseCashReserve;
  const cashSeries: CashFlowPoint[] = overviewSeries.map((pt) => {
    const net = pt.revenue - pt.expense;
    runningCash += Math.round(net * 0.45);
    return {
      label: pt.label,
      netCash: runningCash,
      inflow: pt.revenue,
      outflow: pt.expense,
    };
  });

  // Spend & Approvals: stacked bar series (Cloud + Payroll + Vendors = total expense)
  const spendSeries: SpendPoint[] = overviewSeries.map((pt) => {
    const cloud = Math.round(pt.expense * 0.24);
    const payroll = Math.round(pt.expense * 0.54);
    const vendors = Math.max(1, pt.expense - cloud - payroll);
    return {
      label: pt.label,
      cloud,
      payroll,
      vendors,
    };
  });

  // Team Capacity: area chart series (billable vs available hours)
  const capacitySeries: CapacityPoint[] = overviewSeries.map((pt) => {
    const ratio = pt.revenue / periodRevenue;
    const avail = Math.round(periodAvailableHours * ratio);
    const bill = Math.round(periodBillableHours * ratio);
    return {
      label: pt.label,
      billableHours: bill,
      availableHours: avail,
      utilizationPct: Number(((bill / Math.max(1, avail)) * 100).toFixed(1)),
    };
  });

  return {
    kpis: kpisByTab[tab],
    overviewSeries,
    cashSeries,
    spendSeries,
    capacitySeries,
    multiplier: m,
  };
}

export const LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'NX-4812',
    module: 'overview',
    entity: 'North America Core',
    department: 'Cloud Infrastructure',
    category: 'AWS Production Cluster',
    owner: 'D. Patel',
    baseAmount: 11200,
    variance: '-3.2%',
    status: 'Settled',
  },
  {
    id: 'NX-4813',
    module: 'cashflow',
    entity: 'EMEA Operations Ltd.',
    department: 'Enterprise Revenue',
    category: 'Annual License Remittance',
    owner: 'H. Lindqvist',
    baseAmount: 38400,
    variance: '+12.8%',
    status: 'Settled',
  },
  {
    id: 'NX-4814',
    module: 'operations',
    entity: 'APAC Logistics Hub',
    department: 'Procurement',
    category: 'Freight Carrier Renewal',
    owner: 'K. Takahashi',
    baseAmount: 7450,
    variance: '+5.4%',
    status: 'In Review',
  },
  {
    id: 'NX-4815',
    module: 'overview',
    entity: 'North America Core',
    department: 'Security & Compliance',
    category: 'SOC 2 Audit Retainer',
    owner: 'M. Alvarez',
    baseAmount: 4600,
    variance: '0.0%',
    status: 'Settled',
  },
  {
    id: 'NX-4816',
    module: 'operations',
    entity: 'EMEA Operations Ltd.',
    department: 'Field Marketing',
    category: 'Munich Executive Forum',
    owner: 'S. Becker',
    baseAmount: 8900,
    variance: '+14.1%',
    status: 'Flagged',
  },
  {
    id: 'NX-4817',
    module: 'capacity',
    entity: 'Global Delivery Group',
    department: 'Implementation Ops',
    category: 'Enterprise Migration Pod',
    owner: 'R. Okafor',
    baseAmount: 21800,
    variance: '-1.4%',
    status: 'Settled',
  },
  {
    id: 'NX-4818',
    module: 'cashflow',
    entity: 'North America Core',
    department: 'Treasury Desk',
    category: 'FX EUR-USD Sweep',
    owner: 'C. Vance',
    baseAmount: 29500,
    variance: '+2.1%',
    status: 'Settled',
  },
  {
    id: 'NX-4819',
    module: 'capacity',
    entity: 'EMEA Operations Ltd.',
    department: 'Advisory Services',
    category: 'Q4 Integration Retainer',
    owner: 'E. Rostova',
    baseAmount: 16400,
    variance: '+4.6%',
    status: 'In Review',
  },
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    index: '01',
    title: 'Multi-Entity Financial Ledger',
    outcome: 'Close monthly books in 2 days instead of 11',
    description:
      'Consolidate subsidiaries, intercompany eliminations, and 38 currencies automatically with continuous general-ledger reconciliation.',
    metricValue: '2.1 days',
    metricLabel: 'Average month-end close across 400+ accounts',
    mechanism: {
      label: 'Consolidated Entities · Live FX Sync',
      rows: [
        { name: 'US Parent Corp (USD)', value: '$3,412,800', note: 'Reconciled' },
        { name: 'EU GmbH (EUR to USD)', value: '$1,084,210', note: 'FX 1.0842' },
        { name: 'SG Pte Ltd (SGD to USD)', value: '$395,640', note: 'FX 0.7460' },
      ],
    },
  },
  {
    index: '02',
    title: 'Policy-Driven Spend Approvals',
    outcome: 'Eliminate rogue SaaS renewals and budget drift',
    description:
      'Route purchase orders, vendor contracts, and card limits through deterministic thresholds tied directly to department budgets.',
    metricValue: '99.4%',
    metricLabel: 'Spend pre-authorized against approved cost centers',
    mechanism: {
      label: 'Approval Routing · Rule Engine',
      rows: [
        { name: 'Software > $10,000', value: 'VP + Finance', note: '2-step signoff' },
        { name: 'Cloud Overrun > 8%', value: 'Auto-alert', note: 'Slack + Ledger' },
        { name: 'Contractor Renewal', value: 'Dept Lead', note: '30d notice' },
      ],
    },
  },
  {
    index: '03',
    title: 'Resource & Margin Forecasting',
    outcome: 'Spot project margin compression six weeks early',
    description:
      'Map billable headcount, contractor burn, and milestone schedules against contract revenue inside one live margin model.',
    metricValue: '+6.4 pts',
    metricLabel: 'Average gross margin recovery within two quarters',
    mechanism: {
      label: 'Active Delivery Margins',
      rows: [
        { name: 'Platform Migration', value: '41.2% GM', note: 'On target' },
        { name: 'Enterprise Rollout', value: '38.7% GM', note: '+2.1 pts' },
        { name: 'Advisory Retainer', value: '52.0% GM', note: 'Locked' },
      ],
    },
  },
  {
    index: '04',
    title: 'Unified ERP & Payroll Sync',
    outcome: 'Remove manual CSV exports from operations',
    description:
      'Bi-directional connectors for NetSuite, QuickBooks, Stripe, Rippling, and Workday keep headcount and cash balances synced every 15 minutes.',
    metricValue: '15 min',
    metricLabel: 'Maximum sync interval across 40+ integrations',
    mechanism: {
      label: 'Connector Pipeline Status',
      rows: [
        { name: 'NetSuite GL Sync', value: '1,482 txns', note: '4m ago' },
        { name: 'Stripe Billing Feed', value: '$842,100', note: '2m ago' },
        { name: 'Rippling Headcount', value: '214 active', note: '9m ago' },
      ],
    },
  },
  {
    index: '05',
    title: 'Audit-Ready Access Controls',
    outcome: 'Pass SOC 2 and external audits without scramble',
    description:
      'Every budget override, journal adjustment, and contract approval writes an immutable timestamped record with role-based permissions.',
    metricValue: '100%',
    metricLabel: 'Immutable audit trail coverage per ledger change',
    mechanism: {
      label: 'Change Log Verification',
      rows: [
        { name: 'Budget Cap Adjustment', value: 'M. Chen', note: '14:22 UTC' },
        { name: 'Vendor IBAN Verified', value: 'K. Takahashi', note: '11:08 UTC' },
        { name: 'Role Grant: Controller', value: 'SSO SAML', note: '09:15 UTC' },
      ],
    },
  },
  {
    index: '06',
    title: 'Scenario & Cash Runway Modeling',
    outcome: 'Compare hiring and pricing plans side by side',
    description:
      'Spin up isolated forecast branches from live actuals to model hiring waves, capex shifts, and churn sensitivities in seconds.',
    metricValue: '24 mo',
    metricLabel: 'Rolling cash runway visibility with variance bands',
    mechanism: {
      label: 'Active Forecast Branches',
      rows: [
        { name: 'Base Operating Plan', value: '28.4 mo', note: 'Active' },
        { name: 'Q2 Hiring Expansion', value: '22.1 mo', note: '-6.3 mo' },
        { name: 'Enterprise Tier Lift', value: '33.6 mo', note: '+5.2 mo' },
      ],
    },
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Authenticate ERP, Bank & HRIS Feeds',
    summary:
      'Link NetSuite, QuickBooks, Stripe, bank accounts, and payroll rosters via OAuth in under 20 minutes.',
    detail:
      'NEXORA pulls read-only general ledger entries and automatically maps disparate subsidiary charts of accounts into a single normalized schema.',
    duration: 'Step 1 · 20 Minutes',
    checklist: [
      'Zero-code OAuth connections with SAML 2.0 enforcement',
      'Automatic subsidiary chart-of-accounts normalization',
      '24-month historical ledger backfill and reconciliation check',
    ],
    configSnippet: {
      header: 'Connected Source Inventory',
      fields: [
        { key: 'Accounting Ledger', value: 'NetSuite OneWorld (4 Entities)' },
        { key: 'Billing Engine', value: 'Stripe + Salesforce Billing' },
        { key: 'HRIS & Payroll', value: 'Rippling US / UK / SG' },
        { key: 'History Imported', value: '24 Months Verified' },
      ],
    },
  },
  {
    number: '02',
    title: 'Encode Approval Matrices & Budget Caps',
    summary:
      'Replace ad-hoc Slack signoffs with automated purchase thresholds, vendor checks, and margin alerts.',
    detail:
      'Configure deterministic spending limits by department, subsidiary, and contract tier so variances are intercepted before capital leaves your bank.',
    duration: 'Step 2 · 45 Minutes',
    checklist: [
      'Multi-tier PO routing by amount and cost center',
      'Automated duplicate vendor and renewal collision detection',
      'Real-time alerts when project burn exceeds 8% of baseline',
    ],
    configSnippet: {
      header: 'Active Governance Rules',
      fields: [
        { key: 'Auto-Approve Cap', value: 'Up to $2,500 / request' },
        { key: 'Controller Signoff', value: '$2,500 – $25,000' },
        { key: 'Executive Approval', value: 'Above $25,000 or New Vendor' },
        { key: 'Margin Floor Alert', value: 'Below 32.0% Gross Margin' },
      ],
    },
  },
  {
    number: '03',
    title: 'Publish Live Forecasts & Board Packs',
    summary:
      'Run weekly executive cash reviews and month-end closes directly from reconciled operational actuals.',
    detail:
      'Finance controllers, department leads, and board observers inspect one shared source of truth with automated variance commentary.',
    duration: 'Step 3 · Day 2 Onward',
    checklist: [
      '15-minute live sync across cash, spend, and team capacity',
      'One-click board reporting exports with variance footnotes',
      'Immutable audit log ready for external SOC 2 review',
    ],
    configSnippet: {
      header: 'Operating Cadence Output',
      fields: [
        { key: 'Cash Briefing', value: 'Weekly Automated Digest' },
        { key: 'Month-End Close', value: 'Target Business Day 2' },
        { key: 'Board Package', value: 'Live Link + PDF Snapshot' },
        { key: 'Audit Retention', value: '7 Years Immutable' },
      ],
    },
  },
];

export const ANALYTICS_SERIES = {
  revenue: {
    title: 'Operating Revenue vs. Plan',
    subtitle: 'Actual recognized revenue tracked against baseline annual operating plan ($M)',
    headlineMetric: '$16.54M',
    headlineDelta: '+11.4% ahead of annual operating plan',
    benchmarks: [
      { label: 'Forecast Accuracy (90-Day)', value: '98.4%', context: 'Across 18 recurring & service lines' },
      { label: 'Net Dollar Retention', value: '118.6%', context: 'Trailing 12 months cohort average' },
      { label: 'Days Sales Outstanding', value: '24 days', context: 'Down from 39 days prior to NEXORA' },
    ],
    points: [
      { period: 'Jan', primary: 1.08, secondary: 0.98 },
      { period: 'Feb', primary: 1.14, secondary: 1.04 },
      { period: 'Mar', primary: 1.22, secondary: 1.10 },
      { period: 'Apr', primary: 1.28, secondary: 1.15 },
      { period: 'May', primary: 1.34, secondary: 1.20 },
      { period: 'Jun', primary: 1.39, secondary: 1.24 },
      { period: 'Jul', primary: 1.43, secondary: 1.28 },
      { period: 'Aug', primary: 1.47, secondary: 1.31 },
      { period: 'Sep', primary: 1.51, secondary: 1.34 },
      { period: 'Oct', primary: 1.54, secondary: 1.37 },
      { period: 'Nov', primary: 1.56, secondary: 1.39 },
      { period: 'Dec', primary: 1.58, secondary: 1.41 },
    ],
  },
  burn: {
    title: 'Net Operating Margin & Cash Efficiency',
    subtitle: 'Monthly operating cash margin percentage versus sector median benchmark (%)',
    headlineMetric: '35.8%',
    headlineDelta: '+6.3 percentage points YoY expansion',
    benchmarks: [
      { label: 'Duplicate SaaS Eliminated', value: '$184K/yr', context: 'Average recovery in first 60 days' },
      { label: 'Approval Cycle Time', value: '38 min', context: 'Median time from PO request to signoff' },
      { label: 'Runway Precision Band', value: '±1.2%', context: 'Variance between 6-mo forecast and actuals' },
    ],
    points: [
      { period: 'Jan', primary: 29.4, secondary: 24.0 },
      { period: 'Feb', primary: 30.1, secondary: 24.2 },
      { period: 'Mar', primary: 31.2, secondary: 24.5 },
      { period: 'Apr', primary: 31.8, secondary: 24.8 },
      { period: 'May', primary: 32.5, secondary: 25.0 },
      { period: 'Jun', primary: 33.1, secondary: 25.1 },
      { period: 'Jul', primary: 33.8, secondary: 25.3 },
      { period: 'Aug', primary: 34.4, secondary: 25.4 },
      { period: 'Sep', primary: 34.9, secondary: 25.6 },
      { period: 'Oct', primary: 35.2, secondary: 25.7 },
      { period: 'Nov', primary: 35.5, secondary: 25.8 },
      { period: 'Dec', primary: 35.8, secondary: 26.0 },
    ],
  },
  margins: {
    title: 'Department Utilization & Gross Margin',
    subtitle: 'Billable team capacity utilization paired with realized delivery margin (%)',
    headlineMetric: '87.7%',
    headlineDelta: '+8.2% utilization gain without added headcount',
    benchmarks: [
      { label: 'Unbilled Hours Recovered', value: '14.2 hrs/mo', context: 'Per delivery team lead on average' },
      { label: 'Over-Budget Projects', value: '2.1%', context: 'Reduced from 17.8% baseline' },
      { label: 'Close Labor Saved', value: '68 hrs/mo', context: 'Reclaimed by finance & ops teams' },
    ],
    points: [
      { period: 'Jan', primary: 79.5, secondary: 31.2 },
      { period: 'Feb', primary: 80.4, secondary: 32.0 },
      { period: 'Mar', primary: 81.8, secondary: 33.1 },
      { period: 'Apr', primary: 82.9, secondary: 33.8 },
      { period: 'May', primary: 83.7, secondary: 34.4 },
      { period: 'Jun', primary: 84.5, secondary: 35.2 },
      { period: 'Jul', primary: 85.2, secondary: 35.9 },
      { period: 'Aug', primary: 85.9, secondary: 36.4 },
      { period: 'Sep', primary: 86.4, secondary: 37.0 },
      { period: 'Oct', primary: 86.9, secondary: 37.6 },
      { period: 'Nov', primary: 87.3, secondary: 38.1 },
      { period: 'Dec', primary: 87.7, secondary: 38.8 },
    ],
  },
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    audience: 'For lean finance teams replacing manual spreadsheets',
    monthlyPrice: 390,
    annualPrice: 310,
    priceNote: 'per workspace / month',
    ctaLabel: 'Start 14-Day Trial',
    quotas: [
      { label: 'Legal Entities', value: 'Up to 2' },
      { label: 'Operator Seats', value: '25 included' },
      { label: 'ERP & Bank Sync', value: 'Hourly' },
      { label: 'Audit Log Retention', value: '2 years' },
    ],
    capabilities: [
      'Unified cash flow & P&L ledger',
      'Spend approval workflows up to 3 tiers',
      'Department budget tracking & variance alerts',
      'Standard CSV, QuickBooks & Xero connectors',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    audience: 'For multi-entity finance and operations teams',
    monthlyPrice: 890,
    annualPrice: 710,
    priceNote: 'per workspace / month',
    featured: true,
    ctaLabel: 'Start 14-Day Trial',
    quotas: [
      { label: 'Legal Entities', value: 'Up to 10' },
      { label: 'Operator Seats', value: '100 included' },
      { label: 'ERP & Bank Sync', value: '15-minute live' },
      { label: 'Audit Log Retention', value: '7 years' },
    ],
    capabilities: [
      'Automated intercompany eliminations & 38 currencies',
      'Unlimited scenario & hiring runway branches',
      'Project margin & billable utilization tracking',
      'NetSuite, Workday, Rippling & SAML SSO',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    audience: 'For global organizations with custom governance',
    monthlyPrice: null,
    annualPrice: null,
    priceNote: 'Annual contract · Custom volume',
    ctaLabel: 'Contact Sales',
    quotas: [
      { label: 'Legal Entities', value: 'Unlimited' },
      { label: 'Operator Seats', value: 'Unlimited' },
      { label: 'ERP & Bank Sync', value: 'Real-time webhook' },
      { label: 'Audit Log Retention', value: 'Custom / WORM' },
    ],
    capabilities: [
      'Dedicated solutions engineer & guided migration',
      'SOC 2 Type II + ISO 27001 compliance package',
      'Snowflake & BigQuery warehouse exports',
      '99.98% uptime SLA with 24/7 priority response',
    ],
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'claire-vance',
    name: 'Claire Vance',
    role: 'VP of Operations',
    company: 'Kestrel Freight Systems',
    industry: 'Logistics Technology · 340 Employees',
    avatar: '/src/assets/images/avatar_claire_vance_1795620263620.jpg',
    metric: 'Month-end close cut from 11 days to 2.5 days',
    quote:
      'Before NEXORA, our regional leads ran four separate spreadsheets for contractor burn and vendor POs. Connecting NetSuite and Rippling into one approval ledger eliminated reconciliation disputes and gave us clear gross margin visibility six weeks before quarter end.',
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Chief Financial Officer',
    company: 'Halcyon Robotics',
    industry: 'Industrial Automation · 4 Subsidiaries',
    avatar: '/src/assets/images/avatar_marcus_chen_1795620263774.jpg',
    metric: '$210,000 in duplicate SaaS & vendor overrun prevented in Q1',
    quote:
      'We needed deterministic spend controls across US, German, and Singapore entities without slowing down engineering procurement. NEXORA catches budget variance before invoices clear and generates our board pack directly from verified actuals.',
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Managing Partner',
    company: 'Vektor Advisory Group',
    industry: 'Management Consulting · 180 Consultants',
    avatar: '/src/assets/images/avatar_elena_rostova_1795620264036.jpg',
    metric: '+7.8 percentage point increase in realized project margin',
    quote:
      'Linking team utilization directly to contract billing inside NEXORA exposed scope creep on three flagship retainers in our first month. Every partner now reviews live project margins in Monday operations meetings with zero manual prep.',
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'migration-time',
    question: 'How long does it take to migrate from spreadsheets and existing ERPs?',
    answer:
      'Most Basic and Pro teams connect their bank feeds, ERP (NetSuite, QuickBooks, or Xero), and HRIS within 20 minutes. Historical data for the trailing 24 months is backfilled automatically on Day 1, and approval rules are typically live within 48 hours without engineering involvement.',
  },
  {
    id: 'accounting-replacement',
    question: 'Does NEXORA replace NetSuite or QuickBooks, or sit alongside them?',
    answer:
      'NEXORA sits above your general ledger as the operational control and forecasting layer. Your statutory accounting stays intact in NetSuite, QuickBooks, or Xero while NEXORA performs bi-directional 15-minute syncs for spend approvals, multi-entity consolidation, and live margin analytics.',
  },
  {
    id: 'security-compliance',
    question: 'How is financial and payroll data secured and audited?',
    answer:
      'All customer data is encrypted in transit via TLS 1.3 and at rest using AES-256 with tenant-isolated keys. NEXORA is SOC 2 Type II audited, supports SAML 2.0 single sign-on, enforces granular role-based access controls, and maintains an immutable audit log for every ledger modification.',
  },
  {
    id: 'multi-currency',
    question: 'How does multi-entity and multi-currency consolidation work?',
    answer:
      'NEXORA ingests subsidiary ledgers in 38 supported currencies, applies daily ECB and Federal Reserve spot or weighted-average rates, and flags intercompany transfers for automated elimination—allowing finance teams to toggle between local currency and consolidated USD or EUR views.',
  },
  {
    id: 'seat-pricing',
    question: 'Are approval-only or read-only stakeholders charged as full seats?',
    answer:
      'No. Every plan includes unlimited read-only executive viewers and external auditor seats at zero extra charge. Seat quotas apply only to active operators who submit purchase requests, edit forecasts, or configure approval policies.',
  },
  {
    id: 'trial-cancellation',
    question: 'What is included in the 14-day trial and can we export our data anytime?',
    answer:
      'The 14-day trial unlocks full Pro-tier capabilities—including sandbox ERP connectors, multi-entity consolidation, and scenario modeling—with no credit card required. You can export your full normalized ledger and audit history in CSV, Parquet, or JSON at any time.',
  },
];
