import api from '@/lib/axios';

import { ProjectImportSchema, type ProjectImportPayload } from '../types';

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
  is_urgent: 'NORMAL' | 'URGENT';
  expected_approval_date?: Date;
}

const toCreateProjectPayload = (payload: ProjectImportPayload): CreateProjectRequestPayload => {
  const parsedPayload = ProjectImportSchema.parse(payload);

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
    is_urgent: 'NORMAL',
    expected_approval_date: parsedPayload.delivery_date,
  };
};

export const createProject = async (payload: ProjectImportPayload) => {
  const requestPayload = toCreateProjectPayload(payload);
  const { data } = await api.post('/project/create', requestPayload);
  return data;
};
