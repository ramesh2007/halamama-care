// ─── Dashboard API ────────────────────────────────────────────────────────────
// Fetches high-level Care metrics, agent workload stats, activity logs, and queue depth.
// Toggles between mock data and the live Care dashboard service via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import {
  MOCK_DASHBOARD_METRICS,
  MOCK_AGENT_PERFORMANCE,
  MOCK_ACTIVITY_FEED,
  MOCK_QUEUE_DEPTH,
  MOCK_BREACHED_THREADS,
  type AgentPerformanceItem,
  type ActivityFeedItem,
  type QueueDepthItem,
  type BreachedThreadItem,
} from '../mocks';
import type { DashboardMetrics } from '../types/care';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (shouldUseMock('dashboard')) {
    return MOCK_DASHBOARD_METRICS;
  }

  try {
    const { data } = await apiClient.get<DashboardMetrics>('/care/dashboard/metrics');
    return data;
  } catch (err) {
    console.warn('[dashboardApi] Failed to fetch live metrics, falling back to mock', err);
    return MOCK_DASHBOARD_METRICS;
  }
}

export async function getAgentPerformance(): Promise<AgentPerformanceItem[]> {
  if (shouldUseMock('dashboard')) {
    return MOCK_AGENT_PERFORMANCE;
  }

  try {
    const { data } = await apiClient.get<AgentPerformanceItem[]>('/care/dashboard/agents');
    return data;
  } catch (err) {
    console.warn('[dashboardApi] Failed to fetch agent performance, falling back to mock', err);
    return MOCK_AGENT_PERFORMANCE;
  }
}

export async function getActivityFeed(): Promise<ActivityFeedItem[]> {
  if (shouldUseMock('dashboard')) {
    return MOCK_ACTIVITY_FEED;
  }

  try {
    const { data } = await apiClient.get<ActivityFeedItem[]>('/care/dashboard/activity');
    return data;
  } catch (err) {
    console.warn('[dashboardApi] Failed to fetch activity feed, falling back to mock', err);
    return MOCK_ACTIVITY_FEED;
  }
}

export async function getQueueDepth(): Promise<QueueDepthItem[]> {
  if (shouldUseMock('dashboard')) {
    return MOCK_QUEUE_DEPTH;
  }

  try {
    const { data } = await apiClient.get<QueueDepthItem[]>('/care/dashboard/queue-depth');
    return data;
  } catch (err) {
    console.warn('[dashboardApi] Failed to fetch queue depth, falling back to mock', err);
    return MOCK_QUEUE_DEPTH;
  }
}

export async function getBreachedThreads(): Promise<BreachedThreadItem[]> {
  if (shouldUseMock('dashboard')) {
    return MOCK_BREACHED_THREADS;
  }

  try {
    const { data } = await apiClient.get<BreachedThreadItem[]>('/care/dashboard/sla-breaches');
    return data;
  } catch (err) {
    console.warn('[dashboardApi] Failed to fetch breached threads, falling back to mock', err);
    return MOCK_BREACHED_THREADS;
  }
}
