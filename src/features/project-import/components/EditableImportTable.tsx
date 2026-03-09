import { useMemo, useState } from 'react';

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { File, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { RESPONSIBLE_SELECT_OPTIONS } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import type { EditableImportRow } from '../types';
import { ExcelImportSchema } from '../types';

interface Props {
  data: EditableImportRow[];
  updateRow: (index: number, id: string, value: any) => void;
  deleteRow: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  departments: Array<{ id: string; name: string }> | undefined;
  fiscalYears: string[];
}

interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

// Editable Cell Component
const EditableCell = ({ getValue, row: { index }, column: { id }, table }: any) => {
  const initialValue = getValue();
  const updateData = table.options.meta?.updateData;
  const departments = table.options.meta?.departments;
  const fiscalYears = table.options.meta?.fiscalYears;
  const errors = table.options.meta?.errors || [];
  const value = initialValue ?? '';

  const cellError = errors.find(
    (err: ValidationError) => err.rowIndex === index && err.field === id
  );
  const hasError = !!cellError;

  if (id === 'procurement_type') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Select value={value} onValueChange={(val) => updateData(index, id, val)}>
          <SelectTrigger
            className={cn('bg-background h-9 w-full', hasError && 'border-destructive')}
          >
            <SelectValue placeholder="กรุณาเลือกวิธีการจัดหา" />
          </SelectTrigger>
          <SelectContent>
            {RESPONSIBLE_SELECT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {cellError && <p className="text-destructive text-xs">{cellError.message}</p>}
      </div>
    );
  }

  if (id === 'department_id') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Select value={value} onValueChange={(val) => updateData(index, id, val)}>
          <SelectTrigger
            className={cn('bg-background h-9 w-full', hasError && 'border-destructive')}
          >
            <SelectValue placeholder="กรุณาเลือกหน่วยงาน" />
          </SelectTrigger>
          <SelectContent>
            {departments &&
              departments.map((dept: { id: string; name: string }) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {cellError && <p className="text-destructive text-xs">{cellError.message}</p>}
      </div>
    );
  }

  if (id === 'fiscal_year') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Select value={value} onValueChange={(val) => updateData(index, id, val)}>
          <SelectTrigger
            className={cn('bg-background h-9 w-full', hasError && 'border-destructive')}
          >
            <SelectValue placeholder="เลือกปีงบประมาณ" />
          </SelectTrigger>
          <SelectContent>
            {fiscalYears &&
              fiscalYears.map((year: string) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {cellError && <p className="text-destructive text-xs">{cellError.message}</p>}
      </div>
    );
  }

  if (id === 'delivery_date_str') {
    const dateValue = value ? new Date(value) : undefined;

    return (
      <div className="flex w-full flex-col gap-1">
        <DatePicker
          date={dateValue}
          disabledDays={{ before: new Date() }}
          setDate={(date) => {
            const dateStr = date ? date.toISOString().split('T')[0] : '';
            updateData(index, id, dateStr);
          }}
          className={cn('bg-background h-9 w-full', hasError && 'border-destructive')}
        />
        {cellError && <p className="text-destructive text-xs">{cellError.message}</p>}
      </div>
    );
  }

  // Handle long text fields (title, description) with Textarea
  if (id === 'description') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Textarea
          value={value}
          onChange={(e) => updateData(index, id, e.target.value)}
          className={cn(
            'min-h-10 w-full resize-y py-1.5 text-sm',
            hasError && 'border-destructive'
          )}
          rows={2}
        />
        {cellError && <p className="text-destructive text-xs">{cellError.message}</p>}
      </div>
    );
  }

  // Handle Text and Number fields (for short fields like pr_no, budget)
  return (
    <div className="flex w-full flex-col gap-1">
      <Input
        type={id === 'budget' ? 'number' : 'text'}
        value={value}
        onChange={(e) =>
          updateData(index, id, id === 'budget' ? e.target.valueAsNumber : e.target.value)
        }
        className={cn('h-9 w-full', hasError && 'border-destructive')}
      />
      {cellError && <p className="text-destructive text-xs">{cellError.message}</p>}
    </div>
  );
};

