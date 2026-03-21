import { z } from 'zod';

export const RoleEnum = z.enum([
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

export const RoleDetailSchema = z.object({
  role: RoleEnum,
  dept_id: z.string().nullable(),
  dept_name: z.string().nullable(),
  unit_id: z.string().nullable(),
  unit_name: z.string().nullable(),
});

export const UserRolesSchema = z.object({
  own: z.array(RoleDetailSchema),
  delegated: z.array(RoleDetailSchema),
});

export const LoginRequestSchema = z.object({
  username: z.string().min(1, { message: 'กรุณากรอกชื่อผู้ใช้' }),
  full_name: z.string().min(1, { message: 'กรุณากรอกชื่อ-นามสกุล' }),
});

export const BackendDelegatedBySchema = z.object({
  id: z.string(),
  full_name: z.string(),
  roles: z.array(RoleEnum),
});

export const BackendLoginDataSchema = z.object({
  token: z.string(),
  id: z.string(),
  username: z.string().optional(),
  full_name: z.string().optional(),
  roles: z.array(RoleDetailSchema),
  is_delegated: z.boolean(),
  delegated_by: z.array(BackendDelegatedBySchema),
});

export const BackendLoginResponseSchema = z.object({
  data: BackendLoginDataSchema,
});

export const AuthUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  full_name: z.string(),
  token: z.string().optional(),
  is_delegated: z.boolean(),
  roles: UserRolesSchema,
});

export type AuthUser = z.infer<typeof AuthUserSchema> & {
  name?: string;
  email?: string;
  role?: Role;
  isStaff?: boolean;
  department?: {
    id?: string;
    name?: string;
  };
  unit?: {
    id?: string;
    name?: string;
  };
};

export const getPrimaryRole = (user: AuthUser): RoleDetail | null => {
  if (user.roles.own.length > 0) {
    return user.roles.own[0];
  }
  if (user.roles.delegated.length > 0) {
    return user.roles.delegated[0];
  }
  return null;
};

export const enrichUser = (userData: z.infer<typeof AuthUserSchema>): AuthUser => {
  const primaryRole = getPrimaryRole(userData);

  return {
    ...userData,
    name: userData.full_name,
    email: `${userData.username}@example.com`,
    role: primaryRole?.role,
    isStaff: primaryRole?.role ? !['GUEST'].includes(primaryRole.role) : false,
    department: primaryRole?.dept_id
      ? {
          id: primaryRole.dept_id,
          name: primaryRole.dept_name || undefined,
        }
      : undefined,
    unit: primaryRole?.unit_id
      ? {
          id: primaryRole.unit_id,
          name: primaryRole.unit_name || undefined,
        }
      : undefined,
  };
};

export type User = AuthUser;
export type Role = z.infer<typeof RoleEnum>;
export type RoleDetail = z.infer<typeof RoleDetailSchema>;
export type UserRoles = z.infer<typeof UserRolesSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type BackendLoginResponse = z.infer<typeof BackendLoginResponseSchema>;

export interface GetUsersParams {
  page?: number;
  limit?: number;
}

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

export const UserSchema = AuthUserSchema;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: User) => void;
  logout: () => void;
  switchUser: (user: User) => void;
};
