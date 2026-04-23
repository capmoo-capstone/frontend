import type { z } from 'zod';

import type {
  AssignedProjectItem,
  Project,
  ProjectDetail,
  UnassignedProjectItem,
  WaitingCancelProjectItem,
} from '../types/index';
import {
  AssignedProjectItemSchema,
  type ProjectDetailApiSchema,
  type ProjectListApiItemSchema,
  ProjectSchema,
  type ProjectWorklistApiItemSchema,
  UnassignedProjectItemSchema,
  WaitingCancelProjectItemSchema,
} from '../types/index';

type ProjectListApiItem = z.infer<typeof ProjectListApiItemSchema>;
type ProjectWorklistApiItem = z.infer<typeof ProjectWorklistApiItemSchema>;
type ProjectDetailApi = z.infer<typeof ProjectDetailApiSchema>;

const toBudgetPlanIds = (budgetPlans: unknown): string[] => {
  if (!Array.isArray(budgetPlans)) {
    return [];
  }

  return budgetPlans
    .map((budgetPlan) => {
      if (typeof budgetPlan === 'string') {
        return budgetPlan;
      }

      if (
        typeof budgetPlan === 'object' &&
        budgetPlan !== null &&
        'id' in budgetPlan &&
        typeof budgetPlan.id === 'string'
      ) {
        return budgetPlan.id;
      }

      return '';
    })
    .filter((id): id is string => id.length > 0);
};

const getWorklistAssignee = (item: ProjectWorklistApiItem) => {
  const assignees = item.assignee ?? item.assignee_procurement ?? item.assignee_contract ?? [];

  return assignees[0] ?? null;
};

export const mapProjectListItem = (project: ProjectListApiItem): Project =>
  ProjectSchema.parse({
    id: project.id,
    receive_no: project.receive_no,
    title: project.title,
    description: project.description,
    budget: project.budget,
    status: project.status,
    procurement_type: project.procurement_type,
    current_workflow_type: project.current_workflow_type,
    responsible_unit_id: project.responsible_unit_id,
    requesting_dept_id: project.requesting_dept_id,
    requesting_unit_id: project.requesting_unit_id,
    is_urgent: project.is_urgent,
    expected_approval_date: project.expected_approval_date,
    procurement_status: project.procurement_status,
    procurement_step: project.procurement_step,
    contract_status: project.contract_status,
    contract_step: project.contract_step,
    budget_plan_id: project.budget_plan_id ?? [],
    pr_no: project.pr_no,
    po_no: project.po_no,
    less_no: project.less_no,
    contract_no: project.contract_no,
    migo_no: project.migo_no,
    vendor_name: project.vendor_name,
    vendor_tax_id: project.vendor_tax_id,
    vendor_email: project.vendor_email,
    requesting_dept: project.requesting_dept,
    requesting_unit: project.requesting_unit,
    assignee_procurement: project.assignee_procurement,
    assignee_contract: project.assignee_contract,
    created_by: project.created_by,
    created_at: project.created_at,
    updated_at: project.updated_at,
  });

export const mapAssignedProjectItem = (item: ProjectWorklistApiItem): AssignedProjectItem =>
  AssignedProjectItemSchema.parse({
    id: item.id,
    receive_no: item.receive_no,
    title: item.title,
    status: item.status,
    request_unit: {
      name: item.requesting_unit?.name ?? '-',
      department: {
        id: item.requesting_unit?.department.id,
        name: item.requesting_unit?.department.name ?? '-',
      },
    },
    procurement_type: item.procurement_type,
    template_type: item.current_workflow_type,
    assignee_id: getWorklistAssignee(item)?.id ?? null,
    assignee_full_name: getWorklistAssignee(item)?.full_name ?? null,
    urgent_status: item.is_urgent,
    expected_approval_date: item.expected_approval_date,
    created_at: item.created_at,
  });

export const mapUnassignedProjectItem = (item: ProjectWorklistApiItem): UnassignedProjectItem =>
  UnassignedProjectItemSchema.parse({
    id: item.id,
    receive_no: item.receive_no,
    title: item.title,
    status: item.status,
    request_unit: {
      name: item.requesting_unit?.name ?? '-',
      department: {
        id: item.requesting_unit?.department.id,
        name: item.requesting_unit?.department.name ?? '-',
      },
    },
    procurement_type: item.procurement_type,
    template_type: item.current_workflow_type,
    urgent_status: item.is_urgent,
    expected_approval_date: item.expected_approval_date,
    created_at: item.created_at,
  });

export const mapWaitingCancelProjectItem = (
  item: ProjectWorklistApiItem
): WaitingCancelProjectItem =>
  WaitingCancelProjectItemSchema.parse({
    id: item.id,
    receive_no: item.receive_no,
    title: item.title,
    status: item.status,
    request_unit: {
      name: item.requesting_unit?.name ?? '-',
      department: {
        id: item.requesting_unit?.department.id,
        name: item.requesting_unit?.department.name ?? '-',
      },
    },
    procurement_type: item.procurement_type,
    template_type: item.current_workflow_type,
    assignee_id: getWorklistAssignee(item)?.id ?? null,
    assignee_full_name: getWorklistAssignee(item)?.full_name ?? null,
    requester_full_name: item.project_cancellation?.[0]?.requester?.full_name ?? null,
    urgent_status: item.is_urgent,
    cancel_reason: item.project_cancellation?.[0]?.reason ?? null,
    expected_approval_date: item.expected_approval_date,
    created_at: item.created_at,
  });

export const mapProjectDetail = (parsed: ProjectDetailApi): ProjectDetail => ({
  id: parsed.id,
  procurement_type: parsed.procurement_type,
  current_template_type: parsed.current_workflow_type,
  is_urgent: parsed.is_urgent,
  title: parsed.title,
  description: parsed.description,
  budget: parsed.budget,
  status: parsed.status,
  procurement_status: parsed.procurement_status.status,
  contract_status: parsed.contract_status.status,
  contract_step: parsed.contract_status.step,
  receive_no: parsed.receive_no,
  less_no: parsed.less_no,
  pr_no: parsed.pr_no,
  po_no: parsed.po_no,
  contract_no: parsed.contract_no,
  migo_no: parsed.migo_no,
  budget_plans: toBudgetPlanIds(parsed.budget_plans),
  expected_approval_date: parsed.expected_approval_date,
  expected_completion_procurement_date: parsed.expected_completion_procurement_date,
  created_at: parsed.created_at,
  updated_at: parsed.updated_at ?? parsed.created_at,
  vendor: parsed.vendor,
  requester: parsed.requester,
  creator: {
    id: parsed.creator.id,
    full_name: parsed.creator.full_name,
  },
  assignee_procurement: {
    id: parsed.assignee_procurement[0]?.id ?? null,
    full_name: parsed.assignee_procurement[0]?.full_name ?? null,
  },
  assignee_contract: {
    id: parsed.assignee_contract[0]?.id ?? null,
    full_name: parsed.assignee_contract[0]?.full_name ?? null,
  },
  current_step: {
    name:
      parsed.current_workflow_type === 'CONTRACT'
        ? parsed.contract_status.status
        : parsed.procurement_status.status,
    order:
      parsed.current_workflow_type === 'CONTRACT'
        ? (parsed.contract_status.step ?? 1)
        : (parsed.procurement_status.step ?? 1),
  },
  workflow: {
    type: parsed.current_workflow_type,
    steps: [],
  },
  cancellation: parsed.cancellation,
  submissions: [],
});
