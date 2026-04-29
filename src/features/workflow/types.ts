import { z } from 'zod';

export const WorkflowSubmissionBackendStatusSchema = z.enum([
  'WAITING_APPROVAL',
  'WAITING_PROPOSAL',
  'WAITING_SIGNATURE',
  'REJECTED',
  'COMPLETED',
  'SUBMITTED',
  'APPROVED',
  'ACCEPTED',
]);

// ============================================================================
// Workflow Field Types
// ============================================================================

export const FieldTypeSchema = z.enum([
  'FILE',
  'TEXT',
  'NUMBER',
  'BOOLEAN',
  'DATE',
  'DUE_DATE_SELECT',
  'GEN_CONT_NO',
  'VENDOR_EMAIL',
  'COMMITTEE_EMAIL',
  'SELECT_CONTRACT_STATUS',
  'SELECT_DELIVERY_STATUS',
  'SELECT_BUDGET_PLAN',
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

export interface FieldConfig {
  field_key: string;
  label: string;
  type: FieldType;
  mark_as_done?: boolean;
  project_update_key?: ProjectUpdateFieldKey;
}

// ============================================================================
// Workflow Step Types
// ============================================================================

export const UiOnlyStepStatusSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS']);

export const StepStatusSchema = z.union([
  UiOnlyStepStatusSchema,
  WorkflowSubmissionBackendStatusSchema,
]);

export type StepStatus = z.infer<typeof StepStatusSchema>;
export type UiOnlyStepStatus = z.infer<typeof UiOnlyStepStatusSchema>;
export type BackendSubmissionStatus = z.infer<typeof WorkflowSubmissionBackendStatusSchema>;

export const PROJECT_UPDATE_FIELD_KEYS = [
  'pr_no',
  'po_no',
  'less_no',
  'contract_no',
  'migo_no',
  'asset_code',
  'vendor_name',
  'vendor_email',
] as const;

export const ProjectUpdateFieldKeySchema = z.enum(PROJECT_UPDATE_FIELD_KEYS);

export type ProjectUpdateFieldKey = z.infer<typeof ProjectUpdateFieldKeySchema>;

export const WorkflowDocumentConfigSchema = z.object({
  type: FieldTypeSchema,
  label: z.string(),
  field_key: z.string(),
  mark_as_done: z.boolean(),
  project_update_key: ProjectUpdateFieldKeySchema.optional(),
});

export type WorkflowDocumentConfig = z.infer<typeof WorkflowDocumentConfigSchema>;

export const WorkflowStepConfigSchema = z.object({
  name: z.string(),
  order: z.number(),
  required_step: z.array(z.number()),
  required_documents: z.array(WorkflowDocumentConfigSchema),
  required_approval: z.boolean().optional(),
  required_signature: z.boolean().optional(),
});

export type WorkflowStepConfig = z.infer<typeof WorkflowStepConfigSchema>;

// ============================================================================
// Submission Types
// ============================================================================

export const SubmissionDocumentSchema = z.object({
  field_key: z.string(),
  file_name: z.string().optional(),
  file_path: z.string().optional(),
  value: z
    .string()
    .optional()
    .or(z.number().optional())
    .or(z.boolean().optional())
    .or(z.array(z.string()).optional()),
});

export type SubmissionDocument = z.infer<typeof SubmissionDocumentSchema>;

export const SubmissionSchema = z.object({
  id: z.string().optional(),
  project_id: z.string().optional(),
  workflow_type: z.string().optional(),
  submission_type: z.string().nullable().optional(),
  backend_status: WorkflowSubmissionBackendStatusSchema.optional(),
  step_name: z.string().optional(),
  step_order: z.number(),
  submission_round: z.number(),
  po_no: z.string().nullable().optional(),
  status: z.enum(['SUBMITTED', 'APPROVED', 'ACCEPTED', 'COMPLETED', 'REJECTED']),
  submitted_by: z.string().nullable().optional(),
  submitted_at: z.string().nullable().optional(),
  approved_by: z.string().nullable().optional(),
  approved_at: z.string().nullable().optional(),
  proposing_by: z.string().nullable().optional(),
  proposing_at: z.string().nullable().optional(),
  completed_by: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  documents: z.array(SubmissionDocumentSchema),
  meta_data: z.union([z.record(z.string(), z.any()), z.array(z.unknown())]).default([]),
  comment: z.string().nullable().optional(),
  comments: z.string().optional(),
});

export type Submission = z.infer<typeof SubmissionSchema>;
export type SubmissionStatus = Submission['status'];
