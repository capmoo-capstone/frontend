import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { type VendorFilterParams, VendorSubmissionTable } from '@/features/vendors';

export default function VendorSubmission() {
  const [filters, setFilters] = useState<VendorFilterParams>({
    search: '',
    dateRange: undefined,
  });

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="h1-topic text-primary">ใบแจ้งหนี้/ใบส่งของ/ใบวางบิลจากผู้ค้า</h1>
      </div>

      {/* Table with integrated toolbar */}
      <VendorSubmissionTable
        filters={filters}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
}
