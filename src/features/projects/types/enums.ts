import { z } from 'zod';

export const ProjectStatusEnum = z.enum([
  'UNASSIGNED',
  'WAITING_ACCEPT',
  'IN_PROGRESS',
  'WAITING_CANCEL',
  'CANCELLED',
  'CLOSED',
  'REQUEST_EDIT',
]);

export const ProjectStatusByTypeEnum = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'WAITING_APPROVAL',
  'WAITING_PROPOSAL',
  'WAITING_SIGNATURE',
  'COMPLETED',
  'REJECTED',
]);

export const ProjectUrgentStatusEnum = z.enum(['NORMAL', 'URGENT', 'VERY_URGENT']);

export const ProcurementTypeEnum = z.enum([
  'LT100K',
  'LT500K',
  'MT500K',
  'SELECTION',
  'EBIDDING',
  'INTERNAL',
]);

export const UnitResponsibleTypeEnum = z.enum([
  'LT100K',
  'LT500K',
  'MT500K',
  'SELECTION',
  'EBIDDING',
  'INTERNAL',
  'CONTRACT',
]);

export const AssignedProjectStatusEnum = z.enum([
  'WAITING_ACCEPT',
  'IN_PROGRESS',
  'WAITING_CANCEL',
  'CANCELLED',
]);

export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type ProjectStatusByType = z.infer<typeof ProjectStatusByTypeEnum>;
export type ProjectUrgentStatus = z.infer<typeof ProjectUrgentStatusEnum>;
export type ProcurementType = z.infer<typeof ProcurementTypeEnum>;
export type UnitResponsibleType = z.infer<typeof UnitResponsibleTypeEnum>;
export type AssignedProjectStatus = z.infer<typeof AssignedProjectStatusEnum>;
