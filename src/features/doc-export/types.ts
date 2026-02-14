import type {
  ProcurementType,
  ProjectStatus,
  ProjectUrgentStatus,
} from '@/features/projects/types';

export type DocExportStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface DocExportItem {
  id: string;
  receive_no: string;
  project_title: string;
  is_urgent: boolean;
  responsible_person: string;
  procurement_type: ProcurementType;
  doc_status: DocExportStatus;
  project_status: ProjectStatus;
  urgent_status: ProjectUrgentStatus;
}
