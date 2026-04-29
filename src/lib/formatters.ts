import { Clock, FileCheck, UserCheck, UserCog } from 'lucide-react';

import type { Role as UserRole } from '@/features/auth';
import {
  type ProjectStatus,
  type ProjectStatusByType,
  type UnitResponsibleType,
} from '@/features/projects';
import type { Project, StepStatus } from '@/features/projects';

export * from './date-formatters';

export type StatusVariant = 'warning' | 'info' | 'destructive' | 'secondary' | 'success';

export interface StatusFormat {
  label: string;
  variant: StatusVariant;
}

export interface ProjectStatusesResult {
  procurement: StatusFormat;
  contract: StatusFormat;
}

interface FormatParams {
  overallStatus: ProjectStatus;
  currentWorkflowType: UnitResponsibleType;
  procurementStatus?: ProjectStatusByType | null;
  procurementStep?: number | null;
  contractStatus?: ProjectStatusByType | null;
  contractStep?: number | null;
  isProcurementStaff: boolean;
  roles?: readonly UserRole[];
}

const hasRole = (roles: readonly UserRole[] | undefined, role: UserRole) =>
  roles?.includes(role) ?? false;

const getPhaseLabel = (status: ProjectStatusByType, step?: number | null) => {
  switch (status) {
    case 'IN_PROGRESS':
      return step != null ? `ขั้นตอนที่ ${step}` : 'กำลังดำเนินการ';
    case 'WAITING_APPROVAL':
      return step != null ? `รออนุมัติขั้นตอนที่ ${step}` : 'รออนุมัติ';
    case 'WAITING_PROPOSAL':
      return step != null ? `รอจัดทำแบบเสนอขั้นตอนที่ ${step}` : 'รอจัดทำแบบเสนอ';
    case 'WAITING_SIGNATURE':
      return step != null ? `เสนอลงนามขั้นตอนที่ ${step}` : 'เสนอลงนาม';
    case 'REJECTED':
      return step != null ? `แก้ไขขั้นตอนที่ ${step}` : 'ยกเลิก';
    case 'NOT_EXPORTED':
      return 'รอส่งเบิกการเงิน';
    case 'COMPLETED':
      return 'เสร็จสิ้น';
    default:
      return status;
  }
};

const getPhaseFormat = (
  phaseType: 'PROCUREMENT' | 'CONTRACT',
  status: ProjectStatusByType | null | undefined,
  step: number | null | undefined,
  overallStatus: ProjectStatus,
  currentWorkflowType: UnitResponsibleType,
  isProcurementStaff: boolean,
  roles?: readonly UserRole[]
): StatusFormat => {
  if (!status) return { label: '-', variant: 'secondary' };

  const isContractPhase = phaseType === 'CONTRACT';
  const isContractWorkflow = currentWorkflowType === 'CONTRACT';

  // Logic for External (Non-Staff)
  if (!isProcurementStaff) {
    if (overallStatus === 'CLOSED') return { label: 'ปิดโครงการ', variant: 'success' };
    if (overallStatus === 'CANCELLED') return { label: 'ยกเลิก', variant: 'destructive' };
    if (status === 'NOT_STARTED') return { label: 'ยังไม่เริ่ม', variant: 'secondary' };
    if (status === 'COMPLETED') {
      return isContractPhase
        ? { label: 'กำลังดำเนินการ', variant: 'warning' }
        : { label: 'เสร็จสิ้น', variant: 'success' };
    }
    return { label: 'กำลังดำเนินการ', variant: 'warning' };
  }

  // Logic for Staff Roles
  if (overallStatus === 'CLOSED') return { label: 'ปิดโครงการ', variant: 'success' };
  if (overallStatus === 'CANCELLED') return { label: 'ยกเลิก', variant: 'destructive' };

  if (overallStatus === 'WAITING_CANCEL') {
    const isHead = hasRole(roles, 'HEAD_OF_UNIT') || hasRole(roles, 'HEAD_OF_DEPARTMENT');
    return { label: 'รออนุมัติยกเลิก', variant: isHead ? 'warning' : 'info' };
  }

  if (overallStatus === 'UNASSIGNED' && status === 'NOT_STARTED') {
    const isActivePhase =
      (phaseType === 'PROCUREMENT' && !isContractWorkflow) ||
      (isContractPhase && isContractWorkflow);
    if (isActivePhase) return { label: 'ยังไม่ได้มอบหมาย', variant: 'secondary' };
  }

  if (overallStatus === 'WAITING_ACCEPT') {
    const isActivePhase =
      (phaseType === 'PROCUREMENT' && !isContractWorkflow) ||
      (isContractPhase && isContractWorkflow);
    if (isActivePhase) {
      return {
        label: 'รอการตอบรับ',
        variant: hasRole(roles, 'GENERAL_STAFF') ? 'warning' : 'info',
      };
    }
  }

  if (overallStatus === 'REQUEST_EDIT' && isContractPhase) {
    return {
      label: 'การเงินส่งคืนแก้ไข',
      variant:
        hasRole(roles, 'GENERAL_STAFF') || hasRole(roles, 'FINANCE_STAFF') ? 'destructive' : 'info',
    };
  }

  // Normal States Logic
  if (status === 'NOT_STARTED') return { label: 'ยังไม่ได้มอบหมาย', variant: 'secondary' };

  if (status === 'COMPLETED') {
    if (!isContractPhase) return { label: 'เสร็จสิ้น', variant: 'success' };
    return {
      label: 'ส่งเบิกการเงินแล้ว',
      variant: hasRole(roles, 'FINANCE_STAFF') ? 'warning' : 'info',
    };
  }

  if (status === 'NOT_EXPORTED' && isContractPhase) {
    return {
      label: 'รอส่งเบิกการเงิน',
      variant: hasRole(roles, 'FINANCE_STAFF') ? 'warning' : 'info',
    };
  }

  const label = getPhaseLabel(status, step);

  switch (status) {
    case 'IN_PROGRESS':
      return { label, variant: hasRole(roles, 'GENERAL_STAFF') ? 'warning' : 'info' };
    case 'WAITING_APPROVAL':
      return { label, variant: hasRole(roles, 'HEAD_OF_UNIT') ? 'warning' : 'info' };
    case 'WAITING_PROPOSAL':
    case 'WAITING_SIGNATURE':
      return { label, variant: hasRole(roles, 'DOCUMENT_STAFF') ? 'warning' : 'info' };
    case 'REJECTED':
      return { label, variant: hasRole(roles, 'GENERAL_STAFF') ? 'destructive' : 'info' };
    default:
      return { label, variant: 'secondary' };
  }
};

