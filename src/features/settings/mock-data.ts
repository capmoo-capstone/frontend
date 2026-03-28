import type { DelegationPayload } from '@/features/settings/types';

export interface SettingsPerson {
  id: string;
  full_name: string;
  role: string;
}

export interface ProcurementRoleSetting {
  id: string;
  label: string;
  member_ids: string[];
  allow_multiple: boolean;
  delegation: DelegationPayload[];
}

export interface WorkGroupSetting {
  id: string;
  name: string;
  workflow_types: string[];
  head_id: string;
  member_ids: string[];
  delegation: DelegationPayload | null;
}

export const DIRECTOR_USER_ID = 'u-director';

export const PROCUREMENT_PEOPLE: SettingsPerson[] = [
  { id: 'u-director', full_name: 'นายกิตติวศิรา รัตนโชติโสภณ', role: 'DIRECTOR' },
  { id: 'u-201', full_name: 'น.ส.ชัญฐ์มิตรา พักก้องวงศ์ชัย', role: 'DOCUMENT_STAFF' },
  { id: 'u-202', full_name: 'น.ส.บรรณจินรรณ วิจิตรวงศศิริ', role: 'FINANCE_STAFF' },
  { id: 'u-203', full_name: 'น.ส.ปุณณทิการิโชติ เตชะธนบูรณ์', role: 'GENERAL_STAFF' },
  { id: 'u-204', full_name: 'น.ส.พิพปานันท์ ก้องวนานก', role: 'GENERAL_STAFF' },
  { id: 'u-205', full_name: 'นางศิริพรัสรณ์ จอมเกียรติธำรง', role: 'GENERAL_STAFF' },
  { id: 'u-206', full_name: 'นางจิรนภัทรัส อนันดิ์ศุภผล', role: 'GENERAL_STAFF' },
  { id: 'u-207', full_name: 'น.ส.ธัญญนิตมิตรา พักก้องวงศ์ชัย', role: 'GENERAL_STAFF' },
  { id: 'u-208', full_name: 'นายเบราว์บริกรกุล พิษฐุฏิโกน', role: 'GENERAL_STAFF' },
  { id: 'u-209', full_name: 'นายวัชรธนธำชา จิรกรเอกอนันต์', role: 'GENERAL_STAFF' },
  { id: 'u-210', full_name: 'น.ส.ธิชาภรพฤกษ์ เลิศสิทธิ์วิจุลย์', role: 'GENERAL_STAFF' },
  { id: 'u-211', full_name: 'นางบรินทร์ศิริสวร อนันดิ์ศุภผล', role: 'GENERAL_STAFF' },
];

export const PROCUREMENT_ROLE_SETTINGS: ProcurementRoleSetting[] = [
  {
    id: 'director',
    label: 'ผู้อำนวยการฝ่ายการพัสดุ',
    member_ids: [DIRECTOR_USER_ID],
    allow_multiple: false,
    delegation: [],
  },
  {
    id: 'document',
    label: 'เจ้าหน้าที่สารบรรณ',
    member_ids: ['u-201'],
    allow_multiple: true,
    delegation: [],
  },
  {
    id: 'finance',
    label: 'เจ้าหน้าที่ติดต่อการเงิน',
    member_ids: ['u-202'],
    allow_multiple: true,
    delegation: [],
  },
  {
    id: 'admin',
    label: 'Admin',
    member_ids: [DIRECTOR_USER_ID, 'u-202'],
    allow_multiple: true,
    delegation: [],
  },
];

export const WORK_GROUP_SETTINGS: WorkGroupSetting[] = [
  {
    id: 'wg-1',
    name: 'กลุ่มงานซื้อจ้างงานกลาง',
    workflow_types: ['LT100K', 'LT500K'],
    head_id: DIRECTOR_USER_ID,
    member_ids: ['u-201', 'u-202', 'u-203', 'u-204', 'u-205', 'u-206'],
    delegation: null,
  },
  {
    id: 'wg-2',
    name: 'กลุ่มงานบริหารสัญญา',
    workflow_types: ['MT500K', 'SELECTION', 'EBIDDING', 'CONTRACT'],
    head_id: 'u-207',
    member_ids: ['u-208', 'u-209', 'u-210', 'u-211'],
    delegation: null,
  },
];

export const getPersonNameById = (id: string) => {
  return PROCUREMENT_PEOPLE.find((person) => person.id === id)?.full_name || '-';
};
