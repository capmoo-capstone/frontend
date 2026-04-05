import { type Role, type User } from '@/features/auth';

const ProcurementAllowedRoles: Role[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'HEAD_OF_DEPARTMENT',
  'HEAD_OF_UNIT',
  'DOCUMENT_STAFF',
  'FINANCE_STAFF',
  'GENERAL_STAFF',
];

const UnitAllowedRoles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'HEAD_OF_DEPARTMENT', 'HEAD_OF_UNIT'];

const DepartmentAllowedRoles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'HEAD_OF_DEPARTMENT'];

const SettingsAllowedRoles: Role[] = ['SUPER_ADMIN', 'ADMIN'];

const UnitBypassRoles: Role[] = ['SUPER_ADMIN', 'ADMIN'];
const DepartmentBypassRoles: Role[] = ['SUPER_ADMIN', 'ADMIN'];

const getAllScopes = (user: User) => [...user.roles.own, ...user.roles.delegated];

const hasRoleInScopes = (
  user: User,
  allowedRoles: Role[],
  options?: { unitId?: string; departmentId?: string }
) => {
  const scopes = getAllScopes(user);

  return scopes.some((scope) => {
    if (!allowedRoles.includes(scope.role)) return false;
    if (options?.unitId && scope.unit_id !== options.unitId) return false;
    if (options?.departmentId && scope.dept_id !== options.departmentId) return false;
    return true;
  });
};

const hasBypassRole = (user: User, bypassRoles: Role[]) => {
  return hasRoleInScopes(user, bypassRoles) || (!!user.role && bypassRoles.includes(user.role));
};

export const hasProcurementPermission = (user: User, targetDepartmentId?: string) => {
  if (targetDepartmentId) {
    return hasRoleInScopes(user, ProcurementAllowedRoles, { departmentId: targetDepartmentId });
  }

  return (
    hasRoleInScopes(user, ProcurementAllowedRoles) ||
    (!!user.role && ProcurementAllowedRoles.includes(user.role))
  );
};

export const hasUnitPermission = (user: User, targetUnitId?: string) => {
  if (!targetUnitId) {
    return (
      hasRoleInScopes(user, UnitAllowedRoles) ||
      (!!user.role && UnitAllowedRoles.includes(user.role))
    );
  }

  if (hasBypassRole(user, UnitBypassRoles)) {
    return true;
  }

  return hasRoleInScopes(user, UnitAllowedRoles, { unitId: targetUnitId });
};

export const hasDepartmentPermission = (user: User, targetDepartmentId?: string) => {
  if (!targetDepartmentId) {
    return (
      hasRoleInScopes(user, DepartmentAllowedRoles) ||
      (!!user.role && DepartmentAllowedRoles.includes(user.role))
    );
  }

  if (hasBypassRole(user, DepartmentBypassRoles)) {
    return true;
  }

  return hasRoleInScopes(user, DepartmentAllowedRoles, { departmentId: targetDepartmentId });
};

export const hasSettingsPermission = (user: User) => {
  return (
    hasRoleInScopes(user, SettingsAllowedRoles) ||
    (!!user.role && SettingsAllowedRoles.includes(user.role))
  );
};

/** Supervisory roles that have department-level oversight */
export const SupervisorRoles: Role[] = ['HEAD_OF_DEPARTMENT'];

/** Roles that can manage unit-level operations and assignments */
export const ManageUnitRoles: Role[] = ['HEAD_OF_UNIT', 'SUPER_ADMIN'];

/** Roles that have view-only access to unit operations */
export const ViewUnitRoles: Role[] = ['ADMIN', 'DOCUMENT_STAFF', 'FINANCE_STAFF'];

/** Roles that can manage their own assignments */
export const ManageSelfRoles: Role[] = ['GENERAL_STAFF'];

/** Import Project */

// can use different import options (manual, lesspaper, fiori)
export const hasImportOptionsPermission = (user: User) => {
  return hasProcurementPermission(user);
};

// can import projects
export const hasImportProjectPermission = (user: User) => {
  return hasProcurementPermission(user); // or is representative of unit
};
