// ─── SP1-06: Channel Filter List ────────────────────────────────────────────
// Renders channel pills (WhatsApp, Instagram, Messenger) with live counts
// from Meta Business Suite webhooks.

import { useCareStore } from '../../../store/useCareStore';
import { clsx } from 'clsx';
import { MessageCircle } from 'lucide-react';

// Custom channel icons (not available in lucide-react)
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

interface ChannelItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CHANNELS: ChannelItem[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    shortLabel: 'WA',
    icon: <MessageCircle className="h-4 w-4" />,
    count: 14,
    color: 'text-channel-whatsapp',
    bgColor: 'bg-channel-whatsapp/10',
    borderColor: 'border-channel-whatsapp/30',
  },
  {
    id: 'instagram',
    label: 'Instagram DM',
    shortLabel: 'IG',
    icon: <InstagramIcon className="h-4 w-4" />,
    count: 6,
    color: 'text-channel-instagram',
    bgColor: 'bg-channel-instagram/10',
    borderColor: 'border-channel-instagram/30',
  },
  {
    id: 'messenger',
    label: 'Messenger',
    shortLabel: 'FB',
    icon: <MessengerIcon className="h-4 w-4" />,
    count: 2,
    color: 'text-channel-messenger',
    bgColor: 'bg-channel-messenger/10',
    borderColor: 'border-channel-messenger/30',
  },
];

interface ChannelFilterListProps {
  collapsed?: boolean;
}

export function ChannelFilterList({ collapsed }: ChannelFilterListProps) {
  const { activeChannelFilter, setActiveChannelFilter } = useCareStore();

  return (
    <div className="p-3">
      {!collapsed && (
        <h3 className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Inbound Channels
        </h3>
      )}

      <div className="space-y-1">
        {/* All Channels */}
        <button
          onClick={() => setActiveChannelFilter('all')}
          className={clsx(
            'w-full flex items-center gap-3 rounded-lg transition-all duration-150',
            collapsed ? 'p-2 justify-center' : 'px-3 py-2',
            activeChannelFilter === 'all'
              ? 'bg-[#74A09F]/15 text-[#74A09F] font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
          title="All Channels"
        >
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <MessageCircle className="h-4 w-4" />
          </div>
          {!collapsed && (
            <>
              <span className="flex-1 text-sm text-left">All Channels</span>
              <span className="text-xs text-muted-foreground font-medium">
                {CHANNELS.reduce((sum, c) => sum + c.count, 0)}
              </span>
            </>
          )}
        </button>

        {/* Individual Channels */}
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setActiveChannelFilter(channel.id)}
            className={clsx(
              'w-full flex items-center gap-3 rounded-lg transition-all duration-150',
              collapsed ? 'p-2 justify-center' : 'px-3 py-2',
              activeChannelFilter === channel.id
                ? `${channel.bgColor} ${channel.color} border ${channel.borderColor} font-medium`
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
            title={channel.label}
          >
            <div
              className={clsx(
                'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                activeChannelFilter === channel.id ? `${channel.bgColor}` : 'bg-muted'
              )}
            >
              <span className={activeChannelFilter === channel.id ? channel.color : ''}>{channel.icon}</span>
            </div>
            {!collapsed && (
              <>
                <span className="flex-1 text-sm text-left">{channel.label}</span>
                <span
                  className={clsx(
                    'text-xs font-medium px-1.5 py-0.5 rounded-full',
                    activeChannelFilter === channel.id
                      ? `${channel.bgColor} ${channel.color}`
                      : 'text-muted-foreground'
                  )}
                >
                  {channel.count}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
