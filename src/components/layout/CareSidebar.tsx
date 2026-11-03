// ─── Care Sidebar (Exact RMO UI Structure) ──────────────────────────────────
// Navigation bar matching /Users/insasofttechnologies/React-js.js/Halamama-RMO
// with /halamama_green.svg branding, collapse states, #74A09F accents, and badges.

import { useEffect } from 'react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  Megaphone,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
} from 'lucide-react';
import { useCareStore, type ActiveTab } from '../../store/useCareStore';

interface CareSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CareSidebar({ collapsed, onToggle }: CareSidebarProps) {
  const { activeTab, setActiveTab } = useCareStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'live_care' as ActiveTab,
      path: '/live-care',
      label: 'Live Care',
      icon: MessageSquare,
      badge: '12',
      isLive: true,
    },
    {
      id: 'tickets' as ActiveTab,
      path: '/tickets',
      label: 'Tickets',
      icon: Mail,
      badge: '24',
    },
    {
      id: 'broadcasts' as ActiveTab,
      path: '/broadcasts',
      label: 'Broadcasts',
      icon: Megaphone,
      badge: null,
    },
  ];

  // Sync activeTab with current URL route
  useEffect(() => {
    const matched = navItems.find((item) =>
      location.pathname === item.path ||
      (item.path === '/dashboard' && location.pathname === '/')
    );
    if (matched && matched.id !== activeTab) {
      setActiveTab(matched.id);
    }
  }, [location.pathname, setActiveTab]);

  return (
    <aside
      className={clsx(
        'h-full border-r border-border bg-card flex flex-col transition-all duration-300 shrink-0 z-30 select-none shadow-sm',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* ── Top Header / Logo + Toggle (Matching RMO) ─────────────── */}
      {collapsed ? (
        <div className="flex flex-col items-center justify-center gap-2.5 px-2 py-4 border-b border-border/50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              navigate('/dashboard');
            }}
            className="group flex items-center justify-center cursor-pointer"
            title="Halamama Care"
          >
            <div className="h-9 w-9 rounded-xl bg-[#74A09F]/15 text-[#74A09F] flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-[#74A09F]/20 transition-transform group-hover:scale-105">
              H
            </div>
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer select-none"
            title="Expand sidebar (⌘B)"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-4.5 w-4.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              navigate('/dashboard');
            }}
            className="group flex items-center cursor-pointer text-left"
          >
            <div className="relative transition-transform duration-300 group-hover:scale-[1.02]">
              <img
                src="/halamama_green.svg"
                alt="Halamama"
                className="h-auto w-full max-w-[125px] object-contain"
              />
            </div>
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer select-none"
            title="Collapse sidebar (⌘B)"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* ── Nav Links (Matching RMO Sidebar Item Styling) ─────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {!collapsed && (
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Customer Care
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname === '/');

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
              className={clsx(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative cursor-pointer',
                isActive
                  ? 'bg-[#74A09F]/15 text-[#1e4e4d] dark:text-[#a0d5d4] shadow-sm border-l-2 border-[#74A09F]'
                  : 'text-foreground/75 hover:bg-muted/60 hover:text-foreground',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#74A09F]" />
              )}
              <Icon
                className={clsx(
                  'h-4.5 w-4.5 shrink-0 transition-colors',
                  isActive ? 'text-[#74A09F]' : 'text-muted-foreground group-hover:text-foreground'
                )}
                strokeWidth={isActive ? 2.4 : 2}
              />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={clsx(
                        'min-w-[22px] h-5 px-1.5 rounded-full text-[10px] font-semibold grid place-items-center transition-colors',
                        isActive
                          ? 'bg-[#74A09F] text-white shadow-xs'
                          : 'bg-[#74A09F]/12 text-[#74A09F]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.isLive && !item.badge && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        <div className="pt-4 space-y-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Preferences
            </p>
          )}

          <button
            className={clsx(
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground/75 hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer',
              collapsed && 'justify-center px-0'
            )}
            title="Settings"
          >
            <Settings className="h-4.5 w-4.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span>Settings</span>}
          </button>

          <button
            className={clsx(
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground/75 hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer',
              collapsed && 'justify-center px-0'
            )}
            title="Help & Support"
          >
            <HelpCircle className="h-4.5 w-4.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span>Help & Docs</span>}
          </button>
        </div>
      </div>

      {/* ── Bottom Collapse Menu (Matching RMO) ───────────────────── */}
      <div className="p-3 border-t border-border/60 shrink-0">
        <button
          onClick={onToggle}
          className={clsx(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="flex-1 text-left text-xs font-medium">Collapse Menu</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                ⌘B
              </kbd>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
