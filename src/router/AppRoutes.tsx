// ─── Application Routes & Mapping ───────────────────────────────────────────
// Central routing configuration with lazy loading, layout nesting, and auth guards.

import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import {
  LoginPage,
  DashboardPage,
  LiveCarePage,
  TicketsPage,
  BroadcastsPage,
  NotFoundPage,
} from '../pages';

export function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Auth Route ───────────────────────────────────────── */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* ── Protected Operational Workspaces ────────────────────────── */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Workspace */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Live Care 4-Segment Workspace */}
        <Route path="live-care" element={<LiveCarePage />} />

        {/* Email Tickets Workspace */}
        <Route path="tickets" element={<TicketsPage />} />

        {/* WhatsApp Broadcast Campaigns Workspace */}
        <Route path="broadcasts" element={<BroadcastsPage />} />
      </Route>

      {/* ── 404 Fallback Route ───────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
