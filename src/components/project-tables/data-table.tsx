import { useNavigate } from 'react-router-dom';

import { type Cell, type Table as ReactTable, type Row, flexRender } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTablePagination } from './data-table-pagination';

interface ProjectDataTableProps<TData> {
  table: ReactTable<TData>;
  columnsLength: number;
  toolbar?: React.ReactNode;
  hasPagination?: boolean;
}

export function ProjectDataTable<TData>({
  table,
  columnsLength,
  toolbar,
  hasPagination = true,
}: ProjectDataTableProps<TData>) {
  const navigate = useNavigate();

  const handleNavigate = (row: any) => {
    const projectId = row.original.id;
    if (projectId) {
      navigate(`/app/projects/${projectId}`);
    }
  };

  const handleRowDoubleClick = (row: Row<TData>, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const isInteractiveElement = target.closest('button, a, [role="button"]');

    if (isInteractiveElement) {
      return;
    }

    handleNavigate(row);
  };

  const handleCellClick = (
    row: Row<TData>,
    cell: Cell<TData, unknown>,
    event: React.MouseEvent
  ) => {
    if (cell.column.id === 'title') {
      const target = event.target as HTMLElement;
      const isInteractiveElement = target.closest('button, a, [role="button"]');

      if (!isInteractiveElement) {
        handleNavigate(row);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 w-full">
        <div className="flex items-center gap-2">{toolbar}</div>
      </div>

      <div className="overflow-hidden bg-background">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onDoubleClick={(e) => handleRowDoubleClick(row, e)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => handleCellClick(row, cell, e)}
                      className={cell.column.id === 'title' ? 'cursor-pointer hover:underline' : ''}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsLength} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && <DataTablePagination table={table} />}
    </div>
  );
}
