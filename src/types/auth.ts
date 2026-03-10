import { z } from 'zod';

// Note: This User type is for the authenticated current user (from GET /user/me or POST /auth/login)
// For user management/listing endpoints, see UserRecord type in @/types/user

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

// Auth User Schema - matches getMe API response
export const AuthUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  full_name: z.string(),
  is_delegated: z.boolean(),
  roles: UserRolesSchema,
});

// Computed properties helper
export type AuthUser = z.infer<typeof AuthUserSchema> & {
  // Computed convenience properties for backward compatibility
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

// Helper to get primary role (first own role or first delegated role)
export const getPrimaryRole = (user: AuthUser): RoleDetail | null => {
  if (user.roles.own.length > 0) {
    return user.roles.own[0];
  }
  if (user.roles.delegated.length > 0) {
    return user.roles.delegated[0];
  }
  return null;
};

// Helper to enrich user with computed properties
export const enrichUser = (userData: z.infer<typeof AuthUserSchema>): AuthUser => {
  const primaryRole = getPrimaryRole(userData);

  return {
    ...userData,
    name: userData.full_name,
    email: `${userData.username}@example.com`, // Derive or fetch separately if needed
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

export const UserSchema = AuthUserSchema;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: User) => void;
  logout: () => void;
  switchUser: (user: User) => void;
};
