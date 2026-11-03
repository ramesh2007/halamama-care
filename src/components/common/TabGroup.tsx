// ─── TabGroup Component ─────────────────────────────────────────────────────
// Reusable tab navigation with animated active indicator.

import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
  size?: 'sm' | 'md';
  className?: string;
}

export function TabGroup({ tabs, activeTab, onChange, variant = 'pills', size = 'md', className }: TabGroupProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-1',
        variant === 'pills' && 'bg-muted/70 p-1 rounded-xl border border-border/60',
        variant === 'underline' && 'border-b border-border',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'relative flex items-center gap-2 font-medium transition-all duration-200 cursor-pointer',
            size === 'sm' && 'px-3 py-1.5 text-xs',
            size === 'md' && 'px-4 py-2 text-sm',
            variant === 'pills' && [
              'rounded-lg',
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-xs border border-border/50 font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            ],
            variant === 'underline' && [
              'pb-3 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-[#74A09F] text-[#74A09F] font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            ]
          )}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span
              className={clsx(
                'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-2xs font-bold px-1',
                activeTab === tab.id
                  ? 'bg-[#74A09F]/20 text-[#74A09F]'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
