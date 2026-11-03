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
        <div className="flex items-center gap-2.5">
          <img
            src="/halamama_green.svg"
            alt="Halamama Care"
            className="h-6 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground leading-tight">Halamama Care</span>
            <span className="text-2xs text-muted-foreground leading-tight">Customer Support</span>
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
      <div className="flex items-center gap-1 bg-muted/70 rounded-xl p-1 ml-4 border border-border/60">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
      <div className="hidden lg:flex items-center gap-2 bg-muted/70 rounded-xl px-3 py-1.5 w-64 border border-border/60">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
      </div>

      {/* ─── Connection Status ───────────────────────────────────────── */}
      <div
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border',
          isConnected
            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20 animate-pulse'
        )}
      >
        {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        <span className="hidden xl:inline">{isConnected ? 'Connected' : 'Reconnecting...'}</span>
      </div>

      {/* ─── Team View Toggle ────────────────────────────────────────── */}
      <button
        onClick={toggleSharedTeamView}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer',
          sharedTeamView
            ? 'bg-[#74A09F]/15 text-[#74A09F] border border-[#74A09F]/30 font-semibold'
            : 'bg-muted/70 text-muted-foreground hover:text-foreground border border-border/60'
        )}
      >
        <Users className="h-3.5 w-3.5" />
        <span className="hidden xl:inline">All Teams</span>
      </button>

      {/* ─── Theme Selector (Dark / Light) ──────────────────────────── */}
      <ThemeToggle />

      {/* ─── Agent Presence Dropdown ─────────────────────────────────── */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/70 hover:bg-muted border border-border/60 transition-colors cursor-pointer">
          <span className={clsx('h-2.5 w-2.5 rounded-full', currentPresence.color)} />
          <span className="text-sm font-medium text-foreground">{currentPresence.label}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {/* Dropdown */}
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 p-1">
          {PRESENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setAgentPresence(option.value);
                emitPresence(option.value);
              }}
              className={clsx(
                'flex items-center gap-3 w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer',
                agentPresence === option.value
                  ? 'bg-[#74A09F]/15 text-[#74A09F] font-semibold'
                  : 'text-foreground hover:bg-muted'
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
