// ─── React Query Hooks: Installation ────────────────────────────────────────

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getDeliveryZones,
  getInstallationSlots,
  getInstallationTeams,
  scheduleInstallation,
} from '../../api/installationApi';
import type { InstallationSlotRequest } from '../../types/care';

export function useDeliveryZones() {
  return useQuery({
    queryKey: ['installation', 'zones'],
    queryFn: getDeliveryZones,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInstallationSlots() {
  return useQuery({
    queryKey: ['installation', 'slots'],
    queryFn: getInstallationSlots,
    staleTime: 60 * 1000,
  });
}

export function useInstallationTeams() {
  return useQuery({
    queryKey: ['installation', 'teams'],
    queryFn: getInstallationTeams,
    staleTime: 5 * 60 * 1000,
  });
}

export function useScheduleInstallation() {
  return useMutation({
    mutationFn: (payload: InstallationSlotRequest) => scheduleInstallation(payload),
  });
}
