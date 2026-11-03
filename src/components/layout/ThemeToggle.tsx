// ─── ThemeToggle Component ──────────────────────────────────────────────────
// Allows the agent/user to switch between Dark theme (current Care UI)
// and Light theme (OMS template style with #f8fafc background and #85afae accents).

import { Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { useCareStore } from '../../store/useCareStore';

export function ThemeToggle() {
  const { theme, setTheme } = useCareStore();

  return (
    <div
      className="flex items-center bg-surface-tertiary p-0.5 rounded-lg border border-surface-border transition-colors shadow-sm"
      role="group"
      aria-label="Theme selector"
    >
      {/* Dark Theme Button */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer',
          theme === 'dark'
            ? 'bg-surface-elevated text-brand-400 font-semibold shadow-sm border border-surface-border'
            : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/50'
        )}
        title="Dark Theme (Current Care UI background)"
      >
        <Moon className="h-3.5 w-3.5 text-brand-400 shrink-0" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      {/* Light Theme Button */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer',
          theme === 'light'
            ? 'bg-surface-elevated text-brand-600 font-semibold shadow-sm border border-surface-border'
            : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/50'
        )}
        title="Light Theme (OMS template background & styling)"
      >
        <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span className="hidden sm:inline">Light</span>
      </button>
    </div>
  );
}
