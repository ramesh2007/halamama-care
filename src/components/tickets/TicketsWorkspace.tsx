// ─── SP4-01/02: Email Ticket Workspace ──────────────────────────────────────
// Split-pane layout: ticket table (left) and email thread + composer (right).
// Features ticket triage, status transitions, creation modal, and real-time thread updates.

import { useState } from 'react';
import {
  Mail,
  Ticket,
  Plus,
  X,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { TicketTable } from './TicketTable';
import { EmailThreadViewer } from './EmailThreadViewer';
import { EmailComposer } from './EmailComposer';
import { useTickets, useTicketMessages, useUpdateTicketStatus, useCreateTicket } from '../../hooks/api';
import { clsx } from 'clsx';
import type { EmailTicket } from '../../types/care';

const STATUS_OPTIONS: { value: EmailTicket['status']; label: string; cls: string }[] = [
  { value: 'open', label: 'Open', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { value: 'pending_ops', label: 'Pending Ops', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { value: 'escalated', label: 'Escalated', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  { value: 'closed', label: 'Closed', cls: 'bg-muted text-muted-foreground border-border' },
];

export function TicketsWorkspace() {
  const { data: tickets = [] } = useTickets();
  const updateStatusMutation = useUpdateTicketStatus();
  const createTicketMutation = useCreateTicket();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New ticket modal state
  const [newSenderName, setNewSenderName] = useState('');
  const [newSenderEmail, setNewSenderEmail] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDepartment, setNewDepartment] = useState<'support' | 'operations' | 'billing'>('support');
  const [newPriority, setNewPriority] = useState<EmailTicket['priority']>('medium');

  const ticket = tickets.find((t) => t.id === selectedId) || tickets[0] || null;
  const { data: messages = [] } = useTicketMessages(ticket?.id);

  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  const handleStatusChange = (newStatus: EmailTicket['status']) => {
    if (!ticket) return;
    updateStatusMutation.mutate({
      ticketId: ticket.id,
      status: newStatus,
    });
    setIsStatusMenuOpen(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSenderName || !newSenderEmail || !newSubject) return;

    createTicketMutation.mutate(
      {
        sender_name: newSenderName,
        sender_email: newSenderEmail,
        subject: newSubject,
        department: newDepartment,
        priority: newPriority,
        status: 'open',
      },
      {
        onSuccess: (newTck) => {
          setSelectedId(newTck.id);
          setIsCreateModalOpen(false);
          setNewSenderName('');
          setNewSenderEmail('');
          setNewSubject('');
        },
      },
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-background relative">
      {/* Left Pane: Ticket List Table */}
      <div className="w-[42%] min-w-[380px] max-w-[520px] border-r border-border bg-card flex flex-col shrink-0">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#74A09F]/15 flex items-center justify-center text-[#74A09F]">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Email Support Tickets</h2>
              <p className="text-2xs text-muted-foreground">Inbound customer emails & inquiries</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold bg-[#74A09F]/15 text-[#74A09F] border border-[#74A09F]/20">
              {openTicketsCount} Open
            </span>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="p-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors cursor-pointer"
              title="Create new support ticket"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <TicketTable tickets={tickets} selectedId={ticket?.id ?? null} onSelect={setSelectedId} />
      </div>

      {/* Right Pane: Thread Details & Reply Composer */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {ticket ? (
          <>
            {/* Ticket Header */}
            <div className="px-6 py-3.5 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between shrink-0 shadow-xs">
              <div className="min-w-0 flex-1 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#74A09F] bg-[#74A09F]/10 px-2 py-0.5 rounded-md border border-[#74A09F]/20">
                    {ticket.ticket_id}
                  </span>
                  <h2 className="text-sm font-bold text-foreground truncate tracking-tight">
                    {ticket.subject}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                  <span className="font-medium text-foreground/80">{ticket.sender_name}</span>
                  <span>•</span>
                  <span className="truncate">{ticket.sender_email}</span>
                  <span>•</span>
                  <span className="capitalize font-medium">{ticket.department || 'Support'}</span>
                </div>
              </div>

              {/* Priority & Interactive Status Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Priority Badge */}
                <span
                  className={clsx(
                    'px-2.5 py-1 rounded-full text-2xs font-bold border uppercase tracking-wider',
                    ticket.priority === 'urgent' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                    ticket.priority === 'high' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                    ticket.priority === 'medium' && 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
                    ticket.priority === 'low' && 'bg-muted text-muted-foreground border-border',
                  )}
                >
                  {ticket.priority}
                </span>

                {/* Status Dropdown Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setIsStatusMenuOpen((prev) => !prev)}
                    className={clsx(
                      'px-2.5 py-1 rounded-full text-2xs font-bold border capitalize flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs',
                      ticket.status === 'open' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
                      ticket.status === 'pending_ops' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
                      ticket.status === 'escalated' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
                      ticket.status === 'closed' && 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
                    )}
                  >
                    <span>{ticket.status.replace('_', ' ')}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {/* Status Options Dropdown Menu */}
                  {isStatusMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsStatusMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-40 rounded-xl bg-card border border-border shadow-lg p-1.5 z-40 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                          Set Ticket Status
                        </p>
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleStatusChange(opt.value)}
                            className={clsx(
                              'w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer',
                              ticket.status === opt.value
                                ? 'bg-[#74A09F]/15 text-[#74A09F]'
                                : 'text-foreground hover:bg-muted',
                            )}
                          >
                            <span>{opt.label}</span>
                            {ticket.status === opt.value && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#74A09F]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Email Message Thread */}
            <EmailThreadViewer messages={messages} />

            {/* Reply Composer */}
            <EmailComposer key={ticket.id} ticket={ticket} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-3 text-muted-foreground">
              <Ticket className="h-8 w-8 text-[#74A09F]" />
            </div>
            <p className="text-base font-bold text-foreground mb-1">Select an Email Ticket</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Choose a ticket from the left panel to review message correspondence and send a response.
            </p>
          </div>
        )}
      </div>

      {/* ── Create Ticket Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#74A09F]/15 flex items-center justify-center text-[#74A09F]">
                  <Mail className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Create Support Ticket</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5">
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={newSenderName}
                  onChange={(e) => setNewSenderName(e.target.value)}
                  placeholder="e.g. Tariq Mansoor"
                  className="w-full bg-muted/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-1 focus:ring-[#74A09F]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  required
                  value={newSenderEmail}
                  onChange={(e) => setNewSenderEmail(e.target.value)}
                  placeholder="e.g. tariq@domain.qa"
                  className="w-full bg-muted/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-1 focus:ring-[#74A09F]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Delayed Delivery Inquiry"
                  className="w-full bg-muted/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-1 focus:ring-[#74A09F]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Department
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value as any)}
                    className="w-full bg-muted/40 rounded-xl px-3 py-2 text-xs text-foreground border border-border focus:border-[#74A09F] focus:bg-card outline-none cursor-pointer"
                  >
                    <option value="support">Support</option>
                    <option value="operations">Operations</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-muted/40 rounded-xl px-3 py-2 text-xs text-foreground border border-border focus:border-[#74A09F] focus:bg-card outline-none cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTicketMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#74A09F] hover:bg-[#5D8C8B] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {createTicketMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  <span>Create Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