export function EditableImportTable({
  data,
  updateRow,
  deleteRow,
  onSubmit,
  onBack,
  departments,
  fiscalYears,
}: Props) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateData = () => {
    const errors: ValidationError[] = [];

    data.forEach((row, index) => {
      try {
        const rowData = {
          ...row,
          delivery_date: row.delivery_date_str ? new Date(row.delivery_date_str) : undefined,
        };
        ExcelImportSchema.parse(rowData);
      } catch (error: any) {
        if (error.errors) {
          error.errors.forEach((err: any) => {
            const field = err.path[0];
            const displayField = field === 'delivery_date' ? 'delivery_date_str' : field;
            errors.push({
              rowIndex: index,
              field: displayField,
              message: err.message,
            });
          });
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    if (validateData()) {
      onSubmit();
    }
  };

  // Add the `size` property to control column widths
  const columns = useMemo<ColumnDef<EditableImportRow>[]>(
    () => [
      {
        accessorKey: 'pr_no',
        header: () => (
          <>
            เลขที่ใบขอซื้อขอจ้าง (PR) <span className="text-destructive">*</span>
          </>
        ),
        cell: EditableCell,
        size: 180, // Short
      },
      {
        accessorKey: 'title',
        header: () => (
          <>
            โครงการ <span className="text-destructive">*</span>
          </>
        ),
        cell: EditableCell,
        size: 350, // Long
      },
      {
        accessorKey: 'description',
        header: () => (
          <>
            รายละเอียด <span className="text-destructive">*</span>
          </>
        ),
        cell: EditableCell,
        size: 350, // Long
      },
      {
        accessorKey: 'procurement_type',
        header: () => (
          <>
            วิธีการจัดหา <span className="text-destructive">*</span>
          </>
        ),
        cell: EditableCell,
        size: 250, // Medium
      },
      {
        accessorKey: 'delivery_date_str',
        header: 'วันที่ส่งมอบ',
        cell: EditableCell,
        size: 180,
      },
      {
        accessorKey: 'budget',
        header: () => (
          <>
            วงเงินงบประมาณ (บาท) <span className="text-destructive">*</span>
          </>
        ),
        cell: EditableCell,
        size: 180,
      },
      {
        accessorKey: 'department_id',
        header: () => (
          <>
            หน่วยงาน <span className="text-destructive">*</span>
          </>
        ),
        cell: EditableCell,
        size: 220,
      },
      {
        accessorKey: 'fiscal_year',
        header: () => (
          <>
            ปีงบประมาณ <span className="text-destructive">*</span>
          </>
        ),
        cell: EditableCell,
        size: 140, // Short
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteRow(row.index)}
            className="mx-auto block hover:bg-transparent"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        ),
        size: 60, // Very Short
      },
    ],
    [deleteRow]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: updateRow,
      departments,
      fiscalYears,
      errors: validationErrors,
    },
  });

  return (
    <div className="w-full space-y-6">
      <div className="rounded-md border bg-white p-6 shadow-sm">
        <div className="h2-topic text-primary mb-4 flex items-center gap-2">
          <File className="h-5 w-5" />
          ไฟล์แนบ
        </div>

        <div className="overflow-x-auto pb-4">
          {/* Added table-fixed to respect column widths */}
          <Table
            className="border-separate border-spacing-y-2"
            style={{ tableLayout: 'fixed', minWidth: table.getTotalSize() }}
          >
            <TableHeader className="bg-transparent">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-none hover:bg-transparent">
                  {hg.headers.map((h) => (
                    // Apply the width from TanStack to the TableHead
                    <TableHead
                      key={h.id}
                      style={{ width: h.getSize() }}
                      className="h-10 px-2 text-xs font-bold text-slate-800"
                    >
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
                    // Apply the width from TanStack to the TableCell
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="p-1 px-2 align-top"
                    >
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
          onClick={handleSubmit}
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
