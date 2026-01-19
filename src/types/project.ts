import { z } from 'zod';

import { UserSchema } from './auth';

export const ProjectStatusEnum = z.enum([
  'DRAFT',
  'UNASSIGNED',
  'WAITING_FOR_ACCEPTANCE',
  'IN_PROGRESS_OF_PROCUREMENT',
  'IN_PROGRESS_OF_CONTRACT',
  'APPROVED',
  'REJECTED',
]);

export const ProcurementTypeEnum = z.enum(['LT100K', 'LT500K', 'MT500K', 'SELECTION', 'EBIDDING']);
export const ProjectSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),

  budget: z.union([z.string(), z.number()]).pipe(z.coerce.number()),

  pr_no: z.string().nullable().optional(),
  po_no: z.string().nullable().optional(),

  status: ProjectStatusEnum,
  procurement_type: ProcurementTypeEnum,

  request_unit_id: z.string().nullable().optional(),
  current_templates_id: z.string(),
  current_step_id: z.string().nullable().optional(),

  assignee_procurement_id: z.string().nullable().optional(),
  assignee_contract_id: z.string().nullable().optional(),

  contract_no: z.string().nullable().optional(),
  migo_no: z.string().nullable().optional(),
  vendor_name: z.string().nullable().optional(),
  vendor_tax_id: z.string().nullable().optional(),
  vendor_email: z.email().nullable().optional(),

  is_urgent: z.boolean().default(false),

  created_by: z.string(),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),

  creator: UserSchema.optional(),
  assignee_procurement: UserSchema.optional(),
  assignee_contract: UserSchema.optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type ProcurementType = z.infer<typeof ProcurementTypeEnum>;

export const ProjectListSchema = z.array(ProjectSchema);

export const AssignedProjectStatusEnum = z.enum([
  'WAITING_FOR_ACCEPTANCE',
  'IN_PROGRESS',
  'CANCEL',
]);

export const AssignedProjectItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  receive_no: z.string(),
  req_department_name: z.string(),
  status: AssignedProjectStatusEnum,
  description: z.string(),
  assignee_id: z.string().nullable(),
  assignee_fullname: z.string().nullable(),
  created_at: z.iso.datetime(),
});

export type AssignedProjectItem = z.infer<typeof AssignedProjectItemSchema>;

export const UnassignedProjectItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  receive_no: z.string(),
  req_department_name: z.string(),
  status: 'UNASSIGNED',
  description: z.string(),
  assignee_id: z.string().nullable(),
  assignee_fullname: z.string().nullable(),
  created_at: z.iso.datetime(),
});

export type UnassignedProjectItem = z.infer<typeof UnassignedProjectItemSchema>;
