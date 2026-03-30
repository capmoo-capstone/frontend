import { z } from 'zod';

import { RoleEnum, UserSchema } from '@/features/auth';
import { SubmissionSchema, WorkflowStepConfigSchema } from '@/features/workflow';

// ============================================================================
// Project Status & Type Enums
// ============================================================================

export const ProjectStatusEnum = z.enum([
  'UNASSIGNED',
  'WAITING_ACCEPT',
  'IN_PROGRESS',
  'WAITING_CANCEL',
  'CANCELLED',
  'CLOSED',
  'REQUEST_EDIT',
]);

export const ProjectUrgentStatusEnum = z.enum(['NORMAL', 'URGENT', 'VERY_URGENT']);

export const ProcurementTypeEnum = z.enum(['LT100K', 'LT500K', 'MT500K', 'SELECTION', 'EBIDDING', 'NO18']);

export const UnitResponsibleTypeEnum = z.enum([
  'LT100K',
  'LT500K',
  'MT500K',
  'SELECTION',
  'EBIDDING',
  'CONTRACT',
  'NO18'
]);

export const AssignedProjectStatusEnum = z.enum(['WAITING_ACCEPT', 'IN_PROGRESS', 'CANCELLED']);

// ============================================================================
// Basic Project Schema
// ============================================================================

export const WorkflowStatusSchema = z.object({
  p: z.string(),
  c: z.string(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),
  budget: z.union([z.string(), z.number()]).pipe(z.coerce.number()),
  pr_no: z.string().nullable().optional(),
  po_no: z.string().nullable().optional(),
  status: ProjectStatusEnum,
  workflow_status: WorkflowStatusSchema,
  procurement_type: ProcurementTypeEnum,
  request_unit_id: z.string().nullable().optional(),
  current_templates_id: z.string(),
  current_step_id: z.string().nullable().optional(),
  assignee_procurement: z.array(UserSchema).optional(),
  assignee_contract: z.array(UserSchema).optional(),
  contract_no: z.string().nullable().optional(),
  migo_no: z.string().nullable().optional(),
  vendor_name: z.string().nullable().optional(),
  vendor_tax_id: z.string().nullable().optional(),
  vendor_email: z.email().nullable().optional(),
  urgent_status: ProjectUrgentStatusEnum,
  created_by: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  creator: UserSchema.optional(),
});

export const ProjectListSchema = z.array(ProjectSchema);

// ============================================================================
// Project List Items (Assigned/Unassigned)
// ============================================================================

const RequestUnitSchema = z.object({
  name: z.string(),
  department: z.object({
    name: z.string(),
  }),
});

export const AssignedProjectItemSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),
  status: AssignedProjectStatusEnum,
  request_unit: RequestUnitSchema,
  procurement_type: ProcurementTypeEnum,
  template_type: UnitResponsibleTypeEnum,
  current_step_name: z.string(),
  current_step_order: z.number(),
  assignee_id: z.string(),
  assignee_full_name: z.string(),
  urgent_status: ProjectUrgentStatusEnum,
  expected_approval_date: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});
export type AssignedProjectItem = z.infer<typeof AssignedProjectItemSchema>;

export const UnassignedProjectItemSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),
  status: z.literal('UNASSIGNED'),
  request_unit: RequestUnitSchema,
  procurement_type: ProcurementTypeEnum,
  template_type: UnitResponsibleTypeEnum,
  urgent_status: ProjectUrgentStatusEnum,
  expected_approval_date: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});
export type UnassignedProjectItem = z.infer<typeof UnassignedProjectItemSchema>;

export const ProjectListResponseSchema = z.object({
  total: z.number(),
  data: z.array(z.union([AssignedProjectItemSchema, UnassignedProjectItemSchema])),
});
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;

export const ProjectAssignmentSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
});
export type ProjectAssignment = z.infer<typeof ProjectAssignmentSchema>;

export const ProjectAssignmentsPayloadSchema = z.array(ProjectAssignmentSchema);
export type ProjectAssignmentsPayload = z.infer<typeof ProjectAssignmentsPayloadSchema>;

export const UpdateProjectPayloadSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  budget: z.number().nullable().optional(),
  is_urgent: z.boolean().optional(),
});
export type UpdateProjectPayload = z.infer<typeof UpdateProjectPayloadSchema>;

// ============================================================================
// Project Detail Schema
// ============================================================================

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

// ============================================================================
// Type Exports
// ============================================================================

export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type ProjectUrgentStatus = z.infer<typeof ProjectUrgentStatusEnum>;
export type ProcurementType = z.infer<typeof ProcurementTypeEnum>;
export type UnitResponsibleType = z.infer<typeof UnitResponsibleTypeEnum>;

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;

// Re-export workflow types for convenience
export type {
  FieldConfig,
  FieldType,
  StepStatus,
  Submission,
  SubmissionDocument,
  WorkflowDocumentConfig,
  WorkflowStepConfig,
} from '@/features/workflow';
