// ─── Dashboard Workspace (Matching Exact RMO UI Structure) ──────────────────
// Features: Date & Greeting header, period filter pills [ Today | 7D | 30D | QTD ],
// 4 KPI cards with live pulses & smooth sparklines, Shift Operations Control banner,
// Live Continuous Pipeline, SLA Urgency Watchlist, and Team Agent Performance.

import { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  RotateCcw,
  Users,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useCareStore } from '../../store/useCareStore';
import { useAgentPerformance, useQueueDepth } from '../../hooks/api';

type PeriodFilter = 'today' | '7d' | '30d' | 'qtd';
type SimulationMode = 'real-time' | 'all-track' | 'high-risk' | 'breached';

function Sparkline({ data, className, color = '#85AFAE' }: { data: number[]; className?: string; color?: string }) {
  const w = 120;
  const h = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`)
    .join(' ');

  const gradId = `spark-fill-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={clsx('w-full h-6', className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gradId})`} stroke="none" />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashboardWorkspace() {
  const { user } = useCareStore();
  const [period, setPeriod] = useState<PeriodFilter>('today');
  const [simulation, setSimulation] = useState<SimulationMode>('real-time');

  const { data: agentPerformance = [] } = useAgentPerformance();
  const { data: queueDepth = [] } = useQueueDepth();

  const MAX_QUEUE = Math.max(1, ...queueDepth.map((q) => q.count));

  // Dynamic date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening';

  const kpis = [
    {
      label: 'TOTAL CONVERSATIONS',
      value: '12',
      change: 14.2,
      positive: true,
      icon: MessageSquare,
      tone: '#85AFAE',
      softBg: 'bg-primary/10',
      ring: 'ring-primary/20',
      spark: [4, 6, 5, 8, 7, 9, 10, 8, 11, 12, 10, 12],
      pulse: true,
    },
    {
      label: 'RESOLVED TODAY',
      value: '48',
      change: 22.5,
      positive: true,
      icon: CheckCircle2,
      tone: 'oklch(0.7 0.16 165)',
      softBg: 'bg-success/10',
      ring: 'ring-success/20',
      spark: [12, 15, 18, 22, 28, 30, 35, 38, 42, 45, 46, 48],
    },
    {
      label: 'AVG FIRST RESPONSE',
      value: '1.8m',
      change: -28.4,
      positive: true, // faster is positive
      icon: Clock,
      tone: 'oklch(0.78 0.17 70)',
      softBg: 'bg-warning/10',
      ring: 'ring-warning/20',
      spark: [3.4, 3.1, 2.8, 2.5, 2.4, 2.2, 2.0, 1.9, 2.0, 1.8, 1.9, 1.8],
    },
    {
      label: 'SLA COMPLIANCE',
      value: '98.5%',
      change: 2.1,
      positive: true,
      icon: ShieldCheck,
      tone: 'oklch(0.72 0.14 210)',
      softBg: 'bg-info/10',
      ring: 'ring-info/20',
      spark: [94, 95, 96, 95, 97, 96, 98, 97, 98, 98.5, 98.2, 98.5],
      pulse: true,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* ── Top Greeting & Period Filter (Matching RMO) ─────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{dateStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {greeting}, {user?.name?.split(' ')[0] || 'Aravind'} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening across your customer care channels & operations.
          </p>
        </div>

        {/* Period Filter Pills (Matching RMO) */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border shadow-xs self-start sm:self-auto">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: 'qtd', label: 'QTD' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={clsx(
                'h-8 px-3 rounded-lg text-xs cursor-pointer transition-all duration-200',
                period === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 font-medium'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4 Top KPI Cards (Specification 5: Premium Cards) ────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="premium-card p-4 sm:p-5 hover:border-primary/40"
          >
            <div className="flex items-start justify-between">
              <div
                className={clsx(
                  'h-10 w-10 rounded-xl grid place-items-center ring-1 transition-all duration-300 group-hover:scale-105',
                  kpi.softBg,
                  kpi.ring
                )}
              >
                <kpi.icon className="h-5 w-5" style={{ color: kpi.tone }} strokeWidth={2} />
              </div>
              {kpi.pulse && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-success uppercase tracking-wider bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
                </span>
              )}
            </div>

            <div className="mt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </div>
              <div className="mt-1 flex items-baseline gap-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  {kpi.value}
                </div>
                <div
                  className={clsx(
                    'flex items-center gap-0.5 text-xs font-bold px-1.5 h-5 rounded-md',
                    kpi.positive
                      ? 'text-success bg-success/10'
                      : 'text-destructive bg-destructive/10'
                  )}
                >
                  {kpi.positive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
            </div>

            <div className="mt-3 -mx-1">
              <Sparkline data={kpi.spark} color={kpi.tone} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Shift Operations Control (Matching RMO Shift Tracker) ──── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        {/* Banner Header */}
        <div className="px-5 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
              <Zap className="h-4.5 w-4.5" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Shift Operations Control
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Continuous 4H SLA Workflow
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live continuous customer care tracking · Maximum 4-hour target response and resolution window
              </p>
            </div>
          </div>

          {/* Simulation Toggle Pills */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Simulation:
            </span>
            <div className="flex items-center bg-muted rounded-xl p-1 border border-border text-xs">
              {(
                [
                  { id: 'real-time', label: 'Real-Time' },
                  { id: 'all-track', label: 'All On Track' },
                  { id: 'high-risk', label: 'High Risk' },
                  { id: 'breached', label: 'Breached SLA' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSimulation(m.id)}
                  className={clsx(
                    'px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors',
                    simulation === m.id
                      ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground font-medium'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shift Bar Subheader */}
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-foreground bg-card px-2.5 py-1 rounded-lg border border-border shadow-xs">
              Morning Shift (06:00 - 14:00)
            </span>
            <span className="text-muted-foreground">
              Workforce schedule active · Staff seamless shift handoff enabled
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              12 On Track
            </span>
            <span className="flex items-center gap-1.5 text-warning">
              <span className="h-2 w-2 rounded-full bg-warning" />
              0 At Risk
            </span>
            <span className="flex items-center gap-1.5 text-destructive">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              0 Breached
            </span>
          </div>
        </div>

        {/* 4 Shift Metrics Row */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Active Queue
            </span>
            <p className="text-xl font-black text-foreground mt-1">12 Chats</p>
            <p className="text-xs text-muted-foreground mt-1">Processing across all agents</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Channel Volume
            </span>
            <p className="text-xl font-bold text-foreground mt-1">8 WA · 4 IG</p>
            <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '66%' }} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Average First Response
            </span>
            <p className="text-xl font-bold text-foreground mt-1 font-mono">1.8m</p>
            <p className="text-xs text-success mt-1">Target is under 5.0m</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              4h SLA Compliance
            </span>
            <p className="text-xl font-bold text-success mt-1 font-mono">100%</p>
            <p className="text-xs text-muted-foreground mt-1">All conversations within SLA</p>
          </div>
        </div>

        {/* Live Continuous Pipeline & SLA Urgency Watchlist */}
        <div className="p-5 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Live Queue */}
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                Live Continuous Pipeline
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                2 Active Orders
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground font-mono">#1138</span>
                    <span className="text-[10px] text-muted-foreground font-mono">(12:16)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ramesh Rekonex · 1 item · WhatsApp
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                  NEW
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground font-mono">#1137</span>
                    <span className="text-[10px] text-muted-foreground font-mono">(11:27)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Naseef uk · 2 items · Instagram
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                  NEW
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: SLA Watchlist */}
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                SLA Urgency & Risk Watchlist
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card text-muted-foreground border border-border">
                Sorted by 4h Target
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground font-mono">#1138</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-success/10 text-success">
                      ON TRACK
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Ramesh Rekonex · Agent: Aravind</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground font-mono">2h 45m left</span>
                  <p className="text-[10px] text-muted-foreground font-mono">Elapsed: 1h 15m</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground font-mono">#1137</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-success/10 text-success">
                      ON TRACK
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Naseef uk · Agent: Sara Al-Mansoor</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground font-mono">3h 27m left</span>
                  <p className="text-[10px] text-muted-foreground font-mono">Elapsed: 0h 33m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Team Agent Performance & Queue Depth (Matching RMO) ────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Agent Performance Table */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card overflow-hidden shadow-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" strokeWidth={2} />
              Agent Performance & Active Workloads
            </h3>
            <span className="text-xs font-medium text-muted-foreground">6 Agents Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40">
                  <th className="px-5 py-3 font-semibold">Agent</th>
                  <th className="px-4 py-3 font-semibold text-right">Active Chats</th>
                  <th className="px-4 py-3 font-semibold text-right">Resolved</th>
                  <th className="px-4 py-3 font-semibold text-right">Avg Response</th>
                  <th className="px-5 py-3 font-semibold text-right">SLA Breaches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {agentPerformance.map((a) => (
                  <tr key={a.name} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                        {a.name.slice(0, 2).toUpperCase()}
                      </div>
                      {a.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-right font-medium font-mono">{a.active}</td>
                    <td className="px-4 py-3 text-muted-foreground text-right font-medium font-mono">{a.resolved}</td>
                    <td className="px-4 py-3 text-muted-foreground text-right font-medium font-mono">{a.first_response}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={clsx('font-bold font-mono', a.sla_breaches > 0 ? 'text-destructive' : 'text-success')}>
                        {a.sla_breaches}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Queue Depth */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" strokeWidth={2} />
              Queue Depth By Dept
            </h3>
            <span className="text-xs text-primary font-semibold">Real-Time</span>
          </div>

          <div className="space-y-4 pt-1">
            {queueDepth.map((q) => (
              <div key={q.department}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">{q.department}</span>
                  <span className="text-xs font-bold text-foreground font-mono">{q.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (q.count / MAX_QUEUE) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
