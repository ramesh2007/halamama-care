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
    <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className={clsx('h-8 w-8 rounded-lg flex items-center justify-center', accent)}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
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
          icon={<MessageSquare className="h-4 w-4 text-brand-400" />}
          accent="bg-brand-500/10"
        />
        <KpiTile
          label="Unassigned Pool"
          value={String(m.unassigned_pool)}
          icon={<Users className="h-4 w-4 text-blue-400" />}
          accent="bg-blue-500/10"
        />
        <KpiTile
          label="First Response"
          value={`${m.first_response_avg_minutes}m`}
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          accent="bg-amber-500/10"
        />
        <KpiTile
          label="Returns in Review"
          value={String(m.returns_in_review)}
          icon={<RefreshCw className="h-4 w-4 text-purple-400" />}
          accent="bg-purple-500/10"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent Performance</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-2xs text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/10">
              <th className="px-4 py-2.5 font-semibold">Agent</th>
              <th className="px-4 py-2.5 font-semibold text-right">Active</th>
              <th className="px-4 py-2.5 font-semibold text-right">Resolved</th>
              <th className="px-4 py-2.5 font-semibold text-right">First Response</th>
              <th className="px-4 py-2.5 font-semibold text-right">SLA Breaches</th>
            </tr>
          </thead>
          <tbody>
            {agentPerformance.map((a) => (
              <tr key={a.name} className="border-t border-border/50 hover:bg-muted/40 transition-colors">
                <td className="px-4 py-2.5 text-xs font-medium text-foreground">{a.name}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{a.active}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{a.resolved}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{a.first_response}</td>
                <td className="px-4 py-2.5 text-xs text-right">
                  <span className={a.sla_breaches > 0 ? 'text-red-500 font-medium' : 'text-muted-foreground'}>
                    {a.sla_breaches}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Activity</h3>
        </div>
        <div className="divide-y divide-border/50">
          {activityFeed.map((act) => (
            <div key={act.id} className="px-4 py-2.5 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#74A09F] shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{act.agent}</span> {act.action}
              </p>
              <span className="text-2xs text-muted-foreground ml-auto whitespace-nowrap">
                {formatRelativeTime(act.time)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
