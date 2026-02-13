import type { DateRange } from 'react-day-picker';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUEST_EDIT';

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

export interface VendorSubmission {
  id: string;
  project_id: string;
  project_title: string;
  vendor_name: string;
  submission_type: string;
  submission_round: number;
  submitted_at: Date;
  status: SubmissionStatus;
  contact_email: string;
  po_number: string;
  receipt_number: string;
  department: string;
  attachments: Attachment[];
}

export interface VendorFilterParams {
  search: string;
  status: SubmissionStatus[];
  dateRange: DateRange | undefined;
}

export interface VendorFormData {
  po: string;
  files?: File[];
}
