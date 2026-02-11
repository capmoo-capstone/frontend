import { Navigate, Route, Routes } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
// Public Pages
import DevLogin from '../pages/auth/DevLogin';
import Login from '../pages/auth/Login';
import VendorForm from '../pages/vendor/VendorForm';

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
