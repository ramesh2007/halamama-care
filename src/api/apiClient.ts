// ─── API Client ─────────────────────────────────────────────────────────────
// Axios instance with bearer token interceptors and error handling.

import axios from 'axios';
import { API_CONFIG } from './config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — attach auth token & normalize paths
apiClient.interceptors.request.use(
  (config) => {
    // If baseURL already ends with /api, normalize any /api/ prefix in URL to avoid /api/api
    if (config.url && config.baseURL) {
      const cleanBase = config.baseURL.replace(/\/+$/, '');
      if (cleanBase.endsWith('/api') && config.url.startsWith('/api/')) {
        config.url = config.url.substring(4);
      }
    }

    const token = localStorage.getItem('halamama_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally without disrupting live chat
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      const isAuthRequest = error.config?.url?.includes('/auth/');
      if (isAuthRequest) {
        localStorage.removeItem('halamama_auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
