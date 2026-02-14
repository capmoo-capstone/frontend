import { useEffect, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

const ProjectAccessGuard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !id) return;

      // Super User Bypass
      if (user.role === 'SUPER_ADMIN') {
        setIsAllowed(true);
        return;
      }

      try {
        // todo check logic from API
        const mockProject = {
          id: '123',
          assigneeId: 'staff_01',
          unitId: 'unit_eng',
        };

        const isAssignee = mockProject.assigneeId === user.id;
        const isHeadOfUnit = user.role === 'HEAD_OF_UNIT' && user.unit?.id === mockProject.unitId;

        if (isAssignee || isHeadOfUnit) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }

        // If all checks pass
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
