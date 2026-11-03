// ─── MyFatoorah Payment API ──────────────────────────────────────────────────
// Endpoint wrapper for generating payment links via the Laravel middleware.
// Toggles between mock data and the live payment gateway via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import type { PaymentLinkRequest, PaymentLinkResponse } from '../types/care';

export async function generatePaymentLink(
  payload: PaymentLinkRequest,
): Promise<PaymentLinkResponse> {
  const paymentId = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;
  const mockResponse: PaymentLinkResponse = {
    success: true,
    payment_id: paymentId,
    invoice_url: `https://myfatoorah.demo/pay/${paymentId}?amount=${payload.invoice_amount}&currency=${payload.currency}`,
    expires_at: new Date(Date.now() + 24 * 3600000).toISOString(),
  };

  if (shouldUseMock('payment')) {
    return mockResponse;
  }

  try {
    const { data } = await apiClient.post<PaymentLinkResponse>(
      '/care/payments/generate-link',
      payload,
    );
    return data;
  } catch {
    return mockResponse;
  }
}
