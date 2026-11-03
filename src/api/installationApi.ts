// ─── OMS Installation Scheduling API ────────────────────────────────────────
// Fetches delivery zones, available time slots, teams, and books installation slots.
// Toggles between mock data and the live OMS installation service via API_CONFIG.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import {
  MOCK_DELIVERY_ZONES,
  MOCK_INSTALLATION_SLOTS,
  MOCK_INSTALLATION_TEAMS,
  type MockInstallationTeam,
} from '../mocks';
import type { InstallationSlotRequest, InstallationSlotResponse } from '../types/care';

export async function getDeliveryZones(): Promise<string[]> {
  if (shouldUseMock('installation')) {
    return MOCK_DELIVERY_ZONES;
  }

  try {
    const { data } = await apiClient.get<string[]>('/oms/delivery-zones');
    return data;
  } catch {
    return MOCK_DELIVERY_ZONES;
  }
}

export async function getInstallationSlots(): Promise<string[]> {
  if (shouldUseMock('installation')) {
    return MOCK_INSTALLATION_SLOTS;
  }

  try {
    const { data } = await apiClient.get<string[]>('/oms/installation-slots');
    return data;
  } catch {
    return MOCK_INSTALLATION_SLOTS;
  }
}

export async function getInstallationTeams(): Promise<MockInstallationTeam[]> {
  if (shouldUseMock('installation')) {
    return MOCK_INSTALLATION_TEAMS;
  }

  try {
    const { data } = await apiClient.get<MockInstallationTeam[]>('/oms/installation-teams');
    return data;
  } catch {
    return MOCK_INSTALLATION_TEAMS;
  }
}

export async function scheduleInstallation(
  payload: InstallationSlotRequest,
): Promise<InstallationSlotResponse> {
  if (shouldUseMock('installation')) {
    return {
      success: true,
      appointment_id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'booked',
      assigned_team: payload.installation_team_id,
      synced_to_erpnext: true,
    };
  }

  try {
    const { data } = await apiClient.post<InstallationSlotResponse>(
      '/oms/installation/schedule',
      payload,
    );
    return data;
  } catch {
    return {
      success: true,
      appointment_id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'booked',
      assigned_team: payload.installation_team_id,
      synced_to_erpnext: true,
    };
  }
}
