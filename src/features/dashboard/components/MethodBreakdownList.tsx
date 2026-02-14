import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MethodStat {
  title: string;
  count: number;
  avgTime: number;
  avgTimeMarket: number;
  performance: 'excellent' | 'good' | 'warning';
}

interface MethodBreakdownListProps {
  data: MethodStat[];
}

export function MethodBreakdownList({ data }: MethodBreakdownListProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">แยกตามประเภทการจัดซื้อ</CardTitle>
        <CardDescription>ปริมาณงานและประสิทธิภาพรายประเภท</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {data.map((method, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">{method.title}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{method.count} โครงการ</span>
                <span>•</span>
                <span
                  className={
                    method.avgTime > method.avgTimeMarket
                      ? 'font-medium text-rose-600'
                      : 'font-medium text-emerald-600'
                  }
                >
                  เฉลี่ย {method.avgTime} วัน
                </span>
              </div>
            </div>
            {method.performance === 'excellent' && (
              <Badge className="border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                ดีเยี่ยม
              </Badge>
            )}
            {method.performance === 'warning' && (
              <Badge className="border-0 bg-rose-100 text-rose-700 hover:bg-rose-100">
                ควรปรับปรุง
              </Badge>
            )}
          </div>
        ))}

        <Separator />

        <div className="rounded-lg bg-slate-50 p-4 text-center">
          <p className="mb-1 text-xs text-slate-500">ประเภทงานที่คุณเชี่ยวชาญที่สุด</p>
          <p className="text-sm font-bold text-blue-700">วิธีเฉพาะเจาะจง {'<'} 1 แสน</p>
        </div>
      </CardContent>
    </Card>
  );
}
