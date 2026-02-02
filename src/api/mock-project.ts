// Adjust import path as needed
import type { Role } from '@/types/auth';
import type { ProjectDetail, WorkflowStepConfig } from '@/types/project-detail';

// --- Shared Workflow Definition ---
const WORKFLOW_STEPS: WorkflowStepConfig[] = [
  {
    name: 'จัดทำแผนจัดการจัดซื้อจัดจ้าง และจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
    order: 1,
    required_step: [],
    required_documents: [
      {
        type: 'FILE_UPLOAD',
        label: 'แผนการจัดซื้อจัดจ้าง',
        field_key: 'mt500k_procurement_plan_file',
        is_required: false,
      },
      {
        type: 'FILE_UPLOAD',
        label: 'คำสั่งแต่งตั้งคณะกรรมการจัดทำขอบเขตของงาน (TOR)',
        field_key: 'mt500k_tor_committee_appt_file',
        is_required: false,
      },
    ],
  },
  {
    name: 'จัดทำรายงานขอซื้อหรือขอจ้าง, คำสั่งแต่งตั้งคณะกรรมการซื้อหรือจ้าง และหนังสือเชิญชวน',
    order: 2,
    required_step: [1],
    required_documents: [
      {
        type: 'FILE_UPLOAD',
        label: 'รายงานขอซื้อ/จ้าง',
        field_key: 'mt500k_requisition_report_file',
        is_required: false,
      },
      {
        type: 'FILE_UPLOAD',
        label: 'คำสั่งแต่งตั้งคณะกรรมการซื้อ/จ้าง',
        field_key: 'mt500k_procurement_committee_file',
        is_required: false,
      },
      {
        type: 'FILE_UPLOAD',
        label: 'หนังสือเชิญชวน',
        field_key: 'mt500k_invitation_letter_file',
        is_required: false,
      },
    ],
  },
  {
    name: 'จัดทำรายงานผลการพิจารณาจัดซื้อจัดจ้าง, รายงานผลฯ อนุมัติ ประกาศผู้ชนะ และหนังสือสนองรับราคาฯ',
    order: 3,
    required_step: [2],
    required_documents: [
      {
        type: 'FILE_UPLOAD',
        label: 'รายงานผลการพิจารณาและอนุมัติสั่งซื้อ/จ้าง',
        field_key: 'mt500k_consideration_report_file',
        is_required: false,
      },
      {
        type: 'FILE_UPLOAD',
        label: 'ประกาศผู้ชนะการเสนอราคา',
        field_key: 'mt500k_winner_announcement_file',
        is_required: false,
      },
      {
        type: 'FILE_UPLOAD',
        label: 'หนังสือแจ้งให้มาลงนามในสัญญา',
        field_key: 'mt500k_contract_notice_file',
        is_required: false,
      },
      {
        type: 'TEXT_INPUT',
        label: 'เลขที่ใบขอซื้อ (PR Number)',
        field_key: 'mt500k_pr_number',
        is_required: false,
      },
    ],
  },
  {
    name: 'จัดทำร่างสัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
    order: 4,
    required_step: [3],
    required_documents: [
      {
        type: 'FILE_UPLOAD',
        label: 'สัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
        field_key: 'mt500k_contract_doc_file',
        is_required: false,
      },
      {
        type: 'TEXT_INPUT',
        label: 'เลขที่ใบสั่งซื้อ (PO Number)',
        field_key: 'mt500k_po_number',
        is_required: false,
      },
    ],
  },
];

// --- Shared User/Meta Data ---
const COMMON_META = {
  is_urgent: false,
  budget: 450000,
  procurement_type: 'EBIDDING' as const,
  current_template_type: 'MT500K' as const,
  created_at: '2026-01-01T08:00:00Z',
  updated_at: '2026-01-01T08:00:00Z',
  receive_no: 'REC-2026/001',
  less_no: null,
  pr_no: null,
  po_no: null,
  contract_no: null,
  migo_no: null,
  expected_approval_date: '2026-02-01',
  description: null,
  vendor: { name: 'Company ABC Co., Ltd.', tax_id: '1234567890123', email: 'sales@abc.com' },
  requester: {
    unit_name: 'ฝ่ายเทคโนโลยีสารสนเทศ',
    unit_id: 'IT01',
    dept_name: 'สำนักคอมพิวเตอร์',
    dept_id: 'C01',
  },
  creator: {
    full_name: 'นายสมชาย ใจดี',
    role: 'GENERAL_STAFF' as Role,
    unit_name: 'งานพัสดุ',
    unit_id: 'P01',
    dept_name: 'กองคลัง',
    dept_id: 'F01',
  },
  assignee_procurement: {
    id: 'ST001',
    full_name: 'นางสาวจัดซื้อ มือโปร',
    role: 'GENERAL_STAFF' as Role,
    unit_name: 'งานจัดซื้อ',
    unit_id: 'P02',
  },
  assignee_contract: { id: null, full_name: null, role: null, unit_name: null, unit_id: null },
};

