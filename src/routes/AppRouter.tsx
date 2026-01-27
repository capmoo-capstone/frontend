import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';

export const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div className="loading">Checking credentials...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<PrivateRoutes />} />
        ) : (
          <Route path="/*" element={<PublicRoutes />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
