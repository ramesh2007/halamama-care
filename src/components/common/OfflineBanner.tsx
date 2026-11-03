// ─── SP4-05: Offline / Reconnecting Banner ──────────────────────────────────
// Shown when the socket connection is lost. Auto-retry is handled by the
// socket.io client with exponential backoff.

import { useCareStore } from '../../store/useCareStore';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isConnected = useCareStore((s) => s.isConnected);

  if (isConnected) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-red-500/15 border-b border-red-500/30 px-4 py-1.5">
      <WifiOff className="h-3.5 w-3.5 text-red-400 animate-pulse" />
      <span className="text-xs font-medium text-red-300">
        Reconnecting… real-time updates are paused.
      </span>
    </div>
  );
}
