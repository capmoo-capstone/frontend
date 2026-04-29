import type { UnitResponsibleType } from '@/features/projects';

import type { WorkflowStepConfig } from '../types';

type WorkflowConfig = {
  type: UnitResponsibleType;
  steps: WorkflowStepConfig[];
};

export const ProcurementWorkflows: WorkflowConfig[] = [
  // --- MT500K ---
  {
    type: 'MT500K' as UnitResponsibleType,
    steps: [
      {
        name: 'จัดทำแผนจัดการจัดซื้อจัดจ้าง และจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
        order: 1,
        required_step: [], // ต้องส่งขั้นตอนใน required_step ก่อน ถึงจะทำขั้นตอนนี้ได้
        required_approval: true, // หัวหน้า ต้องอนุมัติขั้นตอนนี้
        required_signature: true, // ผอ ต้องเซ็นอนุมัติในขั้นตอนนี้
        required_documents: [
          {
            // ถ้าขั้นตอนนี้มีเลขที่ต้อง save / action ที่ต้องทำหลัง step ให้ใส่ comment ไว้
            // todo: saved PR no to project id after complete this step
            // todo: set noti after complete this step
            type: 'FILE',
            label: 'แผนการจัดซื้อจัดจ้าง',
            field_key: 'mt500k_procurement_plan_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'คำสั่งแต่งตั้งคณะกรรมการจัดทำขอบเขตของงาน (TOR)',
            field_key: 'mt500k_tor_committee_appt_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำรายงานขอซื้อหรือขอจ้าง, คำสั่งแต่งตั้งคณะกรรมการซื้อหรือจ้าง และหนังสือเชิญชวน',
        order: 2,
        required_step: [1],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานขอซื้อ/จ้าง',
            field_key: 'mt500k_requisition_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'คำสั่งแต่งตั้งคณะกรรมการซื้อ/จ้าง',
            field_key: 'mt500k_procurement_committee_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'หนังสือเชิญชวน',
            field_key: 'mt500k_invitation_letter_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำรายงานผลการพิจารณาจัดซื้อจัดจ้าง, รายงานผลฯ อนุมัติ ประกาศผู้ชนะ และหนังสือสนองรับราคาฯ',
        order: 3,
        required_step: [2],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานผลการพิจารณาและอนุมัติสั่งซื้อ/จ้าง',
            field_key: 'mt500k_consideration_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'ประกาศผู้ชนะการเสนอราคา',
            field_key: 'mt500k_winner_announcement_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'หนังสือแจ้งให้มาลงนามในสัญญา',
            field_key: 'mt500k_contract_notice_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบขอซื้อ (PR Number)',
            field_key: 'mt500k_pr_number',
            project_update_key: 'pr_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'จัดทำร่างสัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
        order: 4,
        required_step: [3],
        required_approval: true,
        required_signature: true,
        required_documents: [
          // todo: generate contract number and save to project after complete this step
          {
            type: 'GEN_CONT_NO',
            label: 'เลขที่สัญญา',
            field_key: 'mt500k_contract_number',
            project_update_key: 'contract_no',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'สัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
            field_key: 'mt500k_contract_doc_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบสั่งซื้อ (PO Number)',
            field_key: 'mt500k_po_number',
            project_update_key: 'po_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        order: 5,
        required_step: [4],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: send notification to vendor email after complete this step
          {
            type: 'TEXT',
            label: 'ชื่อบริษัทผู้ค้า',
            field_key: 'mt500k_vendor_name',
            project_update_key: 'vendor_name',
            mark_as_done: false,
          },
          {
            type: 'VENDOR_EMAIL',
            label: 'อีเมลผู้ค้า',
            field_key: 'mt500k_vendor_email',
            project_update_key: 'vendor_email',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'ส่งไปยังฝ่ายตรวจรับ',
        order: 6,
        required_step: [1, 2, 3, 4, 5],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'NUMBER',
            label: 'จำนวนงวด',
            field_key: 'mt500k_installment_count',
            mark_as_done: false,
          },
          {
            type: 'NUMBER',
            label: 'วงเงิน',
            field_key: 'mt500k_credit_limit',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันเริ่มต้นสัญญา',
            field_key: 'mt500k_contract_start_date',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันสิ้นสุดสัญญา',
            field_key: 'mt500k_contract_end_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'มีรหัสสินทรัพย์หรือไม่',
            field_key: 'mt500k_contract_asset_code',
            project_update_key: 'asset_code',
            mark_as_done: false,
          },
          {
            // todo: if have asset code, then show this field and save selected budget plan to project
            type: 'SELECT_BUDGET_PLAN',
            label: 'แผนงบประมาณ',
            field_key: 'mt500k_asset_budget_plan',
            mark_as_done: false,
          },
        ],
      },
    ],
  },

  // --- E-BIDDING ---
  {
    type: 'EBIDDING' as UnitResponsibleType,
    steps: [
      {
        name: 'จัดทำแผนจัดการจัดซื้อจัดจ้าง',
        order: 1,
        required_step: [],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'แผนการจัดซื้อจัดจ้าง',
            field_key: 'ebid_procurement_plan_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำรายงานขอมอบหมายผู้จัดทำขอบเขตของงาน และคำสั่งแต่งตั้ง',
        order: 2,
        required_step: [1],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานขอมอบหมายผู้จัดทำขอบเขตของงาน',
            field_key: 'ebid_tor_assignment_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'คำสั่งแต่งตั้งคณะกรรมการจัดทำขอบเขตของงาน (TOR)',
            field_key: 'ebid_tor_committee_appt_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดประชุมคณะกรรมการจัดทำขอบเขตของงาน',
        order: 3,
        required_step: [2],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'DATE',
            label: 'วันที่ประชุมจัดทำร่างขอบเขตของงาน',
            field_key: 'ebid_tor_meeting_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'ประชุมเสร็จเรียบร้อยหรือยัง',
            field_key: 'ebid_tor_meeting_completed',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'บันทึกรายงานการประชุม',
            field_key: 'ebid_tor_meeting_minutes_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำรายงานขอซื้อ / จ้าง, คำสั่งแต่งตั้งคณะกรรมการพิจารณาผลและตรวจรับ, เอกสารประกวดราคาจ้างฯ และร่างประกาศ',
        order: 4,
        required_step: [3],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานขอซื้อ/จ้าง',
            field_key: 'ebid_requisition_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'คำสั่งแต่งตั้งคณะกรรมการพิจารณาผลและตรวจรับ',
            field_key: 'ebid_procurement_committee_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'เอกสารประกวดราคาจ้าง',
            field_key: 'ebid_tender_doc_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'เอกสารประกาศเชิญชวน',
            field_key: 'ebid_announcement_draft_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'ขอบเขตของงาน (TOR)',
            field_key: 'ebid_tor_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำรายงานผลการรับฟังความเห็น, เอกสารประกวดราคาฯ และประกาศฉบับจริง',
        order: 5,
        required_step: [4],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานผลการรับฟังความเห็น',
            field_key: 'ebid_hearing_report_file',
            mark_as_done: true,
          },
          { type: 'BOOLEAN', label: 'มีอุทธรณ์', field_key: 'ebid_is_appeal', mark_as_done: false },
          {
            type: 'FILE',
            label: 'เอกสารประกวดราคา',
            field_key: 'ebid_final_tender_doc_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'เอกสารประกาศเชิญชวน',
            field_key: 'ebid_final_announcement_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดประชุมคณะกรรมการพิจารณาผลฯ',
        order: 6,
        required_step: [5],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'DATE',
            label: 'วันที่ประชุมคณะกรรมการพิจารณาผล',
            field_key: 'ebid_consideration_meeting_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'ประชุมเสร็จเรียบร้อยหรือยัง',
            field_key: 'ebid_consideration_meeting_completed',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'เอกสารประกอบการประชุม',
            field_key: 'ebid_consideration_meeting_doc_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำรายงานผลการพิจารณาจัดซื้อจัดจ้าง, รายงานผลฯอนุมัติ, แบบแจ้งผลการจัดซื้อ / จ้าง, แบบแจ้งเหตุผลเพิ่มเติม ประกาศผู้ชนะ และหนังสือสนองรับราคาฯ',
        order: 7,
        required_step: [6],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานผลการพิจารณาและแบบแจ้งผลการจัดซื้อ/จ้าง',
            field_key: 'ebid_consideration_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'ประกาศผู้ชนะการเสนอราคา',
            field_key: 'ebid_winner_announcement_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'หนังสือแจ้งให้มาลงนามในสัญญา',
            field_key: 'ebid_contract_notice_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบขอซื้อ (PR Number)',
            field_key: 'ebid_pr_number',
            project_update_key: 'pr_no',
            mark_as_done: false,
          },
          {
            // todo: generate contract number and save to project after complete this step
            type: 'GEN_CONT_NO',
            label: 'เลขที่สัญญา',
            field_key: 'ebid_contract_number',
            project_update_key: 'contract_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'จัดทำร่างสัญญา พร้อมเอกสารประกอบสัญญา และหลักประกันสัญญา',
        order: 8,
        required_step: [7],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'สัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
            field_key: 'ebid_contract_doc_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบสั่งซื้อ (PO Number)',
            field_key: 'ebid_po_number',
            project_update_key: 'po_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        order: 9,
        required_step: [8],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: send notification to vendor email after complete this step
          {
            type: 'TEXT',
            label: 'ชื่อบริษัทผู้ค้า',
            field_key: 'ebid_vendor_name',
            project_update_key: 'vendor_name',
            mark_as_done: false,
          },
          {
            type: 'VENDOR_EMAIL',
            label: 'อีเมลผู้ค้า',
            field_key: 'ebid_vendor_email',
            project_update_key: 'vendor_email',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'ส่งไปยังฝ่ายตรวจรับ',
        order: 10,
        required_step: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'NUMBER',
            label: 'จำนวนงวด',
            field_key: 'ebid_installment_count',
            mark_as_done: false,
          },
          { type: 'NUMBER', label: 'วงเงิน', field_key: 'ebid_credit_limit', mark_as_done: false },
          {
            type: 'DATE',
            label: 'วันเริ่มต้นสัญญา',
            field_key: 'ebid_contract_start_date',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันสิ้นสุดสัญญา',
            field_key: 'ebid_contract_end_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'มีรหัสสินทรัพย์หรือไม่',
            field_key: 'ebid_contract_asset_code',
            project_update_key: 'asset_code',
            mark_as_done: false,
          },
          {
            // todo: if have asset code, then show this field and save selected budget plan to project
            type: 'SELECT_BUDGET_PLAN',
            label: 'แผนงบประมาณ',
            field_key: 'ebid_asset_budget_plan',
            mark_as_done: false,
          },
        ],
      },
    ],
  },

  // --- SELECTION ---
  {
    type: 'SELECTION' as UnitResponsibleType,
    steps: [
      {
        name: 'แผนจัดการจัดซื้อจัดจ้าง และจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
        order: 1,
        required_step: [],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'แผนการจัดซื้อ/จ้าง',
            field_key: 'select_procurement_plan_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'คำสั่งแต่งตั้งคณะกรรมการจัดทำขอบเขตของงาน (TOR)',
            field_key: 'select_tor_committee_appt_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'รายงานขอซื้อ / จ้าง, คำสั่งคณะกรรมการซื้อ / จ้าง โดยวิธีคัดเลือก, หนังสือเชิญชวน',
        order: 2,
        required_step: [1],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานขอซื้อ/จ้าง',
            field_key: 'select_requisition_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'คำสั่งแต่งตั้งคณะกรรมการซื้อหรือจ้าง',
            field_key: 'select_procurement_committee_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'หนังสือเชิญชวน',
            field_key: 'select_invitation_letter_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดประชุมคณะกรรมการจ้างโดยวิธีคัดเลือก',
        order: 3,
        required_step: [2],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'DATE',
            label: 'วันที่ประชุมคณะกรรมการ',
            field_key: 'select_meeting_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'ประชุมเสร็จเรียบร้อยหรือยัง',
            field_key: 'select_meeting_completed',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'เอกสารประกอบการประชุม',
            field_key: 'select_meeting_doc_file',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำรายงานผลการพิจารณาจัดซื้อจัดจ้าง, รายงานผลฯ อนุมัติ, แบบแจ้งผลการจัดซื้อ / จ้าง, แบบแจ้งเหตุผลเพิ่มเติม ประกาศผู้ชนะ และหนังสือสนองรับราคาฯ',
        order: 4,
        required_step: [3],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานผลการพิจารณาและแบบแจ้งผลการจัดซื้อ/จ้าง',
            field_key: 'select_consideration_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'ประกาศผู้ชนะการเสนอราคา',
            field_key: 'select_winner_announcement_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'หนังสือแจ้งให้มาลงนามในสัญญา',
            field_key: 'select_contract_notice_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบขอซื้อ (PR Number)',
            field_key: 'select_is_sap_pr_approved',
            mark_as_done: false,
          },
          {
            // todo: generate contract number and save to project after complete this step
            type: 'GEN_CONT_NO',
            label: 'เลขที่สัญญา',
            field_key: 'select_contract_number',
            project_update_key: 'contract_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'จัดทำร่างสัญญา / ใบสั่งซื้อ/จ้าง',
        order: 5,
        required_step: [4],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'สัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
            field_key: 'select_contract_doc_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบสั่งซื้อ (PO Number)',
            field_key: 'select_po_number',
            project_update_key: 'po_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        order: 6,
        required_step: [5],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: send notification to vendor email after complete this step
          {
            type: 'TEXT',
            label: 'ชื่อบริษัทผู้ค้า',
            field_key: 'select_vendor_name',
            project_update_key: 'vendor_name',
            mark_as_done: false,
          },
          {
            type: 'VENDOR_EMAIL',
            label: 'อีเมลผู้ค้า',
            field_key: 'select_vendor_email',
            project_update_key: 'vendor_email',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'ส่งไปยังฝ่ายตรวจรับ',
        order: 7,
        required_step: [1, 2, 3, 4, 5, 6],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'NUMBER',
            label: 'จำนวนงวด',
            field_key: 'select_installment_count',
            mark_as_done: false,
          },
          {
            type: 'NUMBER',
            label: 'วงเงิน',
            field_key: 'select_credit_limit',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันเริ่มต้นสัญญา',
            field_key: 'select_contract_start_date',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันสิ้นสุดสัญญา',
            field_key: 'select_contract_end_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'มีรหัสสินทรัพย์หรือไม่',
            field_key: 'select_contract_asset_code',
            project_update_key: 'asset_code',
            mark_as_done: false,
          },
          {
            // todo: if have asset code, then show this field and save selected budget plan to project
            type: 'SELECT_BUDGET_PLAN',
            label: 'แผนงบประมาณ',
            field_key: 'select_asset_budget_plan',
            mark_as_done: false,
          },
        ],
      },
    ],
  },

  // --- LT500K ---
  {
    type: 'LT500K' as UnitResponsibleType,
    steps: [
      {
        name: 'จัดทำรายงานขอซื้อ/จ้าง ,รายงานผลฯอนุมัติ ประกาศผู้ชนะ',
        order: 1,
        required_step: [],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'FILE',
            label: 'รายงานขอซื้อ/จ้าง',
            field_key: 'lt500k_requisition_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'รายงานผลฯอนุมัติ',
            field_key: 'lt500k_consideration_report_file',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'ประกาศผู้ชนะ',
            field_key: 'lt500k_winner_announcement_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบขอซื้อ (PR Number)',
            field_key: 'lt500k_pr_number',
            project_update_key: 'pr_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'จัดทำใบสั่งซื้อสั่งจ้าง',
        order: 2,
        required_step: [1],
        required_approval: true,
        required_signature: true,
        required_documents: [
          // todo: generate contract number and save to project after complete this step
          {
            type: 'GEN_CONT_NO',
            label: 'เลขที่สัญญา',
            field_key: 'lt500k_contract_number',
            project_update_key: 'contract_no',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'สัญญา / ใบสั่งซื้อสั่งจ้าง / หนังสือข้อตกลง',
            field_key: 'lt500k_contract_doc_file',
            mark_as_done: true,
          },
          {
            type: 'TEXT',
            label: 'เลขที่ใบสั่งซื้อ (PO Number)',
            field_key: 'lt500k_po_number',
            project_update_key: 'po_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        order: 3,
        required_step: [2],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: send notification to vendor email after complete this step
          {
            type: 'TEXT',
            label: 'ชื่อบริษัทผู้ค้า',
            field_key: 'lt500k_vendor_name',
            project_update_key: 'vendor_name',
            mark_as_done: false,
          },
          {
            type: 'VENDOR_EMAIL',
            label: 'อีเมลผู้ค้า',
            field_key: 'lt500k_vendor_email',
            project_update_key: 'vendor_email',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'ส่งไปยังฝ่ายตรวจรับ',
        order: 4,
        required_step: [1, 2, 3],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: if number of delivery date < 30 days and installment_count = 1, then procurement staff do until complete all contract step.
          {
            type: 'NUMBER',
            label: 'จำนวนงวด',
            field_key: 'lt500k_installment_count',
            mark_as_done: false,
          },
          {
            type: 'NUMBER',
            label: 'วงเงิน',
            field_key: 'lt500k_credit_limit',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันเริ่มต้นสัญญา',
            field_key: 'lt500k_contract_start_date',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันสิ้นสุดสัญญา',
            field_key: 'lt500k_contract_end_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'มีรหัสสินทรัพย์หรือไม่',
            field_key: 'lt500k_contract_asset_code',
            project_update_key: 'asset_code',
            mark_as_done: false,
          },
          {
            // todo: if have asset code, then show this field and save selected budget plan to project
            type: 'SELECT_BUDGET_PLAN',
            label: 'แผนงบประมาณ',
            field_key: 'lt500k_asset_budget_plan',
            mark_as_done: false,
          },
        ],
      },
    ],
  },

  // --- LT100K ---
  {
    type: 'LT100K' as UnitResponsibleType,
    steps: [
      {
        name: 'จัดใบขอซื้อ',
        order: 1,
        required_step: [],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'TEXT',
            label: 'เลขที่ใบขอซื้อ (PR Number)',
            field_key: 'lt100k_pr_number',
            project_update_key: 'pr_no',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'เอกสารเพิ่มเติม',
            field_key: 'lt100k_pr_doc',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำใบสั่งซื้อสั่งจ้าง',
        order: 2,
        required_step: [1],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'TEXT',
            label: 'เลขที่ใบสั่งซื้อ (PO Number)',
            field_key: 'lt100k_po_number',
            project_update_key: 'po_no',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'เอกสารเพิ่มเติม',
            field_key: 'lt100k_po_doc',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        order: 3,
        required_step: [2],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: send notification to vendor email after complete this step
          {
            type: 'TEXT',
            label: 'ชื่อบริษัทผู้ค้า',
            field_key: 'lt100k_vendor_name',
            project_update_key: 'vendor_name',
            mark_as_done: false,
          },
          {
            type: 'VENDOR_EMAIL',
            label: 'อีเมลผู้ค้า',
            field_key: 'lt100k_vendor_email',
            project_update_key: 'vendor_email',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'ส่งไปยังฝ่ายตรวจรับ',
        order: 4,
        required_step: [1, 2, 3],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: if number of delivery date < 30 days and installment_count = 1, then procurement staff do until complete all contract step.
          {
            type: 'NUMBER',
            label: 'จำนวนงวด',
            field_key: 'lt100k_installment_count',
            mark_as_done: false,
          },
          {
            type: 'NUMBER',
            label: 'วงเงิน',
            field_key: 'lt100k_credit_limit',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันเริ่มต้นสัญญา',
            field_key: 'lt100k_contract_start_date',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันสิ้นสุดสัญญา',
            field_key: 'lt100k_contract_end_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'มีรหัสสินทรัพย์หรือไม่',
            field_key: 'lt100k_contract_asset_code',
            project_update_key: 'asset_code',
            mark_as_done: false,
          },
          {
            // todo: if have asset code, then show this field and save selected budget plan to project
            type: 'SELECT_BUDGET_PLAN',
            label: 'แผนงบประมาณ',
            field_key: 'lt100k_asset_budget_plan',
            mark_as_done: false,
          },
        ],
      },
    ],
  },

  // --- No 18 ---
  {
    type: 'INTERNAL' as UnitResponsibleType,
    steps: [
      {
        name: 'จัดทำรายงานขอให้จัดทำเองและจัดทำคำสั่งแต่งตั้งคณะกรรมการฯ TOR',
        order: 1,
        required_step: [],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'TEXT',
            label: 'เลขที่ใบขอซื้อ (PR Number)',
            field_key: 'reg18_pr_number',
            project_update_key: 'pr_no',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'รายงานขอให้จัดทำเอง',
            field_key: 'reg18_report',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'เอกสารเพิ่มเติม',
            field_key: 'reg18_pr_doc',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'จัดทำหนังสือสั่งงานจัดทำเอง',
        order: 2,
        required_step: [1],
        required_approval: true,
        required_signature: true,
        required_documents: [
          {
            type: 'TEXT',
            label: 'เลขที่ใบสั่งซื้อ (PO Number)',
            field_key: 'reg18_po_number',
            project_update_key: 'po_no',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'หนังสือสั่งงานจัดทำเอง',
            field_key: 'reg18_instruction_letter',
            mark_as_done: true,
          },
          {
            type: 'FILE',
            label: 'เอกสารเพิ่มเติม',
            field_key: 'reg18_po_doc',
            mark_as_done: true,
          },
        ],
      },
      {
        name: 'แจ้งเตือนผู้ค้าให้เข้ามาลงนามในเอกสารสั่งซื้อ/จ้าง',
        order: 3,
        required_step: [2],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: send notification to vendor email after complete this step
          {
            type: 'TEXT',
            label: 'ชื่อบริษัทผู้ค้า',
            field_key: 'reg18_vendor_name',
            project_update_key: 'vendor_name',
            mark_as_done: false,
          },
          {
            type: 'VENDOR_EMAIL',
            label: 'อีเมลผู้ค้า',
            field_key: 'reg18_vendor_email',
            project_update_key: 'vendor_email',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'ส่งไปยังฝ่ายตรวจรับ',
        order: 4,
        required_step: [1, 2, 3],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'NUMBER',
            label: 'จำนวนงวด',
            field_key: 'reg18_installment_count',
            mark_as_done: false,
          },
          {
            type: 'NUMBER',
            label: 'วงเงิน',
            field_key: 'reg18_credit_limit',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันเริ่มต้นสัญญา',
            field_key: 'reg18_contract_start_date',
            mark_as_done: false,
          },
          {
            type: 'DATE',
            label: 'วันสิ้นสุดสัญญา',
            field_key: 'reg18_contract_end_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'มีรหัสสินทรัพย์หรือไม่',
            field_key: 'reg18_contract_asset_code',
            project_update_key: 'asset_code',
            mark_as_done: false,
          },
          {
            // todo: if have asset code, then show this field and save selected budget plan to project
            type: 'SELECT_BUDGET_PLAN',
            label: 'แผนงบประมาณ',
            field_key: 'reg18_asset_budget_plan',
            mark_as_done: false,
          },
        ],
      },
    ],
  },

  // --- CONTRACT (Standard) ---
  {
    type: 'CONTRACT' as UnitResponsibleType,
    steps: [
      {
        name: 'ระบบแจ้งเตือน',
        order: 1,
        required_step: [],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'DATE',
            label: 'วันที่ตรวจรับ',
            field_key: 'contract_inspection_date',
            mark_as_done: false,
          },
          {
            type: 'BOOLEAN',
            label: 'ต้องการระบบแจ้งเตือนไหม',
            field_key: 'contract_enable_notification',
            mark_as_done: false,
          },
          {
            // todo: if contract_enable_notification is true, then show this field
            // todo: send notification to contract staff, vendor email and committee email when due date is coming
            type: 'DUE_DATE_SELECT',
            label: 'แจ้งเตือนก่อนวันครบกำหนดมอบงาน (3/5/7/15 วัน)',
            field_key: 'contract_notification_days',
            mark_as_done: false,
          },
          {
            // todo: if contract_enable_notification is true, then show this field
            // todo: send notification to this email when due date is coming
            type: 'COMMITTEE_EMAIL',
            label: 'อีเมลกรรมการตรวจรับ',
            field_key: 'contract_committee_email',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'vendor วางบิล',
        order: 2,
        required_step: [],
        required_approval: false,
        required_signature: false,
        required_documents: [
          // todo: from vendor billing form
          {
            type: 'FILE',
            label: 'อัปโหลดไฟล์ใบแจ้งหนี้/ใบส่งของ/ใบวางบิล',
            field_key: 'contract_billing_doc',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'ตรวจสอบและบันทึกข้อมูลการส่งมอบงาน',
        order: 3,
        required_step: [1],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'SELECT_CONTRACT_STATUS',
            label: 'สถานะการส่งมอบงาน',
            field_key: 'contract_status',
            mark_as_done: false,
          },
          { type: 'FILE', label: 'บันทึกข้อมูล', field_key: 'contract_detail', mark_as_done: true },
        ],
      },
      {
        name: 'บันทึกข้อมูลการตรวจรับ',
        order: 4,
        required_step: [3],
        required_approval: false,
        required_signature: false,
        required_documents: [
          {
            type: 'TEXT',
            label: 'เลข MIGO (103)',
            field_key: 'contract_migo_103',
            project_update_key: 'migo_103_no',
            mark_as_done: false,
          },
          {
            type: 'TEXT',
            label: 'เลข MIGO (105)',
            field_key: 'contract_migo_105',
            project_update_key: 'migo_105_no',
            mark_as_done: false,
          },
        ],
      },
      {
        name: 'บันทึกรายงานผลการตรวจรับพัสดุเสนอผู้บริหาร',
        order: 5,
        required_step: [4],
        required_approval: true, // todo: if don't have asset code, then require approval: true
        required_signature: false, // todo: if have asset code, then require signature: true
        required_documents: [
          {
            type: 'SELECT_DELIVERY_STATUS',
            label: 'สถานะการตรวจรับ',
            field_key: 'contract_delivery_status',
            mark_as_done: false,
          },
          {
            type: 'FILE',
            label: 'รายงานผลการตรวจรับพัสดุ',
            field_key: 'contract_report',
            mark_as_done: true,
          },
          {
            // todo: if have asset code, then show this field
            type: 'FILE',
            label: 'ไฟล์ลงนามอนุมัติ',
            field_key: 'contract_signed_approval_document',
            mark_as_done: true,
          },
        ],
      },
    ],
  },
];
