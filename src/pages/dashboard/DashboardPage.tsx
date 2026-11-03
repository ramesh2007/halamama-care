// ─── Dashboard Page ─────────────────────────────────────────────────────────

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const DashboardWorkspace = lazy(() =>
  import('../../components/dashboard/DashboardWorkspace').then((m) => ({
    default: m.DashboardWorkspace,
  })),
);

function PageLoading() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground min-h-[400px]">
      <Loader2 className="h-6 w-6 animate-spin text-[#74A09F]" />
    </div>
  );
}

export function DashboardPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <DashboardWorkspace />
      </Suspense>
    </ErrorBoundary>
  );
}
