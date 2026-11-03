// ─── OMS Installation Mock Data ─────────────────────────────────────────────

export const MOCK_DELIVERY_ZONES = [
  'Doha Central',
  'West Bay',
  'Al Sadd',
  'Al Wakra',
  'Al Rayyan',
];

export const MOCK_INSTALLATION_SLOTS = [
  '09:00–12:00',
  '12:00–15:00',
  '15:00–18:00',
];

export interface MockInstallationTeam {
  id: string;
  name: string;
  lead: string;
}

export const MOCK_INSTALLATION_TEAMS: MockInstallationTeam[] = [
  { id: 'team-1', name: 'Install Team A', lead: 'Mohammed Ali' },
  { id: 'team-2', name: 'Install Team B', lead: 'Naseef K.' },
];
