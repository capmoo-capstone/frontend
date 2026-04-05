import type { DateRange } from 'react-day-picker';

export interface ProjectFilterParams {
  search?: string;
  title?: string;
  dateRange?: DateRange;
  fiscalYear?: string;
  procurementType?: string[];
  status?: string[];
  urgentStatus?: string[];
  assignees?: string[];
  departments?: string[];
  myTasks?: boolean;
}
