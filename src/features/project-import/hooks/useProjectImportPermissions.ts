import { useAuth } from '@/context/useAuth';
import { OPS_DEPT_ID } from '@/lib/constants';
import { hasRoleInScopes } from '@/lib/permissions';

export const useProjectImportPermissions = () => {
  const { user } = useAuth();

  return {
    // Action permissions
    canImportProject: !!(user && hasRoleInScopes(user, ['DOCUMENT_STAFF', 'REPRESENTATIVE'])),
    canImportOptions: !!(
      user &&
      hasRoleInScopes(user, ['DOCUMENT_STAFF'], {
        departmentId: OPS_DEPT_ID,
      })
    ),
  };
};
