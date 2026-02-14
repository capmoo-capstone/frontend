import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Loader2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';

// A simple loading fallback for lazy-loaded routes
const PageLoader = () => (
  <div className="bg-background flex h-screen w-screen items-center justify-center">
    <Loader2 className="text-primary h-8 w-8 animate-spin" />
  </div>
);

export const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {isAuthenticated ? (
            <Route path="/*" element={<PrivateRoutes />} />
          ) : (
            <Route path="/*" element={<PublicRoutes />} />
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
