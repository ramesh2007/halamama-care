// ─── React Query Hooks: Dashboard ───────────────────────────────────────────

import { useQuery } from '@tanstack/react-query';
import {
  getDashboardMetrics,
  getAgentPerformance,
  getActivityFeed,
  getQueueDepth,
  getBreachedThreads,
} from '../../api/dashboardApi';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: getDashboardMetrics,
    staleTime: 30 * 1000,
  });
}

export function useAgentPerformance() {
  return useQuery({
    queryKey: ['dashboard', 'agent-performance'],
    queryFn: getAgentPerformance,
    staleTime: 60 * 1000,
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: ['dashboard', 'activity-feed'],
    queryFn: getActivityFeed,
    staleTime: 30 * 1000,
  });
}

export function useQueueDepth() {
  return useQuery({
    queryKey: ['dashboard', 'queue-depth'],
    queryFn: getQueueDepth,
    staleTime: 30 * 1000,
  });
}

export function useBreachedThreads() {
  return useQuery({
    queryKey: ['dashboard', 'breached-threads'],
    queryFn: getBreachedThreads,
    staleTime: 30 * 1000,
  });
}
