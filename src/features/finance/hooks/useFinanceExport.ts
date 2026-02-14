import { useMemo } from 'react';

import { useProjects } from '@/features/projects/hooks/useProjects';
import type { Project } from '@/features/projects/types';

import type { FinanceExportItem, FinanceExportStatus } from '../types';

// Map project status to finance export status
const mapToFinanceStatus = (projectStatus: Project['status']): FinanceExportStatus => {
  switch (projectStatus) {
    case 'CLOSED':
      return 'CLOSED';
    case 'REQUEST_EDIT':
      return 'WAITING_EDIT';
    case 'IN_PROGRESS':
      // In a real scenario, you'd check if it's been exported
      // For now, we'll use IN_PROGRESS as NOT_EXPORTED
      return 'NOT_EXPORTED';
    case 'WAITING_ACCEPT':
    case 'WAITING_CANCEL':
      return 'NOT_EXPORTED';
    default:
      return 'NOT_EXPORTED';
  }
};

// Get responsible person name from assignees
const getResponsiblePerson = (project: Project): string => {
  // Priority: procurement assignee, then contract assignee, then creator
  if (project.assignee_procurement && project.assignee_procurement.length > 0) {
    const assignee = project.assignee_procurement[0];
    return `${assignee.name}`;
  }
  if (project.assignee_contract && project.assignee_contract.length > 0) {
    const assignee = project.assignee_contract[0];
    return `${assignee.name}`;
  }
  if (project.creator) {
    return `${project.creator.name}`;
  }
  return 'ไม่ระบุ';
};

export function useFinanceExport() {
  // Fetch projects with filter for finance-relevant statuses
  const { data: projects, isLoading } = useProjects({
    status: ['IN_PROGRESS', 'CLOSED', 'REQUEST_EDIT', 'WAITING_ACCEPT'],
  });

  // Map and filter projects to finance export items
  const data = useMemo<FinanceExportItem[]>(() => {
    if (!projects) return [];

    return projects
      .map((project) => ({
        id: project.id,
        receive_no: project.receive_no,
        project_title: project.title,
        is_urgent: project.urgent_status !== 'NORMAL',
        responsible_person: getResponsiblePerson(project),
        procurement_type: project.procurement_type,
        export_status: mapToFinanceStatus(project.status),
        project_status: project.status,
        urgent_status: project.urgent_status,
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
