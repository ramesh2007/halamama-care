// ─── Authentication API ───────────────────────────────────────────────────────
// Authenticates agents and fetches the current session profile.
// Easily toggled to real backend endpoints via API_CONFIG or VITE_USE_MOCK_DATA.

import apiClient from './apiClient';
import { shouldUseMock } from './config';
import { CURRENT_AGENT, MOCK_USERS, type MockUser } from '../mocks';

export { CURRENT_AGENT, MOCK_USERS };

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthSessionResponse {
  token: string;
  user: MockUser;
}

export async function loginAgent(credentials: LoginCredentials): Promise<AuthSessionResponse> {
  if (shouldUseMock('auth')) {
    const matchedUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase(),
    ) || {
      id: 'agent-custom',
      name: credentials.email.split('@')[0] || 'Care Agent',
      email: credentials.email,
      role: 'Operations Manager',
    };

    const token = 'mock_jwt_' + Math.random().toString(36).substring(2);
    localStorage.setItem('halamama_auth_token', token);
    return { token, user: matchedUser };
  }

  const { data } = await apiClient.post<AuthSessionResponse>('/auth/login', credentials);
  if (data.token) {
    localStorage.setItem('halamama_auth_token', data.token);
  }
  return data;
}

export async function getCurrentAgent(): Promise<MockUser> {
  if (shouldUseMock('auth')) {
    return {
      id: CURRENT_AGENT.id,
      name: CURRENT_AGENT.name,
      email: CURRENT_AGENT.email,
      role: CURRENT_AGENT.role,
    };
  }

  const { data } = await apiClient.get<MockUser>('/auth/me');
  return data;
}

export async function logoutAgent(): Promise<void> {
  if (shouldUseMock('auth')) {
    localStorage.removeItem('halamama_auth_token');
    return;
  }

  try {
    await apiClient.post('/auth/logout');
  } finally {
    localStorage.removeItem('halamama_auth_token');
  }
}
