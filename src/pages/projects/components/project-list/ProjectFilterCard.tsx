import { Delete, RotateCcw, Search, TextSearch } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';

import { DatePickerWithRange } from '../../../../components/ui/DatePickerWithRange';
import { FilterCheckbox } from './FilterCheckBox';
import { SearchInput } from './Search';
import { SearchCheckbox } from './SearchCheckbox';

export function ProjectFilterCard() {
  const projects = useProjects();

  const departments = [
    { label: 'สำนักงานมหาวิทยาลัย', value: 'office' },
    { label: 'คณะวิศวกรรมศาสตร์', value: 'eng' },
    { label: 'สถาบันนวัตกรรมบูรณาการแห่ง...', value: 'inter' },
  ];
  return (
    <Card className="p-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ชื่อโครงการ</span>
          <SearchInput placeholder="ค้นหาโครงการ" />
        </div>

        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ช่วงเวลา</span>
          <DatePickerWithRange />
        </div>

        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ปีงบประมาณ</span>
          <Select>
            <SelectTrigger className="normal w-full">
              <SelectValue placeholder="เลือกปีงบประมาณ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2566</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2">
          <span className="normal-b">ผู้รับผิดชอบ</span>
          <SearchCheckbox items={departments} placeholder="ค้นหาผู้รับผิดชอบ" />
        </div>
      </div>

      <FilterCheckbox id="MY_TASKS" label="งานของฉัน" />

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="normal-b">ประเภทงาน</span>
          <FilterCheckbox id="LT100K" label="ซื้อ/จ้าง แบบเจาะจง ไม่เกิน 1 แสน" />
          <FilterCheckbox id="LT500K" label="ซื้อ/จ้าง แบบเจาะจง 1 - 5 แสน" />
          <FilterCheckbox id="MT500K" label="ซื้อ/จ้าง แบบเจาะจง เกิน 5 แสน" />
          <FilterCheckbox id="SELECTION" label="ซื้อ/จ้าง แบบคัดเลือก" />
          <FilterCheckbox id="EBIDDING" label="ซื้อ/จ้าง แบบประกาศเชิญชวนทั่วไป" />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="normal-b">สถานะ</span>
          <FilterCheckbox id="IN_PROGRESS" label="กำลังดำเนินการ" />
          <FilterCheckbox id="CLOSED" label="เสร็จสิ้น" />
          <FilterCheckbox id="CANCELLED" label="ยกเลิก" />
          <FilterCheckbox id="UNASSIGNED" label="ยังไม่ได้มอบหมาย" />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="normal-b">ความเร่งด่วน</span>
          <FilterCheckbox id="NORMAL" label="ปกติ" />
          <FilterCheckbox id="URGENT" label="ด่วน" />
          <FilterCheckbox id="VERY_URGENT" label="ด่วนพิเศษ" />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="normal-b">หน่วยงาน</span>
          <SearchCheckbox items={departments} placeholder="ค้นหาหน่วยงาน" />
        </div>
      </div>
    </Card>
  );
}
