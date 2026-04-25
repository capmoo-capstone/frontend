import { useAuth } from '@/context/useAuth';
import { OPS_DEPT_ID } from '@/lib/constants';
import {
  getRolesInDept,
  getRolesInUnit,
  hasDepartmentPermission,
  hasProcurementPermission,
  hasSettingsPermission,
  hasUnitPermission,
} from '@/lib/permissions';

import type { RoleDetail, User } from '../types';

export const getRoleInDeptSupOps = (u?: User): RoleDetail | undefined => {
  const allRoles = u?.roles ?? [];

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
      canDoProcurement: false,
      roleInDeptSupOps: undefined as RoleDetail | undefined,
      isProcurementStaff: false,
      rolesInDept: [],
      rolesInUnit: [],
    };
  }

  const roleInDeptSupOps = getRoleInDeptSupOps(user);

  return {
    canManageUnit: hasUnitPermission(user, targetUnitId),
    canManageDepartment: hasDepartmentPermission(user, targetDepartmentId),
    canAccessSettings: hasSettingsPermission(user),
    canDoProcurement: hasProcurementPermission(user, targetDepartmentId),
    roleInDeptSupOps,
    isProcurementStaff: Boolean(roleInDeptSupOps),
    rolesInDept: getRolesInDept(user, targetDepartmentId),
    rolesInUnit: getRolesInUnit(user, targetUnitId),
  };
};