export const getProjectStatusesFormat = ({
  overallStatus,
  procurementStatus,
  procurementStep,
  contractStatus,
  contractStep,
  currentWorkflowType,
  isProcurementStaff,
  roles,
}: FormatParams): ProjectStatusesResult => {
  return {
    procurement: getPhaseFormat(
      'PROCUREMENT',
      procurementStatus,
      procurementStep,
      overallStatus,
      currentWorkflowType,
      isProcurementStaff,
      roles
    ),
    contract: getPhaseFormat(
      'CONTRACT',
      contractStatus,
      contractStep,
      overallStatus,
      currentWorkflowType,
      isProcurementStaff,
      roles
    ),
  };
};

// ==================== PROJECT HELPERS ====================

/**
 * Get responsible person name from project assignees
 * Priority: procurement assignee > contract assignee > creator
 * @param project - Project object
 * @returns Name of the responsible person or 'ไม่ระบุ' if none found
 */
export const getResponsiblePerson = (project: Project): string => {
  // Priority: procurement assignee, then contract assignee, then creator
  if (project.assignee_procurement && project.assignee_procurement.length > 0) {
    const assignee = project.assignee_procurement[0];
    return `${assignee.full_name}`;
  }
  if (project.assignee_contract && project.assignee_contract.length > 0) {
    const assignee = project.assignee_contract[0];
    return `${assignee.full_name}`;
  }
  return 'ไม่ระบุ';
};
export const normalizeMappedValue = (
  value: string | undefined,
  nameToIdMap: Map<string, string>
): string => {
  const raw = value?.trim();
  if (!raw) return '';
  return nameToIdMap.get(raw) ?? raw;
};

// ==================== RESPONSIBLE TYPE FORMATTERS ====================

export const RESPONSIBLE_SELECT_OPTIONS: { value: UnitResponsibleType; label: string }[] = [
  { value: 'LT100K', label: 'ซื้อ/จ้าง แบบเจาะจง ไม่เกิน 1 แสน' },
  { value: 'LT500K', label: 'ซื้อ/จ้าง แบบเจาะจง 1 - 5 แสน' },
  { value: 'MT500K', label: 'ซื้อ/จ้าง แบบเจาะจง เกิน 5 แสน' },
  { value: 'SELECTION', label: 'ซื้อ/จ้าง แบบคัดเลือก' },
  { value: 'EBIDDING', label: 'ซื้อ/จ้าง แบบประกาศเชิญชวนทั่วไป' },
  { value: 'CONTRACT', label: 'บริหารสัญญา' },
  { value: 'INTERNAL', label: 'ข้อ 18' },
];

