// ─── Broadcasts Page ────────────────────────────────────────────────────────

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const BroadcastsWorkspace = lazy(() =>
  import('../../components/broadcasts/BroadcastsWorkspace').then((m) => ({
    default: m.BroadcastsWorkspace,
  })),
);

function PageLoading() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground min-h-[400px]">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export function BroadcastsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <BroadcastsWorkspace />
      </Suspense>
    </ErrorBoundary>
  );
}
