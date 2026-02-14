import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function WorkloadTrendChart({ data }: { data: any[] }) {
  return (
    <Card className="shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">แนวโน้มปริมาณงาน (6 เดือนล่าสุด)</CardTitle>
        <CardDescription>
          เปรียบเทียบจำนวนโครงการที่รับเข้ามา (Received) กับที่ทำเสร็จ (Completed)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                type="monotone"
                dataKey="received"
                name="งานรับเข้า"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorReceived)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="งานเสร็จสิ้น"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorCompleted)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
