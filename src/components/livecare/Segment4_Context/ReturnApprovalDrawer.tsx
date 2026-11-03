// ─── SP3-04 / SP3-05: Returns & Approvals ───────────────────────────────────
// Multi-item return form with threshold-based approval (> QAR 200 requires an
// Operations Manager). Regular agents see a pending badge; managers can approve.

import { useState } from 'react';
import { clsx } from 'clsx';
import { RefreshCw, ShieldAlert, Check, X, AlertTriangle } from 'lucide-react';
import { createReturn } from '../../../api/returnsApi';
import { useCareStore } from '../../../store/useCareStore';
import { formatCurrency } from '../../../utils/currencyFormatter';
import type {
  CustomerContext,
  SalesOrderSummary,
  ReturnReason,
  ReturnDisposition,
  ReturnResponse,
} from '../../../types/care';

const REASONS: { value: ReturnReason; label: string }[] = [
  { value: 'damaged', label: 'Damaged' },
  { value: 'wrong_item', label: 'Wrong Item' },
  { value: 'customer_cancellation', label: 'Cancellation' },
];

const DISPOSITIONS: { value: ReturnDisposition; label: string }[] = [
  { value: 'wallet_credit', label: 'Wallet Credit' },
  { value: 'replacement', label: 'Replacement' },
  { value: 'gateway_refund', label: 'Gateway Refund' },
];

interface SelectedItem {
  item_code: string;
  item_name: string;
  qty: number;
  rate: number;
}

interface ReturnApprovalDrawerProps {
  customer: CustomerContext;
  orders: SalesOrderSummary[];
}

