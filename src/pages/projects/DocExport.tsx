import { DocExportTable } from '@/features/doc-export';

export default function DocExportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="h1-topic text-primary">ส่งออกเอกสาร</h1>
        <p className="text-muted-foreground caption">จัดการการส่งเอกสารและเสนอลงนามเอกสาร</p>
      </div>

      {/* Main Table Content */}
      <DocExportTable />
    </div>
  );
}
