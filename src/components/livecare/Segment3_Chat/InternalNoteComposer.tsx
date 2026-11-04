// ─── SP2-02: Internal Whisper Composer ──────────────────────────────────────
// Amber-tinted note input for internal-only messages. Whisper notes are
// stored internally and must never be routed through Meta APIs.

import { Lock, Send } from 'lucide-react';

interface InternalNoteComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function InternalNoteComposer({ value, onChange, onSend }: InternalNoteComposerProps) {
  return (
    <div className="relative rounded-2xl bg-warning/10 dark:bg-warning/15 border border-warning/30 dark:border-warning/40 overflow-hidden shadow-xs">
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-warning/20 pointer-events-none">
        <Lock className="h-3 w-3 text-warning" strokeWidth={2} />
        <span className="text-[10px] font-bold text-warning tracking-wider uppercase">
          Internal Only
        </span>
      </div>

      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Add an internal whisper note (visible to staff only)..."
        className="w-full bg-transparent px-4 pt-8 pb-2 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none font-normal"
      />

      <div className="flex items-center justify-between px-4 pb-2.5 pt-1 border-t border-warning/20">
        <span className="text-[10px] font-medium text-warning">
          Will never be sent or visible to the customer
        </span>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-warning hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-warning-foreground text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Send className="h-3 w-3" strokeWidth={2} />
          Save Note
        </button>
      </div>
    </div>
  );
}

