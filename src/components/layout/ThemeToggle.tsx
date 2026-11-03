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
      className="flex items-center bg-muted/70 p-0.5 rounded-xl border border-border/60 transition-colors shadow-2xs"
      role="group"
      aria-label="Theme selector"
    >
      {/* Dark Theme Button */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer',
          theme === 'dark'
            ? 'bg-card text-[#74A09F] font-semibold shadow-xs border border-border/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        title="Dark Theme"
      >
        <Moon className="h-3.5 w-3.5 text-[#74A09F] shrink-0" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      {/* Light Theme Button */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer',
          theme === 'light'
            ? 'bg-card text-[#74A09F] font-semibold shadow-xs border border-border/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        title="Light Theme"
      >
        <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span className="hidden sm:inline">Light</span>
      </button>
    </div>
  );
}
