import { type Role, type User } from '@/types/auth';

export const hasProcurementPermission = (user: User) => {
  return true;
};

export const hasUnitPermission = (user: User) => {
  return true;
};

export const hasDepartmentPermission = (user: User) => {
  return true;
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
