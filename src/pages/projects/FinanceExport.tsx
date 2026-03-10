import { FinanceTable } from '@/features/finance';

export default function FinanceExportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="h1-topic text-primary">ส่งออกรายงานให้การเงิน</h1>
      </div>

      {/* Main Table Content */}
      <FinanceTable />
    </div>
  );
}
