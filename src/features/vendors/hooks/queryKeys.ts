import type { VendorFilterParams, VendorSubmissionQueryOptions } from '../types';

export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (filters: VendorFilterParams, options: VendorSubmissionQueryOptions) =>
    [...vendorKeys.lists(), filters, options] as const,
};
