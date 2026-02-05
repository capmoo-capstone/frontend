// Assuming the array you provided is exported here
import { ProcurementWorkflows } from '@/pages/projects/config/workflow';
import type { Role } from '@/types/auth';
import type { ProjectDetail, StepStatus, Submission } from '@/types/project-detail';

// Helper to get workflow by type
const getWorkflow = (type: string) => ProcurementWorkflows.find((w) => w.type === type)!;

// Shared metadata for cleaner code
const COMMON_META = {
  is_urgent: false,
  description: 'รายละเอียดโครงการตัวอย่างสำหรับการทดสอบระบบจัดซื้อจัดจ้าง',
  created_at: '2026-02-01T08:00:00Z',
  updated_at: '2026-02-03T10:00:00Z',
  vendor: { name: 'บริษัท ตัวอย่าง จำกัด', tax_id: '1234567890123', email: 'contact@example.com' },
  requester: { unit_name: 'งานพัสดุ', unit_id: 'P01', dept_name: 'กองคลัง', dept_id: 'F01' },
  creator: {
    full_name: 'Admin User',
    role: 'GENERAL_STAFF' as Role,
    unit_name: 'IT',
    unit_id: 'IT01',
    dept_name: 'Center',
    dept_id: 'C01',
  },
  assignee_procurement: {
    id: 'U001',
    full_name: 'สมศรี จัดซื้อ',
    role: 'GENERAL_STAFF' as Role,
    unit_name: 'Purchase',
    unit_id: 'P01',
  },
  assignee_contract: {
    id: 'U002',
    full_name: 'สมชาย สัญญา',
    role: 'GENERAL_STAFF' as Role,
    unit_name: 'Legal',
    unit_id: 'L01',
  },
  receive_no: 'REC-2026/001',
  less_no: null,
  pr_no: null,
  po_no: null,
  contract_no: null,
  migo_no: null,
  expected_approval_date: null,
};