export function ReturnApprovalDrawer({ customer, orders }: ReturnApprovalDrawerProps) {
  const userRole = useCareStore((s) => s.userRole);
  const [orderId, setOrderId] = useState(orders[0]?.name ?? '');
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [reason, setReason] = useState<ReturnReason>('damaged');
  const [disposition, setDisposition] = useState<ReturnDisposition>('wallet_credit');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReturnResponse | null>(null);

  const order = orders.find((o) => o.name === orderId);

  const toggleItem = (item: SalesOrderSummary['items'][number]) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.item_code === item.item_code);
      if (existing) return prev.filter((s) => s.item_code !== item.item_code);
      return [
        ...prev,
        { item_code: item.item_code, item_name: item.item_name, qty: 1, rate: item.rate },
      ];
    });
  };

  const setQty = (itemCode: string, qty: number) => {
    setSelected((prev) => prev.map((s) => (s.item_code === itemCode ? { ...s, qty } : s)));
  };

  const total = selected.reduce((sum, s) => sum + s.qty * s.rate, 0);

  const handleSubmit = async () => {
    if (selected.length === 0 || !order) return;
    setSubmitting(true);
    const response = await createReturn({
      order_id: order.name,
      customer_phone: customer.phone,
      items: selected.map((s) => ({ item_code: s.item_code, qty: s.qty, rate: s.rate })),
      total_refund_amount: total,
      reason,
      disposition,
      notes,
    });
    setResult(response);
    setSubmitting(false);
  };

  const reset = () => {
    setResult(null);
    setSelected([]);
    setNotes('');
  };

  return (
    <div className="p-4 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <RefreshCw className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
          Returns & Replacements
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-muted/40 rounded-xl p-4 text-center border border-dashed border-border">
          <p className="text-xs text-muted-foreground">No orders available for return.</p>
        </div>
      ) : result ? (
        <ResultView result={result} isManager={userRole === 'operations_manager'} onReset={reset} />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Select Order</label>
            <select
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setSelected([]);
              }}
              className="w-full bg-muted/40 rounded-xl px-3.5 py-2.5 text-xs font-medium text-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 outline-none transition-all cursor-pointer"
            >
              {orders.map((o) => (
                <option key={o.name} value={o.name}>
                  {o.name} — {formatCurrency(o.grand_total)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Select Items</label>
            {order ? (
              <div className="space-y-2">
                {order.items.map((item) => {
                  const isSelected = selected.some((s) => s.item_code === item.item_code);
                  const sel = selected.find((s) => s.item_code === item.item_code);
                  return (
                    <div
                      key={item.item_code}
                      className={clsx(
                        'rounded-xl border p-3 transition-all',
                        isSelected
                          ? 'border-[#74A09F] bg-[#74A09F]/5 shadow-2xs'
                          : 'border-border bg-card/60 hover:bg-muted/30',
                      )}
                    >
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItem(item)}
                          className="mt-0.5 accent-[#74A09F]"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block text-xs font-semibold text-foreground">{item.item_name}</span>
                          <span className="block text-2xs text-muted-foreground font-mono mt-0.5">
                            {item.item_code} · {formatCurrency(item.rate)}
                          </span>
                        </span>
                        {isSelected && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-2xs text-muted-foreground">Qty:</span>
                            <input
                              type="number"
                              min={1}
                              max={item.qty}
                              value={sel?.qty ?? 1}
                              onChange={(e) =>
                                setQty(
                                  item.item_code,
                                  Math.max(1, Math.min(item.qty, Number(e.target.value) || 1)),
                                )
                              }
                              className="w-12 bg-muted/70 rounded-lg px-1.5 py-1 text-xs font-bold text-foreground text-center border border-border outline-none focus:border-[#74A09F]"
                            />
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No order selected</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Return Reason</label>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                    reason === r.value
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-semibold'
                      : 'text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Resolution</label>
            <div className="flex flex-wrap gap-2">
              {DISPOSITIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDisposition(d.value)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                    disposition === d.value
                      ? 'bg-[#74A09F]/15 text-[#74A09F] border-[#74A09F]/30 font-semibold'
                      : 'text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Provide reason or condition details..."
              className="w-full bg-muted/40 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 outline-none resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-xs font-medium text-muted-foreground">Total Refund Amount</span>
            <span className="text-base font-bold text-foreground">{formatCurrency(total)}</span>
          </div>

          {total > 200 && (
            <p className="flex items-center gap-1.5 text-2xs text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Exceeds QAR 200 — requires Operations Manager approval.
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={selected.length === 0 || submitting}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {submitting ? 'Submitting…' : 'Submit Return Request'}
          </button>
        </div>
      )}
    </div>
  );
}

function ResultView({
  result,
  isManager,
  onReset,
}: {
  result: ReturnResponse;
  isManager: boolean;
  onReset: () => void;
}) {
  const [approval, setApproval] = useState<'approved' | 'rejected' | null>(null);

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          'rounded-xl border p-4 shadow-xs',
          result.auto_approved
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : 'border-amber-500/30 bg-amber-500/10',
        )}
      >
        <div className="flex items-center gap-2 mb-1.5">
          {result.auto_approved ? (
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          )}
          <span
            className={clsx(
              'text-xs font-bold',
              result.auto_approved
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-amber-700 dark:text-amber-300',
            )}
          >
            {result.auto_approved ? 'Return Auto-Approved' : 'Pending Operations Approval'}
          </span>
        </div>
        <p className="text-2xs text-muted-foreground font-mono mb-2">{result.return_request_id}</p>
        <p className="text-xs text-foreground/90 leading-relaxed">{result.message}</p>
      </div>

      {!result.auto_approved &&
        (approval ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 shadow-2xs">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {approval === 'approved' ? 'Return approved — credit issued.' : 'Return request rejected.'}
            </p>
          </div>
        ) : isManager ? (
          <div className="rounded-xl border border-amber-500/30 bg-card p-3.5 shadow-xs">
            <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Operations Manager Action Required
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setApproval('rejected')}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-card hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
              <button
                onClick={() => setApproval('approved')}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Approve & Credit
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-2xs font-medium text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              Pending Operations Manager Approval
            </p>
          </div>
        ))}

      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold border border-border transition-all cursor-pointer"
      >
        New Return Request
      </button>
    </div>
  );
}

