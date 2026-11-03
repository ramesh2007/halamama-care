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
    <div className="relative rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 overflow-hidden shadow-2xs">
      <div className="absolute top-2 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 pointer-events-none">
        <Lock className="h-3 w-3 text-amber-800 dark:text-amber-300" />
        <span className="text-2xs font-bold text-amber-800 dark:text-amber-300 tracking-wider uppercase">
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
        className="w-full bg-transparent px-4 pt-7 pb-2 text-sm text-amber-950 dark:text-amber-100 placeholder-amber-700/50 dark:placeholder-amber-400/50 outline-none resize-none font-normal"
      />

      <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1 border-t border-amber-500/20">
        <span className="text-2xs font-medium text-amber-800/70 dark:text-amber-300/70">
          Will never be sent or visible to the customer
        </span>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
        >
          <Send className="h-3 w-3" />
          Save Note
        </button>
      </div>
    </div>
  );
}

