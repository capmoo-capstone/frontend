import type { DateRange } from 'react-day-picker';

export interface ProjectFilterParams {
  search?: string;
  title?: string;
  dateRange?: DateRange;
  fiscalYear?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  procurementType?: string[];
  status?: string[];
  procurementStatus?: string[];
  contractStatus?: string[];
  urgentStatus?: string[];
  assignees?: string[];
  departments?: string[];
  units?: string[];
  myTasks?: boolean;
}

export interface ProjectsQueryOptions {
  page?: number;
  limit?: number;
}

export interface OwnProjectQueryParams {
  page?: number;
  limit?: number;
}
