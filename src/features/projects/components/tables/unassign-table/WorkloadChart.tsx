'use client';

import { useMemo } from 'react';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useWorkloadStats } from '@/features/projects/hooks/useProjectQueries';

import { useProjectPermissions } from '../../../hooks/useProjectPermissions';

const chartConfig = {
  current: {
    label: 'งานปัจจุบัน',
    color: 'var(--brand-11)',
  },
  pending: {
    label: 'งานที่กำลังจะมอบหมาย',
    color: 'var(--brand-6)',
  },
} satisfies ChartConfig;

interface WorkloadChartProps {
  pendingChanges: Record<string, string>;
  unitId?: string;
}

export function WorkloadChart({ pendingChanges, unitId }: WorkloadChartProps) {
  const { canViewWorkloadChart } = useProjectPermissions(unitId);
  const { data, isLoading, isError } = useWorkloadStats(unitId);

  if (!canViewWorkloadChart) {
    return null;
  }

  const chartData = useMemo(() => {
    if (!data) {
      return [];
    }

    const currentCounts = new Map<string, { id: string; full_name: string; current: number }>();

    if ('units' in data) {
      for (const unit of data.units) {
        for (const staff of unit.staff) {
          const existing = currentCounts.get(staff.user_id);
          if (existing) {
            existing.current += staff.workload;
          } else {
            currentCounts.set(staff.user_id, {
              id: staff.user_id,
              full_name: staff.full_name,
              current: staff.workload,
            });
          }
        }
      }
    } else {
      for (const staff of data.staff) {
        currentCounts.set(staff.user_id, {
          id: staff.user_id,
          full_name: staff.full_name,
          current: staff.workload,
        });
      }
    }

    const pendingCounts: Record<string, number> = {};
    Object.values(pendingChanges).forEach((userId) => {
      pendingCounts[userId] = (pendingCounts[userId] || 0) + 1;
    });

    return Array.from(currentCounts.values())
      .map((user) => ({
        id: user.id,
        name: user.full_name.split(' ')[0],
        current: user.current,
        pending: pendingCounts[user.id] || 0,
      }))
      .sort((a, b) => b.current - a.current);
  }, [data, pendingChanges]);

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>ภาระงานของเจ้าหน้าที่</CardTitle>
          <CardDescription>แสดงจำนวนงานปัจจุบันและงานที่กำลังจะเพิ่มเข้ามา</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary flex h-44 w-full items-center justify-center rounded-md">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>ภาระงานของเจ้าหน้าที่</CardTitle>
          <CardDescription>แสดงจำนวนงานปัจจุบันและงานที่กำลังจะเพิ่มเข้ามา</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary flex h-44 w-full items-center justify-center rounded-md">
            <AlertTriangle className="text-destructive mr-2 h-6 w-6" />
            <p className="text-primary normal">เกิดข้อผิดพลาดในการโหลดข้อมูลภาระงาน</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>ภาระงานของเจ้าหน้าที่</CardTitle>
        <CardDescription>แสดงจำนวนงานปัจจุบันและงานที่กำลังจะเพิ่มเข้ามา</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="bg-secondary flex h-44 w-full items-center justify-center rounded-md">
            <p className="text-muted-foreground normal">ยังไม่มีข้อมูลภาระงาน</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-44 w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs"
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="current"
                stackId="a"
                fill="var(--color-current)"
                radius={[0, 0, 4, 4]}
              />

              <Bar
                dataKey="pending"
                stackId="a"
                fill="var(--color-pending)"
                radius={[4, 4, 0, 0]}
                className="stroke-background stroke-1"
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
