// ─── ERPNext-specific type definitions ──────────────────────────────────────

export interface ERPNextCustomer {
  name: string;
  customer_name: string;
  customer_group: string;
  territory: string;
  mobile_no: string;
  email_id?: string;
  outstanding_amount: number;
  total_unpaid: number;
}

export interface ERPNextWalletEntry {
  name: string;
  posting_date: string;
  party: string;
  debit: number;
  credit: number;
  balance: number;
  remarks?: string;
  voucher_type: string;
  voucher_no: string;
}

export interface ERPNextItem {
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  image?: string;
  requires_installation: boolean;
  standard_rate: number;
  warehouse_balances: {
    warehouse: string;
    actual_qty: number;
    projected_qty: number;
  }[];
}

export interface ERPNextDeliveryNote {
  name: string;
  posting_date: string;
  customer: string;
  grand_total: number;
  status: 'Draft' | 'To Bill' | 'Completed' | 'Cancelled';
  transporter_name?: string;
  driver_name?: string;
  vehicle_no?: string;
  items: {
    item_code: string;
    item_name: string;
    qty: number;
    rate: number;
    amount: number;
  }[];
}
