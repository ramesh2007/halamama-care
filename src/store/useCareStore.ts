// ─── SP1-03: Zustand Global Store ───────────────────────────────────────────
// Central UI state management. Server-fetched data (orders, stock, tickets)
// lives in TanStack React Query — this store handles only transient UI state.

import { create } from 'zustand';
import type {
  CustomerContext,
  SalesOrderSummary,
  ChatMessage,
  ConversationThread,
  DepartmentType,
  TicketStatus,
  PresenceStatus,
  CannedResponse,
  UserRole,
} from '../types/care';
import { MOCK_THREADS, MOCK_MESSAGES } from '../mocks';

export type ActiveTab = 'dashboard' | 'live_care' | 'tickets' | 'broadcasts';
export type ThemeMode = 'dark' | 'light';

export function applyThemeMode(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'light' ? '#F8FAFD' : '#0B0E14');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch {}
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'light';
}

if (typeof window !== 'undefined') {
  applyThemeMode(getInitialTheme());
}

interface CareStoreState {
  // ─── Navigation ────────────────────────────────────────────────────────
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // ─── Filters ───────────────────────────────────────────────────────────
  activeDepartment: DepartmentType | 'all';
  setActiveDepartment: (dept: DepartmentType | 'all') => void;

  activeStatusFilter: TicketStatus | 'all';
  setActiveStatusFilter: (status: TicketStatus | 'all') => void;

  activeChannelFilter: string | 'all';
  setActiveChannelFilter: (channel: string | 'all') => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // ─── Team Visibility ───────────────────────────────────────────────────
  sharedTeamView: boolean;
  toggleSharedTeamView: () => void;

  // ─── Agent Presence ────────────────────────────────────────────────────
  agentPresence: PresenceStatus;
  setAgentPresence: (presence: PresenceStatus) => void;

  // ─── Selected Thread ───────────────────────────────────────────────────
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;

  // ─── Thread List ───────────────────────────────────────────────────────
  threads: ConversationThread[];
  setThreads: (threads: ConversationThread[]) => void;
  updateThread: (threadId: string, updates: Partial<ConversationThread>) => void;

  // ─── Active Customer Context ───────────────────────────────────────────
  activeCustomer: CustomerContext | null;
  setActiveCustomer: (customer: CustomerContext | null) => void;

  activeOrders: SalesOrderSummary[];
  setActiveOrders: (orders: SalesOrderSummary[]) => void;

  // ─── Messages ──────────────────────────────────────────────────────────
  messages: Record<string, ChatMessage[]>;
  setMessages: (threadId: string, messages: ChatMessage[]) => void;
  addMessage: (threadId: string, message: ChatMessage) => void;
  updateMessageStatus: (
    threadId: string,
    messageId: string,
    status: NonNullable<ChatMessage['delivery_status']>,
    newId?: string
  ) => void;

  // ─── Canned Responses ──────────────────────────────────────────────────
  cannedResponses: CannedResponse[];
  setCannedResponses: (responses: CannedResponse[]) => void;

  // ─── UI State ──────────────────────────────────────────────────────────
  isSegment1Collapsed: boolean;
  toggleSegment1: () => void;

  isSegment4Collapsed: boolean;
  toggleSegment4: () => void;

  composerMode: 'message' | 'whisper';
  setComposerMode: (mode: 'message' | 'whisper') => void;

  // ─── Current User & Auth ───────────────────────────────────────────────
  userRole: UserRole;
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;