export const getResponsibleTypeFormat = (type: UnitResponsibleType) => {
  switch (type) {
    case 'LT100K':
      return {
        label: 'ซื้อ/จ้าง แบบเจาะจง ไม่เกิน 1 แสน',
        indicator: 'var(--chart-1-dark)',
        bg: 'var(--chart-1-light)',
      };

    case 'LT500K':
      return {
        label: 'ซื้อ/จ้าง แบบเจาะจง 1 - 5 แสน',
        indicator: 'var(--chart-2-dark)',
        bg: 'var(--chart-2-light)',
      };

    case 'MT500K':
      return {
        label: 'ซื้อ/จ้าง แบบเจาะจง เกิน 5 แสน',
        indicator: 'var(--chart-3-dark)',
        bg: 'var(--chart-3-light)',
      };

    case 'SELECTION':
      return {
        label: 'ซื้อ/จ้าง แบบคัดเลือก',
        indicator: 'var(--chart-4-dark)',
        bg: 'var(--chart-4-light)',
      };

    case 'EBIDDING':
      return {
        label: 'ซื้อ/จ้าง แบบประกาศเชิญชวนทั่วไป',
        indicator: 'var(--chart-5-dark)',
        bg: 'var(--chart-5-light)',
      };
    case 'CONTRACT':
      return {
        label: 'บริหารสัญญา',
        indicator: 'var(--chart-6-dark)',
        bg: 'var(--chart-6-light)',
      };
    case 'INTERNAL':
      return {
        label: 'ซื้อ/จ้าง ตามระเบียบฯ ข้อ 18',
        indicator: 'var(--chart-7-dark)',
        bg: 'var(--chart-7-light)',
      };

    default:
      return {
        label: type,
        indicator: 'var(--foreground)',
        bg: 'var(--background)',
      };
  }
};

// ==================== WORKFLOW STATUS FORMATTERS ====================

export const getWaitingStatusInfo = (status: StepStatus) => {
  switch (status) {
    case 'NOT_STARTED':
      return {
        title: 'ยังไม่ถึงขั้นตอนนี้',
        description: 'กรุณารอการดำเนินการจากขั้นตอนก่อนหน้า',
        icon: Clock,
        color: 'text-muted-foreground bg-muted',
      };
    case 'IN_PROGRESS':
      return {
        title: 'อยู่ระหว่างดำเนินการ',
        description: 'เจ้าหน้าที่พัสดุกำลังจัดทำหรือแก้ไขเอกสาร',
        icon: UserCog,
        color: 'text-info bg-info-light',
      };
    case 'REJECTED':
      return {
        title: 'รอการแก้ไขเอกสาร',
        description: 'รอเจ้าหน้าที่พัสดุปรับปรุงเอกสารและส่งใหม่',
        icon: UserCheck,
        color: 'text-info bg-info-light',
      };
    case 'WAITING_APPROVAL':
    case 'WAITING_PROPOSAL':
      return {
        title: 'รอการตรวจสอบ',
        description: 'หัวหน้ากลุ่มงานกำลังตรวจสอบความถูกต้อง',
        icon: UserCheck,
        color: 'text-info bg-info-light',
      };
    case 'WAITING_SIGNATURE':
      return {
        title: 'รอเสนอลงนาม',
        description: 'เจ้าหน้าที่งานระเบียบกำลังเตรียมเสนอผู้อำนวยการ',
        icon: FileCheck,
        color: 'text-info bg-info-light',
      };
    case 'COMPLETED':
      return {
        title: 'ดำเนินการเสร็จสิ้น',
        description: 'ขั้นตอนนี้เสร็จสมบูรณ์แล้ว',
        icon: FileCheck,
        color: 'text-success bg-success-light',
      };
    default:
      return {
        title: 'ยังไม่ถึงขั้นตอนนี้',
        description: 'กรุณารอการดำเนินการจากขั้นตอนก่อนหน้า',
        icon: Clock,
        color: 'text-muted-foreground bg-muted',
      };
  }
};

// ==================== PROJECT STATUS FORMATTERS ====================

/**
 * Get formatted project status label and badge variant
 * Note: This function requires user context to determine department-specific logic.
 * Pass the user's department name as a parameter to keep it testable.
 */
