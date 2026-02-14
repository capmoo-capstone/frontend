import { useMemo } from 'react';

import { useProjects } from '@/features/projects/hooks/useProjects';
import type { Project } from '@/features/projects/types';

import type { RegistryExportItem, RegistryExportStatus } from '../types';

// Map project status to registry export status
const mapToRegistryStatus = (projectStatus: Project['status']): RegistryExportStatus => {
  switch (projectStatus) {
    case 'UNASSIGNED':
    case 'WAITING_ACCEPT':
      return 'NOT_REGISTERED';
    case 'IN_PROGRESS':
      return 'PENDING';
    case 'CLOSED':
      return 'ARCHIVED';
    case 'CANCELLED':
      return 'ARCHIVED';
    default:
      return 'REGISTERED';
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

export function useRegistryExport() {
  // Fetch all projects
  const { data: projects, isLoading } = useProjects();

  // Map and filter projects to registry export items
  const data = useMemo<RegistryExportItem[]>(() => {
    if (!projects) return [];

    return projects
      .map((project) => ({
        id: project.id,
        receive_no: project.receive_no,
        project_title: project.title,
        is_urgent: project.urgent_status !== 'NORMAL',
        responsible_person: getResponsiblePerson(project),
        procurement_type: project.procurement_type,
        registry_status: mapToRegistryStatus(project.status),
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
