// ─── SP2-03: Canned Response Picker ─────────────────────────────────────────
// Popover listing canned responses filtered by the current "/" trigger.
// Keyboard navigation (↑/↓/Enter/Escape) is handled by the composer.

import { clsx } from 'clsx';
import { Zap } from 'lucide-react';
import type { CannedResponse } from '../../../types/care';

interface CannedResponsePickerProps {
  responses: CannedResponse[];
  highlightIndex: number;
  onSelect: (response: CannedResponse) => void;
  onHover: (index: number) => void;
}

export function CannedResponsePicker({
  responses,
  highlightIndex,
  onSelect,
  onHover,
}: CannedResponsePickerProps) {
  if (responses.length === 0) {
    return (
      <div className="absolute bottom-full left-0 mb-2 w-80 rounded-xl border border-border dark:border-[#222A3A] bg-card dark:bg-[#151A26] shadow-xl p-4">
        <p className="text-xs text-muted-foreground">No matching canned responses</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 w-84 rounded-xl border border-border dark:border-[#222A3A] bg-card dark:bg-[#151A26] shadow-xl overflow-hidden z-30">
      <div className="px-3 py-2 border-b border-border dark:border-[#202738] bg-muted/40 dark:bg-black/20 flex items-center justify-between">
        <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Canned Responses
        </span>
        <span className="text-2xs text-muted-foreground font-mono">
          ↑/↓ Navigate • Enter
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {responses.map((response, idx) => (
          <button
            key={response.id}
            onMouseEnter={() => onHover(idx)}
            onClick={() => onSelect(response)}
            className={clsx(
              'w-full flex items-start gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer',
              idx === highlightIndex
                ? 'bg-[#74A09F]/15 text-foreground font-medium'
                : 'hover:bg-muted/60 dark:hover:bg-[#1C2333] text-foreground/80',
            )}
          >
            <Zap className="h-3.5 w-3.5 text-[#74A09F] mt-0.5 shrink-0" />
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-semibold text-foreground">{response.label}</span>
              <span className="block text-2xs text-muted-foreground truncate">{response.text}</span>
            </span>
            <span className="text-2xs text-muted-foreground font-mono shrink-0 bg-muted px-1.5 py-0.5 rounded border border-border/60">
              {response.trigger}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
