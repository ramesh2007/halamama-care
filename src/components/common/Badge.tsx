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
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  danger: 'bg-destructive/15 text-destructive border-destructive/30',
  info: 'bg-info/15 text-info border-info/30',
  purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  whatsapp: 'bg-channel-whatsapp/15 text-channel-whatsapp border-channel-whatsapp/30',
  instagram: 'bg-channel-instagram/15 text-channel-instagram border-channel-instagram/30',
  messenger: 'bg-channel-messenger/15 text-channel-messenger border-channel-messenger/30',
  email: 'bg-channel-email/15 text-channel-email border-channel-email/30',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'text-[9px] px-1.5 py-0.2 leading-tight',
  sm: 'text-[10px] px-2 py-0.5 leading-tight',
  md: 'text-xs px-2.5 py-1 leading-tight',
};

export function Badge({ children, variant = 'default', size = 'sm', dot, pulse, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'h-1.5 w-1.5 rounded-full shrink-0',
            pulse && 'animate-pulse',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'danger' && 'bg-destructive',
            variant === 'info' && 'bg-info',
            variant === 'purple' && 'bg-purple-500',
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
        'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1 shadow-2xs leading-none',
        className
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
