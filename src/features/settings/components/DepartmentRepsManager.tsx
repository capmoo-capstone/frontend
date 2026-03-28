import { Search, Users } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

import { useDepartmentRepsManager } from '../hooks/useDepartmentRepsManager';
import { DepartmentUnitList } from './DepartmentUnitList';

export function DepartmentRepsManager() {
  const { isLoading, searchTerm, setSearchTerm, filteredDepartments } = useDepartmentRepsManager();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] p-6">
        <p className="text-muted-foreground text-sm">กำลังโหลดข้อมูลหน่วยงาน...</p>
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-row flex-wrap items-center justify-between space-y-3">
        <h1 className="text-primary text-3xl font-bold">ตั้งค่าตัวแทนหน่วยงาน</h1>

        <div className="relative w-sm">
          <Input
            className="normal pr-10"
            placeholder="ค้นหาชื่อเจ้าหน้าที่, หน่วยงาน, ฝ่าย..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
        </div>
      </header>

      {filteredDepartments.length === 0 ? (
        <div className="border-border text-muted-foreground rounded-md border border-dashed bg-white p-8 text-center text-sm">
          ไม่พบข้อมูลหน่วยงาน
        </div>
      ) : (
        <Accordion
          type="multiple"
          className="space-y-4"
          defaultValue={filteredDepartments.map((department) => department.id)}
        >
          {filteredDepartments.map((department) => (
            <AccordionItem
              key={department.id}
              value={department.id}
              className="border-border rounded-md border bg-white px-6"
            >
              <AccordionTrigger className="h2-topic font-semibold hover:no-underline">
                <div className="flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  {department.name}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <DepartmentUnitList departmentId={department.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
}
