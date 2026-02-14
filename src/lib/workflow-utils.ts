import { CircleCheckBig, Clock, FileCheck, UserCheck, UserCog } from 'lucide-react';

import type { StepStatus } from '@/features/projects';
import type { Role } from '@/types/auth';

export const isActionRequired = (role: Role, status: StepStatus): boolean => {
  switch (role) {
    case 'GENERAL_STAFF':
      return ['in_progress', 'rejected'].includes(status);
    case 'HEAD_OF_UNIT':
      return status === 'submitted';
    case 'DOCUMENT_STAFF':
      return status === 'approved';
    default:
      return false;
  }
};

export const getStepColor = (status: StepStatus, role: Role) => {
  if (status === 'completed') {
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
    case 'in_progress': {
      return {
        line: 'bg-info',
        bubble: 'bg-info text-white',
        container: 'border-info bg-info-light text-info',
        title: 'กำลังดำเนินการ',
        description: 'เจ้าหน้าที่พัสดุกำลังจัดทำเอกสาร',
        icon: CircleCheckBig,
      };
    }
    case 'not_started': {
      return {
        line: 'bg-muted',
        bubble: 'bg-muted text-primary',
        container: 'border-muted bg-secondary text-muted-dark',
        title: 'ยังไม่ถึงขั้นตอนนี้',
        description: 'กรุณารอการดำเนินการจากขั้นตอนก่อนหน้า',
        icon: Clock,
      };
    }
    case 'submitted':
      return {
        line: 'bg-info',
        bubble: 'bg-info text-white',
        container: 'border-info bg-info-light text-info',
        title: 'รอการตรวจสอบ',
        description: 'หัวหน้ากลุ่มงานกำลังตรวจสอบความถูกต้อง',
        icon: UserCheck,
      };
    case 'approved':
      return {
        line: 'bg-info',
        bubble: 'bg-info text-white',
        container: 'border-info bg-info-light text-info',
        title: 'รอเสนอลงนาม',
        description: 'เจ้าหน้าที่งานระเบียบกำลังเตรียมเสนอผู้อำนวยการ',
        icon: FileCheck,
      };
    case 'rejected':
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
