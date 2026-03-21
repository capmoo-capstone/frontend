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

export const hasProcurementPermission = (user: User) => {
  return !!user.role && ProcurementAllowedRoles.includes(user.role);
};

export const hasUnitPermission = (user: User) => {
  return !!user.role && UnitAllowedRoles.includes(user.role);
};

export const hasDepartmentPermission = (user: User) => {
  return !!user.role && DepartmentAllowedRoles.includes(user.role);
};

export const hasSettingsPermission = (user: User) => {
  return !!user.role && SettingsAllowedRoles.includes(user.role);
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
