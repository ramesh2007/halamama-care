// ─── Broadcast Campaigns & Templates Mock Data ──────────────────────────────

import type { BroadcastCampaign, BroadcastTemplate } from '../types/care';

export const MOCK_BROADCAST_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Order Confirmation',
    category: 'Utility',
    status: 'approved',
    body: 'Dear {{1}}, your order {{2}} has been confirmed and will be delivered within {{3}} business days.',
    variables: ['{{1}}', '{{2}}', '{{3}}'],
  },
  {
    id: 'tpl-2',
    name: 'Delivery Update',
    category: 'Utility',
    status: 'approved',
    body: 'Hello {{1}}, your order {{2}} is now {{3}}. Track it here: {{4}}',
    variables: ['{{1}}', '{{2}}', '{{3}}', '{{4}}'],
  },
  {
    id: 'tpl-3',
    name: 'Winter Sale Announcement',
    category: 'Marketing',
    status: 'approved',
    body: 'Exclusive for you, {{1}}! Enjoy up to 40% off this weekend. Visit our showroom or shop online with code {{2}}.',
    variables: ['{{1}}', '{{2}}'],
  },
  {
    id: 'tpl-4',
    name: 'Cart Abandonment Reminder',
    category: 'Marketing',
    status: 'pending',
    body: 'Hi {{1}}, you left something behind! Complete your purchase within 24 hours to get free delivery.',
    variables: ['{{1}}'],
  },
];

export const MOCK_BROADCASTS: BroadcastCampaign[] = [
  {
    id: 'bc-1',
    name: 'Winter Sale Promo',
    template_name: 'Winter Sale Announcement',
    audience_size: 2450,
    delivery_rate: 98,
    read_rate: 72,
    failed_count: 12,
    status: 'completed',
    sent_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'bc-2',
    name: 'Delivery Update — Weekend',
    template_name: 'Delivery Update',
    audience_size: 860,
    delivery_rate: 99,
    read_rate: 88,
    failed_count: 3,
    status: 'completed',
    sent_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'bc-3',
    name: 'VIP Early Access',
    template_name: 'Winter Sale Announcement',
    audience_size: 320,
    delivery_rate: 100,
    read_rate: 91,
    failed_count: 0,
    status: 'scheduled',
    scheduled_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'bc-4',
    name: 'Cart Abandonment Batch 4',
    template_name: 'Cart Abandonment Reminder',
    audience_size: 540,
    delivery_rate: 0,
    read_rate: 0,
    failed_count: 0,
    status: 'draft',
  },
];
