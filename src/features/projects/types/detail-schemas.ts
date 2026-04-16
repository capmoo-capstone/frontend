import { z } from 'zod';

import { RoleEnum } from '@/features/auth';
import { SubmissionSchema, WorkflowStepConfigSchema } from '@/features/workflow';

import {
  ProcurementTypeEnum,
  ProjectStatusByTypeEnum,
  ProjectStatusEnum,
  ProjectUrgentStatusEnum,
  UnitResponsibleTypeEnum,
} from './enums';
import { ProjectPersonSchema } from './project-schemas';

export const ProjectDetailSchema = z.object({
  id: z.string(),
  procurement_type: ProcurementTypeEnum,
  current_template_type: UnitResponsibleTypeEnum,
  is_urgent: ProjectUrgentStatusEnum,
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
  budget_plan_id: z.array(z.string()).optional(),
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
    id: z.string().nullable().optional(),
    full_name: z.string().nullable(),
    role: RoleEnum.optional(),
    unit_name: z.string().nullable().optional(),
    unit_id: z.string().nullable().optional(),
    dept_name: z.string().nullable().optional(),
    dept_id: z.string().nullable().optional(),
  }),
  assignee_procurement: z.object({
    id: z.string().nullable(),
    full_name: z.string().nullable(),
    role: RoleEnum.nullable().optional(),
    unit_name: z.string().nullable().optional(),
    unit_id: z.string().nullable().optional(),
  }),
  assignee_contract: z.object({
    id: z.string().nullable(),
    full_name: z.string().nullable(),
    role: RoleEnum.nullable().optional(),
    unit_name: z.string().nullable().optional(),
    unit_id: z.string().nullable().optional(),
  }),
  current_step: z.object({
    name: z.string(),
    order: z.number(),
  }),
  workflow: z.object({
    type: UnitResponsibleTypeEnum,
    steps: z.array(WorkflowStepConfigSchema),
  }),
  cancellation: z
    .array(
      z.object({
        reason: z.string(),
        is_cancelled: z.boolean(),
        requester: z.object({
          id: z.string(),
          full_name: z.string(),
          roles: z.array(
            z.object({
              role: RoleEnum,
              dept_id: z.string().nullable(),
              unit_id: z.string().nullable(),
            })
          ),
        }),
        approver: z
          .object({
            id: z.string(),
            full_name: z.string(),
            roles: z.array(
              z.object({
                role: RoleEnum,
                dept_id: z.string().nullable(),
                unit_id: z.string().nullable(),
              })
            ),
          })
          .nullable(),
        requested_at: z.string().datetime(),
        approved_at: z.string().datetime().nullable(),
      })
    )
    .nullable()
    .optional(),
  submissions: z.array(SubmissionSchema),
});

export const ProjectDetailApiSchema = z.object({
  id: z.string(),
  procurement_type: ProcurementTypeEnum,
  current_workflow_type: UnitResponsibleTypeEnum,
  is_urgent: ProjectUrgentStatusEnum,
  title: z.string(),
  description: z.string().nullable(),
  budget: z.union([z.string(), z.number()]).pipe(z.coerce.number()).nullable(),
  status: ProjectStatusEnum,
  procurement_status: z.object({
    status: ProjectStatusByTypeEnum,
    step: z.number().nullable(),
  }),
  contract_status: z.object({
    status: ProjectStatusByTypeEnum,
    step: z.number().nullable(),
  }),
  cancellation: z
    .array(
      z.object({
        reason: z.string(),
        is_cancelled: z.boolean(),
        requester: z.object({
          id: z.string(),
          full_name: z.string(),
          roles: z.array(
            z.object({
              role: RoleEnum,
              dept_id: z.string().nullable(),
              unit_id: z.string().nullable(),
            })
          ),
        }),
        approver: z
          .object({
            id: z.string(),
            full_name: z.string(),
            roles: z.array(
              z.object({
                role: RoleEnum,
                dept_id: z.string().nullable(),
                unit_id: z.string().nullable(),
              })
            ),
          })
          .nullable(),
        requested_at: z.string().datetime(),
        approved_at: z.string().datetime().nullable(),
      })
    )
    .nullable(),
  receive_no: z.string(),
  less_no: z.string().nullable(),
  pr_no: z.string().nullable(),
  po_no: z.string().nullable(),
  contract_no: z.string().nullable(),
  migo_no: z.string().nullable(),
  budget_plan_id: z.array(z.string()).optional(),
  expected_approval_date: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  vendor: z.object({
    name: z.string().nullable(),
    tax_id: z.string().nullable(),
    email: z.string().nullable(),
  }),
  requester: z.object({
    dept_id: z.string().nullable(),
    dept_name: z.string().nullable(),
    unit_id: z.string().nullable(),
    unit_name: z.string().nullable(),
  }),
  creator: ProjectPersonSchema,
  assignee_procurement: z.array(ProjectPersonSchema),
  assignee_contract: z.array(ProjectPersonSchema),
});

export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
