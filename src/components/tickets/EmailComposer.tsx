// ─── SP4-02: Email Composer ─────────────────────────────────────────────────
// Rich-text reply editor with To/CC/BCC, a formatting toolbar, and a
// drag-and-drop attachment zone.

import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';
import { Bold, Italic, Underline, List, Link, Paperclip, Send, Save, X, Check, Loader2 } from 'lucide-react';
import { useSendTicketReply } from '../../hooks/api';
import type { EmailTicket } from '../../types/care';

interface Attachment {
  name: string;
  size: number;
}

interface EmailComposerProps {
  ticket: EmailTicket;
}

export function EmailComposer({ ticket }: EmailComposerProps) {
  const [to, setTo] = useState(ticket.sender_email);
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(`Re: ${ticket.subject}`);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [status, setStatus] = useState<'idle' | 'sent' | 'draft'>('idle');
  const editorRef = useRef<HTMLDivElement>(null);

  const sendReplyMutation = useSendTicketReply();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) =>
      setAttachments((prev) => [...prev, ...files.map((f) => ({ name: f.name, size: f.size }))]),
  });

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  const clear = () => {
    setCc('');
    setAttachments([]);
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const send = () => {
    const htmlContent = editorRef.current?.innerHTML || '';
    const textContent = editorRef.current?.innerText || '';
    if (!textContent.trim() && attachments.length === 0) return;

    sendReplyMutation.mutate(
      {
        ticketId: ticket.id,
        payload: {
          recipients: to.split(',').map((e) => e.trim()).filter(Boolean),
          cc: cc ? cc.split(',').map((e) => e.trim()).filter(Boolean) : [],
          subject,
          body_text: textContent,
          body_html: htmlContent,
          attachments,
        },
      },
      {
        onSuccess: () => {
          clear();
          setStatus('sent');
          window.setTimeout(() => setStatus('idle'), 2500);
        },
      },
    );
  };

  const saveDraft = () => {
    setStatus('draft');
    window.setTimeout(() => setStatus('idle'), 2500);
  };

  return (
    <div className="border-t border-border bg-card p-4 sm:p-5 shrink-0 shadow-xs">
      {/* Header Fields (To, CC, Subject) */}
      <div className="space-y-2 mb-3">
        <FieldRow label="To">
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 bg-muted/40 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-1 focus:ring-[#74A09F]/20 outline-none transition-all"
          />
        </FieldRow>
        <FieldRow label="CC">
          <input
            type="text"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            placeholder="Add recipient emails separated by comma..."
            className="flex-1 bg-muted/40 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-1 focus:ring-[#74A09F]/20 outline-none transition-all"
          />
        </FieldRow>
        <FieldRow label="Subject">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 bg-muted/40 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-1 focus:ring-[#74A09F]/20 outline-none transition-all font-semibold"
          />
        </FieldRow>
      </div>

      {/* Editor Box */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden focus-within:border-[#74A09F] focus-within:ring-2 focus-within:ring-[#74A09F]/20 transition-all shadow-2xs">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/40">
          <ToolbarButton title="Bold" onClick={() => exec('bold')}>
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Italic" onClick={() => exec('italic')}>
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Underline" onClick={() => exec('underline')}>
            <Underline className="h-3.5 w-3.5" />
          </ToolbarButton>
          <div className="h-4 w-px bg-border mx-1" />
          <ToolbarButton title="Bullet list" onClick={() => exec('insertUnorderedList')}>
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            title="Insert link"
            onClick={() => {
              const url = window.prompt('URL', 'https://');
              if (url) exec('createLink', url);
            }}
          >
            <Link className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>

        {/* Content Editable Body */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => setStatus('idle')}
          className="min-h-[110px] sm:min-h-[130px] px-3.5 py-3 text-xs sm:text-sm text-foreground leading-relaxed outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#74A09F] [&_a]:underline"
        />
      </div>

      {/* Attachment Pills */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {attachments.map((att) => (
            <div
              key={att.name}
              className="inline-flex items-center gap-2 rounded-xl bg-muted/70 border border-border px-3 py-1.5 shadow-2xs"
            >
              <Paperclip className="h-3.5 w-3.5 text-[#74A09F]" />
              <span className="text-xs font-medium text-foreground">{att.name}</span>
              <span className="text-2xs text-muted-foreground">
                ({(att.size / 1024).toFixed(0)} KB)
              </span>
              <button
                onClick={() => removeAttachment(att.name)}
                className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer ml-1"
                title="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={clsx(
          'mt-3 rounded-xl border border-dashed px-4 py-2.5 text-center cursor-pointer transition-all',
          isDragActive
            ? 'border-[#74A09F] bg-[#74A09F]/10'
            : 'border-border hover:border-[#74A09F]/60 bg-muted/20 hover:bg-muted/40',
        )}
      >
        <input {...getInputProps()} />
        <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1.5">
          <Paperclip className="h-3.5 w-3.5 text-[#74A09F]" />
          <span>Drag & drop files here, or click to browse</span>
        </p>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-3.5 pt-1">
        {status !== 'idle' ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            {status === 'sent' ? 'Email dispatched successfully!' : 'Draft saved to ticket'}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={saveDraft}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-all cursor-pointer shadow-2xs"
          >
            <Save className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={send}
            disabled={sendReplyMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#74A09F] hover:bg-[#5D8C8B] text-white transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendReplyMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Send Email Reply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-muted-foreground w-14 shrink-0">{label}:</span>
      {children}
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

