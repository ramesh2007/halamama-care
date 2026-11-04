// ─── 404 Not Found Page ─────────────────────────────────────────────────────

import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background text-foreground text-center select-none">
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shadow-lg ring-1 ring-primary/20 mx-auto">
          <AlertCircle className="h-12 w-12 text-primary" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-sm">
          404
        </span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        The customer care workspace or resource you are looking for does not exist or has been relocated.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" icon={<Home className="h-4 w-4" />}>
            Back to Dashboard
          </Button>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous Page
        </button>
      </div>
    </div>
  );
}
