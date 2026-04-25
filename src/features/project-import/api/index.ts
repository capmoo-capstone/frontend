import type { ProjectUrgentStatus, UnitResponsibleType } from '@/features/projects/types/enums';
import api from '@/lib/axios';

import { type ProjectImportPayload, ProjectImportSchema } from '../types';
import { calculateUrgentLevel, getDefaultDeliveryDate } from '../utils/calculateUrgentLevel';

interface CreateProjectRequestPayload {
  title: string;
  description?: string;
  budget: number;
  budget_plan_id?: string[];
  pr_no?: string;
  less_no?: string;
  requesting_dept_id: string;
  requesting_unit_id: string;
  procurement_type: string;
  is_urgent: ProjectUrgentStatus;
  expected_approval_date?: Date;
}

const toCreateProjectPayload = async (
  payload: ProjectImportPayload
): Promise<CreateProjectRequestPayload> => {
  const parsedPayload = ProjectImportSchema.parse(payload);
  const procurementType = parsedPayload.procurement_type as UnitResponsibleType;
  const resolvedDeliveryDate =
    parsedPayload.delivery_date ?? (await getDefaultDeliveryDate(procurementType));
  const urgentLevel = parsedPayload.delivery_date
    ? await calculateUrgentLevel(parsedPayload.delivery_date, procurementType)
    : 'NORMAL';

  return {
    title: parsedPayload.title,
    description: parsedPayload.description,
    budget: parsedPayload.budget,
    budget_plan_id: parsedPayload.budget_plan_ids,
    pr_no: parsedPayload.pr_no,
    less_no: parsedPayload.lesspaper_no,
    requesting_dept_id: parsedPayload.department_id,
    requesting_unit_id: parsedPayload.unit_id,
    procurement_type: parsedPayload.procurement_type,
    is_urgent: urgentLevel,
    expected_approval_date: resolvedDeliveryDate,
  };
};

export const createProject = async (payload: ProjectImportPayload) => {
  const requestPayload = await toCreateProjectPayload(payload);
  const { data } = await api.post('/projects/create', requestPayload);
  return data;
};

export const importProjects = async (payload: ProjectImportPayload[]) => {
  const requestPayload = await Promise.all(payload.map((item) => toCreateProjectPayload(item)));
  const { data } = await api.post('/projects/import', requestPayload);
  return data;
};
