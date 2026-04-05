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
import type { ProjectFilterParams } from './types';

export const fetchProjectsPage = async (params?: ProjectFilterParams) => {
  const page = params?.myTasks ? 1 : 1;
  const limit = 50;

  const { data } = await api.get('/projects', {
    params: {
      page,
      limit,
    },
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

export const fetchUnassignedProjects = async () => {
  const { data } = await api.get('/projects/unassigned', {
    params: {},
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
