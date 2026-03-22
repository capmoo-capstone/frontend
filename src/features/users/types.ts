import { z } from 'zod';

export const UserRoleEnum = z.enum([
  'SUPER_ADMIN',
  'ADMIN',
  'HEAD_OF_DEPARTMENT',
  'HEAD_OF_UNIT',
  'REPRESENTATIVE',
  'DOCUMENT_STAFF',
  'FINANCE_STAFF',
  'GENERAL_STAFF',
  'GUEST',
]);

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
