// ─── SP4-03: WhatsApp Broadcast Workspace ───────────────────────────────────
// Toggle between the campaign history list and the template message builder.

import { useState } from 'react';
import { clsx } from 'clsx';
import { Megaphone, ListChecks, PenSquare, Plus } from 'lucide-react';
import { BroadcastCampaignList } from './BroadcastCampaignList';
import { TemplateMessageBuilder } from './TemplateMessageBuilder';
import { useBroadcasts } from '../../hooks/api';

type View = 'campaigns' | 'builder';

export function BroadcastsWorkspace() {
  const [view, setView] = useState<View>('campaigns');
  const { data: campaigns = [] } = useBroadcasts();

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-background">
      {/* Top Header & View Switcher */}
      <div className="px-5 py-3.5 border-b border-border bg-card flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-2xs">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-foreground tracking-tight">WhatsApp Broadcasts</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                Meta Cloud API
              </span>
            </div>
            <p className="text-2xs text-muted-foreground">
              Targeted customer messaging, marketing campaigns & Meta-approved template builder
            </p>
          </div>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setView('campaigns')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                view === 'campaigns'
                  ? 'bg-card text-foreground shadow-xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground font-medium',
              )}
            >
              <ListChecks className="h-4 w-4 text-primary" />
              <span>Campaigns</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/15 text-primary">
                {campaigns.length}
              </span>
            </button>
            <button
              onClick={() => setView('builder')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                view === 'builder'
                  ? 'bg-card text-foreground shadow-xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground font-medium',
              )}
            >
              <PenSquare className="h-4 w-4 text-primary" />
              <span>Template Builder</span>
            </button>
          </div>

          {view === 'campaigns' && (
            <button
              onClick={() => setView('builder')}
              className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Campaign</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-auto">
        {view === 'campaigns' ? (
          <BroadcastCampaignList onNavigateBuilder={() => setView('builder')} />
        ) : (
          <TemplateMessageBuilder onCompleted={() => setView('campaigns')} />
        )}
      </div>
    </div>
  );
}
