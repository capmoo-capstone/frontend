// Components
export { NotificationList } from './components/NotificationList';
export { CalendarWidget } from './components/CalendarWidget';
export { MyTasksTable } from './components/MyTasksTable';
export { myTasksColumns } from './components/MyTasksColumns';
export { WorkloadTrendChart } from './components/WorkloadTrendChart';
export { ProcurementPieChart } from './components/ProcurementPieChart';
export { StageDistributionChart } from './components/StageDistributionChart';
export { AverageTimeChart } from './components/AverageTimeChart';
export { StaffPerformanceTable } from './components/StaffPerformanceTable';
export { PerformanceComparisonChart } from './components/PerformanceComparisonChart';
export { MethodBreakdownList } from './components/MethodBreakdownList';

// Types
export type { NotificationItem, UpcomingEvent, DashboardFilters } from './types';

// Mock Data
export { MOCK_NOTIFICATIONS, MOCK_UPCOMING_SCHEDULE } from './data/mock-data';

// Hooks
export { useDashboardStats } from './hooks/useDashboardStats';
export { useStaffKpiStats } from './hooks/useStaffKpiStats';
