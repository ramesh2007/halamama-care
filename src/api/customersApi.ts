// ─── Customer 360 & Orders API ──────────────────────────────────────────────
// Fetches ERPNext customer context, lifetime order value, wallet balance, and sales orders.
// Toggles between mock data and the live ERPNext connector via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import {
  MOCK_CUSTOMER_BUNDLES,
  getCustomerBundle as getMockCustomerBundle,
  type CustomerBundle,
} from '../mocks';
import type { ConversationThread, SalesOrderSummary } from '../types/care';

export async function getCustomerBundle(
  thread?: ConversationThread,
  customerId?: string,
): Promise<CustomerBundle> {
  if (shouldUseMock('customers')) {
    if (thread) {
      return getMockCustomerBundle(thread);
    }
    if (customerId) {
      const match = Object.values(MOCK_CUSTOMER_BUNDLES).find((b) => b.customer.id === customerId);
      if (match) return match;
    }
    return getMockCustomerBundle();
  }

  const lookupId = customerId || thread?.id;
  try {
    const { data } = await apiClient.get<CustomerBundle>(`/erp/customers/${lookupId}/bundle`);
    return data;
  } catch (err) {
    console.warn(`[customersApi] Failed to fetch customer bundle for ${lookupId}, falling back to mock`, err);
    return getMockCustomerBundle(thread);
  }
}

export async function getCustomerOrders(customerId: string): Promise<SalesOrderSummary[]> {
  if (shouldUseMock('customers')) {
    const match = Object.values(MOCK_CUSTOMER_BUNDLES).find((b) => b.customer.id === customerId);
    return match ? match.orders : [];
  }

  try {
    const { data } = await apiClient.get<SalesOrderSummary[]>(`/erp/customers/${customerId}/orders`);
    return data;
  } catch (err) {
    console.warn(`[customersApi] Failed to fetch orders for ${customerId}, falling back to mock`, err);
    const match = Object.values(MOCK_CUSTOMER_BUNDLES).find((b) => b.customer.id === customerId);
    return match ? match.orders : [];
  }
}
