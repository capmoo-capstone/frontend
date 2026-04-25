import { useMemo } from 'react';

import {
  type Project,
  type ProjectFilterParams,
  getResponsiblePerson,
  useProjects,
} from '@/features/projects';

import type { FinanceExportItem, FinanceExportStatus } from '../types';

type ProjectWithRequester = Project & {
  requester?: {
    dept_name?: string;
  };
};

const FINANCE_PROJECT_FILTERS: ProjectFilterParams = {
  status: ['IN_PROGRESS', 'CLOSED', 'REQUEST_EDIT'],
  procurementStatus: ['COMPLETED'],
  contractStatus: ['NOT_EXPORTED', 'COMPLETED'],
};

const isFinanceProject = (project: Project) => {
  if (project.procurement_status !== 'COMPLETED') return false;

  if (project.status === 'IN_PROGRESS') {
    return project.contract_status === 'NOT_EXPORTED' || project.contract_status === 'COMPLETED';
  }

  return (
    (project.status === 'CLOSED' || project.status === 'REQUEST_EDIT') &&
    project.contract_status === 'COMPLETED'
  );
};

const mapToFinanceStatus = (project: Project): FinanceExportStatus => {
  if (project.status === 'IN_PROGRESS' && project.contract_status === 'COMPLETED') {
    return 'EXPORTED';
  }
  if (project.status === 'CLOSED') return 'CLOSED';
  if (project.status === 'REQUEST_EDIT') return 'WAITING_EDIT';
  return 'NOT_EXPORTED';
};

export function useFinanceExport() {
  const { data: projects, isLoading } = useProjects(FINANCE_PROJECT_FILTERS);

  // Map and filter projects to finance export items
  const data = useMemo<FinanceExportItem[]>(() => {
    if (!projects) return [];

    const getDepartmentName = (project: Project): string => {
      const maybeProject = project as ProjectWithRequester;
      if (typeof maybeProject.requester?.dept_name === 'string') {
        return maybeProject.requester.dept_name;
      }
      return '-';
    };

    return projects
      .filter(isFinanceProject)
      .map((project) => ({
        id: project.id,
        receive_no: project.receive_no,
        project_title: project.title,
        is_urgent: project.is_urgent !== 'NORMAL',
        responsible_person: getResponsiblePerson(project),
        procurement_type: project.procurement_type,
        budget:
          typeof project.budget === 'number' ? project.budget : parseFloat(project.budget || '0'),
        department_name: getDepartmentName(project),
        export_status: mapToFinanceStatus(project),
        project_status: project.status,
        procurement_status: project.procurement_status,
        contract_status: project.contract_status,
        urgent_status: project.is_urgent,
      }))
      .sort((a, b) => {
        // Sort by receive number descending
        return b.receive_no.localeCompare(a.receive_no);
      });
  }, [projects]);

  return {
    data,
    isLoading,
  };
}
