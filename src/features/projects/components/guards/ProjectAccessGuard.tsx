import { useEffect, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { useAuth } from '@/context/useAuth';
import { hasRoleInScopes } from '@/lib/permissions';

import { getProjectDetail } from '../../api';

const ProjectAccessGuard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !id) return;

      if (hasRoleInScopes(user, ['SUPER_ADMIN'])) {
        setIsAllowed(true);
        return;
      }

      try {
        await getProjectDetail(id);
        setIsAllowed(true);
      } catch (error) {
        console.error('Access check failed', error);
        setIsAllowed(false);
      }
    };

    checkAccess();
  }, [id, user]);

  if (isAllowed === null) {
    return <div>Checking permissions...</div>; // todo: Replace with a proper loading component
  }

  return isAllowed ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProjectAccessGuard;
