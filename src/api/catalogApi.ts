// ─── ERPNext Catalog & Stock API ───────────────────────────────────────────
// Looks up warehouse inventory balances and product details.
// Toggles between mock data and the live ERPNext stock service via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import { MOCK_STOCK } from '../mocks';
import type { StockBalance } from '../types/care';

export async function lookupStock(itemCode: string): Promise<StockBalance | null> {
  if (shouldUseMock('catalog')) {
    const match = MOCK_STOCK.find(
      (s) => s.item_code.toLowerCase() === itemCode.toLowerCase(),
    );
    return match || null;
  }

  try {
    const { data } = await apiClient.get<StockBalance>(
      `/erp/stock/${encodeURIComponent(itemCode)}`,
    );
    return data;
  } catch {
    const match = MOCK_STOCK.find(
      (s) => s.item_code.toLowerCase() === itemCode.toLowerCase(),
    );
    return match || null;
  }
}

export async function getAllStock(): Promise<StockBalance[]> {
  if (shouldUseMock('catalog')) {
    return MOCK_STOCK;
  }

  try {
    const { data } = await apiClient.get<StockBalance[]>('/erp/stock');
    return data;
  } catch {
    return MOCK_STOCK;
  }
}
