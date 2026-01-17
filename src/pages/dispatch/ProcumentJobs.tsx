import { Button } from '@/components/ui/button';
import { AssignTable } from './components/AssignTable';

export default function ProcumentJobs() {
  return (
    <div className="relative">
      <h1 className="text-h1-topic text-brand-9">มอบหมายงานจัดซื้อ</h1>
      <Button variant="brand" className="mt-4 mb-6">
        เพิ่มงานจัดซื้อ
      </Button>
      <Button variant="destructive" className="mt-4 mb-6">
        เพิ่มงานจัดซื้อ
      </Button>
      <AssignTable />
    </div>
  );
}
