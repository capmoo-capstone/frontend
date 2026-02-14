import { z } from 'zod';

import {
  type AssignedProjectItem,
  AssignedProjectItemSchema,
  type Project,
  type ProjectDetail,
  ProjectListSchema,
  type UnassignedProjectItem,
  UnassignedProjectItemSchema,
} from '@/features/projects';
import type { ProjectFilterParams } from '@/hooks/useProjects';
import api from '@/lib/axios';

import { MOCK_ASSIGNED_PROJECTS, MOCK_PROJECTS, MOCK_UNASSIGNED_PROJECTS } from './mock-data';
import { mockProjects } from './mock-project';
import { mockProjects as workflow } from './mock-workflow';

export const getProjects = async (_params?: ProjectFilterParams): Promise<Project[]> => {
  // return mock data;
  return MOCK_PROJECTS;

  const { data } = await api.get('/projects');

  return ProjectListSchema.parse(data);
};

export const getProjectDetail = async (id: string): Promise<ProjectDetail> => {
  // return mock data
  return workflow.find((project) => project.id === id)!;
  return mockProjects.find((project) => project.id === id)!;

  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const getAssignedProjects = async (
  unitId: string,
  date: Date
): Promise<AssignedProjectItem[]> => {
  // return mock data
  return MOCK_ASSIGNED_PROJECTS;

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
  // return mock data
  return MOCK_UNASSIGNED_PROJECTS;

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

export const assignProject = async (assignments: Array<{ projectId: string; userId: string }>) => {
  // Mock response
  return {
    success: true,
    data: assignments,
  };

  const { data } = await api.patch(`/projects/assign`, {
    data: assignments,
  });

  return data;
};

export const changeProjectAssignee = async (projectId: string, newUserId: string) => {
  // Mock response
  return {
    success: true,
    projectId,
    newUserId,
  };

  const { data } = await api.patch(`/project/${projectId}/change-assignee/${newUserId}`);

  return z
    .object({
      success: z.boolean(),
      projectId: z.string(),
      newUserId: z.string(),
    })
    .parse(data);
};

export const cancelProject = async (projectId: string, reason: string) => {
  // Mock response
  return {
    data: {
      id: projectId,
      status: 'WAITING_CANCEL' as const,
      reason,
    },
  };

  const { data } = await api.patch(`/project/${projectId}/cancel`, {
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
  // Mock response
  return {
    total: projectIds.length,
    data: projectIds.map((projectId) => ({
      projectId,
      status: 'IN_PROGRESS' as const,
      userId: 'current-user-id',
    })),
  };

  const { data } = await api.patch(`/project/accept`, {
    data: projectIds,
  });

  return z
    .object({
      total: z.number(),
      data: z.array(
        z.object({
          projectId: z.string(),
          status: z.literal('IN_PROGRESS'),
          userId: z.string(),
        })
      ),
    })
    .parse(data);
};

export const claimProject = async (projectId: string) => {
  // Mock response
  return {
    data: {
      projectId,
      status: 'IN_PROGRESS' as const,
      assignee_procurement_id: 'current-user-id',
    },
  };

  const { data } = await api.patch(`/project/${projectId}/claim`);

  return z
    .object({
      data: z.object({
        projectId: z.string(),
        status: z.literal('IN_PROGRESS'),
        assignee_procurement_id: z.string(),
      }),
    })
    .parse(data);
};
