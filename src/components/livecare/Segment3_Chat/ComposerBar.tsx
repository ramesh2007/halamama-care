// ─── SP2-02 / SP2-05: Dual-Tab Composer Bar ────────────────────────────────
// Toggles between an outbound WhatsApp composer and an internal whisper note,
// enforces the Meta 24-hour messaging window, and integrates the canned
// response picker and MyFatoorah payment link generator.

import { useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import {
  Send,
  Paperclip,
  ImageIcon,
  CreditCard,
  ShieldAlert,
  MessageSquare,
  Lock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useCareStore } from '../../../store/useCareStore';
import { useSendConversationReply } from '../../../hooks/api';
import { CannedResponsePicker } from './CannedResponsePicker';
import { InternalNoteComposer } from './InternalNoteComposer';
import { MyFatoorahModal } from './MyFatoorahModal';
import { emitSendMessage } from '../../../services/socket';
import { isWithin24Hours } from '../../../utils/dateFormatter';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { CURRENT_AGENT } from '../../../api';
import type { ConversationThread, CannedResponse, PaymentLinkMetadata } from '../../../types/care';

const TRIGGER_REGEX = /(?:^|\s)\/([a-z_]*)$/;

interface ComposerBarProps {
  thread: ConversationThread;
}

export function ComposerBar({ thread }: ComposerBarProps) {
  const {
    composerMode,
    setComposerMode,
    cannedResponses,
    addMessage,
    updateThread,
  } = useCareStore();

  const sendReplyMutation = useSendConversationReply();

  const [text, setText] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [dismissedToken, setDismissedToken] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const match = text.match(TRIGGER_REGEX);
  const triggerToken = match ? match[0] : null;
  const query = match ? match[1] : '';
  const isPicking = triggerToken !== null && triggerToken !== dismissedToken;

  const filteredResponses = useMemo(
    () =>
      cannedResponses.filter((r) => r.trigger.toLowerCase().includes(query.toLowerCase())),
    [cannedResponses, query],
  );

  const safeHighlight = filteredResponses.length > 0 ? highlightIndex % filteredResponses.length : 0;

  const locked =
    !thread.last_customer_message_at || !isWithin24Hours(thread.last_customer_message_at);

  const selectCanned = (response: CannedResponse) => {
    const slashIndex = text.lastIndexOf('/');
    setText(text.slice(0, slashIndex) + response.text + ' ');
    setDismissedToken(null);
    textareaRef.current?.focus();
  };

  const handleQuickInsertSlash = () => {
    setText((prev) => (prev.endsWith('/') ? prev : prev + (prev.length > 0 && !prev.endsWith(' ') ? ' /' : '/')));
    setDismissedToken(null);
    textareaRef.current?.focus();
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sendReplyMutation.isPending) return;

    if (composerMode === 'whisper') {
      const now = new Date().toISOString();
      addMessage(thread.id, {
        id: `note-${Date.now()}`,
        thread_id: thread.id,
        sender_type: 'internal_note',
        sender_name: CURRENT_AGENT.name,
        text: trimmed,
        created_at: now,
      });
      setText('');
      setDismissedToken(null);
      textareaRef.current?.focus();
      return;
    }

    setText('');
    setDismissedToken(null);
    emitSendMessage(thread.id, trimmed, 'agent');

    try {
      await sendReplyMutation.mutateAsync({
        threadId: thread.id,
        message: trimmed,
      });
    } catch (err) {
      console.error('[ComposerBar] Error sending WhatsApp reply to Laravel:', err);
    } finally {
      textareaRef.current?.focus();
    }
  };

  const handlePaymentGenerated = (metadata: PaymentLinkMetadata) => {
    const now = new Date().toISOString();
    addMessage(thread.id, {
      id: `payment-${Date.now()}`,
      thread_id: thread.id,
      sender_type: 'agent',
      sender_name: CURRENT_AGENT.name,
      text: `Payment request for ${formatCurrency(metadata.amount)}`,
      payment_link_metadata: metadata,
      created_at: now,
      delivery_status: 'sent',
    });
    updateThread(thread.id, {
      last_message_preview: `Payment request: ${formatCurrency(metadata.amount)}`,
      last_message_at: now,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPicking) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((idx) => (idx + 1) % Math.max(filteredResponses.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex(
          (idx) => (idx - 1 + Math.max(filteredResponses.length, 1)) % Math.max(filteredResponses.length, 1),
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResponses[safeHighlight]) {
          selectCanned(filteredResponses[safeHighlight]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setDismissedToken(triggerToken);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card p-3.5 sm:p-4 shrink-0 shadow-2xs">
      {/* Top Bar: Segmented Switcher & Quick Helpers */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Segmented Mode Switcher */}
        <div className="inline-flex items-center bg-muted/80 p-0.5 rounded-xl border border-border/60">
          <button
            onClick={() => setComposerMode('message')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              composerMode === 'message'
                ? 'bg-card text-foreground shadow-xs border border-border/50'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#74A09F]" />
            <span>WhatsApp Reply</span>
          </button>
          <button
            onClick={() => setComposerMode('whisper')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              composerMode === 'whisper'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-xs border border-amber-500/30'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Lock className="h-3.5 w-3.5 text-amber-500" />
            <span>Internal Note</span>
          </button>
        </div>

        {/* Quick Shortcut Badge */}
        {composerMode === 'message' && (
          <button
            onClick={handleQuickInsertSlash}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-2xs font-medium text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/60 transition-colors cursor-pointer"
            title="Press / to open canned responses"
          >
            <Sparkles className="h-3 w-3 text-[#74A09F]" />
            <span>Canned Responses</span>
            <kbd className="px-1.5 py-0.5 rounded bg-card text-foreground text-[10px] font-mono border border-border">
              /
            </kbd>
          </button>
        )}
      </div>

      {composerMode === 'whisper' ? (
        <InternalNoteComposer value={text} onChange={setText} onSend={handleSend} />
      ) : locked ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              24-Hour Customer Window Expired
            </span>
          </div>
          <p className="text-2xs text-amber-800/80 dark:text-amber-300/80 mb-3 leading-relaxed">
            Meta policy requires sending an approved HSM template to re-engage after 24 hours of customer inactivity.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#74A09F] hover:bg-[#5D8C8B] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer">
              <Send className="h-3.5 w-3.5" />
              Send Meta Template (HSM)
            </button>
            <button
              onClick={() => setPaymentOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card text-foreground hover:bg-muted border border-border text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <CreditCard className="h-3.5 w-3.5 text-[#74A09F]" />
              Generate Payment Link
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {isPicking && filteredResponses.length > 0 && (
            <CannedResponsePicker
              responses={filteredResponses}
              highlightIndex={safeHighlight}
              onSelect={selectCanned}
              onHover={setHighlightIndex}
            />
          )}

          <div className="flex items-end gap-2.5">
            {/* Attachment Actions */}
            <div className="flex items-center gap-0.5 pb-0.5">
              <button
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border/60 transition-all cursor-pointer"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border/60 transition-all cursor-pointer"
                title="Attach image"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPaymentOpen(true)}
                className="p-2 rounded-xl text-muted-foreground hover:text-[#74A09F] hover:bg-[#74A09F]/10 border border-transparent hover:border-[#74A09F]/20 transition-all cursor-pointer"
                title="Generate payment link (MyFatoorah)"
              >
                <CreditCard className="h-4 w-4" />
              </button>
            </div>

            {/* Message Input Box */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message or press '/' for canned responses..."
                className="w-full bg-muted/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 transition-all"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!text.trim() || sendReplyMutation.isPending}
              className="p-2.5 rounded-xl bg-[#74A09F] hover:bg-[#5D8C8B] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-xs cursor-pointer shrink-0 active:scale-95 flex items-center justify-center min-w-10 min-h-10"
              title="Send WhatsApp Message"
            >
              {sendReplyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      <MyFatoorahModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        thread={thread}
        onGenerated={handlePaymentGenerated}
      />
    </div>
  );
}

