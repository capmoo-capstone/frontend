import React, { type ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { type AuthContextType, AuthUserSchema, type User, enrichUser } from '@/features/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check LocalStorage on load
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const validatedUser = AuthUserSchema.parse(parsed);
        const enrichedUser = enrichUser(validatedUser);
        setUser(enrichedUser);
      } catch (error) {
        console.error('Invalid user data in storage', error);
        localStorage.removeItem('nexus_user');
      }
    }
    setIsLoading(false);
  }, []);

  const setSession = (userData: User) => {
    const enrichedUser = enrichUser(userData);
    setUser(enrichedUser);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  const switchUser = (newUser: User) => {
    // switchUser is intended only for development (e.g., testing/impersonation).
    // In non-development environments, do not allow changing the user directly.
    if (import.meta.env.MODE !== 'development') {
      console.warn('switchUser is disabled outside of development environments.');
      return;
    }
    const enrichedUser = enrichUser(newUser);
    setUser(enrichedUser);
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setSession,
        logout,
        switchUser,
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
