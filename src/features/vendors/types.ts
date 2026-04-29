import type { DateRange } from 'react-day-picker';

import { z } from 'zod';

export const VendorDocumentSchema = z.object({
  field_key: z.string().nullable().optional(),
  file_name: z.string().nullable().optional(),
  file_path: z.string().nullable().optional(),
});

export const VendorSubmissionSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  title: z.string(),
  receive_no: z.string(),
  po_no: z.string().nullable().optional(),
  vendor_name: z.string().nullable().optional(),
  requester: z.object({
    dept_id: z.string(),
    dept_name: z.string(),
  }),
  submitted_at: z.coerce.date(),
  documents: z.array(VendorDocumentSchema).default([]),
});

export const VendorSubmissionListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  data: z.array(VendorSubmissionSchema),
});

export const CreateVendorSubmissionResponseSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  workflow_type: z.literal('CONTRACT'),
  step_order: z.number(),
  submission_round: z.number(),
  status: z.string(),
});

export type VendorDocument = z.infer<typeof VendorDocumentSchema>;
export type VendorSubmission = z.infer<typeof VendorSubmissionSchema>;
export type VendorSubmissionListResponse = z.infer<typeof VendorSubmissionListResponseSchema>;
export type CreateVendorSubmissionResponse = z.infer<typeof CreateVendorSubmissionResponseSchema>;

export type VendorSubmissionFileInput = {
  field_key: string;
  file_name: string;
  file_path: string;
};

export type CreateVendorSubmissionPayload = {
  type: 'VENDOR';
  workflow_type: 'CONTRACT';
  step_order: 2;
  po_no: string;
  installment?: number;
  files: VendorSubmissionFileInput[];
};

export interface VendorFilterParams {
  search: string;
  dateRange: DateRange | undefined;
}

export type VendorSubmissionQueryOptions = {
  page?: number;
  limit?: number;
};

export interface VendorFormData {
  po: string;
  installment?: string;
  files?: File[];
}
