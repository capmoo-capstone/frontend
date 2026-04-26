import type {
  ProcurementType,
  ProjectStatus,
  ProjectStatusByType,
  ProjectUrgentStatus,
} from '@/features/projects';

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
  vendor_name: string | null;
  po_no: string | null;
  contract_no: string | null;
  contract_step: number | null;
  export_status: FinanceExportStatus;
  project_status: ProjectStatus;
  procurement_status: ProjectStatusByType;
  contract_status: ProjectStatusByType;
  urgent_status: ProjectUrgentStatus;
}
