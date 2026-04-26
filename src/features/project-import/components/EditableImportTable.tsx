import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { File, Trash2 } from 'lucide-react';

import { ConfirmDialog } from '@/components/shared-dialog';
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
import { ImportBudgetPlanItemSchema } from '@/features/budgets';
import { RESPONSIBLE_SELECT_OPTIONS } from '@/features/projects';
import { formatDateThai, parseThaiDateString } from '@/lib/date-formatters';
import { cn } from '@/lib/utils';

import type { EditableImportRow, ImportMode } from '../types';
import { FioriImportSchema, LesspaperImportSchema } from '../types';

interface EditableImportTableProps {
  data: EditableImportRow[];
  updateRow: (index: number, id: string, value: unknown) => void;
  deleteRow: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  departments: Array<{ id: string; name: string }> | undefined;
  fiscalYears: string[];
  units?: Array<{ id: string; name: string; dept_id?: string }> | undefined;
  mode: ImportMode;
}

interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

interface EditableTableMeta {
  updateData: (index: number, id: string, value: unknown) => void;
  mode: ImportMode;
  departments: Array<{ id: string; name: string }> | undefined;
  units: Array<{ id: string; name: string; dept_id?: string }> | undefined;
  unitsByDeptId: Map<string, Array<{ id: string; name: string; dept_id?: string }>>;
  unitIdSetByDeptId: Map<string, Set<string>>;
  fiscalYears: string[];
  errorMap: Map<string, string>;
  departmentIdSet: Set<string>;
  departmentNameToId: Map<string, string>;
  unitIdSet: Set<string>;
  unitNameToId: Map<string, string>;
}

type PendingDelete = {
  index: number;
  title: string;
};

const buildErrorKey = (rowIndex: number, field: string) => `${rowIndex}:${field}`;

