import { RotateCcw, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AUDIT_LOG_KIND_LABELS, type AuditLogKindFilter } from '../types';

type AuditLogToolbarProps = {
  searchQuery: string;
  kindFilter: AuditLogKindFilter;
  dateFrom: string;
  dateTo: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onKindChange: (value: AuditLogKindFilter) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
};

const kindOptions: Array<{ value: AuditLogKindFilter; label: string }> = [
  { value: 'ALL', label: 'All types' },
  { value: 'PROJECT_HISTORY', label: AUDIT_LOG_KIND_LABELS.PROJECT_HISTORY },
  { value: 'PROJECT_CANCELLATION', label: AUDIT_LOG_KIND_LABELS.PROJECT_CANCELLATION },
  { value: 'USER_DELEGATION', label: AUDIT_LOG_KIND_LABELS.USER_DELEGATION },
];

export function AuditLogToolbar({
  searchQuery,
  kindFilter,
  dateFrom,
  dateTo,
  hasActiveFilters,
  onSearchChange,
  onKindChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: AuditLogToolbarProps) {
  return (
    <div className="border-border bg-background flex flex-col gap-3 rounded-md border p-4 shadow-xs lg:flex-row lg:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label htmlFor="audit-log-search" className="caption text-primary font-medium">
          Search
        </label>
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="audit-log-search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title, actor, target, ref no"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="audit-log-kind" className="caption text-primary font-medium">
            Type
          </label>
          <Select value={kindFilter} onValueChange={(value) => onKindChange(value as AuditLogKindFilter)}>
            <SelectTrigger id="audit-log-kind" className="w-full sm:w-52">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {kindOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="audit-log-date-from" className="caption text-primary font-medium">
            From
          </label>
          <Input
            id="audit-log-date-from"
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="audit-log-date-to" className="caption text-primary font-medium">
            To
          </label>
          <Input
            id="audit-log-date-to"
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="lg:mb-0"
      >
        <RotateCcw />
        Reset
      </Button>
    </div>
  );
}
