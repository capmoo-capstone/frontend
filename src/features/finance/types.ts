import type { ProcurementType, ProjectStatus, ProjectUrgentStatus } from '@/features/projects';

export type FinanceExportStatus = 'NOT_EXPORTED' | 'EXPORTED' | 'CLOSED' | 'WAITING_EDIT';

export interface FinanceExportItem {
  id: string;
  receive_no: string;
  project_title: string;
  is_urgent: boolean;
  responsible_person: string;
  procurement_type: ProcurementType;
  budget: number;
  department_name: string;
  export_status: FinanceExportStatus;
  project_status: ProjectStatus;
  urgent_status: ProjectUrgentStatus;
}
