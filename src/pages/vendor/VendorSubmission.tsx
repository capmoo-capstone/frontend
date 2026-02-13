import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Download, Search } from 'lucide-react';

import { DateRangeFilter } from '@/components/date-range-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type VendorFilterParams, VendorSubmissionTable } from '@/features/vendors';

export default function VendorSubmission() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<VendorFilterParams>({
    search: '',
    status: [],
    dateRange: undefined,
  });

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="h1-topic text-primary">รายการนำส่งจากผู้ขาย (Vendor Submissions)</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-end justify-end gap-2">
        <div className="bg-background relative rounded-lg">
          <Input
            className="normal pr-10"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleSearch}
          >
            <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </Button>
        </div>
        {/* Inline Filters */}
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
        <Button variant="brand">
          <Download />
          ส่งออกข้อมูล
        </Button>
      </div>

      {/* Table */}
      <VendorSubmissionTable filters={filters} />
    </div>
  );
}
