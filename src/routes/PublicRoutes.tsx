import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

// Public Pages
import Login from '../pages/auth/Login';
import VendorForm from '../pages/vendor/VendorForm';
import PageNotFound from '../pages/auth/PageNotFound';

export const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="vendor/form" element={<VendorForm />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </PublicLayout>
  );
};
