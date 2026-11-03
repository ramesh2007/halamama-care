// ─── Dashboard Metrics & Performance Mock Data ──────────────────────────────

import type { DashboardMetrics } from '../types/care';

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  active_chats: 24,
  sla_breaches: 3,
  returns_in_review: 7,
  installation_backlog: 12,
  unassigned_pool: 5,
  first_response_avg_minutes: 4.2,
};

export interface AgentPerformanceItem {
  name: string;
  active: number;
  resolved: number;
  first_response: string;
  sla_breaches: number;
}

export const MOCK_AGENT_PERFORMANCE: AgentPerformanceItem[] = [
  { name: 'Jishu M.', active: 8, resolved: 32, first_response: '2m 40s', sla_breaches: 0 },
  { name: 'Sara K.', active: 6, resolved: 27, first_response: '3m 10s', sla_breaches: 1 },
  { name: 'Ahmed R.', active: 5, resolved: 21, first_response: '4m 05s', sla_breaches: 2 },
  { name: 'Noura J.', active: 5, resolved: 18, first_response: '5m 30s', sla_breaches: 0 },
];

export interface ActivityFeedItem {
  id: string;
  agent: string;
  action: string;
  time: string;
}

export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  { id: 'act-1', agent: 'Sara K.', action: 'resolved thread with Mohammed Rahman', time: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: 'act-2', agent: 'Jishu M.', action: 'reassigned installation ticket to Ahmed R.', time: new Date(Date.now() - 9 * 60000).toISOString() },
  { id: 'act-3', agent: 'Ahmed R.', action: 'approved return #RET-4091 (QAR 450)', time: new Date(Date.now() - 16 * 60000).toISOString() },
  { id: 'act-4', agent: 'Noura J.', action: 'sent payment link to Youssef Al-Ali', time: new Date(Date.now() - 24 * 60000).toISOString() },
];

export interface QueueDepthItem {
  department: string;
  count: number;
}

export const MOCK_QUEUE_DEPTH: QueueDepthItem[] = [
  { department: 'General', count: 9 },
  { department: 'Returns', count: 7 },
  { department: 'Operations', count: 4 },
  { department: 'Installation', count: 3 },
  { department: 'Sales', count: 1 },
];

export interface BreachedThreadItem {
  customer: string;
  channel: string;
  exceeded: string;
}

export const MOCK_BREACHED_THREADS: BreachedThreadItem[] = [
  { customer: 'Mohammed Rahman', channel: 'Instagram', exceeded: '12m overdue' },
  { customer: 'Khalid Nasser', channel: 'WhatsApp', exceeded: '8m overdue' },
  { customer: 'Sara Al-Mahmoud', channel: 'Instagram', exceeded: '3m overdue' },
];
