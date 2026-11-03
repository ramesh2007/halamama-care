# HM Customer Care — Architecture & API Integration Guide

This application follows a clean, modular, production-ready React.js architecture designed to make connecting real backend endpoints effortless and removing mock data seamless.

---

## 1. Directory Structure

```
src/
├── api/                     # Central API Layer
│   ├── apiClient.ts         # Axios instance with Bearer auth token and 401 interceptors
│   ├── config.ts            # Master toggle (USE_MOCKS) & granular domain overrides
│   ├── authApi.ts           # Agent login, profile session, logout
│   ├── dashboardApi.ts      # Metrics, SLA breaches, agent workload, queue depth
│   ├── threadsApi.ts        # Omnichannel chats, messages, status, reassignments
│   ├── customersApi.ts      # Customer 360 bundle, sales orders, CRM link
│   ├── ticketsApi.ts        # Email tickets, ticket messages, replies
│   ├── broadcastsApi.ts     # WhatsApp broadcasts, approved templates
│   ├── catalogApi.ts        # ERPNext warehouse stock balances
│   ├── installationApi.ts   # OMS installation scheduling, zones, slots, teams
│   ├── returnsApi.ts        # Return receipts & auto-approval workflows
│   ├── walletApi.ts         # Store credit balance and debit/credit adjustments
│   ├── paymentApi.ts        # MyFatoorah invoice generation
│   └── index.ts             # Unified barrel export
│
├── hooks/
│   └── api/                 # React Query (TanStack Query) Hooks
│       ├── useDashboardData.ts     # useDashboardMetrics, useAgentPerformance, etc.
│       ├── useTicketsData.ts       # useTickets, useTicketMessages, useSendTicketReply
│       ├── useBroadcastsData.ts    # useBroadcasts, useBroadcastTemplates, useCreateBroadcastCampaign
│       ├── useCustomerData.ts      # useCustomerBundle, useCustomerOrders
│       ├── useInstallationData.ts  # useDeliveryZones, useInstallationSlots, useInstallationTeams
│       └── index.ts                # Central hooks export
│
├── mocks/                   # Domain-Separated Mock Data
│   ├── auth.mock.ts         # Current agent & mock user accounts
│   ├── threads.mock.ts      # WhatsApp/Instagram threads & conversation messages
│   ├── customers.mock.ts    # Customer 360 profiles & ERPNext order histories
│   ├── catalog.mock.ts      # Warehouse stock balances
│   ├── installation.mock.ts # Delivery zones, slots, and installation teams
│   ├── tickets.mock.ts      # Email tickets & inbound/outbound correspondence
│   ├── broadcasts.mock.ts   # WhatsApp campaign records & Meta templates
│   ├── dashboard.mock.ts    # High-level KPIs, queue depths, agent stats
│   └── index.ts             # Central mock barrel export
│
└── data/
    └── mockData.ts          # Backward-compatibility re-export from src/mocks
```

---

## 2. How to Connect Real Endpoints in the Future

### Method A: Connect All Endpoints Globally
In your `.env` or deployment environment, set:
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://api.halamama.qa/api/v1
```
The entire application will immediately route all requests to the live backend server.

### Method B: Progressive / Endpoint-by-Endpoint Connection
When developing backend endpoints incrementally, you can connect one domain at a time in `src/api/config.ts`:
```typescript
export const API_CONFIG = {
  USE_MOCKS: true,
  MOCK_OVERRIDES: {
    auth: false,        // Live backend endpoint connected!
    dashboard: false,   // Live backend endpoint connected!
    threads: true,      // Still using mock data
    tickets: false,     // Live backend endpoint connected!
    customers: true,
    broadcasts: true,
    catalog: false,     // Live backend endpoint connected!
    installation: true,
    returns: true,
    wallet: true,
    payment: true,
  },
};
```
**Zero UI components need to be modified.** All views consume standard API hooks (`useTickets()`, `useDashboardMetrics()`, etc.), which automatically call the correct endpoints.

---

## 3. How to Permanently Remove Mock Data in the Future

When all backend endpoints are live in production:
1. Delete the `src/mocks/` directory.
2. In each `src/api/*.ts` file, remove the `if (shouldUseMock(...))` check and the mock import at the top of the file.
3. Remove `src/data/mockData.ts`.
4. Delete `MOCK_OVERRIDES` in `src/api/config.ts`.

Because UI components never directly import from `src/mocks/`, your components remain 100% clean and untouched!
