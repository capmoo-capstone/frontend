import type { VendorSubmission } from '../types';

// Mock Data
export const MOCK_SUBMISSIONS: VendorSubmission[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `SUB-${1000 + i}`,
  project_id: `PROJ-${500 + i}`,
  project_title: `โครงการจัดซื้ออุปกรณ์คอมพิวเตอร์และระบบเครือข่าย ระยะที่ ${i + 1}`,
  vendor_name: i % 2 === 0 ? 'บริษัท เอไอ โซลูชั่น จำกัด' : 'บริษัท ไอที ซัพพอร์ต 2024 จำกัด',
  submission_type: i % 3 === 0 ? 'เสนอราคา (Quotation)' : 'เอกสารสัญญา (Contract)',
  submission_round: 1,
  submitted_at: new Date(new Date().setDate(new Date().getDate() - i)),
  status: ['PENDING', 'APPROVED', 'REJECTED', 'REQUEST_EDIT'][i % 4] as VendorSubmission['status'],
  contact_email: 'contact@vendor.com',
  po_number: `PO-${2024000 + i}`,
  receipt_number: `REC-${3000 + i}`,
  department: ['กองบริหารงานทั่วไป', 'กองคลัง', 'กองช่าง', 'กองการศึกษา'][i % 4],
  attachments: Array.from({ length: (i % 3) + 1 }).map((_, j) => ({
    id: `ATT-${i}-${j}`,
    filename: j === 0 ? 'ใบเสนอราคา.pdf' : j === 1 ? 'เอกสารสัญญา.pdf' : 'หนังสือรับรอง.pdf',
    size: 1024 * (100 + i * 10),
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - i)),
  })),
}));
