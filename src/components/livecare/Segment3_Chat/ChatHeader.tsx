// ─── SP2-07: Chat Header (Upgraded UI) ──────────────────────────────────────
// Modern conversation header with channel badges, live SLA indicator,
// department reassignment, and status management.

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  UserPlus,
  Check,
  ChevronDown,
  Clock,
  Sparkles,
  Phone,
  User,
  MoreVertical,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { useCareStore } from '../../../store/useCareStore';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { emitReassignThread, emitMarkResolved } from '../../../services/socket';
import { formatTimeRemaining } from '../../../utils/dateFormatter';
import type { ConversationThread, DepartmentType, TicketStatus } from '../../../types/care';

const STATUS_OPTIONS: { value: TicketStatus; label: string; dot: string; badgeCls: string }[] = [
  {
    value: 'in_progress',
    label: 'In Progress',
    dot: 'bg-info',
    badgeCls: 'bg-info/10 text-info border-info/20',
  },
  {
    value: 'pending',
    label: 'Pending',
    dot: 'bg-warning',
    badgeCls: 'bg-warning/10 text-warning border-warning/20',
  },
  {
    value: 'follow_up',
    label: 'Follow Up',
    dot: 'bg-purple-500',
    badgeCls: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  {
    value: 'resolved',
    label: 'Resolved',
    dot: 'bg-success',
    badgeCls: 'bg-success/10 text-success border-success/20',
  },
];

const DEPARTMENT_OPTIONS: { value: DepartmentType; label: string }[] = [
  { value: 'general', label: 'General Support' },
  { value: 'returns', label: 'Returns & Replacements' },
  { value: 'operations', label: 'Operations & Warehouse' },
  { value: 'installation', label: 'Installation Support' },
  { value: 'sales', label: 'Sales & VIP' },
];

const CHANNEL_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  whatsapp: {
    label: 'WhatsApp',
    cls: 'bg-success/10 text-success border-success/20',
    dot: 'bg-success',
  },
  instagram: {
    label: 'Instagram',
    cls: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    dot: 'bg-pink-500',
  },
  messenger: {
    label: 'Messenger',
    cls: 'bg-info/10 text-info border-info/20',
    dot: 'bg-info',
  },
  email: {
    label: 'Email',
    cls: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    dot: 'bg-indigo-500',
  },
};

interface ChatHeaderProps {
  thread: ConversationThread;
}

