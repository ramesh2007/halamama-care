// ─── Live Care 4-Segment Workspace Page ─────────────────────────────────────

import { clsx } from 'clsx';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useCareStore } from '../../store/useCareStore';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { ChannelFilterList } from '../../components/livecare/Segment1_Queues/ChannelFilterList';
import { DepartmentSelector } from '../../components/livecare/Segment1_Queues/DepartmentSelector';
import { TagFilterGroup } from '../../components/livecare/Segment1_Queues/TagFilterGroup';
import { ThreadSearchBar } from '../../components/livecare/Segment2_Threads/ThreadSearchBar';
import { ThreadList } from '../../components/livecare/Segment2_Threads/ThreadList';
import { ChatView } from '../../components/livecare/Segment3_Chat/ChatView';
import { ContextDrawer } from '../../components/livecare/Segment4_Context/ContextDrawer';

export function LiveCarePage() {
  const {
    isSegment1Collapsed,
    toggleSegment1,
    isSegment4Collapsed,
    toggleSegment4,
  } = useCareStore();

  return (
    <ErrorBoundary>
      <div className="flex-1 flex overflow-hidden h-full">
        {/* Segment 1: Queues & Filters */}
        <aside
          className={clsx(
            'h-full border-r border-border bg-card flex flex-col transition-all duration-300 shrink-0',
            isSegment1Collapsed ? 'w-16' : 'w-segment-1',
          )}
        >
          <div className="flex items-center justify-end p-2 border-b border-border">
            <button
              onClick={toggleSegment1}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={isSegment1Collapsed ? 'Expand queues' : 'Collapse queues'}
            >
              {isSegment1Collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <ChannelFilterList collapsed={isSegment1Collapsed} />
            <DepartmentSelector collapsed={isSegment1Collapsed} />
            <TagFilterGroup collapsed={isSegment1Collapsed} />
          </div>
        </aside>

        {/* Segment 2: Thread List */}
        <section className="w-segment-2 h-full border-r border-border bg-card flex flex-col shrink-0">
          <ThreadSearchBar />
          <ThreadList />
        </section>

        {/* Segment 3: Chat View */}
        <main className="flex-1 min-w-[500px] h-full flex flex-col bg-background">
          <ChatView />
        </main>

        {/* Segment 4: Context Drawer */}
        <aside
          className={clsx(
            'h-full border-l border-border bg-card flex flex-col transition-all duration-300 shrink-0',
            isSegment4Collapsed ? 'w-12' : 'w-segment-4',
          )}
        >
          <div className="flex items-center justify-start p-2 border-b border-border">
            <button
              onClick={toggleSegment4}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={isSegment4Collapsed ? 'Expand drawer' : 'Collapse drawer'}
            >
              {isSegment4Collapsed ? (
                <PanelRightOpen className="h-4 w-4" />
              ) : (
                <PanelRightClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {!isSegment4Collapsed && (
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <ContextDrawer />
            </div>
          )}
        </aside>
      </div>
    </ErrorBoundary>
  );
}
