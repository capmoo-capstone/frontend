import { z } from 'zod';

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const DelegationSchema = z
  .object({
    id: z.string().optional(),
    user_id: z.string().min(1, 'กรุณาเลือกเจ้าหน้าที่'),
    start_date: z.date({ message: 'กรุณาเลือกวันเริ่มต้น' }),
    end_date: z.date({ message: 'กรุณาเลือกวันสิ้นสุด' }),
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date < data.start_date) {
      ctx.addIssue({
        code: 'custom',
        message: 'วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่มต้น',
        path: ['end_date'],
      });
    }
  });

export type DelegationPayload = z.infer<typeof DelegationSchema>;

export const DelegationWithFutureDateSchema = DelegationSchema.superRefine((data, ctx) => {
  const today = startOfToday();

  if (data.start_date && data.start_date < today) {
    ctx.addIssue({
      code: 'custom',
      message: 'วันที่เริ่มต้นต้องเป็นวันนี้หรือในอนาคต',
      path: ['start_date'],
    });
  }

  if (data.end_date < today) {
    ctx.addIssue({
      code: 'custom',
      message: 'วันที่สิ้นสุดต้องเป็นวันนี้หรือในอนาคต',
      path: ['end_date'],
    });
  }
  if (data.start_date && data.end_date <= data.start_date) {
    ctx.addIssue({
      code: 'custom',
      message: 'วันที่สิ้นสุดต้องอยู่หลังวันที่เริ่มต้น',
      path: ['end_date'],
    });
  }
});

export const WorkGroupSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อกลุ่มงาน'),
  workflow_types: z.array(z.string()).min(1, 'กรุณาเลือกประเภทงาน'),
  head_id: z.string().min(1, 'กรุณาเลือกหัวหน้ากลุ่มงาน'),
  member_ids: z.array(z.string()).default([]),
  delegation: DelegationSchema.optional().nullable(),
});

export type WorkGroupPayload = z.infer<typeof WorkGroupSchema>;
export type WorkGroupFormInput = z.input<typeof WorkGroupSchema>;

export interface WorkGroupValidationInput {
  id?: string;
  name: string;
  workflow_types: string[];
  head_id: string;
  member_ids: string[];
  delegation?: DelegationPayload | null;
}

interface WorkGroupValidationContext {
  currentGroupId?: string;
  existingGroups: Array<{
    id: string;
    workflow_types: string[];
    head_id: string;
    member_ids: string[];
  }>;
  directorUserId: string;
}

export const createWorkGroupValidationSchema = (context: WorkGroupValidationContext) => {
  return WorkGroupSchema.superRefine((data, ctx) => {
    const otherGroups = context.existingGroups.filter(
      (group) => group.id !== context.currentGroupId
    );

    const usedWorkflowTypes = new Set(otherGroups.flatMap((group) => group.workflow_types));
    const duplicatedWorkflow = data.workflow_types.find((type) => usedWorkflowTypes.has(type));
    if (duplicatedWorkflow) {
      ctx.addIssue({
        code: 'custom',
        message: 'ประเภทวิธีการจัดหาห้ามซ้ำกับกลุ่มงานอื่น',
        path: ['workflow_types'],
      });
    }

    const otherGroupHeads = new Set(otherGroups.map((group) => group.head_id));
    const otherGroupMembers = new Set(otherGroups.flatMap((group) => group.member_ids));

    data.member_ids.forEach((memberId) => {
      if (memberId === context.directorUserId) {
        ctx.addIssue({
          code: 'custom',
          message: 'ไม่สามารถเพิ่มผู้อำนวยการ สบง. เป็นเจ้าหน้าที่กลุ่มงานได้',
          path: ['member_ids'],
        });
      }

      if (otherGroupHeads.has(memberId)) {
        ctx.addIssue({
          code: 'custom',
          message: 'ไม่สามารถเพิ่มผู้ที่เป็นหัวหน้ากลุ่มงานอื่นเป็นเจ้าหน้าที่กลุ่มงานได้',
          path: ['member_ids'],
        });
      }

      if (otherGroupMembers.has(memberId)) {
        ctx.addIssue({
          code: 'custom',
          message: 'เจ้าหน้าที่ 1 คน สามารถอยู่ได้เพียง 1 กลุ่มงานเท่านั้น',
          path: ['member_ids'],
        });
      }
    });

    if (data.delegation) {
      const parsed = DelegationWithFutureDateSchema.safeParse(data.delegation);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: 'custom',
            message: issue.message,
            path: ['delegation', ...(issue.path ?? [])],
          });
        });
      }
    }
  });
};

interface DepartmentRepresentativeContext {
  currentUnitId: string;
  allAssignments: Array<{ unitId: string; userId?: string | null }>;
}

export const createDepartmentRepresentativeSchema = (context: DepartmentRepresentativeContext) => {
  return z
    .object({
      user_id: z.string().min(1, 'กรุณาเลือกเจ้าหน้าที่ตัวแทน'),
    })
    .superRefine((data, ctx) => {
      const duplicate = context.allAssignments.find(
        (assignment) =>
          assignment.unitId !== context.currentUnitId &&
          !!assignment.userId &&
          assignment.userId === data.user_id
      );

      if (duplicate) {
        ctx.addIssue({
          code: 'custom',
          message: 'เจ้าหน้าที่ 1 คน เป็นตัวแทนได้เพียง 1 หน่วยงานเท่านั้น',
          path: ['user_id'],
        });
      }
    });
};

interface ProcurementRoleValidationContext {
  allowMultiple: boolean;
  isDirectorRole: boolean;
}

export const createProcurementRoleSchema = (context: ProcurementRoleValidationContext) => {
  return z
    .object({
      member_ids: z.array(z.string()).min(1, 'กรุณาเลือกเจ้าหน้าที่อย่างน้อย 1 คน'),
      delegations: z.array(DelegationWithFutureDateSchema).default([]),
    })
    .superRefine((data, ctx) => {
      if (!context.allowMultiple && data.member_ids.length > 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'ตำแหน่งนี้กำหนดได้เพียง 1 คน',
          path: ['member_ids'],
        });
      }

      if (context.isDirectorRole && data.member_ids.length !== 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'ตำแหน่งผู้อำนวยการกำหนดได้เพียง 1 คนเท่านั้น',
          path: ['member_ids'],
        });
      }

      if (context.isDirectorRole && data.delegations.length > 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'ตำแหน่งผู้อำนวยการกำหนดผู้รักษาการได้เพียง 1 รายการเท่านั้น',
          path: ['delegations'],
        });
      }
    });
};

export interface SettingsUserOption {
  id: string;
  full_name: string;
  role?: string;
}

export interface SettingsPerson {
  id: string;
  full_name: string;
  role: string;
}

export interface ProcurementRoleSetting {
  id: string;
  label: string;
  member_ids: string[];
  allow_multiple: boolean;
  delegation: DelegationPayload[];
}

export interface WorkGroupSetting {
  id: string;
  name: string;
  workflow_types: string[];
  head_id: string;
  member_ids: string[];
  delegation: DelegationPayload | null;
}
