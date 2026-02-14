import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { toast } from 'sonner';

import { type VendorFilterParams, VendorSubmissionTable } from '@/features/vendors';

export default function VendorSubmission() {
  const [filters, setFilters] = useState<VendorFilterParams>({
    search: '',
    status: [],
    dateRange: undefined,
  });

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  const handleExport = (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error('กรุณาเลือกรายการที่ต้องการส่งออก');
      return;
    }

    toast.success(`ส่งออกข้อมูล ${selectedIds.length} รายการสำเร็จ`, {
      description: `รายการที่เลือก: ${selectedIds.length} รายการ`,
      duration: 4000,
    });
    // Here you would call your export API with selectedIds
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="h1-topic text-primary">รายการนำส่งจากผู้ขาย (Vendor Submissions)</h1>
        <p className="text-muted-foreground caption">
          จัดการรายการนำส่งจากผู้ขาย ตรวจสอบสถานะ และส่งออกข้อมูลที่ต้องการ
        </p>
      </div>

      {/* Table with integrated toolbar */}
      <VendorSubmissionTable
        filters={filters}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        onExport={handleExport}
      />
    </div>
  );
}