export const getProjectStatusFormat = (
  project_status: string,
  workflow_status: string,
  userDepartmentName: string | undefined,
  procure_status?: string
) => {
  let variant: 'secondary' | 'destructive' | 'warning' | 'success' | 'ghost' | 'info' = 'secondary';
  let label: string;

  if (userDepartmentName !== 'procurement') {
    if (
      workflow_status.startsWith('IN_PROGRESS') ||
      workflow_status.startsWith('WAITING_APPROVAL') ||
      workflow_status.startsWith('PENDING_PROPOSAL') ||
      workflow_status.startsWith('PROPOSING') ||
      workflow_status.startsWith('REJECTED')
    ) {
      label = 'กำลังดำเนินการ';
      variant = 'warning';
    } else if (workflow_status === 'COMPLETED') {
      label = 'เสร็จสิ้น';
      variant = 'success';
    } else if (workflow_status === 'NOT_STARTED' && project_status === 'IN_PROGRESS') {
      label = '-';
      variant = 'ghost';
    } else {
      switch (project_status) {
        case 'UNASSIGNED':
          if (procure_status === 'NOT_STARTED') {
            label = '-';
            variant = 'ghost';
          } else {
            label = 'ยังไม่เริ่ม';
            variant = 'secondary';
          }
          break;
        case 'WAITING_ACCEPT':
          if (procure_status === 'NOT_STARTED') {
            label = '-';
            variant = 'ghost';
          } else {
            label = 'ยังไม่เริ่ม';
            variant = 'secondary';
          }
          break;
        case 'IN_PROGRESS':
          label = 'กำลังดำเนินการ';
          variant = 'warning';
          break;
        case 'CLOSED':
          label = 'เสร็จสิ้น';
          variant = 'success';
          break;
        case 'CANCELLED':
          if (procure_status === 'CANCELLED') {
            label = '-';
            variant = 'ghost';
          } else {
            label = 'ยกเลิก';
            variant = 'destructive';
          }
          break;
        case 'REQUEST_EDIT':
          label = 'กำลังดำเนินการ';
          variant = 'warning';
          break;
        default:
          label = workflow_status;
      }
    }
  } else {
    if (workflow_status.startsWith('IN_PROGRESS')) {
      const stepNumber = workflow_status.split(' ').pop();
      label = `ขั้นตอนที่ ${stepNumber}`;
      variant = 'warning';
    } else if (workflow_status.startsWith('WAITING_APPROVAL')) {
      const stepNumber = workflow_status.split(' ').pop();
      label = `รออนุมัติขั้นตอนที่ ${stepNumber}`;
      variant = 'warning';
    } else if (workflow_status.startsWith('PENDING_PROPOSAL')) {
      const stepNumber = workflow_status.split(' ').pop();
      label = `รอจัดทำแบบเสนอขั้นตอนที่ ${stepNumber}`;
      variant = 'warning';
    } else if (workflow_status.startsWith('PROPOSING')) {
      const stepNumber = workflow_status.split(' ').pop();
      label = `เสนอลงนามขั้นตอนที่ ${stepNumber}`;
      variant = 'warning';
    } else if (workflow_status.startsWith('REJECTED')) {
      const stepNumber = workflow_status.split(' ').pop();
      label = `แก้ไขขั้นตอนที่ ${stepNumber}`;
      variant = 'destructive';
    } else if (workflow_status === 'COMPLETED') {
      label = 'เสร็จสิ้น';
      variant = 'success';
    } else if (workflow_status === 'NOT_STARTED' && project_status === 'IN_PROGRESS') {
      label = '-';
      variant = 'ghost';
    } else {
      switch (project_status) {
        case 'UNASSIGNED':
          if (procure_status === 'NOT_STARTED') {
            label = '-';
            variant = 'ghost';
          } else {
            label = 'ยังไม่ได้มอบหมาย';
            variant = 'secondary';
          }
          break;
        case 'WAITING_ACCEPT':
          if (procure_status === 'NOT_STARTED') {
            label = '-';
            variant = 'ghost';
          } else {
            label = 'รอการตอบรับ';
            variant = 'secondary';
          }
          break;
        case 'CLOSED':
          label = 'เสร็จสิ้น';
          variant = 'success';
          break;
        case 'CANCELLED':
          if (procure_status === 'CANCELLED') {
            label = '-';
            variant = 'ghost';
          } else {
            label = 'ยกเลิก';
            variant = 'destructive';
          }
          break;
        case 'REQUEST_EDIT':
          label = 'การเงินส่งคืนแก้ไข';
          variant = 'destructive';
          break;
        default:
          label = workflow_status;
      }
    }
  }
  return { label, variant };
};
