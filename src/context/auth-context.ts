import { createContext } from 'react';

import { type AuthContextType } from '@/features/auth';

export const AuthContext = createContext<AuthContextType | null>(null);
