// ─── SP1-08: Thread List ────────────────────────────────────────────────────
// Scrollable list of conversation threads with live WhatsApp polling from Laravel.
// Supports filtering by department, status, channel, and search query.

import { useMemo, useState } from 'react';
import { RefreshCw, MessageSquarePlus, AlertTriangle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useCareStore } from '../../../store/useCareStore';
import { useThreads } from '../../../hooks/api';
import { ThreadCard } from './ThreadCard';
import { StartConversationModal } from './StartConversationModal';

export function ThreadList() {
  const {
    threads,
    selectedThreadId,
    setSelectedThreadId,
    activeDepartment,
    activeStatusFilter,
    activeChannelFilter,
    searchQuery,
  } = useCareStore();

  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  // Poll conversations from Laravel /api/customer-care/conversations
  const { isLoading, isError, error, refetch, isFetching } = useThreads();

  // Filter threads based on active filters
  const filteredThreads = useMemo(() => {
    return threads
      .filter((thread) => {
        if (activeDepartment !== 'all' && thread.department !== activeDepartment) return false;
        if (activeStatusFilter !== 'all' && thread.status !== activeStatusFilter) return false;
        if (activeChannelFilter !== 'all' && thread.channel !== activeChannelFilter) return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            thread.customer_name.toLowerCase().includes(q) ||
            thread.customer_phone.includes(q) ||
            thread.last_message_preview.toLowerCase().includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (a.unread_count > 0 && b.unread_count === 0) return -1;
        if (a.unread_count === 0 && b.unread_count > 0) return 1;
        return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
      });
  }, [threads, activeDepartment, activeStatusFilter, activeChannelFilter, searchQuery]);

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Thread Count & Polling Sync Bar */}
        <div className="px-4 py-2 border-b border-border bg-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xs text-muted-foreground font-medium">
              {filteredThreads.length} conversation{filteredThreads.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-2xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"
              title="Live polling WhatsApp messages every 5s"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>WhatsApp Live</span>
            </span>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Refresh conversations from backend"
            >
              <RefreshCw className={clsx('h-3.5 w-3.5', isFetching && 'animate-spin text-[#74A09F]')} />
            </button>
          </div>
        </div>

        {/* Backend Warning Banner if API fails */}
        {isError && (
          <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-2xs flex items-center justify-between gap-1 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="truncate">
                {(error as any)?.response?.data?.message ||
                  (error as Error)?.message ||
                  'Backend API unavailable; showing cached threads'}
              </span>
            </div>
            <button
              onClick={() => refetch()}
              className="underline font-semibold hover:text-amber-500 shrink-0 cursor-pointer ml-1"
            >
              Retry
            </button>
          </div>
        )}

        {/* Thread Cards */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {isLoading && threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#74A09F] mb-2" />
              <p className="text-xs text-muted-foreground">Loading WhatsApp conversations...</p>
            </div>
          ) : filteredThreads.length > 0 ? (
            <div className="divide-y divide-border/60">
              {filteredThreads.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  isSelected={String(selectedThreadId) === String(thread.id)}
                  onClick={() => setSelectedThreadId(String(thread.id))}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm font-semibold text-foreground mb-1">No conversations found</p>
              <p className="text-xs text-muted-foreground mb-4">
                Start a WhatsApp conversation to begin chatting with customers.
              </p>
              <button
                onClick={() => setIsNewChatOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#74A09F] text-white hover:bg-[#5E8B8A] text-xs font-semibold shadow-xs cursor-pointer"
              >
                <MessageSquarePlus className="h-4 w-4" />
                <span>Start Conversation</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <StartConversationModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />
    </>
  );
}
