// ─── API Configuration & Mock Controller ────────────────────────────────────
// Central switchboard for live backend vs mock data.
//
// In development:
//   Set VITE_USE_MOCK_DATA=false in .env to connect directly to the real backend.
//   Or toggle individual domains in MOCK_OVERRIDES as each endpoint is ready.
//
// In production:
//   Set VITE_USE_MOCK_DATA=false and configure VITE_API_BASE_URL.

export const API_CONFIG = {
  // Master toggle: set to false to point all services to real endpoints
  USE_MOCKS: import.meta.env.VITE_USE_MOCK_DATA !== 'false',

  // Base API URL for backend services
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://delivery-management.hmws.qatar123.com/public/api',

  // Request timeout in milliseconds
  TIMEOUT: 15000,

  // Granular per-domain overrides:
  // When USE_MOCKS is true, setting any domain to false connects ONLY that domain to real backend.
  MOCK_OVERRIDES: {
    auth: true,
    dashboard: true,
    threads: false, // Connected to live Laravel WhatsApp customer care API
    customers: true,
    tickets: true,
    broadcasts: true,
    catalog: true,
    installation: true,
    returns: true,
    wallet: true,
    payment: true,
  },
} as const;

/**
 * Returns true if mock data should be used for the specified domain.
 * When backend endpoints are deployed, flipping this to false seamlessly
 * switches the domain to real API calls without touching UI components.
 */
export function shouldUseMock(domain: keyof typeof API_CONFIG.MOCK_OVERRIDES): boolean {
  if (!API_CONFIG.USE_MOCKS) return false;
  return API_CONFIG.MOCK_OVERRIDES[domain] ?? true;
}