// Editable Cell Component
const EditableCell = ({
  getValue,
  row,
  column: { id },
  table,
}: CellContext<EditableImportRow, unknown>) => {
  const { index, original } = row;
  const initialValue = getValue();
  const initialTextValue = initialValue == null ? '' : String(initialValue);
  const isCurrencyField = id === 'budget_amount' || id === 'budget';
  const formatWithComma = (val: unknown) => {
    if (val === null || val === undefined || val === '') return '';
    const num = Number(String(val).replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const meta = table.options.meta as EditableTableMeta | undefined;
  const updateData = meta?.updateData;
  const mode = meta?.mode;
  const departments = meta?.departments;
  const fiscalYears = meta?.fiscalYears;
  const unitsByDeptId = meta?.unitsByDeptId;
  const unitIdSetByDeptId = meta?.unitIdSetByDeptId;
  const errorMap = meta?.errorMap;
  const departmentIdSet = meta?.departmentIdSet;
  const departmentNameToId = meta?.departmentNameToId;
  const unitIdSet = meta?.unitIdSet;
  const unitNameToId = meta?.unitNameToId;

  const [value, setValue] = useState(
    isCurrencyField ? formatWithComma(initialValue) : initialTextValue
  );

  useEffect(() => {
    setValue(isCurrencyField ? formatWithComma(initialValue) : initialTextValue);
  }, [initialTextValue, initialValue, isCurrencyField]);

  const onBlur = () => {
    if (!updateData) return;

    let finalValue: unknown = value;
    if (id === 'budget' || id === 'budget_amount') {
      finalValue = value === '' ? '' : Number(value);
    }
    updateData(index, id, finalValue);
  };

  const cellError = errorMap?.get(buildErrorKey(index, id));
  const hasError = Boolean(cellError);

  const resolveSelectValue = (
    rawValue: string,
    idSet: Set<string> | undefined,
    nameToId: Map<string, string> | undefined
  ) => {
    const displayValue = nameToId?.get(rawValue) ?? rawValue;
    return idSet?.has(displayValue) ? displayValue : undefined;
  };

  if (id === 'procurement_type') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Select
          value={initialTextValue || undefined}
          onValueChange={(val) => updateData && updateData(index, id, val)}
        >
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
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  if (id === 'department_id') {
    const displayValue = resolveSelectValue(initialTextValue, departmentIdSet, departmentNameToId);
    return (
      <div className="flex w-full flex-col gap-1">
        <Select
          value={displayValue}
          onValueChange={(val) => {
            if (!updateData) return;

            updateData(index, id, val);
            // Keep row data consistent: selecting a new department invalidates previous unit selection.
            updateData(index, 'unit_id', '');
          }}
        >
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
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  if (id === 'fiscal_year' || id === 'budget_year') {
    const excelYearNum = parseInt(initialTextValue);
    const matchedYear = fiscalYears?.find((year) => {
      const yearNum = parseInt(year);
      return (
        year === initialTextValue || yearNum === excelYearNum + 543 || yearNum === excelYearNum
      );
    });
    const displayValue = matchedYear ? matchedYear : undefined;
    return (
      <div className="flex w-full flex-col gap-1">
        <Select
          value={displayValue}
          onValueChange={(val) => {
            if (!updateData) return;
            if (id === 'budget_year') {
              updateData(index, id, Number(val));
              return;
            }
            updateData(index, id, val);
          }}
        >
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
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  if (id === 'delivery_date_str') {
    const dateValue = initialTextValue
      ? parseThaiDateString(initialTextValue, 'ymd', '-')
      : undefined;

    return (
      <div className="flex w-full flex-col gap-1">
        <DatePicker
          date={dateValue}
          disabledDays={{ before: new Date() }}
          setDate={(date) => {
            const dateStr = date ? formatDateThai(date, 'yyyy-MM-dd') : '';
            if (updateData) {
              updateData(index, id, dateStr);
            }
          }}
          className={cn('bg-background h-9 w-full', hasError && 'border-destructive')}
        />
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  if (id === 'pr_no' || id === 'lesspaper_no') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, ''));
          }}
          onBlur={onBlur}
          className={cn('h-9 w-full', hasError && 'border-destructive')}
        />
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  if (id === 'description') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className={cn('min-h-10 w-full resize-y py-1.5', hasError && 'border-destructive')}
          rows={2}
        />
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  if (id === 'unit_id') {
    const rawDepartmentValue = String(original.department_id ?? '').trim();
    const selectedDepartmentId = departmentIdSet?.has(rawDepartmentValue)
      ? rawDepartmentValue
      : (departmentNameToId?.get(rawDepartmentValue) ?? '');
    const filteredUnits = selectedDepartmentId
      ? (unitsByDeptId?.get(selectedDepartmentId) ?? [])
      : [];
    const filteredUnitIdSet = selectedDepartmentId
      ? (unitIdSetByDeptId?.get(selectedDepartmentId) ?? new Set<string>())
      : new Set<string>();

    const normalizedUnitValue = resolveSelectValue(initialTextValue, unitIdSet, unitNameToId);
    const displayValue =
      normalizedUnitValue && filteredUnitIdSet.has(normalizedUnitValue)
        ? normalizedUnitValue
        : undefined;
    const controlledUnitValue = displayValue ?? '';
    return (
      <div className="flex w-full flex-col gap-1">
        <Select
          value={controlledUnitValue}
          disabled={!selectedDepartmentId}
          onValueChange={(val) => updateData && updateData(index, id, val)}
        >
          <SelectTrigger
            className={cn('bg-background h-9 w-full', hasError && 'border-destructive')}
          >
            <SelectValue
              placeholder={`กรุณาเลือก${mode === 'budget' ? 'ชื่อศูนย์ต้นทุน' : 'ฝ่าย'}`}
            />
          </SelectTrigger>
          <SelectContent>
            {filteredUnits.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  if (id === 'budget_amount' || id === 'budget') {
    return (
      <div className="flex w-full flex-col gap-1">
        <Input
          type="text"
          className={cn('h-9 w-full text-right font-mono', hasError && 'border-destructive')}
          value={value}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, '');
            if (/^\d*\.?\d*$/.test(rawValue)) {
              setValue(e.target.value);
            }
          }}
          onFocus={() => {
            setValue(value.replace(/,/g, ''));
          }}
          onBlur={() => {
            if (!updateData) return;
            const rawValue = value.replace(/,/g, '');
            const numValue = rawValue === '' ? 0 : Number(rawValue);
            updateData(index, id, numValue);
            setValue(formatWithComma(numValue));
          }}
        />
        {hasError && <p className="text-destructive text-xs">{cellError}</p>}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className={cn('h-9 w-full', hasError && 'border-destructive')}
      />
      {cellError && <p className="text-destructive text-xs">{cellError}</p>}
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
  units,
  mode,
}: EditableImportTableProps) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const departmentIdSet = useMemo(
    () => new Set((departments ?? []).map((dept) => dept.id)),
    [departments]
  );
  const departmentNameToId = useMemo(
    () => new Map((departments ?? []).map((dept) => [dept.name, dept.id])),
    [departments]
  );
  const unitIdSet = useMemo(() => new Set((units ?? []).map((unit) => unit.id)), [units]);
  const unitNameToId = useMemo(
    () => new Map((units ?? []).map((unit) => [unit.name, unit.id])),
    [units]
  );
  const unitsByDeptId = useMemo(() => {
    const grouped = new Map<string, Array<{ id: string; name: string; dept_id?: string }>>();
    for (const unit of units ?? []) {
      if (!unit.dept_id) continue;
      const existing = grouped.get(unit.dept_id);
      if (existing) {
        existing.push(unit);
      } else {
        grouped.set(unit.dept_id, [unit]);
      }
    }
    return grouped;
  }, [units]);
  const unitIdSetByDeptId = useMemo(() => {
    const sets = new Map<string, Set<string>>();
    for (const [deptId, deptUnits] of unitsByDeptId) {
      sets.set(deptId, new Set(deptUnits.map((unit) => unit.id)));
    }
    return sets;
  }, [unitsByDeptId]);

  const errorMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const err of validationErrors) {
      map.set(buildErrorKey(err.rowIndex, err.field), err.message);
    }
    return map;
  }, [validationErrors]);

  const handleConfirmDelete = () => {
    if (pendingDelete !== null) {
      deleteRow(pendingDelete.index);
      setPendingDelete(null);
    }
  };

  const validateData = useCallback(() => {
    const errors: ValidationError[] = [];

    const normalizeOptionId = (
      value: string | undefined,
      idSet: Set<string>,
      nameToId: Map<string, string>
    ) => {
      const raw = value?.trim();
      if (!raw) return '';
      if (idSet.has(raw)) return raw;
      return nameToId.get(raw) ?? '';
    };

    const schema =
      mode === 'budget'
        ? ImportBudgetPlanItemSchema
        : mode === 'lesspaper'
          ? LesspaperImportSchema
          : FioriImportSchema;

    data.forEach((row, index) => {
      const rowData =
        mode === 'budget'
          ? {
              id: row._rowId,
              budget_year: Number(row.budget_year ?? 0),
              unit_id: normalizeOptionId(row.unit_id, unitIdSet, unitNameToId),
              department_id: normalizeOptionId(
                row.department_id,
                departmentIdSet,
                departmentNameToId
              ),
              activity_type: row.activity_type ?? '',
              activity_type_name: row.activity_type_name ?? '',
              description: row.description ?? '',
              budget_name: row.budget_name ?? '',
              budget_amount: Number(row.budget_amount ?? 0),
              project_id: null,
            }
          : {
              pr_no: row.pr_no ?? '',
              lesspaper_no: row.lesspaper_no ?? '',
              title: row.title ?? '',
              description: row.description ?? '',
              procurement_type: row.procurement_type ?? '',
              budget: Number(row.budget ?? 0),
              department_id: normalizeOptionId(
                row.department_id,
                departmentIdSet,
                departmentNameToId
              ),
              unit_id: normalizeOptionId(row.unit_id, unitIdSet, unitNameToId),
              fiscal_year: row.fiscal_year ?? '',
              delivery_date: row.delivery_date_str
                ? parseThaiDateString(row.delivery_date_str, 'ymd', '-')
                : undefined,
            };

      const result = schema.safeParse(rowData);

      if (!result.success) {
        result.error.issues.forEach((err) => {
          const field = err.path[0] as string;
          const displayField = field === 'delivery_date' ? 'delivery_date_str' : field;
          errors.push({
            rowIndex: index,
            field: displayField,
            message: err.message,
          });
        });
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  }, [data, mode, unitIdSet, unitNameToId, departmentIdSet, departmentNameToId]);

  useEffect(() => {
    if (data.length > 0) {
      validateData();
    } else {
      setValidationErrors([]);
    }
  }, [data, validateData]);

  const handleSubmit = () => {
    if (validateData()) {
      onSubmit();
    }
  };

  const columns = useMemo<ColumnDef<EditableImportRow>[]>(
    () => [
      ...(mode === 'budget'
        ? [
            {
              accessorKey: 'budget_year',
              header: () => (
                <>
                  ปีงบประมาณ <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 140,
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
              accessorKey: 'unit_id',
              header: () => (
                <>
                  ชื่อศูนย์ต้นทุน <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 320,
            },
            {
              accessorKey: 'budget_name',
              header: () => (
                <>
                  ชื่อเงินทุน <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 220,
            },
            {
              accessorKey: 'activity_type',
              header: () => (
                <>
                  ประเภทกิจกรรม <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 140,
            },
            {
              accessorKey: 'activity_type_name',
              header: () => (
                <>
                  ชื่อประเภทกิจกรรม <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 200,
            },
            {
              accessorKey: 'description',
              header: () => (
                <>
                  รายละเอียด <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 350,
            },
            {
              accessorKey: 'budget_amount',
              header: () => (
                <>
                  วงเงินงบประมาณ (บาท) <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 180,
            },
          ]
        : [
            {
              accessorKey: 'pr_no',
              header: () => <>เลขที่ใบขอซื้อขอจ้าง (PR)</>,
              cell: EditableCell,
              size: 180,
            },
            ...(mode === 'lesspaper'
              ? [
                  {
                    accessorKey: 'lesspaper_no' as const,
                    header: () => (
                      <>
                        เลขที่หนังสือ Lesspaper <span className="text-destructive">*</span>
                      </>
                    ),
                    cell: EditableCell,
                    size: 180,
                  },
                ]
              : []),
            {
              accessorKey: 'title',
              header: () => (
                <>
                  โครงการ <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 350,
            },
            {
              accessorKey: 'description',
              header: () => (
                <>
                  รายละเอียด <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 350,
            },
            {
              accessorKey: 'procurement_type',
              header: () => (
                <>
                  วิธีการจัดหา <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 250,
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
              accessorKey: 'unit_id',
              header: () => (
                <>
                  ฝ่าย <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 320,
            },
            {
              accessorKey: 'fiscal_year',
              header: () => (
                <>
                  ปีงบประมาณ <span className="text-destructive">*</span>
                </>
              ),
              cell: EditableCell,
              size: 140,
            },
          ]),
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setPendingDelete({
                index: row.index,
                title: row.original.title || row.original.activity_type_name || '',
              })
            }
            className="mx-auto block hover:bg-transparent"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        ),
        size: 60,
      },
    ],
    [deleteRow, mode]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: updateRow,
      mode,
      departments,
      units,
      unitsByDeptId,
      unitIdSetByDeptId,
      fiscalYears,
      errorMap,
      departmentIdSet,
      departmentNameToId,
      unitIdSet,
      unitNameToId,
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
          <Table
            className="border-separate border-spacing-y-2"
            style={{ tableLayout: 'fixed', minWidth: table.getTotalSize() }}
          >
            <TableHeader className="bg-transparent">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-none hover:bg-transparent">
                  {hg.headers.map((h) => (
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

      <ConfirmDialog
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`ลบ${mode === 'budget' ? 'แผน' : 'โครงการ'}`}
        description={
          pendingDelete ? (
            <>
              คุณกำลังจะลบ{mode === 'budget' ? 'แผน' : 'โครงการ'}{' '}
              <strong className="text-foreground">&quot;{pendingDelete.title}&quot;</strong>
              <br />
              <br />
              การลบ{mode === 'budget' ? 'แผน' : 'โครงการ'}นี้เป็นการลบแบบถาวร ไม่สามารถนำ
              {mode === 'budget' ? 'แผน' : 'โครงการ'}กลับมาได้ หากต้องการนำกลับมา
              คุณต้องทำการนำเข้าใหม่
            </>
          ) : undefined
        }
        confirmLabel={`ลบ${mode === 'budget' ? 'แผน' : 'โครงการ'}`}
        cancelLabel="ยกเลิก"
        destructive={true}
      />

      <div className="flex justify-end gap-3">
        <Button onClick={handleSubmit} disabled={data.length === 0} variant="brand">
          ยืนยันการนำเข้า{mode === 'budget' ? 'แผน' : 'โครงการ'}
        </Button>
        <Button variant="outline" onClick={onBack} className="border-slate-200 px-8">
          ยกเลิก
        </Button>
      </div>
    </div>
  );
}
