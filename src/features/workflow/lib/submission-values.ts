import type { Submission, WorkflowDocumentConfig } from '../types';

type SubmissionFieldConfig = Pick<WorkflowDocumentConfig, 'field_key' | 'type'>;

export const normalizeStoredSubmissionValue = (
  value: unknown,
  fieldType?: SubmissionFieldConfig['type']
): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();

  if (fieldType === 'BOOLEAN') {
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
  }

  if (
    fieldType === 'VENDOR_EMAIL' ||
    fieldType === 'COMMITTEE_EMAIL' ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return value;
    }
  }

  return value;
};

export const buildSubmissionFormData = (
  submission: Submission | null,
  fieldConfigs: SubmissionFieldConfig[] = []
): Record<string, unknown> => {
  const formData: Record<string, unknown> = {};
  const fieldTypeByKey = new Map(fieldConfigs.map((config) => [config.field_key, config.type]));

  if (!submission) return formData;

  submission.documents.forEach((doc) => {
    formData[doc.field_key] = normalizeStoredSubmissionValue(
      doc.file_path ?? doc.file_name ?? doc.value,
      fieldTypeByKey.get(doc.field_key)
    );
  });

  if (Array.isArray(submission.meta_data)) {
    submission.meta_data.forEach((item) => {
      if (!item || typeof item !== 'object') return;

      const fieldKey = (item as { field_key?: unknown }).field_key;
      const value = (item as { value?: unknown }).value;

      if (typeof fieldKey === 'string') {
        formData[fieldKey] = normalizeStoredSubmissionValue(value, fieldTypeByKey.get(fieldKey));
      }
    });
  } else if (submission.meta_data && typeof submission.meta_data === 'object') {
    Object.entries(submission.meta_data).forEach(([fieldKey, value]) => {
      formData[fieldKey] = normalizeStoredSubmissionValue(value, fieldTypeByKey.get(fieldKey));
    });
  }

  return formData;
};
