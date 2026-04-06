import { z } from 'zod';

import {
  AssignedProjectStatusEnum,
  ProcurementTypeEnum,
  ProjectUrgentStatusEnum,
  UnitResponsibleTypeEnum,
} from './enums';
import { ProjectPersonSchema } from './project-schemas';

const RequestUnitSchema = z.object({
  name: z.string().nullable(),
  department: z.object({
    id: z.string().optional(),
    name: z.string().nullable(),
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
  current_step_name: z.string().optional(),
  current_step_order: z.number().optional(),
  assignee_id: z.string().nullable(),
  assignee_full_name: z.string().nullable(),
  urgent_status: ProjectUrgentStatusEnum,
  expected_approval_date: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

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

export const WaitingCancelProjectItemSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),
  status: z.literal('WAITING_CANCEL'),
  request_unit: RequestUnitSchema,
  procurement_type: ProcurementTypeEnum,
  template_type: UnitResponsibleTypeEnum,
  assignee_id: z.string().nullable(),
  assignee_full_name: z.string().nullable(),
  urgent_status: ProjectUrgentStatusEnum,
  cancel_reason: z.string().nullable(),
  expected_approval_date: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

const ProjectWorklistRequestUnitApiSchema = z.object({
  name: z.string().nullable(),
  department: z.object({
    id: z.string(),
    name: z.string().nullable(),
  }),
});

export const ProjectWorklistApiItemSchema = z.object({
  id: z.string(),
  receive_no: z.string(),
  title: z.string(),
  status: z.enum(['UNASSIGNED', 'WAITING_ACCEPT', 'IN_PROGRESS', 'WAITING_CANCEL', 'CANCELLED']),
  requesting_unit: ProjectWorklistRequestUnitApiSchema.nullable(),
  budget: z.union([z.string(), z.number()]).pipe(z.coerce.number()).optional(),
  procurement_type: ProcurementTypeEnum,
  current_workflow_type: UnitResponsibleTypeEnum,
  assignee: z.array(ProjectPersonSchema).optional(),
  is_urgent: ProjectUrgentStatusEnum,
  expected_approval_date: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable().optional(),
});

export const ProjectsListApiResponseSchema = z.object({
  total: z.number(),
  data: z.array(ProjectWorklistApiItemSchema),
});

export const ProjectListResponseSchema = z.object({
  total: z.number(),
  data: z.array(z.union([AssignedProjectItemSchema, UnassignedProjectItemSchema])),
});

export const ProjectAssignmentSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
});

export const ProjectAssignmentsPayloadSchema = z.array(ProjectAssignmentSchema);

export const UpdateProjectPayloadSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  budget: z.number().nullable().optional(),
  is_urgent: ProjectUrgentStatusEnum.optional(),
});

export type AssignedProjectItem = z.infer<typeof AssignedProjectItemSchema>;
export type UnassignedProjectItem = z.infer<typeof UnassignedProjectItemSchema>;
export type WaitingCancelProjectItem = z.infer<typeof WaitingCancelProjectItemSchema>;
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
export type ProjectAssignment = z.infer<typeof ProjectAssignmentSchema>;
export type ProjectAssignmentsPayload = z.infer<typeof ProjectAssignmentsPayloadSchema>;
export type UpdateProjectPayload = z.infer<typeof UpdateProjectPayloadSchema>;
