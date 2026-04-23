import type { WorkflowStepConfig } from '@/features/workflow';

export interface SubmissionPayload {
  files?: Array<{
    field_key: string;
    file_name: string;
    file_path: string;
  }>;
  meta_data: Array<{
    field_key?: string;
    value?: string;
  }>;
}

function serialiseMetaValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return JSON.stringify(value);
  return String(value);
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
      field_key: document.field_key,
      value: serialiseMetaValue(value),
    });
  }

  return {
    files: files.length > 0 ? files : undefined,
    meta_data: metaData,
  };
}
