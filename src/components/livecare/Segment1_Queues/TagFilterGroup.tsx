// ─── SP1-06: Tag Filter Group ───────────────────────────────────────────────
// Checkbox filters with color-coded badges for chat statuses.

import { useCareStore } from '../../../store/useCareStore';
import { clsx } from 'clsx';
import type { TicketStatus } from '../../../types/care';

interface TagItem {
  id: TicketStatus | 'all';
  label: string;
  color: string;
  dotColor: string;
}

const STATUS_TAGS: TagItem[] = [
  { id: 'all', label: 'All Statuses', color: 'text-foreground', dotColor: 'bg-muted-foreground' },
  { id: 'in_progress', label: 'In Progress', color: 'text-blue-500 dark:text-blue-400', dotColor: 'bg-blue-500' },
  { id: 'pending', label: 'Pending Reply', color: 'text-amber-500 dark:text-amber-400', dotColor: 'bg-amber-500' },
  { id: 'follow_up', label: 'Follow Up', color: 'text-purple-500 dark:text-purple-400', dotColor: 'bg-purple-500' },
  { id: 'resolved', label: 'Resolved', color: 'text-emerald-500 dark:text-emerald-400', dotColor: 'bg-emerald-500' },
];

interface TagFilterGroupProps {
  collapsed?: boolean;
}

export function TagFilterGroup({ collapsed }: TagFilterGroupProps) {
  const { activeStatusFilter, setActiveStatusFilter } = useCareStore();

  if (collapsed) return null;

  return (
    <div className="p-3 border-t border-border">
      <h3 className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
        Status Tags
      </h3>

      <div className="space-y-0.5">
        {STATUS_TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setActiveStatusFilter(tag.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
              activeStatusFilter === tag.id
                ? 'bg-[#74A09F]/15 font-semibold text-[#74A09F]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <span className={clsx('h-2 w-2 rounded-full shrink-0', tag.dotColor)} />
            <span className="flex-1 text-left">{tag.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
