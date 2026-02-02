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

export const UserSchema = z.object({
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
  data: z.array(UserSchema),
});

export type UserRole = z.infer<typeof UserRoleEnum>;
export type User = z.infer<typeof UserSchema>;
export type UserListResponse = z.infer<typeof UserListResponseSchema>;

export const UserSelectionItemSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  role: UserRoleEnum,
});

export const UserSelectionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  entity_type: z.enum(['unit', 'department']),
  data: z.array(UserSelectionItemSchema),
});

export type UserSelectionItem = z.infer<typeof UserSelectionItemSchema>;
export type UserSelectionResponse = z.infer<typeof UserSelectionResponseSchema>;
