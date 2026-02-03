import type { FieldType } from './project-detail';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
}
