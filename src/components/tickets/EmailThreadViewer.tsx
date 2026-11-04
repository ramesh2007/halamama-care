// ─── SP4-02: Email Thread Viewer ────────────────────────────────────────────
// Renders an email chain with sanitized HTML bodies and downloadable
// attachment chips.

import { clsx } from 'clsx';
import { Paperclip, Download, User, ShieldCheck, Mail } from 'lucide-react';
import { sanitizeHtml } from '../../utils/sanitize';
import { formatThreadTimestamp } from '../../utils/dateFormatter';
import type { EmailMessage } from '../../types/care';

interface EmailThreadViewerProps {
  messages: EmailMessage[];
}

export function EmailThreadViewer({ messages }: EmailThreadViewerProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2.5 text-muted-foreground">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground">No messages in this thread</p>
        <p className="text-xs text-muted-foreground mt-0.5">Use the reply box below to send the first response.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {messages.map((msg) => {
        const isOutbound = msg.direction === 'outbound';

        return (
          <div
            key={msg.id}
            className={clsx(
              'rounded-2xl border p-4 sm:p-5 shadow-xs transition-all',
              isOutbound
                ? 'border-primary/30 bg-primary/5'
                : 'border-border bg-card',
            )}
          >
            {/* Message Header */}
            <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-border/50">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={clsx(
                    'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs',
                    isOutbound
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted text-foreground border border-border',
                  )}
                >
                  {isOutbound ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground truncate">{msg.sender_name}</p>
                    <span
                      className={clsx(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0',
                        isOutbound
                          ? 'bg-primary/15 text-primary border-primary/30'
                          : 'bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {isOutbound ? 'Support Reply' : 'Customer'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{msg.sender_email}</p>
                  <p className="text-2xs text-muted-foreground mt-0.5 truncate">
                    To: {msg.recipients.join(', ')}
                    {msg.cc && msg.cc.length > 0 ? ` • CC: ${msg.cc.join(', ')}` : ''}
                  </p>
                </div>
              </div>

              <span className="text-2xs font-mono text-muted-foreground whitespace-nowrap shrink-0">
                {formatThreadTimestamp(msg.created_at)}
              </span>
            </div>

            {/* Subject */}
            <p className="text-xs font-bold text-foreground mb-2.5">{msg.subject}</p>

            {/* Message Body */}
            {msg.body_html ? (
              <div
                className="text-sm text-foreground/90 leading-relaxed [&_p]:mb-2 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.body_html) }}
              />
            ) : (
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {msg.body_text}
              </p>
            )}

            {/* Attachments */}
            {msg.attachments.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Attachments ({msg.attachments.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {msg.attachments.map((att) => (
                    <div
                      key={att.name}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/80 px-3 py-1.5 transition-colors cursor-pointer group shadow-2xs"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
                        {att.name}
                      </span>
                      <span className="text-2xs text-muted-foreground">
                        {(att.size / 1024).toFixed(0)} KB
                      </span>
                      <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

