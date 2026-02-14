import { AlertCircle, AlertTriangle, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';

import type { AnnouncementScheduleData, KpiStat, MethodData, Project } from '../types';

export const KPI_STATS: KpiStat[] = [
  {
    label: 'โครงการทั้งหมด',
    value: 120,
    icon: FileText,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  {
    label: 'ยังไม่เริ่ม',
    value: 5,
    icon: AlertCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    label: 'กำลังดำเนินการ',
    value: 80,
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    label: 'เสร็จสิ้น',
    value: 5,
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  {
    label: 'ถูกยกเลิก',
    value: 5,
    icon: XCircle,
    color: 'text-rose-600',
    bg: 'bg-rose-100',
  },
  {
    label: 'ด่วน',
    value: 3,
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  {
    label: 'ด่วนพิเศษ',
    value: 2,
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100',
  },
];

export const METHOD_DATA: MethodData[] = [
  { name: 'เจาะจง < 100K', value: 50, color: '#EAB308' },
  { name: 'เจาะจง 100K-500K', value: 20, color: '#F97316' },
  { name: 'เจาะจงโดยวิธีคัดเลือก', value: 18, color: '#3B82F6' },
  { name: 'เจาะจง < 100K', value: 22, color: '#60A5FA' },
  { name: 'e-bidding', value: 5, color: '#1E40AF' },
];

export const PROJECTS: Project[] = [
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 1 ซื้อยาวๆๆๆๆๆๆๆ',
    budget: 1300000,
    status: 'ยังไม่ได้ดำเนินการ',
  },
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 2',
    budget: 8200000,
    status: 'ยังไม่ได้ดำเนินการ',
  },
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 3',
    budget: 3200000,
    status: 'ยังไม่ได้ดำเนินการ',
  },
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 4',
    budget: 1400000,
    status: 'ยังไม่ได้ดำเนินการ',
  },
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 5',
    budget: 2300000,
    status: 'กำลังดำเนินการ',
  },
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 6',
    budget: 5200000,
    status: 'กำลังดำเนินการ',
  },
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 7',
    budget: 1100000,
    status: 'กำลังดำเนินการ',
  },
  {
    name: 'โครงการจัดซื้อวัสดุสำหรับคณะหมูกรอบ 8',
    budget: 4500000,
    status: 'ดำเนินการเรียบร้อย',
  },
];

export const ANNOUNCEMENT_SCHEDULES: AnnouncementScheduleData[] = [
  {
    fiscalYear: 2569,
    startMonth: 'ต.ค. 68',
    borderColor: 'border-orange-200',
    bgColor: 'bg-white',
    titleBgColor: 'bg-orange-500',
    sections: [
      {
        title: 'e-bidding',
        colorClass: 'bg-orange-600',
        ranges: [
          { label: 'เกิน 50,000,000 บาท ขึ้นไป', end: '1 พ.ค. 69' },
          { label: '10,000,001 - 50,000,000 บาท', end: '8 พ.ค. 69' },
          { label: '5,000,001 - 10,000,000 บาท', end: '15 พ.ค. 69' },
          { label: '500,000 - 5,000,000 บาท', end: '22 พ.ค. 69' },
        ],
      },
      {
        title: 'วิธีคัดเลือก',
        colorClass: 'bg-orange-500',
        ranges: [{ label: 'เกิน 500,000 บาท ขึ้นไป', end: '29 พ.ค. 69' }],
      },
      {
        title: 'เฉพาะเจาะจง',
        colorClass: 'bg-orange-400',
        ranges: [
          { label: 'เกิน 500,000 บาท ขึ้นไป', end: '12 มิ.ย. 69' },
          { label: '100,001 - 500,000 บาท', end: '26 มิ.ย. 69' },
          { label: 'ไม่เกิน 100,000 บาท', end: '10 ก.ค. 69' },
        ],
      },
    ],
  },
  {
    fiscalYear: 2570,
    startMonth: 'ต.ค. 68',
    borderColor: 'border-blue-200',
    bgColor: 'bg-white',
    titleBgColor: 'bg-blue-600',
    sections: [
      {
        title: 'e-bidding',
        colorClass: 'bg-blue-600',
        ranges: [
          { label: 'เกิน 50,000,000 บาท ขึ้นไป', end: '1 พ.ค. 69' },
          { label: '10,000,001 - 50,000,000 บาท', end: '8 พ.ค. 69' },
          { label: '5,000,001 - 10,000,000 บาท', end: '15 พ.ค. 69' },
          { label: '500,000 - 5,000,000 บาท', end: '22 พ.ค. 69' },
        ],
      },
      {
        title: 'วิธีคัดเลือก',
        colorClass: 'bg-blue-500',
        ranges: [{ label: 'เกิน 500,000 บาท ขึ้นไป', end: '5 มิ.ย. 69' }],
      },
      {
        title: 'เฉพาะเจาะจง',
        colorClass: 'bg-blue-400',
        ranges: [
          { label: 'เกิน 500,000 บาท ขึ้นไป', end: '10 ก.ค. 69' },
          { label: '100,001 - 500,000 บาท', end: '17 ก.ค. 69' },
          { label: 'ไม่เกิน 100,000 บาท', end: '31 ก.ค. 69' },
        ],
      },
    ],
  },
];

export const BUDGET_SUMMARY = {
  totalBudget: 1000000,
  usedBudget: 400000,
  totalItems: 100,
  unusedItems: 12,
};
