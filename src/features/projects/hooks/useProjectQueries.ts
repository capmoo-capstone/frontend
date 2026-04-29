import { useQuery } from '@tanstack/react-query';

import {
  type OwnProjectQueryParams,
  type ProjectFilterParams,
  type ProjectsQueryOptions,
  getAssignedProjects,
  getOwnProjects,
  getProjectDetail,
  getProjectSummary,
  getProjects,
  getUnassignedProjects,
  getWaitingCancelProjects,
  getWorkloadStats,
} from '../api';
import type { ProjectDetail, SummaryResponse, WorkloadStatsResponse } from '../types/index';
import { projectKeys } from './queryKeys';

export type { ProjectFilterParams } from '../api';
export type { OwnProjectQueryParams } from '../api';
export type { ProjectsQueryOptions } from '../api';

export const useProjects = (filters?: ProjectFilterParams, options?: ProjectsQueryOptions) => {
  return useQuery({
    queryKey: projectKeys.list(filters, options),
    queryFn: () => getProjects(filters, options),
  });
};

export const useProjectSummary = () => {
  return useQuery<SummaryResponse, Error>({
    queryKey: projectKeys.summary(),
    queryFn: getProjectSummary,
  });
};

export const useOwnProjects = (params?: OwnProjectQueryParams) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  return useQuery({
    queryKey: projectKeys.own(page, limit),
    queryFn: () => getOwnProjects({ page, limit }),
  });
};

export const useWorkloadStats = (unitId?: string) => {
  return useQuery<WorkloadStatsResponse, Error>({
    queryKey: projectKeys.workload(unitId),
    queryFn: () => getWorkloadStats(unitId),
  });
};

export const useProjectDetail = (id: string | undefined) => {
  return useQuery<ProjectDetail, Error>({
    queryKey: projectKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('Project ID is required');
      return getProjectDetail(id);
    },
    enabled: !!id,
  });
};

export const useAssignedProjects = (date: Date | undefined, unitId?: string) => {
  return useQuery({
    queryKey: projectKeys.assigned(date, unitId),
    queryFn: () => getAssignedProjects(date!, unitId),
    enabled: !!date,
  });
};

export const useUnassignedProjects = (unitId?: string) => {
  return useQuery({
    queryKey: projectKeys.unassigned(unitId),
    queryFn: () => getUnassignedProjects(unitId),
    enabled: !!unitId,
  });
};

export const useWaitingCancelProjects = (unitId?: string) => {
  return useQuery({
    queryKey: projectKeys.waitingCancel(unitId),
    queryFn: () => getWaitingCancelProjects(unitId),
  });
};