export const mockProjects: ProjectDetail[] = [
  // ==================================================================================
  // ID 1: MT500K (Method specific > 500k)
  // Scenario: Just started, Step 1 (Planning)
  // ==================================================================================
  {
    ...COMMON_META,
    id: '1',
    title: 'โครงการจัดซื้อครุภัณฑ์คอมพิวเตอร์ (MT500K)',
    procurement_type: 'MT500K',
    current_template_type: 'MT500K',
    status: 'IN_PROGRESS',
    budget: 600000,
    current_step: {
      name: 'จัดทำแผนจัดการจัดซื้อจัดจ้าง และจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
      order: 1,
    },
    workflow: getWorkflow('MT500K') as ProjectDetail['workflow'],
    submissions: [], // No submissions yet
  },

  // ==================================================================================
  // ID 2: EBIDDING (Electronic Bidding)
  // Scenario: In Progress, Step 4 (Report/Committee Setup) - Steps 1-3 Approved
  // ==================================================================================
  {
    ...COMMON_META,
    id: '2',
    title: 'โครงการจ้างเหมาบริการรักษาความปลอดภัย (e-Bidding)',
    procurement_type: 'EBIDDING',
    current_template_type: 'EBIDDING',
    status: 'IN_PROGRESS',
    budget: 2000000,
    current_step: {
      name: 'จัดทำรายงานขอซื้อ / จ้าง, คำสั่งแต่งตั้งคณะกรรมการพิจารณาผลและตรวจรับ...',
      order: 4,
    },
    workflow: getWorkflow('EBIDDING') as ProjectDetail['workflow'],
    submissions: [
      {
        step_name: 'จัดทำแผนจัดการจัดซื้อจัดจ้าง',
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Somchai',
        submitted_at: '2026-01-10T09:00:00Z',
        action_by: 'Head of Unit',
        action_at: '2026-01-10T14:00:00Z',
        documents: [
          {
            field_key: 'ebid_procurement_plan_file',
            file_name: 'plan.pdf',
            file_path: '/files/plan.pdf',
          },
        ],
        meta_data: {},
      },
      {
        step_name: 'จัดทำรายงานขอมอบหมายผู้จัดทำขอบเขตของงาน และคำสั่งแต่งตั้ง',
        step_order: 2,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Somchai',
        submitted_at: '2026-01-12T09:00:00Z',
        action_by: 'Head of Unit',
        action_at: '2026-01-12T14:00:00Z',
        documents: [
          { field_key: 'ebid_tor_assignment_report_file', file_name: 'assign.pdf' },
          { field_key: 'ebid_tor_committee_appt_file', file_name: 'appt.pdf' },
        ],
        meta_data: {},
      },
      {
        step_name: 'จัดประชุมคณะกรรมการจัดทำขอบเขตของงาน',
        step_order: 3,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Somchai',
        submitted_at: '2026-01-15T09:00:00Z',
        action_by: 'Head of Unit',
        action_at: '2026-01-15T14:00:00Z',
        documents: [
          { field_key: 'ebid_tor_meeting_date', value: '2026-01-14' },
          { field_key: 'ebid_tor_meeting_minutes_file', file_name: 'minutes.pdf' },
        ],
        meta_data: {},
      },
    ],
  },

  // ==================================================================================
  // ID 3: SELECTION (Specific Selection Method)
  // Scenario: Step 2 Submitted (Waiting for Approval)
  // ==================================================================================
  {
    ...COMMON_META,
    id: '3',
    title: 'โครงการจ้างที่ปรึกษาออกแบบระบบ (Selection)',
    procurement_type: 'SELECTION',
    current_template_type: 'SELECTION',
    status: 'IN_PROGRESS', // Waiting for action on Step 2
    budget: 450000,
    current_step: {
      name: 'รายงานขอซื้อ / จ้าง, คำสั่งคณะกรรมการซื้อ / จ้าง โดยวิธีคัดเลือก, หนังสือเชิญชวน',
      order: 2,
    },
    workflow: getWorkflow('SELECTION') as ProjectDetail['workflow'],
    submissions: [
      {
        step_name: 'แผนจัดการจัดซื้อจัดจ้าง และจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Jane Doe',
        submitted_at: '2026-01-20T09:00:00Z',
        action_by: 'Director',
        action_at: '2026-01-21T10:00:00Z',
        documents: [
          { field_key: 'select_procurement_plan_file', file_name: 'plan_select.pdf' },
          { field_key: 'select_tor_committee_appt_file', file_name: 'tor_appt.pdf' },
        ],
        meta_data: {},
      },
      {
        step_name: 'รายงานขอซื้อ / จ้าง, คำสั่งคณะกรรมการซื้อ / จ้าง โดยวิธีคัดเลือก...',
        step_order: 2,
        submission_round: 1,
        status: 'SUBMITTED', // Pending
        submitted_by: 'Jane Doe',
        submitted_at: '2026-02-03T08:00:00Z',
        documents: [
          { field_key: 'select_requisition_report_file', file_name: 'req_report.pdf' },
          { field_key: 'select_procurement_committee_file', file_name: 'comm_list.pdf' },
          { field_key: 'select_invitation_letter_file', file_name: 'invite.pdf' },
        ],
        meta_data: {},
      },
    ],
  },

  // ==================================================================================
  // ID 4: LT500K (Less Than 500K - Standard)
  // Scenario: Near End, Step 4 (Send to Inspection)
  // ==================================================================================
  {
    ...COMMON_META,
    id: '4',
    title: 'ซื้อวัสดุสำนักงานประจำปี (LT500K)',
    procurement_type: 'LT500K',
    current_template_type: 'LT500K',
    status: 'IN_PROGRESS',
    budget: 150000,
    current_step: {
      name: 'ส่งไปยังฝ่ายตรวจรับ',
      order: 4,
    },
    workflow: getWorkflow('LT500K') as ProjectDetail['workflow'],
    submissions: [
      {
        step_name: 'จัดทำรายงานขอซื้อ/จ้าง ,รายงานผลฯอนุมัติ ประกาศผู้ชนะ',
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Admin',
        submitted_at: '2026-01-05T00:00:00Z',
        action_by: 'Boss',
        action_at: '2026-01-06T00:00:00Z',
        documents: [
          { field_key: 'lt500k_requisition_report_file', file_name: 'r1.pdf' },
          { field_key: 'lt500k_consideration_report_file', file_name: 'r2.pdf' },
          { field_key: 'lt500k_winner_announcement_file', file_name: 'win.pdf' },
          { field_key: 'lt500k_pr_number', value: 'PR-1001' },
        ],
        meta_data: {},
      },
      {
        step_name: 'จัดทำใบสั่งซื้อสั่งจ้าง',
        step_order: 2,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Admin',
        submitted_at: '2026-01-08T00:00:00Z',
        action_by: 'Boss',
        action_at: '2026-01-09T00:00:00Z',
        documents: [
          { field_key: 'lt500k_contract_number', value: 'CN-2026/55' },
          { field_key: 'lt500k_contract_doc_file', file_name: 'contract.pdf' },
          { field_key: 'lt500k_po_number', value: 'PO-888' },
        ],
        meta_data: {},
      },
      {
        step_name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        step_order: 3,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Admin',
        submitted_at: '2026-01-12T00:00:00Z',
        action_by: 'Boss',
        action_at: '2026-01-12T10:00:00Z',
        documents: [{ field_key: 'lt500k_vendor_email', value: 'vendor@test.com' }],
        meta_data: {},
      },
    ],
  },

  // ==================================================================================
  // ID 5: LT100K (Less Than 100K - Fast Track)
  // Scenario: Finished Procurement (Step 4 Complete), Ready for Contract Phase
  // ==================================================================================
  {
    ...COMMON_META,
    id: '5',
    title: 'ซ่อมแซมเครื่องปรับอากาศ (LT100K)',
    procurement_type: 'LT100K',
    current_template_type: 'LT100K',
    status: 'IN_PROGRESS',
    budget: 25000,
    current_step: {
      name: 'ส่งไปยังฝ่ายตรวจรับ',
      order: 4,
    },
    workflow: getWorkflow('LT100K') as ProjectDetail['workflow'],
    submissions: [
      {
        step_name: 'จัดใบขอซื้อ',
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Staff A',
        submitted_at: '2026-02-01T00:00:00Z',
        action_at: '2026-02-01T01:00:00Z',
        documents: [
          { field_key: 'lt100k_pr_number', value: 'PR-SMALL-001' },
          { field_key: 'lt100k_pr_doc', file_name: 'pr.pdf' },
        ],
        meta_data: {},
      },
      {
        step_name: 'จัดทำใบสั่งซื้อสั่งจ้าง',
        step_order: 2,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Staff A',
        submitted_at: '2026-02-02T00:00:00Z',
        action_at: '2026-02-02T01:00:00Z',
        documents: [
          { field_key: 'lt100k_po_number', value: 'PO-SMALL-001' },
          { field_key: 'lt100k_po_doc', file_name: 'po.pdf' },
        ],
        meta_data: {},
      },
      {
        step_name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        step_order: 3,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'Staff A',
        submitted_at: '2026-02-02T02:00:00Z',
        action_at: '2026-02-02T03:00:00Z',
        documents: [{ field_key: 'lt100k_vendor_email', value: 'fixer@test.com' }],
        meta_data: {},
      },
      {
        step_name: 'ส่งไปยังฝ่ายตรวจรับ',
        step_order: 4,
        submission_round: 1,
        status: 'APPROVED', // Completed
        submitted_by: 'Staff A',
        submitted_at: '2026-02-02T04:00:00Z',
        action_at: '2026-02-02T05:00:00Z',
        documents: [
          { field_key: 'lt100k_installment_count', value: '1' },
          { field_key: 'lt100k_credit_limit', value: '25000' },
          { field_key: 'lt100k_contract_start_date', value: '2026-02-03' },
          { field_key: 'lt100k_contract_end_date', value: '2026-02-10' },
        ],
        meta_data: {},
      },
    ],
  },

  // ==================================================================================
  // ID 6: CONTRACT (Contract Management Phase)
  // Scenario: Just entered Contract phase (Step 1)
  // ==================================================================================
  {
    ...COMMON_META,
    id: '6',
    title: 'บริหารสัญญาโครงการก่อสร้างอาคารจอดรถ (Contract Phase)',
    procurement_type: 'SELECTION', // Note: This matches the 'CONTRACT' type in your workflows array
    current_template_type: 'CONTRACT',
    status: 'IN_PROGRESS',
    budget: 5000000,
    current_step: {
      name: 'ระบบแจ้งเตือน',
      order: 1,
    },
    workflow: getWorkflow('CONTRACT') as ProjectDetail['workflow'],
    submissions: [], // Fresh contract phase
  },

  // ==================================================================================
  // ID 7: MT500K - ALL STEPS COMPLETED
  // Scenario: All workflow steps submitted and approved
  // ==================================================================================
  {
    ...COMMON_META,
    id: '7',
    title: 'โครงการจัดซื้อเครื่องมือวิทยาศาสตร์ (MT500K - Complete)',
    procurement_type: 'MT500K',
    current_template_type: 'MT500K',
    status: 'COMPLETED' as ProjectDetail['status'],
    budget: 850000,
    current_step: {
      name: 'ส่งไปยังฝ่ายตรวจรับ',
      order: 5,
    },
    workflow: getWorkflow('MT500K') as ProjectDetail['workflow'],
    submissions: [
      {
        step_name: 'จัดทำแผนจัดการจัดซื้อจัดจ้าง และจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
        step_order: 1,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'สมหญิง พัสดุ',
        submitted_at: '2026-01-05T09:00:00Z',
        action_by: 'หัวหน้างาน',
        action_at: '2026-01-05T15:00:00Z',
        documents: [
          {
            field_key: 'mt500k_procurement_plan_file',
            file_name: 'แผนการจัดซื้อ_2026.pdf',
            file_path: '/files/plan_2026.pdf',
          },
          {
            field_key: 'mt500k_tor_committee_appt_file',
            file_name: 'คำสั่งแต่งตั้ง_TOR.pdf',
            file_path: '/files/tor_appt.pdf',
          },
        ],
        meta_data: {},
      },
      {
        step_name:
          'จัดทำรายงานขอซื้อหรือขอจ้าง, คำสั่งแต่งตั้งคณะกรรมการซื้อหรือจ้าง และหนังสือเชิญชวน',
        step_order: 2,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'สมหญิง พัสดุ',
        submitted_at: '2026-01-08T10:00:00Z',
        action_by: 'หัวหน้างาน',
        action_at: '2026-01-08T16:00:00Z',
        documents: [
          {
            field_key: 'mt500k_requisition_report_file',
            file_name: 'รายงานขอซื้อ.pdf',
            file_path: '/files/requisition.pdf',
          },
          {
            field_key: 'mt500k_procurement_committee_file',
            file_name: 'คำสั่งแต่งตั้งคณะกรรมการ.pdf',
            file_path: '/files/committee.pdf',
          },
          {
            field_key: 'mt500k_invitation_letter_file',
            file_name: 'หนังสือเชิญชวน.pdf',
            file_path: '/files/invitation.pdf',
          },
        ],
        meta_data: {},
      },
      {
        step_name:
          'จัดทำรายงานผลการพิจารณาจัดซื้อจัดจ้าง, รายงานผลฯ อนุมัติ ประกาศผู้ชนะ และหนังสือสนองรับราคาฯ',
        step_order: 3,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'สมหญิง พัสดุ',
        submitted_at: '2026-01-12T11:00:00Z',
        action_by: 'หัวหน้างาน',
        action_at: '2026-01-12T17:00:00Z',
        documents: [
          {
            field_key: 'mt500k_consideration_report_file',
            file_name: 'รายงานผลพิจารณา.pdf',
            file_path: '/files/consideration.pdf',
          },
          {
            field_key: 'mt500k_winner_announcement_file',
            file_name: 'ประกาศผู้ชนะ.pdf',
            file_path: '/files/winner.pdf',
          },
          {
            field_key: 'mt500k_contract_notice_file',
            file_name: 'หนังสือแจ้งลงนาม.pdf',
            file_path: '/files/notice.pdf',
          },
          { field_key: 'mt500k_pr_number', value: 'PR-2026-MT-001' },
        ],
        meta_data: {},
      },
      {
        step_name: 'จัดทำร่างสัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
        step_order: 4,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'สมหญิง พัสดุ',
        submitted_at: '2026-01-16T09:30:00Z',
        action_by: 'ผู้อำนวยการ',
        action_at: '2026-01-16T14:00:00Z',
        documents: [
          { field_key: 'mt500k_contract_number', value: 'CU8501/2569' },
          {
            field_key: 'mt500k_contract_doc_file',
            file_name: 'สัญญาจัดซื้อ.pdf',
            file_path: '/files/contract.pdf',
          },
          { field_key: 'mt500k_po_number', value: 'PO-2026-001' },
        ],
        meta_data: {},
      },
      {
        step_name: 'ส่งไปยังฝ่ายตรวจรับ',
        step_order: 5,
        submission_round: 1,
        status: 'APPROVED',
        submitted_by: 'สมหญิง พัสดุ',
        submitted_at: '2026-01-20T08:00:00Z',
        action_by: 'ผู้อำนวยการ',
        action_at: '2026-01-20T10:00:00Z',
        documents: [
          {
            field_key: 'mt500k_vendor_email',
            value: ['vendor@science-supply.co.th', 'contact@science-supply.co.th'],
          },
          { field_key: 'mt500k_installment_count', value: '2' },
          { field_key: 'mt500k_credit_limit', value: '850000' },
          { field_key: 'mt500k_contract_start_date', value: '2026-02-01' },
          { field_key: 'mt500k_contract_end_date', value: '2026-04-30' },
        ],
        meta_data: {},
      },
    ],
  },
];