export const mockProjects: ProjectDetail[] = [
  // =================================================================
  // 1. No Submission (Fresh Project)
  // =================================================================
  {
    ...COMMON_META,
    id: 'PROJ-001',
    title: 'โครงการจัดซื้อครุภัณฑ์คอมพิวเตอร์ (ใหม่ - ยังไม่มีการส่งงาน)',
    status: 'IN_PROGRESS',
    current_step: { name: WORKFLOW_STEPS[0].name, order: 1 },
    workflow: { type: 'MT500K', steps: WORKFLOW_STEPS },
    submissions: [],
  },

  // =================================================================
  // 2. Step 1 Approve, Step 2 Mixed (Reject/Approve), Step 3 Submitted
  // =================================================================
  {
    ...COMMON_META,
    id: 'PROJ-002',
    title: 'โครงการจ้างเหมาบริการทำความสะอาด (รอตรวจ Step 3)',
    status: 'IN_PROGRESS',
    current_step: { name: WORKFLOW_STEPS[2].name, order: 3 },
    workflow: { type: 'MT500K', steps: WORKFLOW_STEPS },
    submissions: [
      // Step 1: Approved
      {
        step_name: WORKFLOW_STEPS[0].name,
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'นายสมชาย ใจดี',
        submitted_at: '2026-01-10T09:00:00Z',
        action_by: 'นางหัวหน้า งานดี',
        action_at: '2026-01-10T14:00:00Z',
        documents: [
          {
            field_key: 'mt500k_tor_committee_appt_file',
            file_name: 'คำสั่ง_TOR.pdf',
            file_path: '/files/tor.pdf',
          },
        ],
        meta_data: {},
      },
      // Step 2: Rejected (Round 1)
      {
        step_name: WORKFLOW_STEPS[1].name,
        step_order: 2,
        submission_round: 1,
        status: 'REJECTED',
        submitted_by: 'นายสมชาย ใจดี',
        submitted_at: '2026-01-12T10:00:00Z',
        action_by: 'นางหัวหน้า งานดี',
        action_at: '2026-01-12T11:00:00Z',
        comments: 'ไฟล์รายงานไม่ครบถ้วน กรุณาแนบใหม่',
        documents: [
          {
            field_key: 'mt500k_requisition_report_file',
            file_name: 'รายงาน_v1.pdf',
            file_path: '/files/rep_v1.pdf',
          },
        ],
        meta_data: {},
      },
      // Step 2: Approved (Round 2)
      {
        step_name: WORKFLOW_STEPS[1].name,
        step_order: 2,
        submission_round: 2,
        status: 'APPROVED',
        submitted_by: 'นายสมชาย ใจดี',
        submitted_at: '2026-01-13T09:00:00Z',
        action_by: 'นางหัวหน้า งานดี',
        action_at: '2026-01-13T15:00:00Z',
        documents: [
          {
            field_key: 'mt500k_requisition_report_file',
            file_name: 'รายงาน_final.pdf',
            file_path: '/files/rep_final.pdf',
          },
          {
            field_key: 'mt500k_procurement_committee_file',
            file_name: 'คำสั่ง_กก.pdf',
            file_path: '/files/comm.pdf',
          },
        ],
        meta_data: {},
      },
      // Step 3: Submitted (Waiting for Action)
      {
        step_name: WORKFLOW_STEPS[2].name,
        step_order: 3,
        submission_round: 1,
        status: 'SUBMITTED',
        submitted_by: 'นายสมชาย ใจดี',
        submitted_at: '2026-01-15T08:30:00Z',
        documents: [
          {
            field_key: 'mt500k_consideration_report_file',
            file_name: 'ผลการพิจารณา.pdf',
            file_path: '/files/res.pdf',
          },
          {
            field_key: 'mt500k_winner_announcement_file',
            file_name: 'ประกาศผู้ชนะ.pdf',
            file_path: '/files/win.pdf',
          },
          { field_key: 'mt500k_pr_number', value: 'PR-2569/001' },
        ],
        meta_data: {},
      },
    ],
  },

  // =================================================================
  // 3. Step 1 Approve, Step 2 Approve, Step 3 Accept (Head Approved, Waiting for Sup)
  // =================================================================
  {
    ...COMMON_META,
    id: 'PROJ-003',
    title: 'โครงการซ่อมแซมอาคารสถานที่ (รอธุรการ/ผอ. Step 3)',
    status: 'IN_PROGRESS',
    current_step: { name: WORKFLOW_STEPS[2].name, order: 3 },
    workflow: { type: 'MT500K', steps: WORKFLOW_STEPS },
    submissions: [
      {
        step_name: WORKFLOW_STEPS[0].name,
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'สมศรี ขยัน',
        submitted_at: '2026-01-05T10:00:00Z',
        action_by: 'ผอ. กองคลัง',
        action_at: '2026-01-05T16:00:00Z',
        documents: [
          {
            field_key: 'mt500k_tor_committee_appt_file',
            file_name: 'TOR.pdf',
            file_path: '/dummy.pdf',
          },
        ],
        meta_data: {},
      },
      {
        step_name: WORKFLOW_STEPS[1].name,
        step_order: 2,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'สมศรี ขยัน',
        submitted_at: '2026-01-07T10:00:00Z',
        action_by: 'ผอ. กองคลัง',
        action_at: '2026-01-07T14:30:00Z',
        documents: [
          {
            field_key: 'mt500k_requisition_report_file',
            file_name: 'Req.pdf',
            file_path: '/dummy.pdf',
          },
          {
            field_key: 'mt500k_procurement_committee_file',
            file_name: 'Comm.pdf',
            file_path: '/dummy.pdf',
          },
        ],
        meta_data: {},
      },
      // Step 3: Accepted
      {
        step_name: WORKFLOW_STEPS[2].name,
        step_order: 3,
        submission_round: 1,
        status: 'ACCEPTED', // Head Approved, Waiting for Document Staff
        submitted_by: 'สมศรี ขยัน',
        submitted_at: '2026-01-20T09:00:00Z',
        action_by: 'หัวหน้างานพัสดุ',
        action_at: '2026-01-20T11:00:00Z',
        documents: [
          {
            field_key: 'mt500k_consideration_report_file',
            file_name: 'Report.pdf',
            file_path: '/dummy.pdf',
          },
          {
            field_key: 'mt500k_winner_announcement_file',
            file_name: 'Winner.pdf',
            file_path: '/dummy.pdf',
          },
          { field_key: 'mt500k_pr_number', value: 'PR-999' },
        ],
        meta_data: {},
      },
    ],
  },

  // =================================================================
  // 4. Step 1 Approve, Step 2 Approve, Step 3 Reject
  // =================================================================
  {
    ...COMMON_META,
    id: 'PROJ-004',
    title: 'โครงการจัดซื้อวัสดุสำนักงาน (ถูกตีกลับที่ Step 3)',
    status: 'IN_PROGRESS',
    current_step: { name: WORKFLOW_STEPS[2].name, order: 3 },
    workflow: { type: 'MT500K', steps: WORKFLOW_STEPS },
    submissions: [
      {
        step_name: WORKFLOW_STEPS[0].name,
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'อำนวย การ',
        submitted_at: '2026-01-01T09:00:00Z',
        action_by: 'หัวหน้าตวงสิทธิ์',
        action_at: '2026-01-01T10:00:00Z',
        documents: [
          {
            field_key: 'mt500k_tor_committee_appt_file',
            file_name: 'TOR.pdf',
            file_path: '/d.pdf',
          },
        ],
        meta_data: {},
      },
      {
        step_name: WORKFLOW_STEPS[1].name,
        step_order: 2,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'อำนวย การ',
        submitted_at: '2026-01-03T09:00:00Z',
        action_by: 'หัวหน้าตวงสิทธิ์',
        action_at: '2026-01-03T10:00:00Z',
        documents: [
          { field_key: 'mt500k_requisition_report_file', file_name: 'R.pdf', file_path: '/d.pdf' },
          {
            field_key: 'mt500k_procurement_committee_file',
            file_name: 'C.pdf',
            file_path: '/d.pdf',
          },
        ],
        meta_data: {},
      },
      // Step 3: Rejected
      {
        step_name: WORKFLOW_STEPS[2].name,
        step_order: 3,
        submission_round: 1,
        status: 'REJECTED',
        submitted_by: 'อำนวย การ',
        submitted_at: '2026-01-22T13:00:00Z',
        action_by: 'หัวหน้าตวงสิทธิ์',
        action_at: '2026-01-22T14:30:00Z',
        comments: 'เลขที่ PR ไม่ตรงกับระบบ ERP และไฟล์แนบไม่ชัดเจน',
        documents: [
          {
            field_key: 'mt500k_consideration_report_file',
            file_name: 'ผล_ผิด.pdf',
            file_path: '/d.pdf',
          },
          {
            field_key: 'mt500k_winner_announcement_file',
            file_name: 'ประกาศ.pdf',
            file_path: '/d.pdf',
          },
          { field_key: 'mt500k_pr_number', value: 'PR-0000' },
        ],
        meta_data: {},
      },
    ],
  },

  // =================================================================
  // 5. All Step Approve (Project Complete)
  // =================================================================
  {
    ...COMMON_META,
    id: 'PROJ-005',
    title: 'โครงการจัดซื้อรถยนต์ส่วนกลาง (เสร็จสมบูรณ์)',
    status: 'CLOSED',
    current_step: { name: WORKFLOW_STEPS[3].name, order: 4 },
    workflow: { type: 'MT500K', steps: WORKFLOW_STEPS },
    submissions: [
      {
        step_name: WORKFLOW_STEPS[0].name,
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'คนเก่ง งานดี',
        submitted_at: '2025-12-01T09:00:00Z',
        action_by: 'ผอ. อนุมัติ',
        action_at: '2025-12-02T10:00:00Z',
        documents: [
          {
            field_key: 'mt500k_tor_committee_appt_file',
            file_name: 'S1.pdf',
            file_path: '/s1.pdf',
          },
        ],
        meta_data: {},
      },
      {
        step_name: WORKFLOW_STEPS[1].name,
        step_order: 2,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'คนเก่ง งานดี',
        submitted_at: '2025-12-05T09:00:00Z',
        action_by: 'ผอ. อนุมัติ',
        action_at: '2025-12-06T10:00:00Z',
        documents: [
          {
            field_key: 'mt500k_requisition_report_file',
            file_name: 'S2_1.pdf',
            file_path: '/s2.pdf',
          },
          {
            field_key: 'mt500k_procurement_committee_file',
            file_name: 'S2_2.pdf',
            file_path: '/s2.pdf',
          },
        ],
        meta_data: {},
      },
      {
        step_name: WORKFLOW_STEPS[2].name,
        step_order: 3,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'คนเก่ง งานดี',
        submitted_at: '2025-12-10T09:00:00Z',
        action_by: 'ผอ. อนุมัติ',
        action_at: '2025-12-11T10:00:00Z',
        documents: [
          {
            field_key: 'mt500k_consideration_report_file',
            file_name: 'S3_1.pdf',
            file_path: '/s3.pdf',
          },
          {
            field_key: 'mt500k_winner_announcement_file',
            file_name: 'S3_2.pdf',
            file_path: '/s3.pdf',
          },
          { field_key: 'mt500k_pr_number', value: 'PR-FINAL' },
        ],
        meta_data: {},
      },
      {
        step_name: WORKFLOW_STEPS[3].name,
        step_order: 4,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'คนเก่ง งานดี',
        submitted_at: '2025-12-15T09:00:00Z',
        action_by: 'ผอ. อนุมัติ',
        action_at: '2025-12-16T10:00:00Z',
        documents: [
          {
            field_key: 'mt500k_contract_doc_file',
            file_name: 'สัญญา_signed.pdf',
            file_path: '/contract.pdf',
          },
          { field_key: 'mt500k_po_number', value: 'PO-2569/999' },
        ],
        meta_data: {},
      },
    ],
  },
];
