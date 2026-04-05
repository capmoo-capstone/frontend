import type {
  AssignedProjectItem,
  Project,
  ProjectAssignmentsPayload,
  ProjectDetail,
  SummaryResponse,
  UnassignedProjectItem,
  UpdateProjectPayload,
  WaitingCancelProjectItem,
  WorkloadStatsResponse,
} from '../types/index';
import {
  mapAssignedProjectItem,
  mapProjectDetail,
  mapProjectListItem,
  mapUnassignedProjectItem,
  mapWaitingCancelProjectItem,
} from './project.mappers';
import {
  acceptProjectsRequest,
  addProjectAssigneeRequest,
  approveCancellationRequest,
  assignProjectRequest,
  cancelProjectRequest,
  changeProjectAssigneeRequest,
  claimProjectRequest,
  closeProjectRequest,
  completeProcurementRequest,
  createProjectRequest,
  deleteProjectRequest,
  fetchAssignedProjects,
  fetchOwnProjects,
  fetchProjectDetail,
  fetchProjectSummary,
  fetchProjectsPage,
  fetchUnassignedProjects,
  fetchWaitingCancelProjects,
  fetchWorkloadStats,
  rejectCancellationRequest,
  requestEditProjectRequest,
  returnProjectRequest,
  updateProjectRequest,
} from './project.requests';
import type { OwnProjectQueryParams, ProjectFilterParams } from './types';

export type { OwnProjectQueryParams, ProjectFilterParams } from './types';

export const getProjects = async (params?: ProjectFilterParams): Promise<Project[]> => {
  const parsed = await fetchProjectsPage(params);
  return parsed.data.map(mapProjectListItem);
};

export const getProjectDetail = async (id: string): Promise<ProjectDetail> => {
  const parsed = await fetchProjectDetail(id);
  return mapProjectDetail(parsed);
};

export const getAssignedProjects = async (date: Date): Promise<AssignedProjectItem[]> => {
  const parsed = await fetchAssignedProjects(date);
  return parsed.data.map(mapAssignedProjectItem);
};

export const getUnassignedProjects = async (unitId?: string): Promise<UnassignedProjectItem[]> => {
  const parsed = await fetchUnassignedProjects(unitId);
  return parsed.data.map(mapUnassignedProjectItem);
};

export const getWaitingCancelProjects = async (
  unitId?: string
): Promise<WaitingCancelProjectItem[]> => {
  return [];

  const parsed = await fetchWaitingCancelProjects(unitId);
  return parsed.data.map(mapWaitingCancelProjectItem);
};

export const assignProject = async (assignments: ProjectAssignmentsPayload) => {
  return assignProjectRequest(assignments);
};

export const changeProjectAssignee = async (projectId: string, newUserId: string) => {
  return changeProjectAssigneeRequest(projectId, newUserId);
};

export const cancelProject = async (projectId: string, reason: string) => {
  return cancelProjectRequest(projectId, reason);
};

export const acceptProjects = async (projectIds: string[]) => {
  return acceptProjectsRequest(projectIds);
};

export const claimProject = async (projectId: string) => {
  return claimProjectRequest(projectId);
};

export const updateProject = async (projectId: string, payload: UpdateProjectPayload) => {
  return updateProjectRequest(projectId, payload);
};

export const getWorkloadStats = async (unitId?: string): Promise<WorkloadStatsResponse> => {
  return fetchWorkloadStats(unitId);
};

export const getProjectSummary = async (): Promise<SummaryResponse> => {
  return fetchProjectSummary();
};

export const getOwnProjects = async (params?: OwnProjectQueryParams) => {
  return fetchOwnProjects(params);
};

export const createProject = async (payload: unknown) => {
  return createProjectRequest(payload);
};

export const addProjectAssignee = async (projectId: string, userId: string) => {
  return addProjectAssigneeRequest(projectId, userId);
};

export const returnProject = async (projectId: string) => {
  return returnProjectRequest(projectId);
};

export const approveProjectCancellation = async (projectId: string) => {
  return approveCancellationRequest(projectId);
};

export const rejectProjectCancellation = async (projectId: string) => {
  return rejectCancellationRequest(projectId);
};

export const completeProjectProcurement = async (projectId: string) => {
  return completeProcurementRequest(projectId);
};

export const closeProject = async (projectId: string) => {
  return closeProjectRequest(projectId);
};

export const requestProjectEdit = async (projectId: string) => {
  return requestEditProjectRequest(projectId);
};

export const deleteProject = async (projectId: string) => {
  return deleteProjectRequest(projectId);
};
