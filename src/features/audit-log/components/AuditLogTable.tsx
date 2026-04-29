import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';



import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { ChevronDown, Inbox } from 'lucide-react';



import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';



import { AUDIT_LOG_KIND_LABELS, type AuditLogItem, type AuditLogKind } from '../types';













































type AuditLogTableProps = {
  items: AuditLogItem[];
};

const kindBadgeVariant: Record<AuditLogKind, 'info' | 'warning' | 'success'> = {
  PROJECT_HISTORY: 'info',
  PROJECT_CANCELLATION: 'warning',
  USER_DELEGATION: 'success',
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(value));

const formatDetailLabel = (value: string) =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (firstLetter) => firstLetter.toUpperCase());

const renderDetailValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">-</span>;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return (
    <pre className="bg-muted text-primary max-h-48 overflow-auto rounded-md p-3 text-xs whitespace-pre-wrap">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

const renderJsonBlock = (value: unknown) => (
  <pre className="bg-muted text-primary max-h-56 overflow-auto rounded-md p-3 text-xs whitespace-pre-wrap">
    {JSON.stringify(value, null, 2)}
  </pre>
);

function AuditLogInlineDetails({ item }: { item: AuditLogItem }) {
  const detailEntries = Object.entries(item.details).filter(
    ([key]) => key !== 'oldValue' && key !== 'newValue'
  );
  const hasBeforeAfter = 'oldValue' in item.details || 'newValue' in item.details;

  return (
    <div className="bg-secondary/50 border-border space-y-5 rounded-md border p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="caption text-muted-foreground">Date / Time</p>
          <p className="normal-b text-primary">{formatDateTime(item.occurredAt)}</p>
        </div>
        <div>
          <p className="caption text-muted-foreground">Actor</p>
          <p className="normal-b text-primary">{item.actor?.name ?? 'SYSTEM'}</p>
        </div>
        <div>
          <p className="caption text-muted-foreground">Target</p>
          <p className="normal-b text-primary wrap-break-word">
            {item.target?.name ?? '-'}
            {item.target?.refNo ? (
              <span className="text-muted-foreground font-normal"> / Ref {item.target.refNo}</span>
            ) : null}
          </p>
        </div>
      </div>

      {hasBeforeAfter && (
        <section className="space-y-3">
          <h2 className="h4-topic text-primary">Before / After</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="caption text-muted-foreground">Before</p>
              {renderJsonBlock(item.details.oldValue)}
            </div>
            <div className="space-y-2">
              <p className="caption text-muted-foreground">After</p>
              {renderJsonBlock(item.details.newValue)}
            </div>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="h4-topic text-primary">Details</h2>
        <div className="bg-background divide-border rounded-md border">
          {detailEntries.map(([key, value]) => (
            <div
              key={key}
              className="grid gap-2 border-b p-3 last:border-b-0 md:grid-cols-[180px_1fr]"
            >
              <p className="caption text-muted-foreground">{formatDetailLabel(key)}</p>
              <div className="normal text-primary min-w-0 wrap-break-word">
                {renderDetailValue(value)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="h4-topic text-primary">Raw JSON</h2>
        {renderJsonBlock(item.details)}
      </section>
    </div>
  );
}

export function AuditLogTable({ items }: AuditLogTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const toggleItem = useCallback((itemId: string) => {
    setExpandedItemId((currentItemId) => (currentItemId === itemId ? null : itemId));
  }, []);

  useEffect(() => {
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));
    setExpandedItemId(null);
  }, [items]);

  const columns = useMemo<ColumnDef<AuditLogItem>[]>(
    () => [
      {
        accessorKey: 'occurredAt',
        header: 'Date / Time',
        cell: ({ row }) => (
          <span className="text-primary whitespace-nowrap">
            {formatDateTime(row.original.occurredAt)}
          </span>
        ),
      },
      {
        accessorKey: 'kind',
        header: 'Type',
        cell: ({ row }) => (
          <Badge variant={kindBadgeVariant[row.original.kind]}>
            {AUDIT_LOG_KIND_LABELS[row.original.kind]}
          </Badge>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div className="min-w-52">
            <p className="normal-b text-primary">{row.original.title}</p>
          </div>
        ),
      },
      {
        id: 'actor',
        header: 'Actor',
        cell: ({ row }) => (
          <span className="text-primary whitespace-nowrap">
            {row.original.actor?.name ?? 'SYSTEM'}
          </span>
        ),
      },
      {
        id: 'target',
        header: 'Target',
        cell: ({ row }) => (
          <div className="min-w-52">
            <p className="normal-b text-primary">{row.original.target?.name ?? '-'}</p>
            {row.original.target?.refNo ? (
              <p className="caption text-muted-foreground">Ref {row.original.target.refNo}</p>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <p className="text-muted-foreground max-w-80 min-w-56 truncate">
            {row.original.description ?? '-'}
          </p>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const isExpanded = expandedItemId === row.original.id;

          return (
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={isExpanded}
              onClick={(event) => {
                event.stopPropagation();
                toggleItem(row.original.id);
              }}
            >
              <ChevronDown
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
              Details
            </Button>
          );
        },
      },
    ],
    [expandedItemId, toggleItem]
  );

  const table = useReactTable({
    data: items,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (items.length === 0) {
    return (
      <Card className="flex min-h-48 items-center justify-center gap-3 rounded-md">
        <Inbox className="text-muted-foreground h-10 w-10" />
        <p className="normal text-primary">No audit logs found.</p>
      </Card>
    );
  }

  return (
    <div className="bg-background overflow-hidden rounded-md border shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const isExpanded = expandedItemId === row.original.id;

              return (
                <Fragment key={row.id}>
                  <TableRow
                    data-state={isExpanded ? 'selected' : undefined}
                    onClick={() => toggleItem(row.original.id)}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length} className="p-4">
                        <AuditLogInlineDetails item={row.original} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <p className="caption text-primary font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 15, 20, 25].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="caption text-primary min-w-28 text-center">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
