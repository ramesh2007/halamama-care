// ─── Button Component ───────────────────────────────────────────────────────
// Reusable button with variants, sizes, and loading state.

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#74A09F] hover:bg-[#5D8C8B] text-white border-transparent shadow-xs',
  secondary: 'bg-muted hover:bg-muted/80 text-foreground border-border shadow-2xs',
  ghost: 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-xs',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs',
  outline: 'bg-transparent hover:bg-muted text-foreground border-border',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'text-xs px-2 py-1 gap-1',
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-1 focus:ring-offset-surface',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
