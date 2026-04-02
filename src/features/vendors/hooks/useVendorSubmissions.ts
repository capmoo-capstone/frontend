import { useMemo } from 'react';

import { endOfDay, startOfDay } from 'date-fns';

import { MOCK_SUBMISSIONS } from '../api/mock-data';
import type { VendorFilterParams } from '../types';

export function useVendorSubmissions(filters: VendorFilterParams) {
  // Filter data server-side (simulated with mock data)
  // In production, this would be an API call with filters.status and filters.dateRange as query params
  // Note: filters.search is handled client-side by TanStack Table's globalFilter
  const filteredData = useMemo(() => {
    let result = MOCK_SUBMISSIONS;

    // Apply status filter (server-side)
    if (filters.status.length > 0) {
      result = result.filter((submission) => filters.status.includes(submission.status));
    }

    // Apply date range filter (server-side)
    if (filters.dateRange?.from) {
      const fromDate = startOfDay(filters.dateRange.from);
      const toDate = endOfDay(filters.dateRange.to || filters.dateRange.from);

      result = result.filter((submission) => {
        const submittedDate = new Date(submission.submitted_at);
        return submittedDate >= fromDate && submittedDate <= toDate;
      });
    }

    return result;
  }, [filters.status, filters.dateRange]);

  return {
    data: filteredData,
    isLoading: false,
    isError: false,
  };
}
