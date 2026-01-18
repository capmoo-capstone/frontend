import { z } from 'zod';

export const RoleEnum = z.enum(['admin', 'head', 'staff', 'unit']);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: RoleEnum,
  department: z.string().optional(),
  unitId: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleEnum>;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
};
