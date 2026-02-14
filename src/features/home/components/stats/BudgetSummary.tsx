import { Info } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { BUDGET_SUMMARY } from '../../data/mock-data';

export function BudgetSummary() {
  const usagePercent = (BUDGET_SUMMARY.usedBudget / BUDGET_SUMMARY.totalBudget) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5" /> สรุปรายการแผนงบประมาณของหน่วยงาน
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-8">
        {/* Stats Row 1 */}
        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <p className="mb-1 text-sm text-slate-500">งบประมาณทั้งหมด (บาท)</p>
            <p className="text-2xl font-bold text-emerald-600">
              {BUDGET_SUMMARY.totalBudget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-slate-500">ใช้ไปแล้ว (บาท)</p>
            <p className="text-2xl font-bold text-rose-600">
              {BUDGET_SUMMARY.usedBudget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Usage</span>
            <span>{usagePercent}%</span>
          </div>
          <Progress value={usagePercent} className="h-3" />
        </div>

        <Separator />

        {/* Stats Row 2 */}
        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <p className="mb-1 text-sm text-slate-500">จำนวนรายการแผน (รายการ)</p>
            <p className="text-2xl font-bold text-emerald-600">{BUDGET_SUMMARY.totalItems}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-slate-500">ยังไม่ได้ใช้ (รายการ)</p>
            <p className="text-2xl font-bold text-rose-600">{BUDGET_SUMMARY.unusedItems}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
