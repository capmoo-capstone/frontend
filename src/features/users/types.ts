import { z } from 'zod';

import { type Role, RoleEnum } from '@/features/auth/types';

export const UserRoleEnum = RoleEnum;
export type UserRole = Role;

export const UserRecordSchema = z.object({
  id: z.string(),
  unit_id: z.string().nullable(),
  username: z.string(),
  email: z.email().nullable(),
  full_name: z.string(),
  role: UserRoleEnum.nullable(),
  is_delegate: z.boolean(),
  delegate_user_id: z.string().nullable(),
  created_at: z.iso.datetime(),
});

export const UserListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  data: z.array(UserRecordSchema),
});

export type UserRecord = z.infer<typeof UserRecordSchema>;
export type UserListResponse = z.infer<typeof UserListResponseSchema>;

export const UserSchema = UserRecordSchema;
export type User = UserRecord;

export const UserSelectionItemSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  role: z.string(),
});

export const UserSelectionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  entity_type: z.enum(['unit', 'department']),
  data: z.array(UserSelectionItemSchema),
});

export type UserSelectionResponse = z.infer<typeof UserSelectionResponseSchema>;

export type GetUsersParams = {
  page?: number;
  limit?: number;
};

export type GetUsersSelectionParams =
  | { unitId: string; deptId?: never }
  | { unitId?: never; deptId: string };

export const BackendUserSelectionItemSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  roles: z.array(z.string()),
});

export const BackendUserSelectionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  entity_type: z.enum(['unit', 'department', 'all']),
  total: z.number().optional(),
  data: z.array(BackendUserSelectionItemSchema),
});

export type BackendUserSelectionResponse = z.infer<typeof BackendUserSelectionResponseSchema>;

export const Roles = z.object({
  role: UserRoleEnum,
  department: z.object({
    id: z.string(),
    name: z.string(),
  }),
  unit: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
});

export const BackendUserDetailResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  full_name: z.string(),
  created_at: z.iso.datetime(),
  role_updated_at: z.iso.datetime(),
  roles: z.array(Roles),
});

export type BackendUserDetailResponse = z.infer<typeof BackendUserDetailResponseSchema>;

export type AddUsersToUnitRequest = {
  unitId: string;
  userId: string[];
};

export const AddUsersToUnitSchema = z.object({
  unitId: z.string(),
  userId: z.array(z.string()),
});
