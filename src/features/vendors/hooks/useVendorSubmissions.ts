import { MOCK_SUBMISSIONS } from '../api/mock-data';
import type { VendorFilterParams } from '../types';

export function useVendorSubmissions(_filters: VendorFilterParams) {
  // Return all data - TanStack Table will handle filtering
  return {
    data: MOCK_SUBMISSIONS,
    isLoading: false,
    isError: false,
  };
}
