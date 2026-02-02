export type FieldType =
  | 'FILE_UPLOAD'
  | 'TEXT_INPUT'
  | 'DATE_PICKER'
  | 'DATE_WITH_CHECKBOX'
  | 'BOOLEAN';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
}
