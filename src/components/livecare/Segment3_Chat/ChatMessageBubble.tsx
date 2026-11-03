// ─── SP2-01: Chat Message Bubble ────────────────────────────────────────────
// WhatsApp-styled chat bubble:
//   - Sender messages (Agent & System/Bot outbound) are on the RIGHT with light green background.
//   - Receiver messages (Customer inbound) are on the LEFT with card background.
// Supports multi-line formatting, media previews, payment links, and delivery checkmarks.

import { clsx } from 'clsx';
import {
  Lock,
  FileText,
  FileAudio,
  FileVideo,
  CreditCard,
  ExternalLink,
  Bot,
  Check,
  CheckCheck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import type { ChatMessage, PaymentLinkMetadata } from '../../../types/care';
import { formatMessageTime } from '../../../utils/dateFormatter';
import { formatCurrency } from '../../../utils/currencyFormatter';

const URL_PATTERN = /(https?:\/\/[^\s]+)/;

function linkify(text: string, isSender?: boolean) {
  return text.split(URL_PATTERN).map((part, idx) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'underline break-all font-medium',
            isSender
              ? 'text-emerald-800 hover:text-emerald-950 dark:text-emerald-200'
              : 'text-[#5D8C8B] hover:text-[#4A7271] dark:text-[#88B8B7]',
          )}
        >
          {part}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function mediaIcon(mediaType: ChatMessage['media_type']) {
  switch (mediaType) {
    case 'audio':
      return <FileAudio className="h-4 w-4" />;
    case 'video':
      return <FileVideo className="h-4 w-4" />;
    case 'document':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function PaymentCard({ metadata }: { metadata: PaymentLinkMetadata }) {
  const isPaid = metadata.status === 'paid';

  return (
    <div className="mt-2.5 rounded-xl border border-border/80 bg-card p-3.5 text-left shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-lg bg-[#74A09F]/15 flex items-center justify-center text-[#74A09F]">
            <CreditCard className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-foreground">Payment Request</span>
        </div>
        <span
          className={clsx(
            'px-2 py-0.5 rounded-full text-2xs font-semibold capitalize',
            isPaid
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          )}
        >
          {metadata.status}
        </span>
      </div>

      <div className="bg-muted/50 rounded-lg p-2.5 mb-2.5">
        <p className="text-2xs text-muted-foreground uppercase tracking-wider mb-0.5">Amount to Pay</p>
        <p className="text-base font-bold text-foreground">{formatCurrency(metadata.amount)}</p>
        <p className="text-2xs text-muted-foreground font-mono mt-0.5">Ref: {metadata.invoice_id}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <a
          href={metadata.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#74A09F] hover:bg-[#5D8C8B] text-white text-xs font-medium transition-colors shadow-2xs"
        >
          Pay via MyFatoorah
          <ExternalLink className="h-3 w-3" />
        </a>
        <span className="text-2xs text-muted-foreground">
          {isPaid ? 'Payment Confirmed' : 'Expires in 24h'}
        </span>
      </div>
    </div>
  );
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  // 1. Internal Note / Whisper Bubble (Centered)
  if (message.sender_type === 'internal_note') {
    return (
      <div className="flex justify-center my-1">
        <div className="max-w-lg w-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 rounded-xl px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-amber-500/20">
            <div className="h-5 w-5 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Lock className="h-3 w-3" />
            </div>
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Internal Whisper
            </span>
            <span className="text-2xs font-medium text-amber-700/80 dark:text-amber-400">
              • {message.sender_name}
            </span>
            <span className="text-2xs text-amber-700/60 dark:text-amber-400/60 ml-auto font-mono">
              {formatMessageTime(message.created_at)}
            </span>
          </div>
          <p className="text-sm text-amber-950 dark:text-amber-100 leading-relaxed font-normal whitespace-pre-wrap break-words">
            {message.text && linkify(message.text, false)}
          </p>
        </div>
      </div>
    );
  }

  // Sender = Outbound (Agent or System/Bot) -> RIGHT
  // Receiver = Inbound (Customer) -> LEFT
  const isSender = message.sender_type === 'agent' || message.sender_type === 'bot';
  const isBot = message.sender_type === 'bot';
  const isAgent = message.sender_type === 'agent';
  const isCustomer = message.sender_type === 'customer';

  return (
    <div className={clsx('flex w-full my-1.5', isSender ? 'justify-end' : 'justify-start')}>
      <div className={clsx('max-w-[85%] sm:max-w-md md:max-w-lg', isSender && 'flex flex-col items-end')}>
        {/* Sender meta header */}
        <div className={clsx('flex items-center gap-1.5 mb-1 px-1', isSender && 'justify-end')}>
          {isBot && <Bot className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
          {isAgent && <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
          <span
            className={clsx(
              'text-2xs font-semibold',
              isCustomer && 'text-foreground/80',
              isSender && 'text-emerald-700 dark:text-emerald-400',
            )}
          >
            {message.sender_name}
          </span>
          <span className="text-2xs text-muted-foreground font-mono">
            {formatMessageTime(message.created_at)}
          </span>
        </div>

        {/* Bubble container: Light green for sender on right; White/Card for customer on left */}
        <div
          className={clsx(
            'px-4 py-2.5 text-sm leading-relaxed transition-all shadow-2xs',
            isSender
              ? 'bg-[#D9FDD3] dark:bg-[#005C4B] text-zinc-900 dark:text-[#E9EDEF] border border-[#BCE8B5] dark:border-[#026B57] rounded-2xl rounded-tr-xs font-normal'
              : 'bg-card dark:bg-[#202C33] border border-border/80 text-foreground rounded-2xl rounded-tl-xs font-normal',
          )}
        >
          {message.text && (
            <div className={clsx(isBot && 'italic', 'whitespace-pre-wrap break-words')}>
              {linkify(message.text, isSender)}
            </div>
          )}

          {message.media_url && message.media_type === 'image' && (
            <div className="mt-2 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xs">
              <img
                src={message.media_url}
                alt="attachment"
                className="max-w-full max-h-72 object-cover"
              />
            </div>
          )}

          {message.media_url && message.media_type && message.media_type !== 'image' && (
            <div
              className={clsx(
                'mt-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs',
                isSender
                  ? 'bg-emerald-700/10 text-emerald-950 dark:text-emerald-100 border border-emerald-600/20'
                  : 'bg-muted text-foreground border border-border/60',
              )}
            >
              <div className="shrink-0">{mediaIcon(message.media_type)}</div>
              <span className="truncate font-medium">{message.media_url.split('/').pop()}</span>
            </div>
          )}

          {message.payment_link_metadata && <PaymentCard metadata={message.payment_link_metadata} />}
        </div>

        {/* Read / delivery receipt status for outbound sender messages */}
        {message.delivery_status && isSender && (
          <div className="flex items-center gap-1 mt-0.5 px-1 text-2xs text-muted-foreground justify-end">
            {message.delivery_status === 'sent' && (
              <span className="flex items-center gap-0.5" title="Sent">
                <Check className="h-3 w-3 text-muted-foreground" />
                <span>Sent</span>
              </span>
            )}
            {message.delivery_status === 'delivered' && (
              <span className="flex items-center gap-0.5" title="Delivered">
                <CheckCheck className="h-3 w-3 text-muted-foreground" />
                <span>Delivered</span>
              </span>
            )}
            {message.delivery_status === 'read' && (
              <span className="flex items-center gap-0.5 text-sky-500 font-medium" title="Read">
                <CheckCheck className="h-3 w-3 text-sky-500" />
                <span>Read</span>
              </span>
            )}
            {message.delivery_status === 'failed' && (
              <span className="flex items-center gap-0.5 text-rose-500 font-medium" title="Delivery failed">
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span>Failed</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
