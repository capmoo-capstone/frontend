import {
  AnnouncementSchedule,
  BudgetSummary,
  ControlBar,
  MethodChart,
  ProjectListTable,
} from '@/features/home';
import { ProjectStats } from '@/features/projects';

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="h1-topic text-primary">ยินดีต้อนรับ คุณทิพปภานันท์ กังวานกนก</h1>
          <p className="text-muted-foreground h2-sub">สำนักงานมหาวิทยาลัย</p>
        </div>
      </div>

      {/* Announcement Schedule Section */}
      <AnnouncementSchedule />

      {/* Control Bar */}
      <ControlBar />

      {/* Project Stats */}
      <ProjectStats />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MethodChart />
        <BudgetSummary />
      </div>

      {/* Project List Table */}
      <ProjectListTable />
    </div>
  );
}
