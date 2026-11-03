// ─── SP4-03: Broadcast Campaign List ────────────────────────────────────────
// Historical WhatsApp broadcast campaigns with KPI metrics, search, filters & delivery tracking.

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  X,
  Plus,
  Send,
  MessageSquare,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { useBroadcasts } from '../../hooks/api';
import { formatThreadTimestamp } from '../../utils/dateFormatter';
import type { BroadcastCampaign } from '../../types/care';

const STATUS: Record<BroadcastCampaign['status'], { label: string; cls: string; dot: string }> = {
  draft: {
    label: 'Draft',
    cls: 'text-muted-foreground bg-muted border-border',
    dot: 'bg-muted-foreground',
  },
  scheduled: {
    label: 'Scheduled',
    cls: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    dot: 'bg-sky-500',
  },
  sent: {
    label: 'Sent',
    cls: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
};

const FILTER_TABS: { value: BroadcastCampaign['status'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All Campaigns' },
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sent', label: 'Sent' },
  { value: 'draft', label: 'Drafts' },
];

interface BroadcastCampaignListProps {
  onNavigateBuilder?: () => void;
}

export function BroadcastCampaignList({ onNavigateBuilder }: BroadcastCampaignListProps) {
  const { data: campaigns = [] } = useBroadcasts();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BroadcastCampaign['status'] | 'all'>('all');

  // KPI Calculations
  const totalAudience = useMemo(
    () => campaigns.reduce((acc, c) => acc + (c.audience_size || 0), 0),
    [campaigns],
  );

  const avgDelivery = useMemo(() => {
    const active = campaigns.filter((c) => c.status === 'completed' || c.status === 'sent');
    if (active.length === 0) return 0;
    return Math.round(active.reduce((acc, c) => acc + c.delivery_rate, 0) / active.length);
  }, [campaigns]);

  const avgRead = useMemo(() => {
    const active = campaigns.filter((c) => c.status === 'completed' || c.status === 'sent');
    if (active.length === 0) return 0;
    return Math.round(active.reduce((acc, c) => acc + c.read_rate, 0) / active.length);
  }, [campaigns]);

  // Filtered List
  const filteredCampaigns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.template_name.toLowerCase().includes(q)
      );
    });
  }, [campaigns, search, statusFilter]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Top KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Campaigns */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Campaigns
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#74A09F]/15 flex items-center justify-center text-[#74A09F]">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {campaigns.length}
            </span>
            <span className="text-2xs font-medium text-emerald-600 dark:text-emerald-400">
              Active channel
            </span>
          </div>
          <p className="text-2xs text-muted-foreground mt-1">
            Meta Cloud WhatsApp Business
          </p>
        </div>

        {/* Total Audience Reached */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              Audience Reached
            </span>
            <div className="h-8 w-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {totalAudience.toLocaleString()}
            </span>
            <span className="text-2xs font-medium text-muted-foreground">customers</span>
          </div>
          <p className="text-2xs text-muted-foreground mt-1">
            Doha & GCC registered users
          </p>
        </div>

        {/* Avg Delivery Rate */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Delivery Rate
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {avgDelivery}%
            </span>
            <span className="text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
              High tier
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${avgDelivery}%` }}
            />
          </div>
        </div>

        {/* Avg Read Rate */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Read Rate
            </span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {avgRead}%
            </span>
            <span className="text-2xs font-semibold text-indigo-600 dark:text-indigo-400">
              Verified read
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${avgRead}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2 border border-border flex-1 max-w-md focus-within:border-[#74A09F] focus-within:bg-card focus-within:ring-2 focus-within:ring-[#74A09F]/20 transition-all">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns or templates..."
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-muted/70 p-1 rounded-xl border border-border/60 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-2xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                statusFilter === tab.value
                  ? 'bg-card text-foreground shadow-xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Campaigns Table ── */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/40 text-2xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4 text-right">Audience</th>
                <th className="py-3 px-4">Delivery Rate</th>
                <th className="py-3 px-4">Read Rate</th>
                <th className="py-3 px-4 text-center">Failed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCampaigns.map((c) => {
                const st = STATUS[c.status];
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Campaign Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Send className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground group-hover:text-[#74A09F] transition-colors">
                            {c.name}
                          </p>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {c.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Template */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-foreground border border-border">
                        <Sparkles className="h-3 w-3 text-[#74A09F]" />
                        <span className="truncate max-w-[180px]">{c.template_name}</span>
                      </span>
                    </td>

                    {/* Audience */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{c.audience_size.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Delivery Rate with Progress */}
                    <td className="py-3.5 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-2xs font-bold">
                          <span className="text-foreground">{c.delivery_rate}%</span>
                          <span className="text-muted-foreground">
                            {Math.round((c.audience_size * c.delivery_rate) / 100)} delivered
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={clsx(
                              'h-1.5 rounded-full transition-all duration-300',
                              c.delivery_rate > 90
                                ? 'bg-emerald-500'
                                : c.delivery_rate > 0
                                  ? 'bg-amber-500'
                                  : 'bg-transparent',
                            )}
                            style={{ width: `${c.delivery_rate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Read Rate with Progress */}
                    <td className="py-3.5 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-2xs font-bold">
                          <span className="text-foreground">{c.read_rate}%</span>
                          <span className="text-muted-foreground">
                            {Math.round((c.audience_size * c.read_rate) / 100)} read
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={clsx(
                              'h-1.5 rounded-full transition-all duration-300',
                              c.read_rate > 70
                                ? 'bg-[#74A09F]'
                                : c.read_rate > 0
                                  ? 'bg-indigo-400'
                                  : 'bg-transparent',
                            )}
                            style={{ width: `${c.read_rate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Failed */}
                    <td className="py-3.5 px-4 text-center">
                      {c.failed_count > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <AlertCircle className="h-3 w-3" />
                          {c.failed_count}
                        </span>
                      ) : (
                        <span className="text-2xs font-medium text-muted-foreground">0</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-bold border',
                          st.cls,
                        )}
                      >
                        <span className={clsx('h-1.5 w-1.5 rounded-full', st.dot)} />
                        {st.label}
                      </span>
                    </td>

                    {/* Sent / Scheduled Timestamp */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {c.sent_at ? (
                        <div className="inline-flex items-center gap-1.5 text-2xs font-mono text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>{formatThreadTimestamp(c.sent_at)}</span>
                        </div>
                      ) : c.scheduled_at ? (
                        <div className="inline-flex items-center gap-1.5 text-2xs font-mono text-sky-600 dark:text-sky-400 font-semibold">
                          <Clock className="h-3 w-3" />
                          <span>{formatThreadTimestamp(c.scheduled_at)}</span>
                        </div>
                      ) : (
                        <span className="text-2xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="py-16 text-center px-4">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
              <MessageSquare className="h-6 w-6 text-[#74A09F]" />
            </div>
            <p className="text-sm font-bold text-foreground">No broadcast campaigns found</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search
                ? `No campaigns match "${search}". Try clearing your search query.`
                : 'Create your first WhatsApp broadcast campaign to reach your customers.'}
            </p>
            {onNavigateBuilder && (
              <button
                onClick={onNavigateBuilder}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#74A09F] hover:bg-[#5D8C8B] text-white shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New Campaign</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
