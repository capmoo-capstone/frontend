import type {
  ProcurementType,
  ProjectStatus,
  ProjectUrgentStatus,
} from '@/features/projects/types';

export type RegistryExportStatus = 'NOT_REGISTERED' | 'REGISTERED' | 'ARCHIVED' | 'PENDING';

export interface RegistryExportItem {
  id: string;
  receive_no: string;
  project_title: string;
  is_urgent: boolean;
  responsible_person: string;
  procurement_type: ProcurementType;
  registry_status: RegistryExportStatus;
  project_status: ProjectStatus;
  urgent_status: ProjectUrgentStatus;
}
