import { useAuth } from '@/context/AuthContext';
import {
  hasDepartmentPermission,
  hasImportProjectPermission,
  hasProcurementPermission,
  hasSettingsPermission,
  hasUnitPermission,
} from '@/lib/permissions';

import type { RoleDetail, User } from '../types';

const OPS_DEPT_ID = 'DEPT-SUP-OPS';

export const getRoleInDeptSupOps = (u?: User): RoleDetail | undefined => {
  const allRoles = u ? [...u.roles.own, ...u.roles.delegated] : [];

  return allRoles.find((role) => role.dept_id === OPS_DEPT_ID && role.role !== 'GUEST');
};

export const isProcurementStaffRole = (u?: User): boolean => Boolean(getRoleInDeptSupOps(u));

export const usePermissions = (targetUnitId?: string, targetDepartmentId?: string) => {
  const { user } = useAuth();

  if (!user) {
    return {
      canManageUnit: false,
      canManageDepartment: false,
      canAccessSettings: false,
      canImportProject: false,
      canImportOptions: false,
      canDoProcurement: false,
      roleInDeptSupOps: undefined as RoleDetail | undefined,
      isProcurementStaff: false,
    };
  }

  const roleInDeptSupOps = getRoleInDeptSupOps(user);

  return {
    canManageUnit: hasUnitPermission(user, targetUnitId),
    canManageDepartment: hasDepartmentPermission(user, targetDepartmentId),
    canAccessSettings: hasSettingsPermission(user),
    canImportProject: hasImportProjectPermission(user),
    canImportOptions: hasProcurementPermission(user, targetDepartmentId),
    canDoProcurement: hasProcurementPermission(user, targetDepartmentId),
    roleInDeptSupOps,
    isProcurementStaff: Boolean(roleInDeptSupOps),
  };
};
