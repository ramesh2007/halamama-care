// ─── Button Component ───────────────────────────────────────────────────────
// Reusable button with variants, sizes, and loading state.

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'destructive' | 'success' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:opacity-90 text-primary-foreground font-semibold border-transparent shadow-xs',
  secondary: 'bg-muted hover:bg-muted/80 text-foreground border-border font-medium',
  outline: 'bg-transparent hover:bg-muted text-foreground border-border font-medium',
  danger: 'bg-destructive hover:opacity-90 text-destructive-foreground font-semibold border-transparent shadow-xs',
  destructive: 'bg-destructive hover:opacity-90 text-destructive-foreground font-semibold border-transparent shadow-xs',
  success: 'bg-success hover:opacity-90 text-white font-semibold border-transparent shadow-xs',
  ghost: 'bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground border-transparent font-medium',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 text-xs px-2 gap-1 rounded-lg',
  sm: 'h-8 text-xs px-3 gap-1.5 rounded-xl', // 32px Small
  md: 'h-9 text-sm px-4 gap-2 rounded-xl',   // 36px Standard
  lg: 'h-10 text-sm px-5 gap-2 rounded-xl',  // 40px Large
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
        'inline-flex items-center justify-center border transition-all duration-150 cursor-pointer select-none active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
