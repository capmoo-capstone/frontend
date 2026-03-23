import { Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StaffPerformanceRow {
  name: string;
  total: number;
  doing: number;
  done: number;
}

export function StaffPerformanceTable({ data }: { data: StaffPerformanceRow[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">ประสิทธิภาพรายบุคคล</CardTitle>
          <CardDescription>ติดตามภาระงานและความสำเร็จของทีม</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" /> จัดการทีม
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-[30%]">ชื่อ-นามสกุล</TableHead>
              <TableHead className="text-center">ทั้งหมด</TableHead>
              <TableHead className="text-center">กำลังทำ</TableHead>
              <TableHead className="text-center">เสร็จสิ้น</TableHead>
              <TableHead className="w-[25%]">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              const percentage = Math.round((row.done / row.total) * 100);
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium text-slate-700">{row.name}</TableCell>
                  <TableCell className="text-center">{row.total}</TableCell>
                  <TableCell className="text-center font-medium text-blue-600">
                    {row.doing}
                  </TableCell>
                  <TableCell className="text-center text-emerald-600">{row.done}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="h-2" />
                      <span className="w-8 text-xs text-slate-500">{percentage}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
