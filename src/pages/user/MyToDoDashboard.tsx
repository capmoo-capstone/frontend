import { useAuth } from '@/context/useAuth';
import {
  CalendarWidget,
  MOCK_NOTIFICATIONS,
  MOCK_UPCOMING_SCHEDULE,
  MyTasksTable,
  NotificationList,
} from '@/features/dashboard';
import { ProjectStats } from '@/features/projects';

export default function MyToDoDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <h1 className="h1-topic text-primary w-full">สวัสดี, {user?.name}</h1>

      {/* Top Section: Notifications & Calendar */}
      <div className="flex flex-col gap-6 xl:flex-row">
        <NotificationList notifications={MOCK_NOTIFICATIONS} />
        <CalendarWidget upcomingEvents={MOCK_UPCOMING_SCHEDULE} />
      </div>

      {/* Middle Section: Stats */}
      <ProjectStats />

      {/* Bottom Section: Jobs Table */}
      <MyTasksTable user={user ?? undefined} />
    </div>
  );
}
