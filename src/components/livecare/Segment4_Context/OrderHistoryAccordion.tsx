// ─── SP3-02: OMS Order Lifecycle ────────────────────────────────────────────
// Collapsible order cards with a delivery step tracker, driver info, items,
// and quick actions.

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  ChevronDown,
  Package,
  Truck,
  ArrowUpRight,
  Download,
  Ticket,
  Check,
} from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyFormatter';
import type { SalesOrderSummary, DeliveryStatus } from '../../../types/care';

const DELIVERY_STEPS: DeliveryStatus[] = [
  'Picked',
  'Packed',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

interface OrderHistoryAccordionProps {
  orders: SalesOrderSummary[];
}

function getStatusBadge(status: DeliveryStatus) {
  switch (status) {
    case 'Delivered':
      return 'bg-success/10 text-success border-success/20';
    case 'Out for Delivery':
    case 'In Transit':
      return 'bg-info/10 text-info border-info/20';
    case 'Packed':
    case 'Picked':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

export function OrderHistoryAccordion({ orders }: OrderHistoryAccordionProps) {
  const [open, setOpen] = useState<string | null>(orders[0]?.name ?? null);

  return (
    <div className="p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
            <Package className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Order History
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-muted/40 rounded-xl p-4 text-center border border-dashed border-border">
          <p className="text-xs text-muted-foreground">No orders found for this customer.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {orders.map((order) => {
            const isOpen = open === order.name;
            const stepIndex = Math.max(0, DELIVERY_STEPS.indexOf(order.delivery_status));
            const progress = (stepIndex / (DELIVERY_STEPS.length - 1)) * 100;

            return (
              <div
                key={order.name}
                className={clsx(
                  'rounded-xl border transition-all overflow-hidden',
                  isOpen
                    ? 'border-primary/40 bg-card shadow-xs'
                    : 'border-border bg-card hover:border-border/80 shadow-2xs',
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : order.name)}
                  className="w-full flex items-center justify-between px-3.5 py-3 text-left transition-colors cursor-pointer hover:bg-muted/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-primary">{order.name}</span>
                    <span className="text-xs font-bold text-foreground font-mono">
                      {formatCurrency(order.grand_total)}
                    </span>
                    <span
                      className={clsx(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold border hidden sm:inline-flex',
                        getStatusBadge(order.delivery_status),
                      )}
                    >
                      {order.delivery_status}
                    </span>
                  </div>
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 text-muted-foreground transition-transform shrink-0',
                      isOpen && 'rotate-180 text-foreground',
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-border space-y-3.5">
                    {/* Stepper Progress Bar */}
                    <div className="pt-2">
                      <div className="relative mb-2">
                        <div className="absolute top-[6px] left-[8px] right-[8px] h-1 bg-muted rounded-full" />
                        <div
                          className="absolute top-[6px] left-[8px] h-1 bg-primary rounded-full transition-all duration-300"
                          style={{ width: `calc(${progress}% - 8px)` }}
                        />
                        <div className="relative flex justify-between">
                          {DELIVERY_STEPS.map((step, idx) => {
                            const isPassed = idx < stepIndex;
                            const isCurrent = idx === stepIndex;

                            return (
                              <div key={step} className="flex flex-col items-center">
                                <div
                                  className={clsx(
                                    'h-3.5 w-3.5 rounded-full flex items-center justify-center transition-all',
                                    isPassed && 'bg-primary text-primary-foreground',
                                    isCurrent && 'bg-primary ring-4 ring-primary/20 text-primary-foreground',
                                    !isPassed && !isCurrent && 'bg-muted border border-border',
                                  )}
                                >
                                  {isPassed && <Check className="h-2 w-2 stroke-[3]" />}
                                  {isCurrent && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                                </div>
                                <span
                                  className={clsx(
                                    'text-[10px] mt-1.5 text-center leading-tight font-medium',
                                    isCurrent ? 'text-primary font-bold' : 'text-muted-foreground',
                                  )}
                                >
                                  {step.split(' ')[0]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Driver details badge */}
                    {order.driver_name && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/60 border border-border/70 text-xs">
                        <div className="h-6 w-6 rounded-lg bg-info/10 flex items-center justify-center text-info shrink-0">
                          <Truck className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            Driver: {order.driver_name}
                          </p>
                          <p className="text-2xs text-muted-foreground truncate">
                            Vehicle #{order.vehicle_number || 'N/A'} • In Transit Area
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Line Items */}
                    <div className="rounded-xl bg-muted/40 p-2.5 border border-border/60 space-y-2">
                      <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Items ({order.items.length})
                      </p>
                      <div className="space-y-1.5">
                        {order.items.map((item) => (
                          <div
                            key={item.item_code}
                            className="flex items-center justify-between text-xs gap-2"
                          >
                            <span className="text-foreground font-medium truncate">
                              <span className="font-bold text-primary font-mono">{item.qty}x</span> {item.item_name}
                            </span>
                            <span className="text-2xs text-muted-foreground font-mono shrink-0">
                              {item.item_code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Order Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>View in OMS</span>
                      </button>
                      <div className="flex items-center gap-3">
                        <button className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                          <Download className="h-3.5 w-3.5" />
                          <span>Invoice</span>
                        </button>
                        <button className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                          <Ticket className="h-3.5 w-3.5" />
                          <span>Ticket</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

