import type { AnnouncementScheduleData } from '../../types';
import { ScheduleRow } from './ScheduleRow';

interface ScheduleCardProps {
  schedule: AnnouncementScheduleData;
  title: string;
}

export function ScheduleCard({ schedule, title }: ScheduleCardProps) {
  return (
    <div className={`rounded-xl border-2 ${schedule.borderColor} ${schedule.bgColor} p-4`}>
      <div
        className={`mb-4 flex items-center justify-between rounded-lg ${schedule.titleBgColor} p-2 text-white`}
      >
        <span className="font-bold">{title}</span>
        <div className="flex gap-4 text-sm">
          <span>เริ่ม: {schedule.startMonth}</span>
        </div>
      </div>

      {schedule.sections.map((section, idx) => (
        <ScheduleRow
          key={idx}
          title={section.title}
          colorClass={section.colorClass}
          ranges={section.ranges}
        />
      ))}
    </div>
  );
}
