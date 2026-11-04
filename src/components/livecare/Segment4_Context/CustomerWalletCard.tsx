// ─── SP3-01: Customer 360 & Wallet ──────────────────────────────────────────
// Customer profile with lifetime stats and store-credit wallet. Wallet balance
// is fetched via TanStack Query; credit/debit adjustments are mutations.

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Phone,
  Mail,
  Wallet,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Copy,
  Check,
} from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { getWalletBalance, adjustWallet } from '../../../api/walletApi';
import type { CustomerContext } from '../../../types/care';

interface CustomerWalletCardProps {
  customer: CustomerContext;
}

type WalletAction = 'credit' | 'debit' | null;

export function CustomerWalletCard({ customer }: CustomerWalletCardProps) {
  const [action, setAction] = useState<WalletAction>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const queryClient = useQueryClient();

  const { data: balance } = useQuery({
    queryKey: ['wallet', customer.id],
    queryFn: () => getWalletBalance(customer.id),
    initialData: customer.wallet_balance_qar,
    staleTime: 30 * 1000,
  });

  const adjustMutation = useMutation({
    mutationFn: (vars: { delta: number; note: string }) =>
      adjustWallet(customer.id, vars.delta, vars.note),
    onSuccess: (_newBalance, vars) => {
      queryClient.setQueryData<number>(['wallet', customer.id], (old) =>
        Math.max(0, (old ?? 0) + vars.delta),
      );
    },
  });

  const openAction = (mode: 'credit' | 'debit') => {
    setAction(mode);
    setAmount('');
    setNote('');
  };

  const closeAction = () => {
    setAction(null);
    setAmount('');
    setNote('');
  };

  const submit = () => {
    const value = Number(amount);
    if (!value || value <= 0 || !action) return;
    const delta = action === 'credit' ? value : -value;
    adjustMutation.mutate({ delta, note });
    closeAction();
  };

  const copyPhoneNumber = () => {
    navigator.clipboard?.writeText(customer.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 1500);
  };

  const initials = customer.customer_name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isVIP = customer.customer_group.toLowerCase() === 'vip';

  return (
    <div className="p-4 bg-card">
      {/* Customer Profile Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-xs">
            {initials}
          </div>
          {isVIP && (
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-warning border-2 border-card flex items-center justify-center text-warning-foreground" title="VIP Customer">
              <Sparkles className="h-2.5 w-2.5" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-foreground truncate">{customer.customer_name}</h3>
            {isVIP && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/15 text-warning border border-warning/30 shrink-0">
                VIP
              </span>
            )}
          </div>

          <div className="space-y-1">
            <button
              onClick={copyPhoneNumber}
              className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Click to copy phone number"
            >
              <Phone className="h-3 w-3 text-primary" strokeWidth={2} />
              <span className="font-mono">{customer.phone}</span>
              {copiedPhone ? (
                <Check className="h-3 w-3 text-success" strokeWidth={2} />
              ) : (
                <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>

            {customer.email && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3 text-primary" strokeWidth={2} />
                <span className="truncate">{customer.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2x2 Lifetime Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-muted/50 border border-border rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tier</span>
            <Sparkles className="h-3 w-3 text-warning" strokeWidth={2} />
          </div>
          <p className="text-xs font-bold text-foreground capitalize">{customer.customer_group}</p>
        </div>

        <div className="bg-muted/50 border border-border rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Orders</span>
            <ShoppingBag className="h-3 w-3 text-primary" strokeWidth={2} />
          </div>
          <p className="text-xs font-bold text-foreground font-mono">{customer.total_orders} Completed</p>
        </div>

        <div className="bg-muted/50 border border-border rounded-xl p-3 col-span-2 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Lifetime Spend</span>
            <TrendingUp className="h-3 w-3 text-success" strokeWidth={2} />
          </div>
          <p className="text-sm font-bold text-foreground font-mono">
            {formatCurrency(customer.lifetime_spend ?? 0)}
          </p>
        </div>
      </div>

      {/* Store Credit Wallet Card */}
      <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-lg bg-warning/20 flex items-center justify-center text-warning">
              <Wallet className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold text-warning uppercase tracking-wider">
              Store Credit Balance
            </span>
          </div>
          <span className="text-[10px] font-semibold text-warning">Active</span>
        </div>

        <p className="text-2xl font-bold text-warning tracking-tight my-1 font-mono">
          {formatCurrency(balance ?? 0)}
        </p>

        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-warning/20">
          <button
            onClick={() => openAction('credit')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-success hover:opacity-90 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Add Credit</span>
          </button>
          <button
            onClick={() => openAction('debit')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-card hover:bg-destructive/10 text-destructive border border-destructive/30 text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Minus className="h-3.5 w-3.5" />
            <span>Deduct</span>
          </button>
        </div>
      </div>

      {/* Store Credit Adjustment Modal */}
      <Modal
        isOpen={action !== null}
        onClose={closeAction}
        title={action === 'credit' ? 'Issue Store Credit' : 'Deduct Store Credit'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={closeAction}>
              Cancel
            </Button>
            <Button
              variant={action === 'credit' ? 'success' : 'danger'}
              onClick={submit}
              disabled={!Number(amount) || adjustMutation.isPending}
            >
              Confirm Adjustment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Amount (QAR)</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              className="w-full h-9 bg-muted/60 rounded-xl px-3.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Note / Reason</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Compensation for late delivery"
              className="w-full h-9 bg-muted/60 rounded-xl px-3.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

