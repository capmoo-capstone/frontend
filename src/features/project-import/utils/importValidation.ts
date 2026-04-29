import type { EditableImportRow, ImportMode } from '../types';
import { FioriImportSchema, LesspaperImportSchema } from '../types';

export interface ImportValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export function validateImportRows(
  data: EditableImportRow[],
  mode: ImportMode
): ImportValidationError[] {
  const errors: ImportValidationError[] = [];
  const schema = mode === 'lesspaper' ? LesspaperImportSchema : FioriImportSchema;

  data.forEach((row, index) => {
    const rowData = {
      pr_no: row.pr_no ?? '',
      lesspaper_no: row.lesspaper_no ?? '',
      title: row.title ?? '',
      description: row.description ?? '',
      procurement_type: row.procurement_type ?? '',
      budget: row.budget ?? '',
      department_id: row.department_id ?? '',
      fiscal_year: row.fiscal_year ?? '',
      delivery_date: row.delivery_date_str ? new Date(row.delivery_date_str) : undefined,
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

  return errors;
}
