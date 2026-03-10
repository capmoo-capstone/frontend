import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export interface ExportTableAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'brand' | 'destructive' | 'ghost' | 'link' | 'secondary';
  disabled?: boolean;
  title?: string;
}

export interface ExportTableToolbarProps {
  selectedCount: number;
  hasSelection: boolean;
  onToggleSelectAll: () => void;
  selectAllLabel?: string;
  deselectAllLabel?: string;
  actions: ExportTableAction[];
  /** Optional date range filter component (e.g., <DateRangeFilter />) */
  dateRangeFilter?: ReactNode;
}

/**
 * Reusable toolbar component for export tables
 * Provides optional date range filter, selection controls, and customizable action buttons
 */
export function ExportTableToolbar({
  selectedCount,
  hasSelection,
  onToggleSelectAll,
  selectAllLabel = 'เลือกทั้งหมด',
  deselectAllLabel = 'ยกเลิกการเลือก',
  actions,
  dateRangeFilter,
}: ExportTableToolbarProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
      {/* Left Side: Date Filter & Selection Info */}
      <div className="flex flex-1 items-center gap-4">
        {/* Optional Date Range Filter */}
        {dateRangeFilter && <div className="flex items-center">{dateRangeFilter}</div>}

        {/* Selection Count */}
        {hasSelection && (
          <div className="text-muted-foreground hidden text-sm font-medium whitespace-nowrap md:block">
            เลือกแล้ว {selectedCount} รายการ
          </div>
        )}
      </div>

      {/* Right Side: Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={onToggleSelectAll}>
          {hasSelection ? deselectAllLabel : selectAllLabel}
        </Button>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant ?? 'brand'}
            onClick={action.onClick}
            disabled={action.disabled ?? false}
            title={action.title}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
