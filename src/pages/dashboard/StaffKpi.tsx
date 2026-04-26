import { useState } from 'react';

import { Calendar as CalendarIcon, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/useAuth';
import {
  MethodBreakdownList,
  MyTasksTable,
  PerformanceComparisonChart,
  useStaffKpiStats,
} from '@/features/dashboard';
import { ProjectStats } from '@/features/projects';

export default function StaffKpi() {
  const [dateRangeType, setDateRangeType] = useState('fiscal_year');
  const { user } = useAuth();

  // Get data from hook
  const { methodStats, chartData } = useStaffKpiStats();

  return (
    <div className="space-y-8 pb-10">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard ประสิทธิภาพรายบุคคล
          </h1>
          <p className="text-sm text-slate-500">ติดตามผลการดำเนินงานและภาระงานของคุณ</p>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border bg-white p-1 shadow-sm sm:flex-row sm:items-center">
          <Select defaultValue="fiscal_year" onValueChange={setDateRangeType}>
            <SelectTrigger className="w-40 border-0 bg-transparent font-medium shadow-none focus:ring-0">
              <SelectValue placeholder="ช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fiscal_year">ปีงบประมาณนี้</SelectItem>
              <SelectItem value="last_quarter">ไตรมาสที่ผ่านมา</SelectItem>
              <SelectItem value="this_month">เดือนนี้</SelectItem>
              <SelectItem value="custom">กำหนดเอง</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="hidden h-6 sm:block" />

          {dateRangeType === 'custom' ? (
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs text-slate-500">เลือกวันที่...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 text-sm text-slate-600">
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <span>1 ต.ค. 68 - 30 ก.ย. 69</span>
            </div>
          )}

          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-500">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- 1. Top Stats (Key Performance Indicators) --- */}
      <ProjectStats />

      {/* --- 3. Performance Chart & Method Breakdown --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PerformanceComparisonChart data={chartData} />
        <MethodBreakdownList data={methodStats} />
      </div>

      {/* --- 4. Projects Table Section --- */}
      <MyTasksTable user={user ?? undefined} />
    </div>
  );
}
