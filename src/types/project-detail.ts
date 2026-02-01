import { z } from 'zod';

import type { ProcurementType, ProjectStatus, UnitResponsibleType } from './project';

export const FieldTypeSchema = z.enum([
  'FILE_UPLOAD',
  'TEXT_INPUT',
  'DATE_PICKER',
  'DATE_WITH_CHECKBOX',
  'BOOLEAN',
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

export const StepStatusSchema = z.enum([
  'not_started',
  'in_progress',
  'submitted',
  'approved',
  'rejected',
  'completed',
]);
export type StepStatus = z.infer<typeof StepStatusSchema>;

export const WorkflowDocumentConfigSchema = z.object({
  type: FieldTypeSchema,
  label: z.string(),
  field_key: z.string(),
  is_required: z.boolean(),
});

export type WorkflowDocumentConfig = z.infer<typeof WorkflowDocumentConfigSchema>;

export const WorkflowStepConfigSchema = z.object({
  name: z.string(),
  order: z.number(),
  required_step: z.array(z.number()),
  required_documents: z.array(WorkflowDocumentConfigSchema),
});

export type WorkflowStepConfig = z.infer<typeof WorkflowStepConfigSchema>;

export const SubmissionDocumentSchema = z.object({
  field_key: z.string(),
  file_name: z.string().optional(),
  file_path: z.string().optional(),
  value: z.string().optional(),
});

export type SubmissionDocument = z.infer<typeof SubmissionDocumentSchema>;

export const SubmissionSchema = z.object({
  step_name: z.string(),
  step_order: z.number(),
  submission_round: z.number(),
  status: z.enum(['SUBMITTED', 'APPROVED', 'ACCEPTED', 'REJECTED']),
  submitted_by: z.string(),
  submitted_at: z.string(),
  action_by: z.string().nullable().optional(),
  action_at: z.string().nullable().optional(),
  documents: z.array(SubmissionDocumentSchema),
  meta_data: z.record(z.string(), z.any()),
  comments: z.string().optional(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

export const ProjectDetailSchema = z.object({
  id: z.string(),
  procurement_type: z.string() as z.ZodType<ProcurementType>,
  current_template_type: z.string() as z.ZodType<UnitResponsibleType>,
  is_urgent: z.boolean(),
  title: z.string(),
  description: z.string().nullable(),
  budget: z.number().nullable(),
  status: z.string() as z.ZodType<ProjectStatus>,
  receive_no: z.string(),
  less_no: z.string().nullable(),
  pr_no: z.string().nullable(),
  po_no: z.string().nullable(),
  contract_no: z.string().nullable(),
  migo_no: z.string().nullable(),
  expected_approval_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  vendor: z.object({
    name: z.string().nullable(),
    tax_id: z.string().nullable(),
    email: z.string().nullable(),
  }),
  requester: z.object({
    unit_name: z.string().nullable(),
    unit_id: z.string().nullable(),
    dept_name: z.string().nullable(),
    dept_id: z.string().nullable(),
  }),
  creator: z.object({
    full_name: z.string(),
    role: z.string(),
    unit_name: z.string(),
    unit_id: z.string(),
    dept_name: z.string(),
    dept_id: z.string(),
  }),
  assignee_procurement: z.object({
    id: z.string().nullable(),
    full_name: z.string().nullable(),
    role: z.string().nullable(),
    unit_name: z.string().nullable(),
    unit_id: z.string().nullable(),
  }),
  assignee_contract: z.object({
    id: z.string().nullable(),
    full_name: z.string().nullable(),
    role: z.string().nullable(),
    unit_name: z.string().nullable(),
    unit_id: z.string().nullable(),
  }),
  current_step: z.object({
    name: z.string(),
    order: z.number(),
  }),
  workflow: z.object({
    type: z.string(),
    steps: z.array(WorkflowStepConfigSchema),
  }),
  submissions: z.array(SubmissionSchema),
});

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
