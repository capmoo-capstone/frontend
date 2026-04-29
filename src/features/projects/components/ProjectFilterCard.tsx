import React, { useMemo } from 'react';

import { Search } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDepartments } from '@/features/organization';
import { useUsersForSelection } from '@/features/users';
import { OPS_DEPT_ID } from '@/lib/constants';

import { type ProjectFilterParams } from '../api';
import { useProjectPermissions } from '../hooks/useProjectPermissions';
import type { ProjectStatus } from '../types/index';
import { ProcurementTypeEnum, ProjectUrgentStatusEnum } from '../types/index';
import { getResponsibleTypeFormat } from '../utils/projectFormatters';
import { FilterCheckbox } from './FilterCheckbox';
import { SearchCheckbox } from './SearchCheckbox';

interface ProjectFilterCardProps {
  filters: ProjectFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<ProjectFilterParams>>;
}

const PROCUREMENT_STATUS_FILTERS: Array<{
  id: string;
  label: string;
  values: ProjectStatus[];
}> = [
  {
    id: 'UNASSIGNED',
    label: 'ยังไม่ได้มอบหมาย',
    values: ['UNASSIGNED'],
  },
  {
    id: 'WAITING_ACCEPT',
    label: 'รอการตอบรับ',
    values: ['WAITING_ACCEPT'],
  },
  {
    id: 'IN_PROGRESS',
    label: 'กำลังดำเนินการ',
    values: ['IN_PROGRESS'],
  },
  {
    id: 'WAITING_CANCEL',
    label: 'รออนุมัติยกเลิก',
    values: ['WAITING_CANCEL'],
  },
  {
    id: 'CANCELLED',
    label: 'ยกเลิก',
    values: ['CANCELLED'],
  },
  {
    id: 'CLOSED',
    label: 'เสร็จสิ้น',
    values: ['CLOSED'],
  },
  {
    id: 'REQUEST_EDIT',
    label: 'การเงินส่งคืนแก้ไข',
    values: ['REQUEST_EDIT'],
  },
];

const NON_PROCUREMENT_STATUS_FILTERS: Array<{
  id: string;
  label: string;
  values: ProjectStatus[];
}> = [
  {
    id: 'NOT_STARTED_GROUP',
    label: 'ยังไม่เริ่ม',
    values: ['UNASSIGNED', 'WAITING_ACCEPT'],
  },
  {
    id: 'IN_PROGRESS_GROUP',
    label: 'กำลังดำเนินการ',
    values: ['IN_PROGRESS', 'WAITING_CANCEL', 'REQUEST_EDIT'],
  },
  {
    id: 'CANCELLED',
    label: 'ยกเลิก',
    values: ['CANCELLED'],
  },
  {
    id: 'CLOSED',
    label: 'เสร็จสิ้น',
    values: ['CLOSED'],
  },
];

export function ProjectFilterCard({ filters, setFilters }: ProjectFilterCardProps) {
  const { isProcurementStaff } = useProjectPermissions();

  const handleToggleFilter = (key: keyof ProjectFilterParams, value: string) => {
    setFilters((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((i) => i !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const procurementTypes = ProcurementTypeEnum.options;
  const urgentStatuses = ProjectUrgentStatusEnum.options;
  const projectStatusFilters = isProcurementStaff
    ? PROCUREMENT_STATUS_FILTERS
    : NON_PROCUREMENT_STATUS_FILTERS;

  const { data: departments } = useDepartments();
  const { data: users } = useUsersForSelection({ deptId: OPS_DEPT_ID });
  const generalStaff = useMemo(() => {
    if (!users?.data) return [];

    return users.data
      .filter((user) => user.role === 'GENERAL_STAFF')
      .map((user) => ({
        id: user.id,
        full_name: user.full_name,
      }));
  }, [users]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ชื่อโครงการ</span>
          <div className="bg-background relative rounded-lg">
            <Input
              className="normal pr-10"
              placeholder={'ค้นหาโครงการ'}
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            />
            <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ช่วงเวลา</span>
          <DatePickerWithRange
            value={filters.dateRange}
            onChange={(val) => setFilters((p) => ({ ...p, dateRange: val }))}
          />
        </div>

        {/* to do ปีงบประมาณ */}
        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ปีงบประมาณ</span>
          <Select
            value={filters.fiscalYear}
            onValueChange={(v) => setFilters((p) => ({ ...p, fiscalYear: v }))}
          >
            <SelectTrigger className="normal w-full">
              <SelectValue placeholder="เลือกปีงบประมาณ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2566</SelectItem>
              <SelectItem value="2024">2567</SelectItem>
              <SelectItem value="2025">2568</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ผู้รับผิดชอบ</span>
          <SearchCheckbox
            items={generalStaff}
            placeholder="ค้นหาผู้รับผิดชอบ"
            value={filters.assignees}
            onChange={(val) => setFilters((p) => ({ ...p, assignees: val }))}
          />
        </div>
      </div>

      <FilterCheckbox
        id="MY_TASKS"
        label="งานของฉัน"
        checked={filters.myTasks}
        onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, myTasks: checked }))}
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="normal-b">วิธีการจัดหา</span>
          {procurementTypes.map((type) => {
            const format = getResponsibleTypeFormat(type);

            return (
              <FilterCheckbox
                key={type}
                id={type}
                label={format.label}
                checked={filters.procurementType?.includes(type)}
                onCheckedChange={() => handleToggleFilter('procurementType', type)}
              />
            );
          })}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="normal-b">สถานะ</span>
          {projectStatusFilters.map((statusGroup) => (
            <FilterCheckbox
              key={statusGroup.id}
              id={statusGroup.id}
              label={statusGroup.label}
              checked={statusGroup.values.every((value) => filters.status?.includes(value))}
              onCheckedChange={(checked) => {
                setFilters((prev) => {
                  const current = prev.status ?? [];

                  if (checked) {
                    const next = new Set(current);
                    statusGroup.values.forEach((value) => next.add(value));
                    return { ...prev, status: [...next] };
                  }

                  const valuesToRemove = new Set<string>(statusGroup.values);

                  return {
                    ...prev,
                    status: current.filter((value) => !valuesToRemove.has(value)),
                  };
                });
              }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="normal-b">ความเร่งด่วน</span>
          {urgentStatuses.map((status) => (
            <FilterCheckbox
              key={status}
              id={status}
              label={
                {
                  NORMAL: 'ปกติ',
                  URGENT: 'ด่วน',
                  VERY_URGENT: 'ด่วนที่สุด',
                  SUPER_URGENT: 'ด่วนพิเศษ',
                }[status]
              }
              checked={filters.urgentStatus?.includes(status)}
              onCheckedChange={() => handleToggleFilter('urgentStatus', status)}
            />
          ))}
        </div>

        {isProcurementStaff && (
          <div className="flex flex-col gap-0.5">
            <span className="normal-b">หน่วยงาน</span>
            <SearchCheckbox
              items={departments ?? []}
              placeholder="ค้นหาหน่วยงาน"
              value={filters.departments}
              onChange={(val) => setFilters((p) => ({ ...p, departments: val }))}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
