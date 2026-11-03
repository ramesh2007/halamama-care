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
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#74A09F] to-[#456A69] flex items-center justify-center text-white font-bold text-base shadow-xs">
            {initials}
          </div>
          {isVIP && (
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-amber-500 border-2 border-card flex items-center justify-center text-white" title="VIP Customer">
              <Sparkles className="h-2.5 w-2.5" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-foreground truncate">{customer.customer_name}</h3>
            {isVIP && (
              <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shrink-0">
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
              <Phone className="h-3 w-3 text-[#74A09F]" />
              <span className="font-mono">{customer.phone}</span>
              {copiedPhone ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>

            {customer.email && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3 text-[#74A09F]" />
                <span className="truncate">{customer.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2x2 Lifetime Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-muted/50 border border-border/70 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Tier</span>
            <Sparkles className="h-3 w-3 text-amber-500" />
          </div>
          <p className="text-xs font-bold text-foreground capitalize">{customer.customer_group}</p>
        </div>

        <div className="bg-muted/50 border border-border/70 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</span>
            <ShoppingBag className="h-3 w-3 text-[#74A09F]" />
          </div>
          <p className="text-xs font-bold text-foreground">{customer.total_orders} Completed</p>
        </div>

        <div className="bg-muted/50 border border-border/70 rounded-xl p-3 col-span-2 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Lifetime Spend</span>
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-foreground">
            {formatCurrency(customer.lifetime_spend ?? 0)}
          </p>
        </div>
      </div>

      {/* Store Credit Wallet Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Wallet className="h-3.5 w-3.5" />
            </div>
            <span className="text-2xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Store Credit Balance
            </span>
          </div>
          <span className="text-2xs font-semibold text-amber-700/80 dark:text-amber-400/80">Active</span>
        </div>

        <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight my-1">
          {formatCurrency(balance ?? 0)}
        </p>

        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-amber-500/20">
          <button
            onClick={() => openAction('credit')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Credit</span>
          </button>
          <button
            onClick={() => openAction('debit')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-card hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
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
              className="w-full bg-muted/50 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Note / Reason</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Compensation for late delivery"
              className="w-full bg-muted/50 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 outline-none transition-all"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

