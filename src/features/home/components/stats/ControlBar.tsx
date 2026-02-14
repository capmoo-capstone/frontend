import { Calendar as CalendarIcon, Download, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ControlBar() {
  return (
    <div className="flex flex-col items-end justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
        <FileText className="h-6 w-6 text-slate-500" />
        รายงานสรุปการทำงานพัสดุ
      </h2>
      <div className="flex items-center gap-3">
        <Select defaultValue="2569">
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="ปีงบประมาณ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2569">ปีงบประมาณ 2569</SelectItem>
            <SelectItem value="2570">ปีงบประมาณ 2570</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="bg-white">
          <CalendarIcon className="mr-2 h-4 w-4" />
          ระบุวันที่
        </Button>
        <Button variant="outline" size="icon" className="bg-white">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
