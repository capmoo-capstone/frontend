import { useQuery } from '@tanstack/react-query';

import {
  type ProjectFilterParams,
  getAssignedProjects,
  getProjectDetail,
  getProjectSummary,
  getProjects,
  getUnassignedProjects,
  getWorkloadStats,
} from '../api';
import type { ProjectDetail, SummaryResponse, WorkloadStatsResponse } from '../types/index';
import { projectKeys } from './queryKeys';

export type { ProjectFilterParams } from '../api';

export const useProjects = (filters?: ProjectFilterParams) => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => getProjects(filters),
  });
};

export const useProjectSummary = () => {
  return useQuery<SummaryResponse, Error>({
    queryKey: projectKeys.summary(),
    queryFn: getProjectSummary,
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

export const useAssignedProjects = (date: Date | undefined) => {
  return useQuery({
    queryKey: projectKeys.assigned(date),
    queryFn: () => getAssignedProjects(date!),
    enabled: !!date,
  });
};

export const useUnassignedProjects = () => {
  return useQuery({
    queryKey: projectKeys.unassigned(),
    queryFn: () => getUnassignedProjects(),
  });
};
