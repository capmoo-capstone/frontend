import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';

// Lazy load public pages
const Login = lazy(() => import('../pages/auth/Login'));
const DevLogin = lazy(() => import('../pages/auth/DevLogin'));
const VendorForm = lazy(() => import('../pages/vendor/VendorForm'));

export const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {import.meta.env.MODE === 'development' && (
          <Route path="/dev-login" element={<DevLogin />} />
        )}
        <Route path="/vendor/form" element={<VendorForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </PublicLayout>
  );
};
