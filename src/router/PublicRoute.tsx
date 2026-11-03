// ─── Public Route Guard ─────────────────────────────────────────────────────
// Redirects already authenticated agents to the dashboard when visiting /login.

import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCareStore } from '../store/useCareStore';

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useCareStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