export function ChatHeader({ thread }: ChatHeaderProps) {
  const { updateThread } = useCareStore();
  const [tagOpen, setTagOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [pendingDept, setPendingDept] = useState<DepartmentType>(thread.department);
  const [copied, setCopied] = useState(false);

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === thread.status) || STATUS_OPTIONS[0];
  const channelInfo = CHANNEL_CONFIG[thread.channel] || CHANNEL_CONFIG.whatsapp;
  const initials = thread.customer_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const setStatus = (status: TicketStatus) => {
    updateThread(thread.id, { status });
    setTagOpen(false);
  };

  const confirmReassign = () => {
    updateThread(thread.id, {
      department: pendingDept,
      assigned_agent_id: 'agent-1',
      assigned_agent_name: 'Jishu M.',
    });
    emitReassignThread(thread.id, pendingDept, 'agent-1');
    setReassignOpen(false);
  };

  const resolveThread = () => {
    updateThread(thread.id, { status: 'resolved' });
    emitMarkResolved(thread.id);
  };

  const copyPhone = () => {
    navigator.clipboard?.writeText(thread.customer_phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="px-4 py-3 sm:px-5 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between shrink-0 shadow-xs flex-nowrap min-w-0 gap-3">
      {/* ── Left Customer Info ────────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
        <div className="relative shrink-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs sm:text-sm font-bold text-primary shadow-xs">
            {initials}
          </div>
          <span
            className={clsx(
              'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ring-2 ring-card',
              channelInfo.dot,
            )}
            title={channelInfo.label}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-foreground truncate tracking-tight">
              {thread.customer_name}
            </h3>
            <span
              className={clsx(
                'inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0',
                channelInfo.cls,
              )}
            >
              {channelInfo.label}
            </span>
            {thread.is_bot_active && (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
                <Sparkles className="h-2.5 w-2.5" />
                Bot
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground min-w-0 truncate">
            <span className="flex items-center gap-1 font-medium text-muted-foreground shrink-0">
              <Phone className="h-3 w-3 opacity-70" />
              <span className="font-mono text-[11px] sm:text-xs">{thread.customer_phone}</span>
            </span>
            <span>•</span>
            <span className="capitalize font-medium shrink-0">{thread.department}</span>
            <span>•</span>
            <span className="flex items-center gap-1 min-w-0 truncate">
              <User className="h-3 w-3 opacity-70 shrink-0" />
              {thread.assigned_agent_name ? (
                <span className="font-semibold text-foreground/80 truncate">
                  {thread.assigned_agent_name}
                </span>
              ) : (
                <span className="text-warning italic shrink-0">Unassigned</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Actions (Compact, Never Wrap) ─────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* SLA Status Indicator (Shown directly on very wide screens) */}
        {thread.sla_deadline && thread.status !== 'resolved' && (
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted text-xs font-medium border border-border text-muted-foreground shrink-0">
            <Clock className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span>SLA:</span>
            <span className="font-semibold text-foreground font-mono">
              {formatTimeRemaining(thread.sla_deadline)}
            </span>
          </div>
        )}

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setTagOpen((v) => !v);
              setActionsOpen(false);
            }}
            className={clsx(
              'px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:opacity-90 shrink-0',
              currentStatus.badgeCls,
            )}
          >
            <span className={clsx('h-2 w-2 rounded-full shrink-0', currentStatus.dot)} />
            <span className="truncate">{currentStatus.label}</span>
            <ChevronDown className="h-3 w-3 opacity-70 shrink-0" />
          </button>

          {tagOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setTagOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-lg p-1 z-30 animate-fade-in divide-y divide-border/40">
                <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Update Status
                </div>
                <div className="py-1">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStatus(option.value)}
                      className={clsx(
                        'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left',
                        thread.status === option.value
                          ? 'bg-primary/15 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted',
                      )}
                    >
                      <span className={clsx('h-2 w-2 rounded-full', option.dot)} />
                      <span className="flex-1">{option.label}</span>
                      {thread.status === option.value && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Primary Resolve / Reopen Button */}
        {thread.status !== 'resolved' ? (
          <button
            onClick={resolveThread}
            className="h-8 px-3 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Resolve</span>
          </button>
        ) : (
          <button
            onClick={() => setStatus('in_progress')}
            className="h-8 px-3 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border/80 transition-all cursor-pointer shrink-0"
          >
            Reopen
          </button>
        )}

        {/* More Actions Dropdown (Reassign, SLA info, Copy contact) */}
        <div className="relative">
          <button
            onClick={() => {
              setActionsOpen((v) => !v);
              setTagOpen(false);
            }}
            className="h-8 px-2.5 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border/80 transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
            title="More Options"
          >
            <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Actions</span>
          </button>

          {actionsOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setActionsOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-lg p-1.5 z-30 animate-fade-in divide-y divide-border/50">
                {/* SLA Info Card inside Dropdown */}
                {thread.sla_deadline && thread.status !== 'resolved' && (
                  <div className="px-3 py-2 bg-muted/40 rounded-lg mb-1">
                    <div className="flex items-center justify-between text-2xs mb-0.5">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary" />
                        SLA Target
                      </span>
                      <span className="font-bold text-foreground">
                        {formatTimeRemaining(thread.sla_deadline)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="py-1 space-y-0.5">
                  {/* Reassign Option */}
                  <button
                    onClick={() => {
                      setPendingDept(thread.department);
                      setReassignOpen(true);
                      setActionsOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                    <span className="flex-1">Reassign Department</span>
                  </button>

                  {/* Copy Customer Phone */}
                  <button
                    onClick={copyPhone}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                  >
                    {copied ? (
                      <CheckCheck className="h-3.5 w-3.5 text-success" strokeWidth={2} />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                    )}
                    <span className="flex-1">
                      {copied ? 'Copied to Clipboard' : 'Copy Phone Number'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reassign Modal */}
      <Modal
        isOpen={reassignOpen}
        onClose={() => setReassignOpen(false)}
        title="Reassign Thread"
        subtitle={`Transfer conversation with ${thread.customer_name}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReassignOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmReassign}>
              Confirm Transfer
            </Button>
          </>
        }
      >
        <div className="space-y-2 py-1">
          {DEPARTMENT_OPTIONS.map((dept) => (
            <button
              key={dept.value}
              onClick={() => setPendingDept(dept.value)}
              className={clsx(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all border cursor-pointer',
                pendingDept === dept.value
                  ? 'bg-primary/15 text-foreground border-primary/40 font-semibold shadow-xs'
                  : 'text-foreground border-border hover:bg-muted',
              )}
            >
              <span>{dept.label}</span>
              {pendingDept === dept.value && <Check className="h-4 w-4 text-primary" strokeWidth={2} />}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

