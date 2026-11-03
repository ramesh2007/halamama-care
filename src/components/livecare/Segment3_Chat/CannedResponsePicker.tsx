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
      <div className="absolute bottom-full left-0 mb-2 w-80 rounded-lg border border-surface-border bg-surface-elevated shadow-elevated p-4">
        <p className="text-xs text-gray-500">No matching canned responses</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 rounded-lg border border-surface-border bg-surface-elevated shadow-elevated overflow-hidden">
      <div className="px-3 py-2 border-b border-surface-border">
        <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider">
          Quick Responses
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {responses.map((response, idx) => (
          <button
            key={response.id}
            onMouseEnter={() => onHover(idx)}
            onClick={() => onSelect(response)}
            className={clsx(
              'w-full flex items-start gap-2 px-3 py-2 text-left transition-colors',
              idx === highlightIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover/50',
            )}
          >
            <Zap className="h-3.5 w-3.5 text-brand-400 mt-0.5 shrink-0" />
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-medium text-gray-200">{response.label}</span>
              <span className="block text-2xs text-gray-500 truncate">{response.text}</span>
            </span>
            <span className="text-2xs text-gray-600 font-mono shrink-0">{response.trigger}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
