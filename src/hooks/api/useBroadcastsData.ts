// ─── React Query Hooks: Broadcasts ──────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBroadcasts,
  getBroadcastTemplates,
  createBroadcastCampaign,
} from '../../api/broadcastsApi';

export function useBroadcasts() {
  return useQuery({
    queryKey: ['broadcasts', 'campaigns'],
    queryFn: getBroadcasts,
    staleTime: 30 * 1000,
  });
}

export function useBroadcastTemplates() {
  return useQuery({
    queryKey: ['broadcasts', 'templates'],
    queryFn: getBroadcastTemplates,
    staleTime: 60 * 1000,
  });
}

export function useCreateBroadcastCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBroadcastCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['broadcasts', 'campaigns'],
      });
    },
  });
}
