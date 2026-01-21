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

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.email(),
  role: RoleEnum,
  isStaff: z.boolean().optional(),
  department: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  unit: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  token: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleEnum>;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { cunet: string; password: string }) => Promise<User>;
  logout: () => void;
};
