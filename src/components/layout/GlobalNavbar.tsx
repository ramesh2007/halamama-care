// ─── SP1-04 & SP1-05: Global Navbar ────────────────────────────────────────
// Top navigation bar with view switcher, agent presence, team controls,
// and environment badge.

import { useCareStore, type ActiveTab } from '../../store/useCareStore';
import {
  MessageSquare,
  Mail,
  BarChart3,
  Megaphone,
  ChevronDown,
  Wifi,
  WifiOff,
  Search,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';
import { emitPresence } from '../../services/socket';
import type { PresenceStatus } from '../../types/care';
import { ThemeToggle } from './ThemeToggle';

const NAV_TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'live_care', label: 'Live Care', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'tickets', label: 'Tickets', icon: <Mail className="h-4 w-4" /> },
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'broadcasts', label: 'Broadcasts', icon: <Megaphone className="h-4 w-4" /> },
];

const PRESENCE_OPTIONS: { value: PresenceStatus; label: string; color: string }[] = [
  { value: 'online', label: 'Online', color: 'bg-emerald-400' },
  { value: 'busy', label: 'Busy / On Break', color: 'bg-amber-400' },
  { value: 'offline', label: 'Offline', color: 'bg-gray-400' },
];

export function GlobalNavbar() {
  const {
    activeTab,
    setActiveTab,
    agentPresence,
    setAgentPresence,
    sharedTeamView,
    toggleSharedTeamView,
    isConnected,
  } = useCareStore();

  const currentPresence = PRESENCE_OPTIONS.find((p) => p.value === agentPresence) || PRESENCE_OPTIONS[0];
  const appEnv = import.meta.env.VITE_APP_ENV || 'development';

  return (
    <nav className="h-navbar bg-surface-secondary border-b border-surface-border flex items-center px-4 gap-4 z-50">
      {/* ─── Brand ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">HM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">Halamama</span>
            <span className="text-2xs text-gray-500 leading-tight">Customer Care</span>
          </div>
        </div>
        {/* Environment Badge */}
        <span
          className={clsx(
            'text-2xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wider',
            appEnv === 'production'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          )}
        >
          {appEnv === 'production' ? 'PROD' : 'DEV'}
        </span>
      </div>

      {/* ─── View Switcher Tabs ──────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-surface-tertiary rounded-lg p-1 ml-4">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-surface-elevated text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover/50'
            )}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Spacer ──────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ─── Global Search ───────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center gap-2 bg-surface-tertiary rounded-lg px-3 py-1.5 w-64">
        <Search className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none w-full"
        />
      </div>

      {/* ─── Connection Status ───────────────────────────────────────── */}
      <div
        className={clsx(
          'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium',
          isConnected
            ? 'text-emerald-400 bg-emerald-500/10'
            : 'text-red-400 bg-red-500/10 animate-pulse'
        )}
      >
        {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        <span className="hidden xl:inline">{isConnected ? 'Connected' : 'Reconnecting...'}</span>
      </div>

      {/* ─── Team View Toggle ────────────────────────────────────────── */}
      <button
        onClick={toggleSharedTeamView}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
          sharedTeamView
            ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
            : 'bg-surface-tertiary text-gray-400 hover:text-gray-200 border border-transparent'
        )}
      >
        <Users className="h-3.5 w-3.5" />
        <span className="hidden xl:inline">All Teams</span>
      </button>

      {/* ─── Theme Selector (Dark / Light) ──────────────────────────── */}
      <ThemeToggle />

      {/* ─── Agent Presence Dropdown ─────────────────────────────────── */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-tertiary hover:bg-surface-hover transition-colors">
          <span className={clsx('h-2.5 w-2.5 rounded-full', currentPresence.color)} />
          <span className="text-sm text-gray-200">{currentPresence.label}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>

        {/* Dropdown */}
        <div className="absolute right-0 top-full mt-1 w-48 bg-surface-elevated border border-surface-border rounded-lg shadow-elevated overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
          {PRESENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setAgentPresence(option.value);
                emitPresence(option.value);
              }}
              className={clsx(
                'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
                agentPresence === option.value
                  ? 'bg-surface-hover text-white'
                  : 'text-gray-300 hover:bg-surface-hover hover:text-white'
              )}
            >
              <span className={clsx('h-2.5 w-2.5 rounded-full', option.color)} />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Agent Avatar ────────────────────────────────────────────── */}
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
        <span className="text-white font-semibold text-xs">JM</span>
      </div>
    </nav>
  );
}
