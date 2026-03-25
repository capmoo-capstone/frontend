import { z } from 'zod';

import api from '@/lib/axios';

// Import ProjectFilterParams from useProjects to avoid duplication
import type { ProjectFilterParams } from '../hooks/useProjects';
import type {
  AssignedProjectItem,
  Project,
  ProjectAssignmentsPayload,
  ProjectDetail,
  UnassignedProjectItem,
  UpdateProjectPayload,
} from '../types';
import {
  AssignedProjectItemSchema,
  ProjectAssignmentsPayloadSchema,
  ProjectDetailSchema,
  ProjectListSchema,
  UnassignedProjectItemSchema,
  UpdateProjectPayloadSchema,
} from '../types';
import { MOCK_ASSIGNED_PROJECTS, MOCK_PROJECTS, MOCK_UNASSIGNED_PROJECTS } from './mockData';
import { mockProjects } from './mockProjects';

export type { ProjectFilterParams };

const USE_PROJECTS_MOCK = import.meta.env.VITE_USE_PROJECTS_MOCK === 'true';

export const getProjects = async (params?: ProjectFilterParams): Promise<Project[]> => {
  if (USE_PROJECTS_MOCK) {
    void params;
    return MOCK_PROJECTS;
  }

  const { data } = await api.get('/projects');
  return ProjectListSchema.parse(data);
};

export const getProjectDetail = async (id: string): Promise<ProjectDetail> => {
  if (USE_PROJECTS_MOCK) {
    return mockProjects.find((project) => project.id === id)!;
  }

  const { data } = await api.get(`/projects/${id}`);
  return ProjectDetailSchema.parse(data);
};

export const getAssignedProjects = async (
  unitId: string,
  date: Date
): Promise<AssignedProjectItem[]> => {
  if (USE_PROJECTS_MOCK) {
    return MOCK_ASSIGNED_PROJECTS;
  }

  const { data } = await api.get('/projects/assigned', {
    params: {
      unit_id: unitId,
      date: date.toISOString(),
    },
  });

  return z
    .object({
      total: z.number(),
      data: z.array(AssignedProjectItemSchema),
    })
    .parse(data).data;
};

export const getUnassignedProjects = async (unitId: string): Promise<UnassignedProjectItem[]> => {
  if (USE_PROJECTS_MOCK) {
    return MOCK_UNASSIGNED_PROJECTS;
  }

  const { data } = await api.get('/projects/unassigned', {
    params: { unit_id: unitId },
  });

  return z
    .object({
      total: z.number(),
      data: z.array(UnassignedProjectItemSchema),
    })
    .parse(data).data;
};

export const assignProject = async (assignments: ProjectAssignmentsPayload) => {
  ProjectAssignmentsPayloadSchema.parse(assignments);

  if (USE_PROJECTS_MOCK) {
    return {
      success: true,
      data: assignments,
    };
  }

  const { data } = await api.patch(
    `/projects/assign`,
    assignments.map((item) => ({ id: item.projectId, userId: item.userId }))
  );

  return data;
};

export const changeProjectAssignee = async (projectId: string, newUserId: string) => {
  if (USE_PROJECTS_MOCK) {
    return {
      success: true,
      projectId,
      newUserId,
    };
  }

  const { data } = await api.patch(`/projects/${projectId}/change-assignee`, {
    userId: newUserId,
  });

  return data;
};

export const cancelProject = async (projectId: string, reason: string) => {
  if (USE_PROJECTS_MOCK) {
    return {
      data: {
        id: projectId,
        status: 'WAITING_CANCEL' as const,
        reason,
      },
    };
  }

  const { data } = await api.patch(`/projects/${projectId}/cancel`, {
    reason,
  });

  return z
    .object({
      data: z.object({
        id: z.string(),
        status: z.literal('WAITING_CANCEL'),
        reason: z.string(),
      }),
    })
    .parse(data);
};

export const acceptProjects = async (projectIds: string[]) => {
  if (USE_PROJECTS_MOCK) {
    return {
      total: projectIds.length,
      data: projectIds.map((projectId) => ({
        projectId,
        status: 'IN_PROGRESS' as const,
        userId: 'current-user-id',
      })),
    };
  }

  const { data } = await api.patch(
    `/projects/accept`,
    projectIds.map((id) => ({ id }))
  );

  return data;
};

export const claimProject = async (projectId: string) => {
  if (USE_PROJECTS_MOCK) {
    return {
      data: {
        projectId,
        status: 'IN_PROGRESS' as const,
        assignee_procurement_id: 'current-user-id',
      },
    };
  }

  const { data } = await api.patch(`/projects/${projectId}/claim`);

  return data;
};

export const updateProject = async (projectId: string, payload: UpdateProjectPayload) => {
  const parsedPayload = UpdateProjectPayloadSchema.parse(payload);
  const requestPayload = {
    ...parsedPayload,
    is_urgent:
      parsedPayload.is_urgent === undefined
        ? undefined
        : parsedPayload.is_urgent
          ? 'URGENT'
          : 'NORMAL',
  };

  if (USE_PROJECTS_MOCK) {
    return {
      data: {
        id: projectId,
        ...parsedPayload,
      },
    };
  }

  const { data } = await api.patch(`/projects/${projectId}/update`, requestPayload);
  return z
    .object({
      data: z.object({
        id: z.string(),
      }),
    })
    .parse(data);
};
