import { useMemo } from 'react';

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Calendar, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { EditableImportRow } from '../types';

interface Props {
  data: EditableImportRow[];
  updateRow: (index: number, id: string, value: any) => void;
  deleteRow: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

// Editable Cell Component
const EditableCell = ({ getValue, row: { index }, column: { id }, table }: any) => {
  const initialValue = getValue();
  const updateData = table.options.meta?.updateData;
  const value = initialValue ?? '';

  // Handle Select fields
  if (['procurement_type', 'department_id', 'fiscal_year'].includes(id)) {
    return (
      <Select value={value} onValueChange={(val) => updateData(index, id, val)}>
        <SelectTrigger className="h-9 w-full rounded-full bg-white text-xs">
          <SelectValue placeholder="กรุณาระบุ..." />
        </SelectTrigger>
        <SelectContent>
          {/* TODO: Map actual options */}
          <SelectItem value="example">ตัวอย่างข้อมูล</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // Handle Date field with icon
  if (id === 'delivery_date_str') {
    return (
      <div className="relative">
        <Input
          type="text"
          placeholder="กรุณาระบุวันที่"
          value={value}
          onChange={(e) => updateData(index, id, e.target.value)}
          className="h-9 w-full rounded-full bg-white px-8 text-xs"
        />
        <Calendar className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
      </div>
    );
  }

  // Handle Text and Number fields
  return (
    <Input
      type={id === 'budget' ? 'number' : 'text'}
      value={value}
      onChange={(e) =>
        updateData(index, id, id === 'budget' ? e.target.valueAsNumber : e.target.value)
      }
      className="h-9 min-w-32 rounded-full border-slate-200 bg-white text-xs focus:ring-1"
    />
  );
};

export function EditableImportTable({ data, updateRow, deleteRow, onSubmit, onBack }: Props) {
  const columns = useMemo<ColumnDef<EditableImportRow>[]>(
    () => [
      { accessorKey: 'pr_no', header: 'เลขที่ใบขอซื้อขอจ้าง (PR) *', cell: EditableCell },
      { accessorKey: 'title', header: 'โครงการ *', cell: EditableCell },
      { accessorKey: 'description', header: 'รายละเอียด *', cell: EditableCell },
      { accessorKey: 'procurement_type', header: 'วิธีการจัดหา *', cell: EditableCell },
      { accessorKey: 'delivery_date_str', header: 'วันที่ส่งมอบ', cell: EditableCell },
      { accessorKey: 'budget', header: 'วงเงินงบประมาณ (บาท) *', cell: EditableCell },
      { accessorKey: 'department_id', header: 'หน่วยงาน *', cell: EditableCell },
      { accessorKey: 'fiscal_year', header: 'ปีงบประมาณ *', cell: EditableCell },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteRow(row.index)}
            className="hover:bg-transparent"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        ),
      },
    ],
    [deleteRow]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData: updateRow },
  });

  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          ไฟล์แนบ
        </div>

        <div className="overflow-x-auto">
          <Table className="border-separate border-spacing-y-2">
            <TableHeader className="bg-transparent">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-none hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="h-10 px-2 text-xs font-bold text-slate-800">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-none hover:bg-transparent">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-1 px-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={onSubmit}
          disabled={data.length === 0}
          className="bg-[#E997B2] px-8 text-white hover:bg-[#d886a1]"
        >
          ยืนยันการนำเข้าโครงการ
        </Button>
        <Button variant="outline" onClick={onBack} className="border-slate-200 px-8">
          ยกเลิก
        </Button>
      </div>
    </div>
  );
}
