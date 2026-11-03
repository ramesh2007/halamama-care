// ─── SP4-01: Email Ticket Table ─────────────────────────────────────────────
// Filterable, searchable, paginated list of email tickets.

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Search, ChevronLeft, ChevronRight, X, Inbox } from 'lucide-react';
import { formatThreadTimestamp } from '../../utils/dateFormatter';
import type { EmailTicket } from '../../types/care';

const PAGE_SIZE = 7;

const STATUS_FILTERS: { value: EmailTicket['status'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'pending_ops', label: 'Pending Ops' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_STYLES: Record<EmailTicket['priority'], string> = {
  low: 'text-muted-foreground bg-muted border-border',
  medium: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
  high: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
  urgent: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
};

const STATUS_STYLES: Record<EmailTicket['status'], { label: string; cls: string }> = {
  open: { label: 'Open', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  pending_ops: { label: 'Pending Ops', cls: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
  escalated: { label: 'Escalated', cls: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' },
  closed: { label: 'Closed', cls: 'text-muted-foreground bg-muted border-border' },
};

interface TicketTableProps {
  tickets: EmailTicket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TicketTable({ tickets, selectedId, onSelect }: TicketTableProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EmailTicket['status'] | 'all'>('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tickets.filter((t) => {
      if (status !== 'all' && t.status !== status) return false;
      if (!q) return true;
      return (
        t.ticket_id.toLowerCase().includes(q) ||
        t.sender_name.toLowerCase().includes(q) ||
        t.sender_email.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      );
    });
  }, [tickets, search, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search & Filter Toolbar */}
      <div className="p-3.5 border-b border-border space-y-3 bg-card">
        <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2 border border-border focus-within:border-[#74A09F] focus-within:bg-card focus-within:ring-2 focus-within:ring-[#74A09F]/20 transition-all">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search by ticket #, sender, or subject..."
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setPage(0);
              }}
              className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-muted/70 p-1 rounded-xl border border-border/60 overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(0);
              }}
              className={clsx(
                'flex-1 px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all whitespace-nowrap cursor-pointer text-center',
                status === f.value
                  ? 'bg-card text-foreground shadow-xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-muted/50 border-b border-border backdrop-blur-xs z-10">
            <tr className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-3.5 py-2.5">Ticket</th>
              <th className="px-3.5 py-2.5">Sender</th>
              <th className="px-3.5 py-2.5">Subject</th>
              <th className="px-3.5 py-2.5">Priority</th>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pageItems.map((t) => {
              const st = STATUS_STYLES[t.status];
              const isSelected = selectedId === t.id;

              return (
                <tr
                  key={t.id}
                  onClick={() => onSelect(t.id)}
                  className={clsx(
                    'cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-[#74A09F]/10 border-l-4 border-l-[#74A09F]'
                      : 'hover:bg-muted/40',
                  )}
                >
                  <td className="px-3.5 py-3 text-xs font-mono font-bold text-[#74A09F] whitespace-nowrap">
                    {t.ticket_id}
                  </td>
                  <td className="px-3.5 py-3">
                    <p className="text-xs font-bold text-foreground whitespace-nowrap">{t.sender_name}</p>
                    <p className="text-2xs text-muted-foreground truncate max-w-[130px]">{t.sender_email}</p>
                  </td>
                  <td className="px-3.5 py-3 text-xs font-medium text-foreground/90 truncate max-w-[180px]">
                    {t.subject}
                  </td>
                  <td className="px-3.5 py-3">
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 rounded-full text-2xs font-bold border uppercase tracking-wider',
                        PRIORITY_STYLES[t.priority],
                      )}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <span
                      className={clsx(
                        'inline-flex px-2 py-0.5 rounded-full text-2xs font-bold border whitespace-nowrap capitalize',
                        st.cls,
                      )}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-2xs font-mono text-muted-foreground text-right whitespace-nowrap">
                    {formatThreadTimestamp(t.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {pageItems.length === 0 && (
          <div className="py-16 text-center p-6">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2.5 text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-foreground">No tickets found</p>
            <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>

      {/* Table Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-card shrink-0">
        <span className="text-2xs font-medium text-muted-foreground">
          Showing {pageItems.length > 0 ? safePage * PAGE_SIZE + 1 : 0} to{' '}
          {Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} tickets
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-foreground px-2">
            {safePage + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

