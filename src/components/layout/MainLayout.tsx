// ─── Main Layout Component ──────────────────────────────────────────────────
// Persistent shell containing collapsible CareSidebar, CareTopBar, OfflineBanner,
// and React Router's <Outlet /> for rendering nested route pages.

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CareSidebar } from './CareSidebar';
import { CareTopBar } from './CareTopBar';
import { OfflineBanner } from '../common/OfflineBanner';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background text-foreground">
      {/* ─── Collapsible Left Sidebar ───────────────────────────────── */}
      <CareSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* ─── Main Content Column ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Operational Bar */}
        <CareTopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        />
        <OfflineBanner />

        {/* ─── Active Route Page Rendered Here via Outlet ────────────── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
