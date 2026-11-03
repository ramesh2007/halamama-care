// ─── Badge Component ────────────────────────────────────────────────────────
// Reusable badge/pill component for status tags, channel indicators, and counts.

import { type ReactNode } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'whatsapp' | 'instagram' | 'messenger' | 'email';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted text-muted-foreground border-border',
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  info: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  whatsapp: 'bg-channel-whatsapp/15 text-channel-whatsapp border-channel-whatsapp/30',
  instagram: 'bg-channel-instagram/15 text-channel-instagram border-channel-instagram/30',
  messenger: 'bg-channel-messenger/15 text-channel-messenger border-channel-messenger/30',
  email: 'bg-channel-email/15 text-channel-email border-channel-email/30',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'text-2xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export function Badge({ children, variant = 'default', size = 'sm', dot, pulse, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'h-1.5 w-1.5 rounded-full',
            pulse && 'animate-pulse',
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'danger' && 'bg-red-400',
            variant === 'info' && 'bg-blue-400',
            variant === 'purple' && 'bg-purple-400',
            variant === 'default' && 'bg-muted-foreground',
          )}
        />
      )}
      {children}
    </span>
  );
}

// Count Badge (for unread indicators)
interface CountBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function CountBadge({ count, max = 99, className }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-2xs font-bold px-1',
        className
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
