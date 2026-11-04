// ─── Login Page (Matching Image 1) ──────────────────────────────────────────
// Clean, branded authentication view with halamama_green.svg logo badge,
// credential validation, demo hints, and ambient background grid.

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sun, Moon } from 'lucide-react';
import { useCareStore } from '../../store/useCareStore';

interface LoginPageProps {
  onSuccess?: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('admin@halamama.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const { login, theme, toggleTheme } = useCareStore();

  useEffect(() => {
    setMounted(true);
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (!email.trim()) {
        setError('Please enter your email address.');
        setLoading(false);
        return;
      }

      // Successful login
      login(email, password);
      setLoading(false);
      if (onSuccess) onSuccess();
    }, 500);
  };

  const handleUseDemo = () => {
    setEmail('admin@halamama.com');
    setPassword('admin123');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* ─── Ambient Glow Orbs & Grid Pattern ─────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft Brand Ambient Glows */}
        <div
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.10] blur-3xl"
          style={{ background: 'linear-gradient(135deg, #85AFAE, #9FC7C6)' }}
        />
        <div
          className="absolute -bottom-60 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.08] blur-3xl"
          style={{ background: 'linear-gradient(135deg, #85AFAE, #38BDF8)' }}
        />
        <div
          className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: 'linear-gradient(135deg, #10B981, #85AFAE)' }}
        />

        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ─── Top Corner Theme Switcher ────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground grid place-items-center transition-colors shadow-sm cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-primary" />
          )}
        </button>
      </div>

      {/* ─── Centered Login Card ──────────────────────────────────────── */}
      <div
        className={`relative z-10 w-full max-w-[440px] px-4 transition-all duration-700 ease-out ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-elevated">
          {/* Top Brand Strip */}
          <div className="h-1 w-full bg-primary" />

          <div className="p-8 sm:p-10">
            {/* Logo Badge & Welcome Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border p-2.5">
                <img
                  src="/halamama_green.svg"
                  alt="Halamama"
                  className="h-10 w-auto max-w-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to the Halamama Care
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive animate-fade-in">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Email
                </label>
                <div className="group relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    ref={emailRef}
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@halamama.com"
                    className="h-11 w-full rounded-xl border border-border bg-muted/40 pl-11 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="group relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-border bg-muted/40 pl-11 pr-12 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button in Exact Requested Brand Primary */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary hover:opacity-90 font-semibold text-primary-foreground shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials Box */}
            <div
              onClick={handleUseDemo}
              className="mt-6 rounded-xl border border-border/80 bg-muted/30 p-4 transition-colors hover:border-primary/60 cursor-pointer"
              title="Click to fill demo credentials"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Demo credentials
                </span>
                <span className="text-xs text-primary font-semibold">Click to use</span>
              </div>
              <div className="flex items-center justify-between text-xs py-0.5">
                <span className="text-muted-foreground">Email</span>
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground border border-border">
                  admin@halamama.com
                </code>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs py-0.5">
                <span className="text-muted-foreground">Password</span>
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground border border-border">
                  admin123
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 Halamama LMD · RouteMyOrder
        </p>
      </div>
    </div>
  );
}
