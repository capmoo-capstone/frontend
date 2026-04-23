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

export const UserRolesSchema = z.array(RoleDetailSchema);

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

export const BackendLoginResponseSchema = BackendLoginDataSchema;

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

const ROLE_PRIORITY: Record<Role, number> = {
  SUPER_ADMIN: 8,
  ADMIN: 7,
  HEAD_OF_DEPARTMENT: 6,
  HEAD_OF_UNIT: 5,
  REPRESENTATIVE: 4,
  DOCUMENT_STAFF: 3,
  FINANCE_STAFF: 2,
  GENERAL_STAFF: 1,
  GUEST: 0,
};

export const getPrimaryRole = (user: AuthUser): RoleDetail | null => {
  const allRoles = user.roles;

  if (allRoles.length === 0) return null;

  return allRoles.reduce((highestRole, currentRole) =>
    ROLE_PRIORITY[currentRole.role] > ROLE_PRIORITY[highestRole.role] ? currentRole : highestRole
  );
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

export const UserSchema = AuthUserSchema;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: User) => void;
  logout: () => void;
};
