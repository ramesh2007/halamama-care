// ─── Central API Layer Barrel Export ─────────────────────────────────────────
// Every service is cleanly abstracted and controlled by API_CONFIG.
// Connecting to real backend endpoints in the future requires only:
// 1. Setting VITE_USE_MOCK_DATA=false in .env (or switching individual domains in API_CONFIG.MOCK_OVERRIDES)
// 2. No UI components or views need to be rewritten or touched.

export { default as apiClient } from './apiClient';
export * from './config';
export * from './authApi';
export * from './dashboardApi';
export * from './threadsApi';
export * from './customersApi';
export * from './ticketsApi';
export * from './broadcastsApi';
export * from './catalogApi';
export * from './installationApi';
export * from './returnsApi';
export * from './walletApi';
export * from './paymentApi';
