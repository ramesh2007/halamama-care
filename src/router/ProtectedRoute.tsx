// ─── Protected Route Guard ──────────────────────────────────────────────────
// Ensures only authenticated agents can access operational Care workspaces.

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCareStore } from '../store/useCareStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useCareStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
