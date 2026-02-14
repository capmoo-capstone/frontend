import type { ProjectStatus } from '@/features/projects';

export interface NotificationItem {
  id: number;
  type: 'ASSIGNED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

export interface UpcomingEvent {
  day: string;
  month: string;
  title: string;
  desc: string;
}

export interface DashboardFilters {
  myTasks?: boolean;
  status?: ProjectStatus[];
  urgentStatus?: string[];
}
