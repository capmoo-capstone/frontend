import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnitCard } from '@/components/unit-management/unit-card/unit-card';
import { useUnits } from '@/hooks/useUnits';
import type { Unit } from '@/types/unit';

export default function OrganizationManagement() {
  const { data: units } = useUnits();
  return (
    <div className="text-foreground flex w-screen flex-col p-9">
      <h1 className="text-h1-topic text-foreground">ตั้งค่าบุคลากร</h1>
      <Tabs defaultValue="organization" className="mt-6 w-full">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="group" className="rounded-r-none text-base font-semibold">
            กลุ่มงาน
          </TabsTrigger>
          <TabsTrigger
            value="department"
            className="rounded-none border-x-1 border-solid text-base font-semibold"
          >
            ตัวแทนหน่วยงาน
          </TabsTrigger>
          <TabsTrigger value="procure" className="rounded-l-none text-base font-semibold">
            เจ้าหน้าที่พัสดุ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="group">
          <div className="flex flex-col gap-4">
            {units?.map((unitItem: Unit, index: number) => (
              <UnitCard key={unitItem.id} unitItem={unitItem} index={index + 1} />
            ))}
          </div>
          <Button
            className="text-h2-topic text-muted-foreground border-muted-foreground mt-6 w-full p-6 font-semibold"
            variant="dash"
          >
            <Plus />
            สร้างกลุ่มงานใหม่
          </Button>
        </TabsContent>
        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>ตัวแทนหน่วยงาน</CardTitle>
            </CardHeader>
            <CardContent>{/* Content for the "department" tab */}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="procure">
          <Card>
            <CardHeader>
              <CardTitle>เจ้าหน้าที่พัสดุ</CardTitle>
            </CardHeader>
            <CardContent>{/* Content for the "procure" tab */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
