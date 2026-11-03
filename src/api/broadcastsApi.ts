// ─── Broadcast Campaigns & Templates API ────────────────────────────────────
// Manages Meta WhatsApp broadcast marketing/utility campaigns and message templates.
// Toggles between mock data and the live Care broadcasts backend via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import { MOCK_BROADCASTS, MOCK_BROADCAST_TEMPLATES } from '../mocks';
import type { BroadcastCampaign, BroadcastTemplate } from '../types/care';

export async function getBroadcasts(): Promise<BroadcastCampaign[]> {
  if (shouldUseMock('broadcasts')) {
    return MOCK_BROADCASTS;
  }

  try {
    const { data } = await apiClient.get<BroadcastCampaign[]>('/care/broadcasts');
    return data;
  } catch (err) {
    console.warn('[broadcastsApi] Failed to fetch live broadcasts, falling back to mock', err);
    return MOCK_BROADCASTS;
  }
}

export async function getBroadcastTemplates(): Promise<BroadcastTemplate[]> {
  if (shouldUseMock('broadcasts')) {
    return MOCK_BROADCAST_TEMPLATES;
  }

  try {
    const { data } = await apiClient.get<BroadcastTemplate[]>('/care/broadcasts/templates');
    return data;
  } catch (err) {
    console.warn('[broadcastsApi] Failed to fetch broadcast templates, falling back to mock', err);
    return MOCK_BROADCAST_TEMPLATES;
  }
}

export async function createBroadcastCampaign(payload: {
  name: string;
  template_id: string;
  template_name: string;
  audience_criteria: string[];
  variables: Record<string, string>;
}): Promise<BroadcastCampaign> {
  const newCampaign: BroadcastCampaign = {
    id: `bc-${Date.now()}`,
    name: payload.name,
    template_name: payload.template_name,
    audience_size: 150 + Math.floor(Math.random() * 500),
    delivery_rate: 0,
    read_rate: 0,
    failed_count: 0,
    status: 'scheduled',
    scheduled_at: new Date(Date.now() + 3600000).toISOString(),
  };

  if (shouldUseMock('broadcasts')) {
    MOCK_BROADCASTS.unshift(newCampaign);
    return newCampaign;
  }

  try {
    const { data } = await apiClient.post<BroadcastCampaign>('/care/broadcasts', payload);
    return data;
  } catch {
    return newCampaign;
  }
}
