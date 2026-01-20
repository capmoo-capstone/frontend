import { z } from 'zod';

import api from '@/lib/axios';
import {
  type AssignedProjectItem,
  AssignedProjectItemSchema,
  type UnassignedProjectItem,
  UnassignedProjectItemSchema,
} from '@/types/project';
import { type Project, ProjectListSchema, ProjectSchema } from '@/types/project';

import { MOCK_ASSIGNED_PROJECTS, MOCK_PROJECTS, MOCK_UNASSIGNED_PROJECTS } from './mock-data';

export const getProjects = async (): Promise<Project[]> => {
  // return mock data;
  return MOCK_PROJECTS;

  const { data } = await api.get('/projects');

  return ProjectListSchema.parse(data);
};

export const getProjectById = async (id: string) => {
  // return mock data;
  return MOCK_PROJECTS[0];

  const { data } = await api.get(`/projects/${id}`);

  return ProjectSchema.parse(data);
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

  return z.array(AssignedProjectItemSchema).parse(data.data);
};

export const getUnassignedProjects = async (unitId: string): Promise<UnassignedProjectItem[]> => {
  // return mock data
  return MOCK_UNASSIGNED_PROJECTS;

  const { data } = await api.get('/projects/unassigned', {
    params: { unit_id: unitId },
  });

  return z.array(UnassignedProjectItemSchema).parse(data.data);
};

export const assignProject = async (
  projectId: string,
  userId: string,
  projectType: 'procurement' | 'contract'
) => {
  // Mock response
  return {
    success: true,
    projectId,
    userId,
    projectType,
  };

  const { data } = await api.patch(`/projects/${projectId}/assign/${userId}`, {
    project_type: projectType,
  });

  return data;
};

export const changeProjectAssignee = async (
  projectId: string,
  newUserId: string,
) => {
  // Mock response
  return {
    success: true,
    projectId,
    newUserId,
  };

  const { data } = await api.patch(`/project/${projectId}/change-assignee/${newUserId}`);

  return data;
}