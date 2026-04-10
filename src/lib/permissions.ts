import { type Role, type User } from '@/features/auth';

// ============================================================================
// 1. ROLE DEFINITIONS & CONFIGURATIONS
// ============================================================================
// Grouping all role arrays together makes it easy to manage who has access to what.

/** Roles that are permitted to perform general procurement actions */
const ProcurementAllowedRoles: Role[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'HEAD_OF_DEPARTMENT',
  'HEAD_OF_UNIT',
  'DOCUMENT_STAFF',
  'FINANCE_STAFF',
  'GENERAL_STAFF',
];

/** Roles permitted to access and manage unit-level data */
const UnitAllowedRoles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'HEAD_OF_UNIT'];

/** Roles permitted to access and manage department-level data */
const DepartmentAllowedRoles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'HEAD_OF_DEPARTMENT'];

/** Roles permitted to access global application settings */
const SettingsAllowedRoles: Role[] = ['SUPER_ADMIN', 'ADMIN'];

/** Roles that bypass standard unit-level restrictions (Global access) */
const UnitBypassRoles: Role[] = ['SUPER_ADMIN', 'ADMIN'];

/** Roles that bypass standard department-level restrictions (Global access) */
const DepartmentBypassRoles: Role[] = ['SUPER_ADMIN', 'ADMIN'];

/** Supervisory roles that have department-level oversight */
export const SupervisorRoles: Role[] = ['HEAD_OF_DEPARTMENT'];

/** Roles that can manage unit-level operations and assignments */
export const ManageUnitRoles: Role[] = ['HEAD_OF_UNIT', 'SUPER_ADMIN'];

/** Roles that have view-only access to unit operations */
export const ViewUnitRoles: Role[] = ['ADMIN', 'DOCUMENT_STAFF', 'FINANCE_STAFF'];

/** Roles that can manage their own assignments */
export const ManageSelfRoles: Role[] = ['GENERAL_STAFF'];

// ============================================================================
// 2. INTERNAL UTILITY FUNCTIONS
// ============================================================================
// Base functions used to extract and evaluate user scopes.

/**
 * Combines a user's natively assigned roles and roles delegated to them.
 * @param user The logged-in user object
 * @returns Array of all active role scopes for the user
 */
const getAllScopes = (user: User) => [...user.roles.own, ...user.roles.delegated];

/**
 * Core engine to check if a user possesses any of the allowed roles,
 * optionally restricted to a specific unit or department context.
 * * @param user The logged-in user
 * @param allowedRoles Array of roles that pass the check
 * @param options Optional context restrictions (unitId, departmentId)
 */
export const hasRoleInScopes = (
  user: User,
  allowedRoles: Role[],
  options?: { unitId?: string; departmentId?: string }
) => {
  const scopes = getAllScopes(user);
  if (scopes.length === 0) return false;

  allowedRoles.push('SUPER_ADMIN');

  return scopes.some((scope) => {
    if (!allowedRoles.includes(scope.role)) return false;
    if (options?.unitId && scope.unit_id !== options.unitId) return false;
    if (options?.departmentId && scope.dept_id !== options.departmentId) return false;
    return true;
  });
};

/**
 * Evaluates if a user has a global bypass role that ignores context restrictions.
 * * @param user The logged-in user
 * @param bypassRoles Array of roles that grant bypass access
 */
export const hasBypassRole = (user: User, bypassRoles: Role[]) => {
  return hasRoleInScopes(user, bypassRoles) || (!!user.role && bypassRoles.includes(user.role));
};

// ============================================================================
// 3. CONTEXTUAL PERMISSION EVALUATORS (EXPORTED)
// ============================================================================
// Primary functions used by components/hooks to check access rights.

/**
 * Checks if a user has procurement capabilities, optionally within a specific department.
 */
export const hasProcurementPermission = (user: User, targetDepartmentId?: string) => {
  if (targetDepartmentId) {
    return hasRoleInScopes(user, ProcurementAllowedRoles, { departmentId: targetDepartmentId });
  }

  return (
    hasRoleInScopes(user, ProcurementAllowedRoles) ||
    (!!user.role && ProcurementAllowedRoles.includes(user.role))
  );
};

/**
 * Checks if a user can access unit-level operations.
 * If a targetUnitId is provided, it verifies access strictly for that unit (unless bypassed).
 */
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

/**
 * Checks if a user can access department-level operations.
 * Verifies access strictly for that department if targetDepartmentId is provided (unless bypassed).
 */
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

/**
 * Checks if a user has access to global system settings.
 */
export const hasSettingsPermission = (user: User) => {
  return (
    hasRoleInScopes(user, SettingsAllowedRoles) ||
    (!!user.role && SettingsAllowedRoles.includes(user.role))
  );
};

/**
 * Checks if a user is allowed to manage their own specific assignments within a unit.
 */
export const hasSelfManagePermission = (user: User, targetUnitId?: string) => {
  return hasRoleInScopes(user, ManageSelfRoles, { unitId: targetUnitId });
};

// ============================================================================
// 5. ROLE RETRIEVAL UTILITIES
// ============================================================================
// Functions for extracting specific data points from the user's scope.

/**
 * Retrieves the specific role a user holds within a given department, if any.
 */
export const getRolesInDept = (user: User, departmentId?: string): Role[] => {
  if (!departmentId) return [];

  const scopes = getAllScopes(user);
  const deptScope = scopes.filter((scope) => scope.dept_id === departmentId);
  return deptScope.map((s) => s.role);
};

/**
 * Retrieves the specific role a user holds within a given unit, if any.
 */
export const getRolesInUnit = (user: User, unitId?: string): Role[] => {
  if (!unitId) return [];

  const scopes = getAllScopes(user);
  const unitScope = scopes.filter((scope) => scope.unit_id === unitId);
  return unitScope.map((s) => s.role);
};

// ============================================================================
// 5. ROLE RETRIEVAL UTILITIES
// ============================================================================
// Functions for extracting specific data points from the user's scope.

/**
 * Retrieves the specific role a user holds within a given department, if any.
 */
export const getRoleInDept = (user: User, departmentId?: string): Role | null => {
  if (!departmentId) return null;

  const scopes = getAllScopes(user);
  const deptScope = scopes.find((scope) => scope.dept_id === departmentId);
  return deptScope ? deptScope.role : null;
};

/**
 * Retrieves the specific role a user holds within a given unit, if any.
 */
export const getRoleInUnit = (user: User, unitId?: string): Role | null => {
  if (!unitId) return null;

  const scopes = getAllScopes(user);
  const unitScope = scopes.find((scope) => scope.unit_id === unitId);
  return unitScope ? unitScope.role : null;
};
