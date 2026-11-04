// ─── Tickets Page ───────────────────────────────────────────────────────────

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const TicketsWorkspace = lazy(() =>
  import('../../components/tickets/TicketsWorkspace').then((m) => ({
    default: m.TicketsWorkspace,
  })),
);

function PageLoading() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground min-h-[400px]">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export function TicketsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <TicketsWorkspace />
      </Suspense>
    </ErrorBoundary>
  );
}
