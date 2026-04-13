export const SUPPLY_OPERATION_DEPARTMENT_ID = 'DEPT-SUP-OPS';
export const DIRECTOR_ROLE_ID = 'HEAD_OF_DEPARTMENT';
export const HEAD_OF_UNIT_ROLE_ID = 'HEAD_OF_UNIT';

export const PROCUREMENT_ROLES_CONFIG = [
  { role: 'HEAD_OF_DEPARTMENT', label: 'ผู้อำนวยการฝ่ายการพัสดุ', allowMultiple: false },
  { role: 'DOCUMENT_STAFF', label: 'เจ้าหน้าที่สารบรรณ', allowMultiple: true },
  { role: 'FINANCE_STAFF', label: 'เจ้าหน้าที่ติดต่อการเงิน', allowMultiple: true },
  { role: 'ADMIN', label: 'Admin', allowMultiple: true },
  { role: 'SUPER_ADMIN', label: 'Super Admin', allowMultiple: true },
];
