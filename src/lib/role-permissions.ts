import { type Role } from '@/types/auth';

/**
 * Role assign page
 */

/** Supervisory roles that have department-level oversight */
export const SupervisorRoles: Role[] = ['HEAD_OF_DEPARTMENT'];

/** Roles that can manage unit-level operations and assignments */
export const ManageUnitRoles: Role[] = ['HEAD_OF_UNIT', 'SUPER_ADMIN'];

/** Roles that have view-only access to unit operations */
export const ViewUnitRoles: Role[] = ['ADMIN', 'DOCUMENT_STAFF', 'FINANCE_STAFF'];

/** Roles that can manage their own assignments */
export const ManageSelfRoles: Role[] = ['GENERAL_STAFF'];

