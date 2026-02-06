import { type Table as ReactTable, flexRender } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface UnitDataTableProps<TData> {
  table: ReactTable<TData>;
  columnsLength: number;
  toolbar?: React.ReactNode;
}

export function UnitDataTable<TData>({ table, columnsLength, toolbar }: UnitDataTableProps<TData>) {
  return (
    <div className="w-full">
      <div className="mb-4 w-full">
        <div className="flex items-center">{toolbar}</div>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
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
    </div>
  );
}
