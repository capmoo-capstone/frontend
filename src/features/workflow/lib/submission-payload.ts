import type { ProjectUpdateFieldKey, WorkflowStepConfig } from '../types';

const PROJECT_UPDATE_FIELD_KEYS = new Set<ProjectUpdateFieldKey>([
  'pr_no',
  'po_no',
  'less_no',
  'contract_no',
  'migo_no',
  'asset_code',
  'vendor_name',
  'vendor_email',
]);

type SubmissionMetaValue = string | number | boolean;

export interface SubmissionPayload {
  files?: Array<{
    field_key: string;
    file_name: string;
    file_path: string;
  }>;
  meta_data: Array<{
    field_key?: string;
    value?: SubmissionMetaValue;
  }>;
  required_updating: boolean;
}

function serialiseMetaValue(
  value: unknown,
  projectUpdateKey?: ProjectUpdateFieldKey
): SubmissionMetaValue {
  if (projectUpdateKey === 'asset_code' && typeof value === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return JSON.stringify(value);
  return String(value);
}

export function hasProjectUpdateMetaData(metaData: unknown): boolean {
  if (Array.isArray(metaData)) {
    return metaData.some((item) => {
      if (!item || typeof item !== 'object') return false;
      const fieldKey = (item as { field_key?: unknown }).field_key;
      return (
        typeof fieldKey === 'string' &&
        PROJECT_UPDATE_FIELD_KEYS.has(fieldKey as ProjectUpdateFieldKey)
      );
    });
  }

  if (metaData && typeof metaData === 'object') {
    return Object.keys(metaData).some((fieldKey) =>
      PROJECT_UPDATE_FIELD_KEYS.has(fieldKey as ProjectUpdateFieldKey)
    );
  }

  return false;
}

export function buildSubmissionPayload(
  step: WorkflowStepConfig,
  formData: Record<string, unknown>
): SubmissionPayload {
  const files: SubmissionPayload['files'] = [];
  const metaData: SubmissionPayload['meta_data'] = [];

  for (const document of step.required_documents) {
    const value = formData[document.field_key];

    if (document.type === 'FILE') {
      const fileValues = Array.isArray(value) ? value : value ? [value] : [];

      for (const fileValue of fileValues) {
        if (typeof fileValue === 'string') {
          files.push({
            field_key: document.field_key,
            file_name: fileValue.split('/').pop() ?? fileValue,
            file_path: fileValue,
          });
          continue;
        }

        if (fileValue instanceof File) {
          files.push({
            field_key: document.field_key,
            file_name: fileValue.name,
            file_path: fileValue.name,
          });
        }
      }

      continue;
    }

    if (value === undefined || value === null || value === '') {
      continue;
    }

    metaData.push({
      field_key: document.project_update_key ?? document.field_key,
      value: serialiseMetaValue(value, document.project_update_key),
    });
  }

  return {
    files: files.length > 0 ? files : undefined,
    meta_data: metaData,
    required_updating: hasProjectUpdateMetaData(metaData),
  };
}
