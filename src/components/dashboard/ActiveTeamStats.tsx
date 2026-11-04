// ─── SP4-04: Active Team Stats ──────────────────────────────────────────────
// KPI tiles, agent performance table, and team activity feed.

import { MessageSquare, Users, Clock, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardMetrics, useAgentPerformance, useActivityFeed } from '../../hooks/api';
import { formatRelativeTime } from '../../utils/dateFormatter';

function KpiTile({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className={clsx('h-8 w-8 rounded-xl flex items-center justify-center', accent)}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-foreground mt-2 font-mono">{value}</p>
    </div>
  );
}

export function ActiveTeamStats() {
  const { data: metrics } = useDashboardMetrics();
  const { data: agentPerformance = [] } = useAgentPerformance();
  const { data: activityFeed = [] } = useActivityFeed();

  const m = metrics || {
    active_chats: 0,
    sla_breaches: 0,
    returns_in_review: 0,
    installation_backlog: 0,
    unassigned_pool: 0,
    first_response_avg_minutes: 0,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiTile
          label="Active Chats"
          value={String(m.active_chats)}
          icon={<MessageSquare className="h-4 w-4 text-primary" strokeWidth={2} />}
          accent="bg-primary/10"
        />
        <KpiTile
          label="Unassigned Pool"
          value={String(m.unassigned_pool)}
          icon={<Users className="h-4 w-4 text-info" strokeWidth={2} />}
          accent="bg-info/10"
        />
        <KpiTile
          label="First Response"
          value={`${m.first_response_avg_minutes}m`}
          icon={<Clock className="h-4 w-4 text-warning" strokeWidth={2} />}
          accent="bg-warning/10"
        />
        <KpiTile
          label="Returns in Review"
          value={String(m.returns_in_review)}
          icon={<RefreshCw className="h-4 w-4 text-purple-500" strokeWidth={2} />}
          accent="bg-purple-500/10"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Agent Performance</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/40">
              <th className="px-5 py-2.5 font-semibold">Agent</th>
              <th className="px-4 py-2.5 font-semibold text-right">Active</th>
              <th className="px-4 py-2.5 font-semibold text-right">Resolved</th>
              <th className="px-4 py-2.5 font-semibold text-right">First Response</th>
              <th className="px-5 py-2.5 font-semibold text-right">SLA Breaches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {agentPerformance.map((a) => (
              <tr key={a.name} className="hover:bg-muted/40 transition-colors">
                <td className="px-5 py-2.5 font-medium text-foreground">{a.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-right font-mono">{a.active}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-right font-mono">{a.resolved}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-right font-mono">{a.first_response}</td>
                <td className="px-5 py-2.5 text-right font-mono">
                  <span className={a.sla_breaches > 0 ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                    {a.sla_breaches}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Team Activity</h3>
        </div>
        <div className="divide-y divide-border/60">
          {activityFeed.map((act) => (
            <div key={act.id} className="px-5 py-2.5 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-xs text-foreground/85">
                <span className="font-semibold text-foreground">{act.agent}</span> {act.action}
              </p>
              <span className="text-[10px] text-muted-foreground font-mono ml-auto whitespace-nowrap">
                {formatRelativeTime(act.time)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
