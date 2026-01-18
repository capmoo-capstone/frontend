import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  unit_id: z.string().nullable(),
  username: z.string(),
  email: z.email().nullable(),
  full_name: z.string(),
  role: z.enum(['admin', 'staff', 'head', 'unit']).nullable(),
  is_delegate: z.boolean().default(false),
  delegate_user_id: z.string().nullable(),
  created_at: z.string().or(z.date()),
});

export type User = z.infer<typeof UserSchema>;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
};
