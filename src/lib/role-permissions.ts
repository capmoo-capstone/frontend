import { type Role } from '@/types/auth';

/**
 * Role groupings for permission checks across the application
 */

/** Supervisory roles that have department-level oversight */
export const SupervisorRoles: Role[] = ['HEAD_OF_DEPARTMENT'];

/** Roles that can manage unit-level operations and assignments */
export const ManageUnitRoles: Role[] = ['HEAD_OF_UNIT', 'SUPER_ADMIN'];

/** Roles that have view-only access to unit operations */
export const ViewUnitRoles: Role[] = ['ADMIN', 'DOCUMENT_STAFF', 'FINANCE_STAFF'];

/** Roles that can manage their own assignments */
export const ManageSelfRoles: Role[] = ['GENERAL_STAFF'];

/**
 * Helper function to check if a role has management permissions
 */
export const hasManagementPermission = (role: Role): boolean => {
  return SupervisorRoles.includes(role) || ManageUnitRoles.includes(role);
};

/**
 * Helper function to check if a role can view unit operations
 */
export const canViewUnitOperations = (role: Role): boolean => {
  return (
    SupervisorRoles.includes(role) || ManageUnitRoles.includes(role) || ViewUnitRoles.includes(role)
  );
};
