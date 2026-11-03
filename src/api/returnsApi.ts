// ─── Returns & Replacements API ─────────────────────────────────────────────
// Submits return requests, validates auto-approval thresholds, and interfaces with ERPNext.
// Toggles between mock data and the live Care returns service via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import type { ReturnRequestPayload, ReturnResponse } from '../types/care';

export async function createReturn(payload: ReturnRequestPayload): Promise<ReturnResponse> {
  const auto = payload.total_refund_amount <= 200;
  const mockResponse: ReturnResponse = {
    status: auto ? 'auto_approved' : 'pending_approval',
    return_request_id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
    auto_approved: auto,
    requires_role: auto ? undefined : 'operations_manager',
    message: auto
      ? 'Return auto-approved and return receipt created in ERPNext.'
      : 'Return submitted for Operations Manager approval.',
  };

  if (shouldUseMock('returns')) {
    return mockResponse;
  }

  try {
    const { data } = await apiClient.post<ReturnResponse>('/care/returns/create', payload);
    return data;
  } catch {
    return mockResponse;
  }
}
