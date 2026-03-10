import { z } from 'zod';

// Note: This UserRecord type is for user management/listing endpoints (e.g., GET /user)
// For the authenticated current user, see User type in @/types/auth

export const UserRoleEnum = z.enum(['ADMIN', 'STAFF', 'MANAGER', 'GUEST']);

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

// Legacy alias for backward compatibility
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
