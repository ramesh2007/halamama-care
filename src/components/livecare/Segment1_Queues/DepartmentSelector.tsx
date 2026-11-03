// ─── SP1-06: Department Selector ────────────────────────────────────────────
// Radio-style list of departments with icons for routing conversations.

import { useCareStore } from '../../../store/useCareStore';
import { clsx } from 'clsx';
import type { DepartmentType } from '../../../types/care';
import {
  Headphones,
  RefreshCw,
  Warehouse,
  Wrench,
  ShoppingBag,
  LayoutGrid,
  Star,
} from 'lucide-react';

interface DepartmentItem {
  id: DepartmentType | 'all';
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const DEPARTMENTS: DepartmentItem[] = [
  { id: 'all', label: 'All Inbound', shortLabel: 'All', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'general', label: 'General Support', shortLabel: 'Gen', icon: <Headphones className="h-4 w-4" /> },
  { id: 'returns', label: 'Returns & Replacements', shortLabel: 'Ret', icon: <RefreshCw className="h-4 w-4" /> },
  { id: 'operations', label: 'Operations & Warehouse', shortLabel: 'Ops', icon: <Warehouse className="h-4 w-4" /> },
  { id: 'installation', label: 'Installation Support', shortLabel: 'Inst', icon: <Wrench className="h-4 w-4" /> },
  { id: 'sales', label: 'Sales & VIP', shortLabel: 'VIP', icon: <ShoppingBag className="h-4 w-4" /> },
];

interface DepartmentSelectorProps {
  collapsed?: boolean;
}

export function DepartmentSelector({ collapsed }: DepartmentSelectorProps) {
  const { activeDepartment, setActiveDepartment } = useCareStore();

  return (
    <div className="p-3 border-t border-border">
      {!collapsed && (
        <h3 className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Departments & Teams
        </h3>
      )}

      <div className="space-y-0.5">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setActiveDepartment(dept.id)}
            className={clsx(
              'w-full flex items-center gap-3 rounded-lg transition-all duration-150',
              collapsed ? 'p-2 justify-center' : 'px-3 py-2',
              activeDepartment === dept.id
                ? 'bg-[#74A09F]/15 text-[#74A09F] font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
            title={dept.label}
          >
            <div
              className={clsx(
                'h-7 w-7 rounded-md flex items-center justify-center shrink-0',
                activeDepartment === dept.id ? 'bg-[#74A09F]/20 text-[#74A09F]' : 'bg-transparent text-muted-foreground'
              )}
            >
              {dept.icon}
            </div>
            {!collapsed && <span className="flex-1 text-sm text-left">{dept.label}</span>}
          </button>
        ))}
      </div>

      {/* My Assigned / Unassigned Toggle */}
      {!collapsed && (
        <div className="mt-4 space-y-1">
          <h3 className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Assignment
          </h3>
          <label className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors cursor-pointer">
            <input type="radio" name="assignment" defaultChecked className="accent-[#74A09F]" />
            <Star className="h-3.5 w-3.5 text-amber-400" />
            My Assigned Chats
          </label>
          <label className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors cursor-pointer">
            <input type="radio" name="assignment" className="accent-[#74A09F]" />
            Team Unassigned Pool
          </label>
        </div>
      )}
    </div>
  );
}
