import { z } from 'zod';

import { UserSchema } from './auth';

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

export const ProcurementTypeEnum = z.enum(['LT100K', 'LT500K', 'MT500K', 'SELECTION', 'EBIDDING']);

export const WorkflowStatusSchema = z.object({
  p: z.string(),
  c: z.string(),
});

export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;

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

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type ProjectUrgentStatus = z.infer<typeof ProjectUrgentStatusEnum>;
export type ProcurementType = z.infer<typeof ProcurementTypeEnum>;

export const ProjectListSchema = z.array(ProjectSchema);

export const UnitResponsibleTypeEnum = z.enum([
  'LT100K',
  'LT500K',
  'MT500K',
  'SELECTION',
  'EBIDDING',
  'CONTRACT',
]);

export type UnitResponsibleType = z.infer<typeof UnitResponsibleTypeEnum>;

export const AssignedProjectStatusEnum = z.enum(['WAITING_ACCEPT', 'IN_PROGRESS', 'CANCELLED']);

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
