// ─── ERPNext Wallet & Store Credit API ──────────────────────────────────────
// Store-credit balance fetch and credit/debit adjustments.
// Toggles between mock data and the live ERPNext wallet service via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import { MOCK_CUSTOMER_BUNDLES } from '../mocks';

function findBundle(customerId: string) {
  return Object.values(MOCK_CUSTOMER_BUNDLES).find((b) => b.customer.id === customerId);
}

export async function getWalletBalance(customerId: string): Promise<number> {
  if (shouldUseMock('wallet')) {
    return findBundle(customerId)?.customer.wallet_balance_qar ?? 0;
  }

  try {
    const { data } = await apiClient.get<{ balance: number }>(
      `/erp/customers/${customerId}/wallet`,
    );
    return data.balance;
  } catch {
    return findBundle(customerId)?.customer.wallet_balance_qar ?? 0;
  }
}

export async function adjustWallet(
  customerId: string,
  delta: number,
  note: string,
): Promise<number> {
  if (shouldUseMock('wallet')) {
    const bundle = findBundle(customerId);
    if (bundle) {
      bundle.customer.wallet_balance_qar = Math.max(0, bundle.customer.wallet_balance_qar + delta);
      return bundle.customer.wallet_balance_qar;
    }
    return Math.max(0, delta);
  }

  const endpoint =
    delta > 0
      ? `/erp/customers/${customerId}/wallet/credit`
      : `/erp/customers/${customerId}/wallet/debit`;

  try {
    const { data } = await apiClient.post<{ balance: number }>(endpoint, {
      amount: Math.abs(delta),
      note,
    });
    return data.balance;
  } catch {
    const bundle = findBundle(customerId);
    return Math.max(0, (bundle?.customer.wallet_balance_qar ?? 0) + delta);
  }
}
