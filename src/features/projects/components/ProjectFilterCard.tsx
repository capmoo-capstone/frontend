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
import { useUnitsList } from '@/features/organization';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { useUsersForSelection } from '@/features/users';
import { getResponsibleTypeFormat } from '@/lib/formatters';

import { type ProjectFilterParams } from '../api';
import { ProcurementTypeEnum, ProjectStatusEnum, ProjectUrgentStatusEnum } from '../types/index';
import { useProjectPermissions } from '../hooks/useProjectPermissions';
import { FilterCheckbox } from './FilterCheckbox';
import { SearchCheckbox } from './SearchCheckbox';

interface ProjectFilterCardProps {
  filters: ProjectFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<ProjectFilterParams>>;
}

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
  const projectStatuses = ProjectStatusEnum.options;
  const urgentStatuses = ProjectUrgentStatusEnum.options;

  const { data: units } = useUnitsList();
  const { data: users } = useUsersForSelection({ deptId: SUPPLY_OPERATION_DEPARTMENT_ID });
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
          {projectStatuses.map((status) => (
            <FilterCheckbox
              key={status}
              id={status}
              label={
                {
                  UNASSIGNED: 'ยังไม่ได้มอบหมาย',
                  WAITING_ACCEPT: 'รอการตอบรับ',
                  IN_PROGRESS: 'กำลังดำเนินการ',
                  WAITING_CANCEL: 'รอยกเลิก',
                  REQUEST_EDIT: 'ขอแก้ไข',
                  CLOSED: 'เสร็จสิ้น',
                  CANCELLED: 'ยกเลิก',
                }[status]
              }
              checked={filters.status?.includes(status)}
              onCheckedChange={() => handleToggleFilter('status', status)}
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
              items={units?.data ?? []}
              placeholder="ค้นหาหน่วยงาน"
              value={filters.units}
              onChange={(val) => setFilters((p) => ({ ...p, units: val }))}
            />
          </div>
        )}
      </div>
    </Card>
  );
}