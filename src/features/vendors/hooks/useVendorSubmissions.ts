import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createVendorSubmission, getVendorSubmissions } from '../api';
import type {
  CreateVendorSubmissionPayload,
  VendorFilterParams,
  VendorSubmissionQueryOptions,
} from '../types';
import { vendorKeys } from './queryKeys';

export function useVendorSubmissions(
  filters: VendorFilterParams,
  options: VendorSubmissionQueryOptions = {}
) {
  return useQuery({
    queryKey: vendorKeys.list(filters, options),
    queryFn: () => getVendorSubmissions(filters, options),
  });
}

export function useCreateVendorSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVendorSubmissionPayload) => createVendorSubmission(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });
}
