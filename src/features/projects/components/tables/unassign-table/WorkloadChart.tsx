'use client';

import { useMemo } from 'react';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { MOCK_USER_PROJECT_STATS } from '@/api/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

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
}

export function WorkloadChart({ pendingChanges }: WorkloadChartProps) {
  const chartData = useMemo(() => {
    const pendingCounts: Record<string, number> = {};
    Object.values(pendingChanges).forEach((userId) => {
      pendingCounts[userId] = (pendingCounts[userId] || 0) + 1;
    });

    return MOCK_USER_PROJECT_STATS.data.map((user) => ({
      id: user.id,
      name: user.full_name.split(' ')[0],
      current: user.project_count,
      pending: pendingCounts[user.id] || 0,
    }));
  }, [pendingChanges]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>ภาระงานของเจ้าหน้าที่</CardTitle>
        <CardDescription>แสดงจำนวนงานปัจจุบันและงานที่กำลังจะเพิ่มเข้ามา</CardDescription>
      </CardHeader>
      <CardContent>
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

            <Bar dataKey="current" stackId="a" fill="var(--color-current)" radius={[0, 0, 4, 4]} />

            <Bar
              dataKey="pending"
              stackId="a"
              fill="var(--color-pending)"
              radius={[4, 4, 0, 0]}
              className="stroke-background stroke-1"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
