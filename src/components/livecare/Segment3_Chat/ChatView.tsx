// ─── Segment 3: Chat Engine ─────────────────────────────────────────────────
// Orchestrates the chat header, message stream, and composer bar for the
// currently selected thread. Connects to Laravel /api/customer-care/conversations/{id}/messages
// with automated real-time polling and audio alerts on inbound messages.

import { useEffect, useRef } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useCareStore } from '../../../store/useCareStore';
import { useThreadMessages } from '../../../hooks/api';
import { ChatHeader } from './ChatHeader';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ComposerBar } from './ComposerBar';

export function ChatView() {
  const selectedThreadId = useCareStore((s) => s.selectedThreadId);
  const threads = useCareStore((s) => s.threads);
  const messages = useCareStore((s) => s.messages);

  const tid = selectedThreadId ? String(selectedThreadId) : null;
  const thread = threads.find((t) => String(t.id) === tid);

  // Poll conversation messages from Laravel backend every 3s
  const { data: polledMessages, isLoading } = useThreadMessages(tid);

  const storeMessages = tid ? messages[tid] : undefined;
  const threadMessages = storeMessages && storeMessages.length > 0 ? storeMessages : (polledMessages || []);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length, selectedThreadId]);

  if (!tid || !thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="h-20 w-20 rounded-2xl bg-primary/15 flex items-center justify-center mb-5">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Choose a WhatsApp thread from the list or start a new conversation to begin chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-background">
      <ChatHeader thread={thread} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {isLoading && threadMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Loading WhatsApp messages...</p>
          </div>
        ) : threadMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2.5 text-muted-foreground">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">No messages in this thread</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send a WhatsApp reply or log an internal note to start.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-center my-1">
              <span className="px-3 py-1 rounded-full text-2xs font-semibold bg-muted/80 text-muted-foreground border border-border/60 shadow-2xs">
                Today
              </span>
            </div>
            {threadMessages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <ComposerBar thread={thread} />
    </div>
  );
}
