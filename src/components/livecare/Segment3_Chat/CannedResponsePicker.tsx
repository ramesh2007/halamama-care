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
      <div className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl border border-border bg-card shadow-elevated p-4">
        <p className="text-xs text-muted-foreground">No matching canned responses</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl border border-border bg-card shadow-elevated overflow-hidden animate-fade-in z-30">
      <div className="px-3.5 py-2.5 border-b border-border bg-muted/40">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Quick Responses
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto py-1 divide-y divide-border/40">
        {responses.map((response, idx) => (
          <button
            key={response.id}
            onMouseEnter={() => onHover(idx)}
            onClick={() => onSelect(response)}
            className={clsx(
              'w-full flex items-start gap-2.5 px-3.5 py-2 text-left transition-colors cursor-pointer',
              idx === highlightIndex ? 'bg-primary/10' : 'hover:bg-muted/50',
            )}
          >
            <Zap className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" strokeWidth={2} />
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-semibold text-foreground">{response.label}</span>
              <span className="block text-[10px] text-muted-foreground truncate">{response.text}</span>
            </span>
            <span className="text-[10px] text-primary font-mono font-bold shrink-0">{response.trigger}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
