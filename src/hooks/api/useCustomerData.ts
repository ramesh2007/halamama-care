// ─── React Query Hooks: Customer 360 ────────────────────────────────────────

import { useQuery } from '@tanstack/react-query';
import { getCustomerBundle, getCustomerOrders } from '../../api/customersApi';
import type { ConversationThread } from '../../types/care';

export function useCustomerBundle(thread?: ConversationThread, customerId?: string) {
  const queryKeyId = thread?.id || customerId || 'default';

  return useQuery({
    queryKey: ['customers', 'bundle', queryKeyId],
    queryFn: () => getCustomerBundle(thread, customerId),
    enabled: Boolean(thread || customerId),
    staleTime: 60 * 1000,
  });
}

export function useCustomerOrders(customerId?: string) {
  return useQuery({
    queryKey: ['customers', 'orders', customerId],
    queryFn: () => (customerId ? getCustomerOrders(customerId) : Promise.resolve([])),
    enabled: Boolean(customerId),
    staleTime: 60 * 1000,
  });
}
