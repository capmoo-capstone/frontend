import api from '@/lib/axios';

import type {
  ProjectAssignmentsPayload,
  SummaryResponse,
  UpdateProjectPayload,
  WorkloadStatsResponse,
} from '../types/index';
import {
  PaginatedProjectListApiResponseSchema,
  ProjectAssignmentsPayloadSchema,
  ProjectDetailApiSchema,
  ProjectsListApiResponseSchema,
  SummaryResponseSchema,
  UpdateProjectPayloadSchema,
  WorkloadStatsResponseSchema,
} from '../types/index';
import type { OwnProjectQueryParams, ProjectFilterParams } from './types';

const toProjectsQueryParams = (params?: ProjectFilterParams) => {
  const query: Record<string, unknown> = {
    page: 1,
    limit: 50,
  };

  if (!params) return query;

  if (params.search) query.search = params.search;
  if (params.title) query.title = params.title;
  if (params.fiscalYear) query.fiscalYear = params.fiscalYear;
  if (params.myTasks !== undefined) query.myTasks = params.myTasks;

  if (params.dateRange?.from) query.dateFrom = params.dateRange.from.toISOString();
  if (params.dateRange?.to) query.dateTo = params.dateRange.to.toISOString();

  if (params.procurementType?.length) query.procurementType = params.procurementType;
  if (params.status?.length) query.status = params.status;
  if (params.urgentStatus?.length) query.urgentStatus = params.urgentStatus;
  if (params.assignees?.length) query.assignees = params.assignees;
  if (params.units?.length) query.units = params.units;

  return query;
};

export const fetchProjectsPage = async (params?: ProjectFilterParams) => {
  const { data } = await api.get('/projects', {
    params: toProjectsQueryParams(params),
  });

  return PaginatedProjectListApiResponseSchema.parse(data);
};

export const fetchProjectDetail = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return ProjectDetailApiSchema.parse(data);
};

export const fetchAssignedProjects = async (date: Date) => {
  const { data } = await api.get('/projects/assigned', {
    params: {
      date: date.toISOString(),
    },
  });

  return ProjectsListApiResponseSchema.parse(data);
};

export const fetchUnassignedProjects = async (unitId?: string) => {
  const { data } = await api.get('/projects/unassigned', {
    params: unitId ? { unitId } : {},
  });

  return ProjectsListApiResponseSchema.parse(data);
};

export const fetchWaitingCancelProjects = async (unitId?: string) => {
  const { data } = await api.get('/projects/waiting-cancel', {
    params: unitId ? { unitId } : {},
  });

  return ProjectsListApiResponseSchema.parse(data);
};

export const assignProjectRequest = async (assignments: ProjectAssignmentsPayload) => {
  ProjectAssignmentsPayloadSchema.parse(assignments);

  const { data } = await api.patch(
    '/projects/assign',
    assignments.map((item) => ({ id: item.projectId, userId: item.userId }))
  );

  return data;
};

export const changeProjectAssigneeRequest = async (projectId: string, newUserId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/change-assignee`, {
    userId: newUserId,
  });

  return data;
};

export const cancelProjectRequest = async (projectId: string, reason: string) => {
  const { data } = await api.patch(`/projects/${projectId}/cancel`, {
    reason,
  });

  return data;
};

export const acceptProjectsRequest = async (projectIds: string[]) => {
  const { data } = await api.patch(
    '/projects/accept',
    projectIds.map((id) => ({ id }))
  );

  return data;
};

export const claimProjectRequest = async (projectId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/claim`);

  return data;
};

export const updateProjectRequest = async (projectId: string, payload: UpdateProjectPayload) => {
  const parsedPayload = UpdateProjectPayloadSchema.parse(payload);
  const { data } = await api.patch(`/projects/${projectId}/update`, parsedPayload);
  return data;
};

export const fetchWorkloadStats = async (unitId?: string): Promise<WorkloadStatsResponse> => {
  const { data } = await api.get('/projects/workload', {
    params: unitId ? { unitId } : {},
  });

  return WorkloadStatsResponseSchema.parse(data);
};

export const fetchProjectSummary = async (): Promise<SummaryResponse> => {
  const { data } = await api.get('/projects/summary');
  return SummaryResponseSchema.parse(data);
};

export const fetchOwnProjects = async (params?: OwnProjectQueryParams) => {
  const { data } = await api.get('/projects/own', {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    },
  });

  return PaginatedProjectListApiResponseSchema.parse(data);
};

export const createProjectRequest = async (payload: unknown) => {
  const { data } = await api.post('/projects/create', payload);
  return data;
};

export const addProjectAssigneeRequest = async (projectId: string, userId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/add-assignee`, { userId });
  return data;
};

export const returnProjectRequest = async (projectId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/return`);
  return data;
};

export const approveCancellationRequest = async (projectId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/approve-cancel`);
  return data;
};

export const rejectCancellationRequest = async (projectId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/reject-cancel`);
  return data;
};

export const completeProcurementRequest = async (projectId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/complete-procurement`);
  return data;
};

export const closeProjectRequest = async (projectId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/close`);
  return data;
};

export const requestEditProjectRequest = async (projectId: string) => {
  const { data } = await api.patch(`/projects/${projectId}/request-edit`);
  return data;
};

export const deleteProjectRequest = async (projectId: string) => {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data;
};
