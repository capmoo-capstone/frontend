import React, { type ReactNode, createContext, useContext, useState } from 'react';

import { type AuthContextType, AuthUserSchema, type User, enrichUser } from '@/features/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('nexus_user');
    if (!storedUser) return null;

    try {
      const parsed = JSON.parse(storedUser);
      const validatedUser = AuthUserSchema.parse(parsed);
      return enrichUser(validatedUser);
    } catch (error) {
      console.error('Invalid user data in storage', error);
      localStorage.removeItem('nexus_user');
      return null;
    }
  });
  const [isLoading] = useState(false);

  const setSession = (userData: User) => {
    const enrichedUser = enrichUser(userData);
    setUser(enrichedUser);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
