// ─── SP4-04: SLA Breach Counter ─────────────────────────────────────────────
// Highlights SLA breaches and installation backlog with breached threads.

import { AlertTriangle, Wrench } from 'lucide-react';
import { useDashboardMetrics, useBreachedThreads } from '../../hooks/api';

export function SLABreachCounter() {
  const { data: metrics } = useDashboardMetrics();
  const { data: breachedThreads = [] } = useBreachedThreads();

  const m = metrics || {
    active_chats: 0,
    sla_breaches: 0,
    returns_in_review: 0,
    installation_backlog: 0,
    unassigned_pool: 0,
    first_response_avg_minutes: 0,
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-medium text-red-400 uppercase tracking-wider">SLA Breaches</span>
          <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
        </div>
        <p className="text-3xl font-bold text-red-300 mt-2">{m.sla_breaches}</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Breached Threads</h3>
        </div>
        <div className="divide-y divide-border/50">
          {breachedThreads.map((t) => (
            <div key={t.customer} className="px-4 py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">{t.customer}</p>
                <p className="text-2xs text-muted-foreground">{t.channel}</p>
              </div>
              <span className="text-2xs text-red-500 font-medium whitespace-nowrap">{t.exceeded}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-medium text-blue-400 uppercase tracking-wider">Installation Backlog</span>
          <Wrench className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-blue-300 mt-2">{m.installation_backlog}</p>
      </div>
    </div>
  );
}
