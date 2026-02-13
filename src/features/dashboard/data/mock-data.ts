import type { NotificationItem, UpcomingEvent } from '../types';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'ASSIGNED',
    title: 'กรุณาแจกงานประจำวันที่ 12 ม.ค. 2569',
    description: 'คุณได้รับมอบหมายให้รับผิดชอบโครงการ จำนวน 5 โครงการ กรุณาตรวจสอบ',
    time: '13.39 น.',
    isNew: true,
  },
  {
    id: 2,
    type: 'ASSIGNED',
    title: 'ได้รับมอบหมายงานใหม่',
    description: 'คุณได้รับมอบหมายให้รับผิดชอบโครงการ จำนวน 5 โครงการ กรุณาตรวจสอบ',
    time: '13.39 น.',
  },
  {
    id: 3,
    type: 'APPROVED',
    title: 'อนุมัติขั้นตอนการดำเนินการ',
    description:
      'โครงการจัดซื้อพัสดุสำหรับคณะหมูกรอบ ได้รับการอนุมัติแล้ว พร้อมดำเนินการในขั้นตอนที่ 1',
    time: '10.39 น.',
  },
  {
    id: 4,
    type: 'COMPLETED',
    title: 'ปิดโครงการ',
    description: 'ขณะนี้โครงการ [ชื่อโครงการ] ได้ดำเนินการเสร็จสิ้นแล้ว',
    time: '10.39 น.',
  },
  {
    id: 5,
    type: 'REJECTED',
    title: 'งานถูกตีกลับให้แก้ไข',
    description:
      'โครงการ [ชื่อโครงการ] ถูกตีกลับโดย [ชื่อผู้ตีกลับ] เหตุผล: [ระบุเหตุผล เช่น แก้ไขรหัสสินค้า]',
    time: '09.39 น.',
  },
];

export const MOCK_UPCOMING_SCHEDULE: UpcomingEvent[] = [
  {
    day: '25',
    month: 'ม.ค.',
    title: 'วันส่งงานโครงการบลาบลา',
    desc: 'ขณะนี้โครงการ [ชื่อโครงการ] ได้ดำเนินการเสร็จสิ้นแล้ว',
  },
  {
    day: '25',
    month: 'ม.ค.',
    title: 'วันส่งงานโครงการบลาบลา',
    desc: 'ขณะนี้โครงการ [ชื่อโครงการ] ได้ดำเนินการเสร็จสิ้นแล้ว',
  },
];