  // ─── Theme Mode ────────────────────────────────────────────────────────
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // ─── Socket Connection ─────────────────────────────────────────────────
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const useCareStore = create<CareStoreState>((set) => ({
  // Navigation
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Filters
  activeDepartment: 'all',
  setActiveDepartment: (dept) => set({ activeDepartment: dept }),

  activeStatusFilter: 'all',
  setActiveStatusFilter: (status) => set({ activeStatusFilter: status }),

  activeChannelFilter: 'all',
  setActiveChannelFilter: (channel) => set({ activeChannelFilter: channel }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Team Visibility
  sharedTeamView: false,
  toggleSharedTeamView: () => set((state) => ({ sharedTeamView: !state.sharedTeamView })),

  // Agent Presence
  agentPresence: 'online',
  setAgentPresence: (presence) => set({ agentPresence: presence }),

  // Selected Thread
  selectedThreadId: null,
  setSelectedThreadId: (id) => set({ selectedThreadId: id }),

  // Thread List
  threads: MOCK_THREADS,
  setThreads: (threads) => set({ threads }),
  updateThread: (threadId, updates) =>
    set((state) => ({
      threads: state.threads.map((t) =>
        t.id === threadId ? { ...t, ...updates } : t
      ),
    })),

  // Active Customer
  activeCustomer: null,
  setActiveCustomer: (customer) => set({ activeCustomer: customer }),

  activeOrders: [],
  setActiveOrders: (orders) => set({ activeOrders: orders }),

  // Messages
  messages: MOCK_MESSAGES,
  setMessages: (threadId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [threadId]: messages },
    })),
  addMessage: (threadId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [threadId]: [...(state.messages[threadId] || []), message],
      },
    })),
  updateMessageStatus: (threadId, messageId, status, newId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [threadId]: (state.messages[threadId] || []).map((m) =>
          m.id === messageId
            ? { ...m, delivery_status: status, ...(newId ? { id: newId } : {}) }
            : m
        ),
      },
    })),

  // Canned Responses
  cannedResponses: [
    { id: '1', trigger: '/store_loc', label: 'Store Location', text: 'Our showroom is located at Gate Mall, West Bay, Doha. Open Saturday–Thursday, 10:00 AM – 10:00 PM. We look forward to welcoming you!', category: 'general' },
    { id: '2', trigger: '/delivery_policy', label: 'Delivery Policy', text: 'We offer free delivery for orders above QAR 200 within Doha. For orders below QAR 200, a flat delivery fee of QAR 30 applies. Delivery typically takes 2–4 business days.', category: 'general' },
    { id: '3', trigger: '/bank_details', label: 'Bank Details', text: 'Bank: QNB\nAccount Name: Halamama Trading\nAccount Number: 2810-XXXX-XXXX\nIBAN: QA58 QNBA 0000 0000 2810 XXXX', category: 'payments' },
    { id: '4', trigger: '/return_faq', label: 'Return FAQ', text: 'You can initiate a return within 7 days of delivery. Items must be in original condition and packaging. Returns for damaged items are processed within 24 hours of reporting.', category: 'returns' },
    { id: '5', trigger: '/warranty', label: 'Warranty Info', text: 'All furniture items come with a 1-year manufacturer warranty covering structural defects. Upholstery and fabric wear is covered for 6 months.', category: 'general' },
    { id: '6', trigger: '/install_info', label: 'Installation Info', text: 'Free installation is included with all furniture purchases. Our team will contact you within 24 hours of delivery to schedule a convenient installation slot.', category: 'installation' },
  ],
  setCannedResponses: (responses) => set({ cannedResponses: responses }),

  // UI State
  isSegment1Collapsed: false,
  toggleSegment1: () => set((state) => ({ isSegment1Collapsed: !state.isSegment1Collapsed })),

  isSegment4Collapsed: false,
  toggleSegment4: () => set((state) => ({ isSegment4Collapsed: !state.isSegment4Collapsed })),

  composerMode: 'message',
  setComposerMode: (mode) => set({ composerMode: mode }),

  // Current User & Auth
  userRole: 'operations_manager',
  isAuthenticated: typeof window !== 'undefined' ? localStorage.getItem('halamama_auth_token') !== null : true,
  user: {
    name: 'Aravind',
    email: 'admin@halamama.com',
    role: 'Admin',
  },
  login: (email: string) => {
    const token = 'mock_jwt_token_' + Date.now();
    try {
      localStorage.setItem('halamama_auth_token', token);
    } catch {}
    set({
      isAuthenticated: true,
      user: {
        name: 'Aravind',
        email: email || 'admin@halamama.com',
        role: 'Admin',
      },
      activeTab: 'dashboard',
    });
    return true;
  },
  logout: () => {
    try {
      localStorage.removeItem('halamama_auth_token');
    } catch {}
    set({
      isAuthenticated: false,
    });
  },

  // Theme
  theme: getInitialTheme(),
  setTheme: (theme) => {
    applyThemeMode(theme);
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyThemeMode(nextTheme);
      return { theme: nextTheme };
    });
  },

  // Socket
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
}));
