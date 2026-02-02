import { Clock, FileCheck, UserCheck, UserCog } from 'lucide-react';

import type { StepStatus } from '@/types/project-detail';

export const getWaitingStatusInfo = (status: StepStatus) => {
  switch (status) {
    case 'in_progress':
    case 'rejected':
      return {
        title: 'อยู่ระหว่างดำเนินการ',
        description: 'เจ้าหน้าที่พัสดุกำลังจัดทำหรือแก้ไขเอกสาร',
        icon: UserCog,
        color: 'text-error bg-error-light',
      };
    case 'submitted':
      return {
        title: 'รอการตรวจสอบ',
        description: 'หัวหน้ากลุ่มงานกำลังตรวจสอบความถูกต้อง',
        icon: UserCheck,
        color: 'text-info bg-info-light',
      };
    case 'approved':
      return {
        title: 'รอเสนอลงนาม',
        description: 'เจ้าหน้าที่งานระเบียบกำลังเตรียมเสนอผู้อำนวยการ',
        icon: FileCheck,
        color: 'text-info bg-info-light',
      };
    case 'completed':
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
