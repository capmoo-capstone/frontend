import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { PROJECTS } from '../../data/mock-data';

export function ProjectListTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">รายการโครงการครุภัณฑ์ตามแผนงบประมาณ</h3>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-[60%] font-bold text-slate-700">โครงการ</TableHead>
            <TableHead className="text-right font-bold text-slate-700">วงเงินงบประมาณ</TableHead>
            <TableHead className="text-center font-bold text-slate-700">สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PROJECTS.map((project, idx) => (
            <TableRow key={idx} className="cursor-pointer hover:bg-slate-50/80">
              <TableCell className="font-medium text-slate-700">
                <div className="line-clamp-1">{project.name}</div>
              </TableCell>
              <TableCell className="text-right font-mono text-slate-600">
                {project.budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={` ${project.status === 'ยังไม่ได้ดำเนินการ' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' : ''} ${project.status === 'กำลังดำเนินการ' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''} ${project.status === 'ดำเนินการเรียบร้อย' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''} `}
                >
                  {project.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
