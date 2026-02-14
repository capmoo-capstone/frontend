import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartDataItem {
  name: string;
  myTime: number;
  teamTime: number;
}

interface PerformanceComparisonChartProps {
  data: ChartDataItem[];
}

export function PerformanceComparisonChart({ data }: PerformanceComparisonChartProps) {
  return (
    <Card className="shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          เปรียบเทียบระยะเวลาทำงานเฉลี่ย (วัน)
        </CardTitle>
        <CardDescription>เทียบประสิทธิภาพของคุณกับค่าเฉลี่ยของทีมในแต่ละประเภท</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: '#F1F5F9', radius: 4 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-lg">
                        <p className="mb-2 font-semibold text-slate-900">{label}</p>
                        <div className="mb-1 flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                          <span className="text-slate-500">ของคุณ:</span>
                          <span className="font-medium text-slate-900">{payload[0].value} วัน</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                          <span className="text-slate-500">เฉลี่ยทีม:</span>
                          <span className="font-medium text-slate-900">{payload[1].value} วัน</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="ml-1 text-sm text-slate-600">{value}</span>}
              />
              <Bar
                dataKey="myTime"
                name="ของคุณ"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="teamTime"
                name="เฉลี่ยทีม"
                fill="#CBD5E1"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
