import { CircleCheckBig, Clock, FileCheck, UserCheck, UserCog } from 'lucide-react';

import type { Role } from '@/features/auth';
import type { StepStatus } from '@/features/projects';

export const isActionRequired = (role: Role, status: StepStatus): boolean => {
  switch (role) {
    case 'GENERAL_STAFF':
      return ['IN_PROGRESS', 'REJECTED'].includes(status);
    case 'HEAD_OF_UNIT':
      return status === 'WAITING_APPROVAL';
    case 'DOCUMENT_STAFF':
      return ['WAITING_PROPOSAL', 'WAITING_SIGNATURE'].includes(status);
    default:
      return false;
  }
};

export const getStepColor = (status: StepStatus, role: Role) => {
  if (status === 'COMPLETED') {
    return {
      line: 'bg-success',
      bubble: 'bg-success text-white',
      container: 'border-success bg-success-light text-success-dark',
      title: 'ดำเนินการเสร็จสิ้น',
      description: 'ขั้นตอนนี้เสร็จสมบูรณ์แล้ว',
      icon: FileCheck,
    };
  }

  if (isActionRequired(role, status)) {
    return {
      line: 'bg-warning/50',
      bubble: 'bg-warning text-white',
      container: 'border-warning bg-warning-light text-warning-dark',
    };
  }

  switch (status) {
    case 'IN_PROGRESS': {
      return {
        line: 'bg-info',
        bubble: 'bg-info text-white',
        container: 'border-info bg-info-light text-info',
        title: 'กำลังดำเนินการ',
        description: 'เจ้าหน้าที่พัสดุกำลังจัดทำเอกสาร',
        icon: CircleCheckBig,
      };
    }
    case 'NOT_STARTED': {
      return {
        line: 'bg-muted',
        bubble: 'bg-muted text-primary',
        container: 'border-muted bg-secondary text-muted-dark',
        title: 'ยังไม่ถึงขั้นตอนนี้',
        description: 'กรุณารอการดำเนินการจากขั้นตอนก่อนหน้า',
        icon: Clock,
      };
    }
    case 'WAITING_APPROVAL':
    case 'WAITING_PROPOSAL':
      return {
        line: 'bg-info',
        bubble: 'bg-info text-white',
        container: 'border-info bg-info-light text-info',
        title: 'รอการตรวจสอบ',
        description: 'หัวหน้ากลุ่มงานกำลังตรวจสอบความถูกต้อง',
        icon: UserCheck,
      };
    case 'WAITING_SIGNATURE':
      return {
        line: 'bg-info',
        bubble: 'bg-info text-white',
        container: 'border-info bg-info-light text-info',
        title: 'รอเสนอลงนาม',
        description: 'เจ้าหน้าที่งานระเบียบกำลังเตรียมเสนอผู้อำนวยการ',
        icon: FileCheck,
      };
    case 'REJECTED':
      return {
        line: 'bg-error',
        bubble: 'bg-error text-white',
        container: 'border-error bg-error-light text-error',
        title: 'อยู่ระหว่างดำเนินการ',
        description: 'เจ้าหน้าที่พัสดุกำลังจัดทำหรือแก้ไขเอกสาร',
        icon: UserCog,
      };
    default:
      return {
        line: 'bg-muted',
        bubble: 'bg-muted text-primary',
        container: 'border-muted bg-secondary text-muted-dark',
        title: 'ยังไม่ถึงขั้นตอนนี้',
        description: 'กรุณารอการดำเนินการจากขั้นตอนก่อนหน้า',
        icon: Clock,
      };
  }
};
