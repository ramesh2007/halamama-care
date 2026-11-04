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
    <div className="space-y-4">
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">SLA Breaches</span>
          <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" strokeWidth={2} />
        </div>
        <p className="text-3xl font-bold text-destructive mt-2 font-mono">{m.sla_breaches}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Breached Threads</h3>
        </div>
        <div className="divide-y divide-border/60">
          {breachedThreads.map((t) => (
            <div key={t.customer} className="px-5 py-2.5 flex items-center justify-between hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-xs font-medium text-foreground">{t.customer}</p>
                <p className="text-[10px] text-muted-foreground">{t.channel}</p>
              </div>
              <span className="text-[10px] text-destructive font-bold font-mono whitespace-nowrap">{t.exceeded}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/10 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-info uppercase tracking-wider">Installation Backlog</span>
          <Wrench className="h-5 w-5 text-info" strokeWidth={2} />
        </div>
        <p className="text-3xl font-bold text-info mt-2 font-mono">{m.installation_backlog}</p>
      </div>
    </div>
  );
}
