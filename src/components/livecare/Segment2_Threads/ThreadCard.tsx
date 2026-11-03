// ─── SP1-08: Thread Card ────────────────────────────────────────────────────
// Individual conversation thread card with channel badge, unread count,
// SLA indicator, tag pill, and message preview.

import { clsx } from 'clsx';
import { MessageCircle, Bot } from 'lucide-react';
import type { ConversationThread } from '../../../types/care';
import { formatThreadTimestamp, formatSLACountdown } from '../../../utils/dateFormatter';
import { CountBadge } from '../../common/Badge';

// Custom channel icons
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.907 1.453 5.497 3.727 7.19V22l3.395-1.86A11.4 11.4 0 0 0 12 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2Z" />
    <path d="m8 13 3-3 2 2 3-3" />
  </svg>
);

interface ThreadCardProps {
  thread: ConversationThread;
  isSelected: boolean;
  onClick: () => void;
}

const channelIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle className="h-3.5 w-3.5" />,
  instagram: <InstagramIcon className="h-3.5 w-3.5" />,
  messenger: <MessengerIcon className="h-3.5 w-3.5" />,
};

const channelColors: Record<string, string> = {
  whatsapp: 'text-channel-whatsapp bg-channel-whatsapp/10',
  instagram: 'text-channel-instagram bg-channel-instagram/10',
  messenger: 'text-channel-messenger bg-channel-messenger/10',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  follow_up: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' },
  resolved: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
};

const statusLabels: Record<string, string> = {
  in_progress: 'In Progress',
  pending: 'Pending',
  follow_up: 'Follow Up',
  resolved: 'Resolved',
};

export function ThreadCard({ thread, isSelected, onClick }: ThreadCardProps) {
  const sla = thread.sla_deadline ? formatSLACountdown(thread.sla_deadline) : null;
  const statusStyle = statusColors[thread.status] || statusColors.in_progress;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-3.5 py-3 border-l-2 transition-all duration-150 border-b border-border/40 hover:bg-muted/70 dark:hover:bg-[#161C28]',
        isSelected
          ? 'bg-[#74A09F]/15 dark:bg-[#74A09F]/20 border-l-[#74A09F] shadow-2xs'
          : 'border-l-transparent',
        thread.unread_count > 0 && !isSelected && 'bg-muted/50 dark:bg-[#141A26]/80',
        sla?.urgency === 'critical' && 'animate-sla-pulse'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar / Channel Icon */}
        <div className="relative shrink-0">
          <div className="h-10 w-10 rounded-full bg-muted dark:bg-[#171D2A] border border-border/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground">
              {thread.customer_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          {/* Channel badge */}
          <div
            className={clsx(
              'absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-card',
              channelColors[thread.channel] || 'bg-muted text-muted-foreground'
            )}
          >
            {channelIcons[thread.channel]}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={clsx(
                'text-sm truncate',
                thread.unread_count > 0 ? 'font-semibold text-foreground' : 'font-medium text-foreground/85'
              )}
            >
              {thread.customer_name}
            </span>
            <span className="text-2xs text-muted-foreground shrink-0 font-mono">
              {formatThreadTimestamp(thread.last_message_at)}
            </span>
          </div>

          <p
            className={clsx(
              'text-xs truncate mb-1.5',
              thread.unread_count > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            {thread.last_message_preview}
          </p>

          {/* Bottom Row: Tags, Department, SLA, Unread */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Status Tag */}
            <span
              className={clsx(
                'inline-flex items-center gap-1 text-2xs font-medium px-1.5 py-0.5 rounded-full border',
                statusStyle.bg,
                statusStyle.text,
                statusStyle.border,
              )}
            >
              <span className={clsx('h-1.5 w-1.5 rounded-full', statusStyle.text.replace('text-', 'bg-'))} />
              {statusLabels[thread.status]}
            </span>

            {/* Department */}
            <span className="text-2xs text-muted-foreground font-medium capitalize">
              {thread.department}
            </span>

            {/* Bot Active Indicator */}
            {thread.is_bot_active && (
              <span className="inline-flex items-center gap-0.5 text-2xs text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-full">
                <Bot className="h-3 w-3" />
                Bot
              </span>
            )}

            <div className="flex-1" />

            {/* SLA Countdown */}
            {sla && thread.status !== 'resolved' && (
              <span
                className={clsx(
                  'text-2xs font-medium px-1.5 py-0.5 rounded-full border',
                  sla.urgency === 'critical' && 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/25',
                  sla.urgency === 'warning' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
                  sla.urgency === 'safe' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                )}
              >
                {sla.text}
              </span>
            )}

            {/* Unread Badge */}
            <CountBadge count={thread.unread_count} />
          </div>
        </div>
      </div>
    </button>
  );
}
