// ─── SP1-07: Thread Search Bar ──────────────────────────────────────────────
// Search input with 300ms debounce for filtering threads by customer name,
// phone number, or order ID, with button to initiate a new WhatsApp conversation.

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { useCareStore } from '../../../store/useCareStore';
import { useDebounce } from '../../../hooks/useDebounce';
import { StartConversationModal } from './StartConversationModal';

export function ThreadSearchBar() {
  const { setSearchQuery } = useCareStore();
  const [localQuery, setLocalQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  return (
    <>
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/60 rounded-xl px-3 h-9 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card transition-all">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search phone, order #, name..."
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>

          <button
            onClick={() => setIsNewChatOpen(true)}
            className="h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0 active:scale-95"
            title="Start new WhatsApp conversation"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>

          <button
            className="h-9 w-9 rounded-xl bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer shrink-0 flex items-center justify-center active:scale-95"
            title="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <StartConversationModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />
    </>
  );
}
