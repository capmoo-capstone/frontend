export interface KpiStat {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

export interface MethodData {
  name: string;
  value: number;
  color: string;
}

export interface Project {
  name: string;
  budget: number;
  status: string;
}

export interface ScheduleRange {
  label: string;
  end: string;
}

export interface ScheduleSection {
  title: string;
  colorClass: string;
  ranges: ScheduleRange[];
}

export interface AnnouncementScheduleData {
  fiscalYear: number;
  startMonth: string;
  sections: ScheduleSection[];
  borderColor: string;
  bgColor: string;
  titleBgColor: string;
}
