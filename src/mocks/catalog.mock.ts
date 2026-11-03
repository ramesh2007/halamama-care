// ─── ERPNext Catalog & Stock Mock Data ──────────────────────────────────────

import type { StockBalance } from '../types/care';

export const MOCK_STOCK: StockBalance[] = [
  {
    item_code: 'HM-9021',
    item_name: 'Rattan Lounge Chair',
    warehouses: [
      { warehouse_name: 'Main WH', actual_qty: 12 },
      { warehouse_name: 'Bay WH', actual_qty: 5 },
      { warehouse_name: 'Transit', actual_qty: 3 },
    ],
  },
  {
    item_code: 'FUR-CHR-01',
    item_name: 'Upholstered Dining Chair',
    warehouses: [
      { warehouse_name: 'Bay WH', actual_qty: 4 },
      { warehouse_name: 'Main WH', actual_qty: 20 },
    ],
  },
  {
    item_code: 'WD-DT-06',
    item_name: 'Wooden Dining Table 6-Seater',
    warehouses: [
      { warehouse_name: 'Main WH', actual_qty: 2 },
      { warehouse_name: 'Bay WH', actual_qty: 1 },
    ],
  },
  {
    item_code: 'WDR-04D',
    item_name: 'Wardrobe 4-Door (Walnut)',
    warehouses: [{ warehouse_name: 'Main WH', actual_qty: 3 }],
  },
  {
    item_code: 'SOF-VLV-03',
    item_name: 'Velvet Sofa 3-Seater',
    warehouses: [
      { warehouse_name: 'Bay WH', actual_qty: 1 },
      { warehouse_name: 'Transit', actual_qty: 2 },
    ],
  },
];
