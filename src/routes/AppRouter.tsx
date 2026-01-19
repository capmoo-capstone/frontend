import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';

// You will likely replace this with a real auth hook later (e.g., useAuth())
type Status = 'checking' | 'authenticated' | 'no-authenticated';
const status: Status = 'authenticated'; // Change this to test the logic

export const AppRouter = () => {
  if (status === ('checking' as Status)) {
    return <div className="loading">Checking credentials...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {status === 'authenticated' ? (
          <Route path="/*" element={<PrivateRoutes />} />
        ) : (
          <Route path="/*" element={<PublicRoutes />} />
        )}

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
