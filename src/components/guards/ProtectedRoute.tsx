import { Navigate, Outlet } from 'react-router-dom';

interface PermissionGuardProps {
  isAllowed: boolean;
  redirectPath?: string;
}

export default function PermissionGuard({
  isAllowed,
  redirectPath = '/app/home', // Default kick-out destination
}: PermissionGuardProps) {
  if (!isAllowed) {
    // If they don't have permission, redirect them instantly
    return <Navigate to={redirectPath} replace />;
  }

  // If they are allowed, render the child routes
  return <Outlet />;
}
