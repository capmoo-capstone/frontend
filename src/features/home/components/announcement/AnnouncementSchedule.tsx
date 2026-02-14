import { ANNOUNCEMENT_SCHEDULES } from '../../data/mock-data';
import { ScheduleCard } from './ScheduleCard';
import { ScheduleRemarks } from './ScheduleRemarks';

export function AnnouncementSchedule() {
  return (
    <div>
      <div className="flex items-center justify-center border-b border-orange-100 bg-orange-50/50 p-3">
        <h2 className="text-center text-lg font-bold text-orange-800">
          กำหนดการส่งเอกสารเพื่อดำเนินการจัดซื้อจัดจ้าง ประจำปีงบประมาณ พ.ศ. 2569 และ 2570
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 p-4 xl:grid-cols-3">
        {/* Schedule Tables (Left - 2 Cols) */}
        <div className="space-y-6 xl:col-span-2">
          <ScheduleCard
            schedule={ANNOUNCEMENT_SCHEDULES[0]}
            title="วัสดุ ครุภัณฑ์ จ้างทั่วไป ปรับปรุง ก่อสร้าง ปี 2569"
          />
          <ScheduleCard
            schedule={ANNOUNCEMENT_SCHEDULES[1]}
            title="งานจ้างเหมาบริการรายปี ปี 2570 (ส่งข้อมูลเข้าระบบ e-GP)"
          />
        </div>

        {/* Remark / Notes (Right Col) */}
        <ScheduleRemarks />
      </div>
    </div>
  );
}
