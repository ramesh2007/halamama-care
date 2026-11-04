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
        variant === 'pills' && 'bg-muted p-1 rounded-xl border border-border',
        variant === 'underline' && 'border-b border-border',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'relative flex items-center gap-2 transition-all duration-200 cursor-pointer',
            size === 'sm' && 'px-3 py-1.5 text-xs',
            size === 'md' && 'px-4 py-2 text-sm',
            variant === 'pills' && [
              'rounded-lg',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 font-medium',
            ],
            variant === 'underline' && [
              'pb-3 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border font-medium',
            ]
          )}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && tab.count > 0 && (
            <span
              className={clsx(
                'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1',
                activeTab === tab.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted/80 text-muted-foreground'
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
