// src/types/dashboard.ts
import type { ProcurementType } from '@/features/projects';

// API Response for Page 1 (Overview)
export interface DashboardOverviewStats {
  fiscal_year_start: string;
  fiscal_year_end: string;
  kpi: {
    total: number;
    unassigned: number;
    in_progress: number;
    delayed: { count: number; percentage: number };
    completed: number;
    cancelled: { count: number; percentage: number };
  };
  charts: {
    avg_processing_time: { type: ProcurementType | string; days: number }[];
    procurement_method_ratio: { type: ProcurementType | string; count: number }[];
    workflow_distribution: { stage: string; count: number }[];
  };
  team_performance: {
    avg_projects_per_person: number;
    avg_days_per_project: number;
    members: {
      id: string;
      name: string;
      total: number;
      in_progress: number;
      completed: number;
    }[];
  };
}

// API Response for Page 2 (Individual)
export interface UserPerformanceStats {
  user_id: string;
  user_name: string;
  kpi_summary: {
    completed_projects: { count: number; trend: number; avg_market: number };
    avg_working_time: { days: number; trend: number; avg_market: number };
  };
  method_breakdown: {
    type: string; // e.g., "Specific < 100k"
    projects_count: number;
    projects_trend: number; // Percentage
    avg_days: number;
    avg_days_trend: number; // Percentage
  }[];
  current_status: {
    in_progress: number;
    urgent: number;
    delayed: number;
    cancelled: number;
  };
}

// Extended interfaces for IndividualDashboardV2
export interface MethodPerformanceStat {
  id: string;
  title: string;
  myCount: number;
  myCountTrend: number; // percentage
  myAvgDays: number;
  myAvgDaysTrend: number; // percentage
  teamAvgCount: number;
  teamAvgDays: number;
  theme: 'yellow' | 'orange' | 'blue';
}

export interface ChartComparisonData {
  name: string;
  myTime: number;
  teamTime: number;
}
