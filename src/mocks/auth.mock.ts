// ─── Auth Mock Data ──────────────────────────────────────────────────────────

export const CURRENT_AGENT = {
  id: 'agent-1',
  name: 'Jishu M.',
  email: 'admin@halamama.com',
  role: 'operations_manager',
} as const;

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'agent-1',
    name: 'Aravind',
    email: 'admin@halamama.com',
    role: 'Admin',
  },
  {
    id: 'agent-2',
    name: 'Jishu M.',
    email: 'jishu@halamama.qa',
    role: 'Operations Manager',
  },
  {
    id: 'agent-3',
    name: 'Sara K.',
    email: 'sara.k@halamama.qa',
    role: 'Senior Care Agent',
  },
  {
    id: 'agent-4',
    name: 'Ahmed R.',
    email: 'ahmed.r@halamama.qa',
    role: 'Support Specialist',
  },
];
