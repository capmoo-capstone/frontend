import { useMemo } from 'react';

import { useProjects } from '@/features/projects/hooks/useProjects';
import type { Project } from '@/features/projects/types';
import { getResponsiblePerson } from '@/lib/formatters';

import type { DocExportItem, DocExportStatus } from '../types';

// Map project status to doc export status
const mapToDocStatus = (projectStatus: Project['status']): DocExportStatus => {
  switch (projectStatus) {
    case 'IN_PROGRESS':
      return 'NOT_SUBMITTED';
    case 'WAITING_ACCEPT':
      return 'SUBMITTED';
    case 'CLOSED':
      return 'APPROVED';
    case 'CANCELLED':
      return 'REJECTED';
    default:
      return 'NOT_SUBMITTED';
  }
};

export function useDocExport() {
  // Fetch projects with filter for doc-relevant statuses
  const { data: projects, isLoading } = useProjects({
    status: ['IN_PROGRESS', 'WAITING_ACCEPT', 'CLOSED', 'CANCELLED'],
  });

  // Map and filter projects to doc export items
  const data = useMemo<DocExportItem[]>(() => {
    if (!projects) return [];

    return projects
      .map((project) => ({
        id: project.id,
        receive_no: project.receive_no,
        project_title: project.title,
        is_urgent: project.urgent_status !== 'NORMAL',
        responsible_person: getResponsiblePerson(project),
        procurement_type: project.procurement_type,
        doc_status: mapToDocStatus(project.status),
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
