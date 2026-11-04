// ─── Segment 4: Context Drawer ──────────────────────────────────────────────
// Tabbed container for the Customer 360, Returns, and OMS Installation
// workspaces, fed by the active thread's customer bundle.

import { useState } from 'react';
import { clsx } from 'clsx';
import { User, RefreshCw, Calendar, Wrench, CheckCircle2 } from 'lucide-react';
import { useCareStore } from '../../../store/useCareStore';
import { useCustomerBundle } from '../../../hooks/api';
import { CustomerWalletCard } from './CustomerWalletCard';
import { OrderHistoryAccordion } from './OrderHistoryAccordion';
import { ERPStockLookup } from './ERPStockLookup';
import { ReturnApprovalDrawer } from './ReturnApprovalDrawer';
import { InstallationSchedulerModal } from './InstallationSchedulerModal';
import type { SalesOrderSummary } from '../../../types/care';

type DrawerTab = 'context' | 'returns' | 'oms';

const TABS: { id: DrawerTab; label: string; icon: React.ReactNode }[] = [
  { id: 'context', label: 'Context', icon: <User className="h-3.5 w-3.5" /> },
  { id: 'returns', label: 'Returns', icon: <RefreshCw className="h-3.5 w-3.5" /> },
  { id: 'oms', label: 'OMS Slots', icon: <Calendar className="h-3.5 w-3.5" /> },
];

export function ContextDrawer() {
  const selectedThreadId = useCareStore((s) => s.selectedThreadId);
  const threads = useCareStore((s) => s.threads);
  const [tab, setTab] = useState<DrawerTab>('context');
  const [schedulingOrder, setSchedulingOrder] = useState<SalesOrderSummary | null>(null);

  const thread = threads.find((t) => t.id === selectedThreadId);
  const { data: bundle } = useCustomerBundle(thread);

  if (!selectedThreadId || !thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-4 text-primary shadow-xs">
          <User className="h-7 w-7" strokeWidth={2} />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">Customer Context</p>
        <p className="text-xs text-muted-foreground max-w-[220px]">
          Select an active conversation to view 360° profile, wallet, and orders.
        </p>
      </div>
    );
  }

  const customer = bundle?.customer || {
    id: `cust-${thread.id}`,
    customer_name: thread.customer_name,
    phone: thread.customer_phone,
    wallet_balance_qar: 0,
    total_orders: 0,
    customer_group: 'Retail',
    lifetime_spend: 0,
  };
  const orders = bundle?.orders || [];
  const installableOrders = orders.filter((o) => o.items.some((i) => i.requires_installation));

  return (
    <div className="flex flex-col">
      {/* Segmented Header Tabs */}
      <div className="p-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                tab === t.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
              )}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'context' && (
        <div className="divide-y divide-border">
          <CustomerWalletCard customer={customer} />
          <OrderHistoryAccordion orders={orders} />
          <ERPStockLookup />
        </div>
      )}

      {tab === 'returns' && <ReturnApprovalDrawer customer={customer} orders={orders} />}

      {tab === 'oms' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Wrench className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Installation Scheduling
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-muted text-muted-foreground border border-border/60">
              {installableOrders.length} Available
            </span>
          </div>

          {installableOrders.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center shadow-xs">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground mb-0.5">No Installation Required</p>
              <p className="text-2xs text-muted-foreground">None of the customer's items require technician scheduling.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {installableOrders.map((order) => (
                <div key={order.name} className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-primary">{order.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-info/10 text-info border border-info/20">
                      {order.delivery_status}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 mb-3 font-medium">
                    {order.items
                      .filter((i) => i.requires_installation)
                      .map((i) => i.item_name)
                      .join(', ')}
                  </p>
                  <button
                    onClick={() => setSchedulingOrder(order)}
                    className="w-full h-8 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Book Technician Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <InstallationSchedulerModal
        order={schedulingOrder}
        customerPhone={customer.phone}
        isOpen={schedulingOrder !== null}
        onClose={() => setSchedulingOrder(null)}
      />
    </div>
  );
}

