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
        variant === 'pills' && 'bg-surface-tertiary rounded-lg p-1',
        variant === 'underline' && 'border-b border-surface-border',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'relative flex items-center gap-2 font-medium transition-all duration-200',
            size === 'sm' && 'px-3 py-1.5 text-xs',
            size === 'md' && 'px-4 py-2 text-sm',
            variant === 'pills' && [
              'rounded-md',
              activeTab === tab.id
                ? 'bg-surface-elevated text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/50',
            ],
            variant === 'underline' && [
              'pb-3 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600',
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
                  ? 'bg-brand-500/20 text-brand-400'
                  : 'bg-surface-hover text-gray-400'
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
