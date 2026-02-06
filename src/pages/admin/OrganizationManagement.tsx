import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import GroupManagement from './components/GroupManagement';

export default function OrganizationManagement() {
  return (
    <div className="text-primary flex flex-col p-9">
      <h1 className="h1-topic text-primary">ตั้งค่าบุคลากร</h1>
      <Tabs defaultValue="group" className="mt-6">
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
          <GroupManagement />
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
