import { z } from 'zod';

import {
  ProcurementTypeEnum,
  ProjectStatusByTypeEnum,
  ProjectStatusEnum,
  ProjectUrgentStatusEnum,
  UnitResponsibleTypeEnum,
} from './enums';

export const ProjectPersonSchema = z.object({
  id: z.string(),
  full_name: z.string(),
});

const ProjectDepartmentSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

const ProjectUnitSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  budget: z.union([z.string(), z.number()]).pipe(z.coerce.number()),
  status: ProjectStatusEnum,
  procurement_type: ProcurementTypeEnum,
  current_workflow_type: UnitResponsibleTypeEnum,
  responsible_unit_id: z.string(),
  requesting_dept_id: z.string(),
  requesting_unit_id: z.string().nullable(),
  is_urgent: ProjectUrgentStatusEnum,
  expected_approval_date: z.string().datetime().nullable(),
  procurement_status: ProjectStatusByTypeEnum,
  procurement_step: z.number().nullable(),
  contract_status: ProjectStatusByTypeEnum,
  contract_step: z.number().nullable(),
  budget_plan_id: z.array(z.string()),
  pr_no: z.string().nullable(),
  po_no: z.string().nullable(),
  less_no: z.string().nullable(),
  contract_no: z.string().nullable(),
  migo_103_no: z.string().nullable(),
  migo_105_no: z.string().nullable(),
  asset_code: z.boolean().nullable(),
  vendor_name: z.string().nullable(),
  vendor_email: z.string().nullable(),
  requesting_dept: ProjectDepartmentSchema,
  requesting_unit: ProjectUnitSchema.nullable(),
  assignee_procurement: z.array(ProjectPersonSchema),
  assignee_contract: z.array(ProjectPersonSchema),
  created_by: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
});

export const ProjectListSchema = z.array(ProjectSchema);

export const ProjectApiSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  budget: z.union([z.string(), z.number()]).pipe(z.coerce.number()),
  status: ProjectStatusEnum,
  procurement_type: ProcurementTypeEnum,
  current_workflow_type: UnitResponsibleTypeEnum,
  responsible_unit_id: z.string(),
  requesting_dept_id: z.string(),
  requesting_unit_id: z.string().nullable(),
  is_urgent: ProjectUrgentStatusEnum,
  expected_approval_date: z.string().datetime().nullable(),
  procurement_status: ProjectStatusByTypeEnum,
  procurement_step: z.number().nullable(),
  contract_status: ProjectStatusByTypeEnum,
  contract_step: z.number().nullable(),
  budget_plan_id: z.array(z.string()),
  pr_no: z.string().nullable(),
  po_no: z.string().nullable(),
  less_no: z.string().nullable(),
  contract_no: z.string().nullable(),
  migo_103_no: z.string().nullable(),
  migo_105_no: z.string().nullable(),
  asset_code: z.boolean().nullable(),
  vendor_name: z.string().nullable(),
  vendor_email: z.string().nullable(),
  requesting_dept: ProjectDepartmentSchema,
  requesting_unit: ProjectUnitSchema.nullable(),
  assignee_procurement: z.array(ProjectPersonSchema),
  assignee_contract: z.array(ProjectPersonSchema),
  created_by: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
});

export const ProjectListApiItemSchema = z.object({
  ...ProjectApiSchema.shape,
  budget: z.union([z.string(), z.number()]).pipe(z.coerce.number()),
  budget_plan_id: z.array(z.string()).optional().default([]),
});

export const PaginatedProjectListApiResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  data: z.array(ProjectListApiItemSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
