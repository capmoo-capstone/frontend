import React, { type ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { type AuthContextType, type User, UserSchema } from '../types/auth';

const MOCK_ADMIN: User = {
  id: '999999',
  name: 'System Administrator',
  email: 'admin@nexus-procure.com',
  role: 'admin',
};

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
        const validatedUser = UserSchema.parse(parsed);
        setUser(validatedUser);
      } catch (error) {
        console.error('Invalid user data in storage', error);
        localStorage.removeItem('nexus_user');
      }
    } else {
      // -----------------------------------------------------------
      // [DEV ONLY] AUTO-LOGIN AS ADMIN
      // If no user is found, force the Mock Admin
      // -----------------------------------------------------------
      console.log('🚧 DEV MODE: Auto-logging in as Admin');
      setUser(MOCK_ADMIN);
      localStorage.setItem('nexus_user', JSON.stringify(MOCK_ADMIN));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
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
        login,
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
