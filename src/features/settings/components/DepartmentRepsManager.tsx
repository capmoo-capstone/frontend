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
      <main className="mx-auto w-full max-w-[1280px] p-6">
        <p className="text-muted-foreground normal">กำลังโหลดข้อมูลหน่วยงาน...</p>
      </main>
    );
  }

  // TODO (BACKEND MIGRATION): Department search/filter and expansion defaults should be computed by the API for large datasets and pagination consistency.
  return (
    <main>
      <header className="flex flex-row flex-wrap items-center justify-between space-y-3">
        <h1 className="text-primary h1-topic">ตั้งค่าตัวแทนหน่วยงาน</h1>

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
        <div className="border-border text-muted-foreground normal rounded-md border border-dashed bg-white p-8 text-center">
          ไม่พบข้อมูลหน่วยงาน
        </div>
      ) : (
        <Accordion
          type="multiple"
          className="space-y-4 pb-4"
          value={filteredDepartments.map((department) => department.id)}
        >
          {filteredDepartments.map((department) => (
            <AccordionItem
              key={department.id}
              value={department.id}
              className="border-border rounded-md border bg-white px-6 last:border"
            >
              <AccordionTrigger className="h2-topic hover:no-underline">
                <span className="h2-topic flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  {department.name}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <DepartmentUnitList departmentId={department.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </main>
  );
}
