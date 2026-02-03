import { z } from 'zod';

import { RoleEnum } from './auth';
import { ProcurementTypeEnum, ProjectStatusEnum, UnitResponsibleTypeEnum } from './project';

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
  procurement_type: ProcurementTypeEnum,
  current_template_type: UnitResponsibleTypeEnum,
  is_urgent: z.boolean(),
  title: z.string(),
  description: z.string().nullable(),
  budget: z.number().nullable(),
  status: ProjectStatusEnum,
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
    role: RoleEnum,
    unit_name: z.string(),
    unit_id: z.string(),
    dept_name: z.string(),
    dept_id: z.string(),
  }),
  assignee_procurement: z.object({
    id: z.string().nullable(),
    full_name: z.string().nullable(),
    role: RoleEnum.nullable(),
    unit_name: z.string().nullable(),
    unit_id: z.string().nullable(),
  }),
  assignee_contract: z.object({
    id: z.string().nullable(),
    full_name: z.string().nullable(),
    role: RoleEnum.nullable(),
    unit_name: z.string().nullable(),
    unit_id: z.string().nullable(),
  }),
  current_step: z.object({
    name: z.string(),
    order: z.number(),
  }),
  workflow: z.object({
    type: UnitResponsibleTypeEnum,
    steps: z.array(WorkflowStepConfigSchema),
  }),
  submissions: z.array(SubmissionSchema),
});

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
