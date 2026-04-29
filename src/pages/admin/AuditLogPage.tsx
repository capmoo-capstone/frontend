import { useMemo, useState } from 'react';

import { ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { mockAuditLogs } from '@/features/audit-log/data/mock-audit-logs';
import { AuditLogTable } from '@/features/audit-log/components/AuditLogTable';
import { AuditLogToolbar } from '@/features/audit-log/components/AuditLogToolbar';
import type { AuditLogItem, AuditLogKindFilter } from '@/features/audit-log/types';

const getStartOfDate = (date: string) => new Date(`${date}T00:00:00`).getTime();
const getEndOfDate = (date: string) => new Date(`${date}T23:59:59.999`).getTime();

const buildSearchText = (item: AuditLogItem) =>
  [
    item.kind,
    item.title,
    item.description,
    item.actor?.name,
    item.target?.name,
    item.target?.refNo,
    JSON.stringify(item.details),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<AuditLogKindFilter>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredLogs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const startTime = dateFrom ? getStartOfDate(dateFrom) : null;
    const endTime = dateTo ? getEndOfDate(dateTo) : null;

    return [...mockAuditLogs]
      .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())
      .filter((item) => {
        if (kindFilter !== 'ALL' && item.kind !== kindFilter) {
          return false;
        }

        const occurredTime = new Date(item.occurredAt).getTime();

        if (startTime !== null && occurredTime < startTime) {
          return false;
        }

        if (endTime !== null && occurredTime > endTime) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return buildSearchText(item).includes(normalizedQuery);
      });
  }, [dateFrom, dateTo, kindFilter, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || kindFilter !== 'ALL' || dateFrom !== '' || dateTo !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setKindFilter('ALL');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand-9 h-6 w-6" />
            <h1 className="h1-topic text-primary">Audit Log</h1>
          </div>
          <p className="normal text-muted-foreground max-w-3xl">
            Super-admin activity view for project history, project cancellations, and user
            delegations. This page currently uses frontend mock data only.
          </p>
        </div>
        <Badge variant="secondary">Mock data</Badge>
      </header>

      <AuditLogToolbar
        searchQuery={searchQuery}
        kindFilter={kindFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearchQuery}
        onKindChange={setKindFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReset={handleResetFilters}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="caption text-muted-foreground">
          Showing {filteredLogs.length} of {mockAuditLogs.length} mock audit records
        </p>
      </div>

      <AuditLogTable items={filteredLogs} />
    </div>
  );
}
