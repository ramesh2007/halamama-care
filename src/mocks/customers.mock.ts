// ─── Customer 360 & Orders Mock Data ────────────────────────────────────────

import type { CustomerContext, SalesOrderSummary, ConversationThread } from '../types/care';

export interface CustomerBundle {
  customer: CustomerContext;
  orders: SalesOrderSummary[];
}

export const MOCK_CUSTOMER_BUNDLES: Record<string, CustomerBundle> = {
  'thread-001': {
    customer: {
      id: 'cust-001',
      customer_name: 'Fatima Al-Kuwari',
      phone: '+974 5512 3456',
      email: 'fatima.k@email.qa',
      wallet_balance_qar: 250,
      total_orders: 6,
      customer_group: 'Retail',
      lifetime_spend: 8450,
    },
    orders: [
      {
        name: 'SO-2026-0881',
        creation_date: '2026-10-01',
        grand_total: 1850,
        fulfillment_status: 'To Deliver and Bill',
        delivery_status: 'Out for Delivery',
        driver_name: 'Naseef',
        driver_phone: '+974 5500 1234',
        vehicle_number: '#12',
        items: [
          { item_code: 'WD-DT-06', item_name: 'Wooden Dining Table 6-Seater', qty: 1, rate: 1250, amount: 1250, warehouse: 'Main WH', requires_installation: true },
          { item_code: 'FUR-CHR-01', item_name: 'Upholstered Dining Chair', qty: 6, rate: 100, amount: 600, warehouse: 'Bay WH', requires_installation: false },
        ],
      },
      {
        name: 'SO-2026-0712',
        creation_date: '2026-09-18',
        grand_total: 3400,
        fulfillment_status: 'Completed',
        delivery_status: 'Delivered',
        driver_name: 'Naseef',
        driver_phone: '+974 5500 1234',
        vehicle_number: '#12',
        items: [
          { item_code: 'SOF-VLV-03', item_name: 'Velvet Sofa 3-Seater', qty: 1, rate: 2900, amount: 2900, warehouse: 'Main WH', requires_installation: true },
          { item_code: 'RUG-PRS-01', item_name: 'Persian Rug 2x3', qty: 1, rate: 500, amount: 500, warehouse: 'Bay WH', requires_installation: false },
        ],
      },
    ],
  },
  'thread-005': {
    customer: {
      id: 'cust-005',
      customer_name: 'Khalid Nasser',
      phone: '+974 7712 3344',
      email: 'khalid.n@email.qa',
      wallet_balance_qar: 0,
      total_orders: 2,
      customer_group: 'Retail',
      lifetime_spend: 5200,
    },
    orders: [
      {
        name: 'SO-2026-0895',
        creation_date: '2026-09-30',
        grand_total: 4900,
        fulfillment_status: 'To Deliver and Bill',
        delivery_status: 'Packed',
        items: [
          { item_code: 'WDR-04D', item_name: 'Wardrobe 4-Door (Walnut)', qty: 1, rate: 4900, amount: 4900, warehouse: 'Main WH', requires_installation: true },
        ],
      },
    ],
  },
  'thread-008': {
    customer: {
      id: 'cust-008',
      customer_name: 'Omar Farouk',
      phone: '+974 5578 9012',
      email: 'omar.f@email.qa',
      wallet_balance_qar: 120,
      total_orders: 4,
      customer_group: 'VIP',
      lifetime_spend: 15800,
    },
    orders: [
      {
        name: 'SO-2026-0912',
        creation_date: '2026-10-02',
        grand_total: 7200,
        fulfillment_status: 'To Deliver and Bill',
        delivery_status: 'In Transit',
        driver_name: 'Naseef',
        driver_phone: '+974 5500 1234',
        vehicle_number: '#12',
        items: [
          { item_code: 'BED-KNG-01', item_name: 'King Bed Frame (Oak)', qty: 1, rate: 5200, amount: 5200, warehouse: 'Main WH', requires_installation: true },
          { item_code: 'MAT-ORT-02', item_name: 'Ortho Mattress King', qty: 1, rate: 2000, amount: 2000, warehouse: 'Main WH', requires_installation: false },
        ],
      },
    ],
  },
};

export function getCustomerBundle(thread?: ConversationThread): CustomerBundle {
  const existing = thread ? MOCK_CUSTOMER_BUNDLES[thread.id] : undefined;
  if (existing) return existing;

  return {
    customer: {
      id: `cust-${thread?.id || 'default'}`,
      customer_name: thread?.customer_name || 'Unknown Customer',
      phone: thread?.customer_phone || '—',
      email: undefined,
      wallet_balance_qar: 0,
      total_orders: 0,
      customer_group: 'Retail',
      lifetime_spend: 0,
    },
    orders: [],
  };
}
