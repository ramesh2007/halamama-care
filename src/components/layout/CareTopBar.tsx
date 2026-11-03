// ─── Care Top Bar (Exact RMO UI Structure) ──────────────────────────────────
// Header bar matching /Users/insasofttechnologies/React-js.js/Halamama-RMO
// with collapsible sidebar trigger, ⌘K search, Sun/Moon theme toggle,
// Systems Live popover, and User Profile dropdown with logout.

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useCareStore } from '../../store/useCareStore';
import type { PresenceStatus } from '../../types/care';
import { emitPresence } from '../../services/socket';

interface CareTopBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const PRESENCE_OPTIONS: {
  value: PresenceStatus;
  label: string;
  desc: string;
  color: string;
  activeCls: string;
}[] = [
  {
    value: 'online',
    label: 'Online',
    desc: 'Available for incoming chats & tickets',
    color: 'bg-emerald-500',
    activeCls: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300',
  },
  {
    value: 'busy',
    label: 'Busy / On Break',
    desc: 'Paused incoming queue assignments',
    color: 'bg-amber-500',
    activeCls: 'bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-300',
  },
  {
    value: 'offline',
    label: 'Offline',
    desc: 'Appear disconnected from routing',
    color: 'bg-zinc-400 dark:bg-zinc-500',
    activeCls: 'bg-muted border-border text-foreground',
  },
];

export function CareTopBar({ sidebarCollapsed, onToggleSidebar }: CareTopBarProps) {
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    user,
    logout,
    agentPresence,
    setAgentPresence,
    isConnected,
  } = useCareStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [systemsOpen, setSystemsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const systemsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (systemsRef.current && !systemsRef.current.contains(event.target as Node)) {
        setSystemsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefreshConnections = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const currentPresence = PRESENCE_OPTIONS.find((p) => p.value === agentPresence) || PRESENCE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between border-b border-border bg-card/90 backdrop-blur-md gap-4 shrink-0 select-none">
      {/* ── Left: Sidebar Trigger & Search Bar (Matching RMO) ────────── */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted cursor-pointer select-none"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4.5 w-4.5 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="h-4.5 w-4.5 text-muted-foreground" />
          )}
        </button>

        {sidebarCollapsed && (
          <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-border/60 shrink-0">
            <img
              src="/halamama_green.svg"
              alt="Halamama Care"
              className="h-5 w-auto object-contain"
            />
            <span className="text-xs font-bold text-foreground">Halamama Care</span>
          </div>
        )}

        {/* Global Search Bar with ⌘K Badge */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, customers, tickets, AWB..."
            className="w-full h-10 pl-10 pr-16 rounded-xl bg-muted/60 border border-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#74A09F]/50 focus:bg-card transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md grid place-items-center hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 h-6 px-1.5 items-center rounded-md border border-border bg-card text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ── Right: Theme Toggle, Systems Status, User Profile ───────── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
        {/* Theme Toggle (Matching RMO ThemeToggle) */}
        <button
          id="care-theme-toggle"
          data-testid="care-theme-toggle"
          onClick={toggleTheme}
          className="relative h-10 w-10 rounded-xl hover:bg-muted grid place-items-center transition-colors text-foreground cursor-pointer"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#74A09F]" />
        </button>

        {/* Systems Live Status Pill (Matching RMO) */}
        <div className="relative" ref={systemsRef}>
          <button
            onClick={() => setSystemsOpen((v) => !v)}
            className="flex items-center gap-2 bg-muted/60 hover:bg-muted/80 h-9 px-3 sm:px-3.5 rounded-xl border border-border/50 shadow-sm shrink-0 transition-all duration-200 cursor-pointer select-none active:scale-[0.98] outline-none"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 rounded-full opacity-75 animate-ping bg-emerald-500" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-foreground">Systems Live</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200" />
          </button>

          {systemsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-card border border-border shadow-xl p-4 z-50 text-xs animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/50">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  System Status
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Operational
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="p-2.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Care Gateway</p>
                      <p className="text-[10px] text-muted-foreground">WebSocket Real-Time</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {isConnected ? 'ONLINE' : 'CONNECTING'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#95BF47]" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Shopify Integration</p>
                      <p className="text-[10px] text-muted-foreground">Webhooks & Orders Sync</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    HEALTHY
                  </span>
                </div>
              </div>

              {/* Refresh Action Button */}
              <button
                onClick={handleRefreshConnections}
                disabled={isRefreshing}
                className="w-full h-9 flex items-center justify-center gap-1.5 rounded-xl bg-[#74A09F] hover:bg-[#5D8C8B] text-white text-xs font-semibold shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Checking Connections...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh Connections
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-border mx-1" />

        {/* User Menu Capsule (Matching RMO) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className={clsx(
              'flex items-center gap-2.5 h-10 pl-1.5 pr-3 rounded-xl transition-all outline-none cursor-pointer border border-transparent',
              profileOpen
                ? 'bg-muted border-border/80 ring-2 ring-[#74A09F]/20 shadow-2xs'
                : 'hover:bg-muted/80 hover:border-border/60'
            )}
          >
            <div className="h-8 w-8 rounded-xl bg-white dark:bg-card ring-1 ring-border shadow-2xs grid place-items-center relative">
              <img
                src="/halamama_green.svg"
                alt="Avatar"
                className="h-5 w-5 object-contain"
              />
              <span
                className={clsx(
                  'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card',
                  currentPresence.color
                )}
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight text-foreground">
                {user?.name || 'Aravind'}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {user?.role || 'Admin'}
              </span>
            </div>
            <ChevronDown
              className={clsx(
                'h-3.5 w-3.5 text-muted-foreground ml-0.5 transition-transform duration-200',
                profileOpen && 'rotate-180 text-foreground'
              )}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 dark:ring-white/5 space-y-2">
              {/* Profile Card Header */}
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#74A09F] to-[#5D8C8B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AR'}
                  </div>
                  <span
                    className={clsx(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card',
                      currentPresence.color
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-foreground truncate tracking-tight">
                      {user?.name || 'Aravind'}
                    </p>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#74A09F]/15 text-[#74A09F] border border-[#74A09F]/20 uppercase">
                      {user?.role || 'Admin'}
                    </span>
                  </div>
                  <p className="text-2xs text-muted-foreground truncate font-medium mt-0.5">
                    {user?.email || 'admin@halamama.com'}
                  </p>
                </div>
              </div>

              {/* Status / Availability Selector */}
              <div className="px-1">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Agent Availability
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                    <span className={clsx('h-1.5 w-1.5 rounded-full', currentPresence.color)} />
                    <span className="capitalize">{agentPresence}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  {PRESENCE_OPTIONS.map((opt) => {
                    const isSelected = agentPresence === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setAgentPresence(opt.value);
                          emitPresence(opt.value);
                        }}
                        className={clsx(
                          'w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer border',
                          isSelected
                            ? clsx(opt.activeCls, 'shadow-2xs font-semibold')
                            : 'border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            {opt.value === 'online' && isSelected && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            )}
                            <span className={clsx('relative inline-flex rounded-full h-2.5 w-2.5', opt.color)} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-tight text-foreground">
                              {opt.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight truncate">
                              {opt.desc}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-[#74A09F] ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Info / Shift details */}
              <div className="px-2.5 py-1.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between text-2xs text-muted-foreground">
                <span className="font-medium">Care Hub</span>
                <span className="font-semibold text-foreground">Doha, Qatar (AST)</span>
              </div>

              {/* Sign out */}
              <div className="border-t border-border/70 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Sign out</span>
                  </div>
                  <span className="text-[10px] font-normal text-rose-500/70">Session exit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
