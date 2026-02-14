import { RegistryExportTable } from '@/features/registry-export';

export default function RegistryExportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="h1-topic text-primary">ส่งออกทะเบียนโครงการ</h1>
        <p className="text-muted-foreground caption">จัดการและส่งออกทะเบียนโครงการทั้งหมด</p>
      </div>

      {/* Main Table Content */}
      <RegistryExportTable />
    </div>
  );
}
