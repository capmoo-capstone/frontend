import type { ReactNode } from 'react';

import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ExportTableAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'brand' | 'destructive' | 'ghost' | 'link' | 'secondary';
  disabled?: boolean;
  title?: string;
}

export interface ExportTableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  searchPlaceholder?: string;
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
 * Provides search input, optional date range filter, selection controls, and customizable action buttons
 */
export function ExportTableToolbar({
  searchQuery,
  onSearchChange,
  onSearch,
  onClearSearch,
  searchPlaceholder = 'ค้นหาโครงการ, เลขที่ลงรับ, ผู้รับผิดชอบ...',
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
      {/* Left Side: Search & Selection Info */}
      <div className="flex flex-1 items-center gap-4">
        <div className="bg-background relative w-full max-w-sm rounded-lg">
          <Input
            className="normal pr-20"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute inset-y-0 right-8 flex h-full items-center px-2 hover:bg-transparent"
              onClick={onClearSearch}
            >
              <X className="text-muted-foreground h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent"
            onClick={onSearch}
          >
            <Search className="text-muted-foreground h-4 w-4" />
          </Button>
        </div>

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
