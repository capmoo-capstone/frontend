import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProcurementPieChart({ data }: { data: any[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">สัดส่วนตามวิธีการ</CardTitle>
        <CardDescription>แยกตามประเภทการจัดซื้อ</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative h-55 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">100%</span>
            <span className="text-xs text-slate-500">Total</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="truncate text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
