export type AuditLogKind = 'PROJECT_HISTORY' | 'PROJECT_CANCELLATION' | 'USER_DELEGATION';

export type AuditLogKindFilter = AuditLogKind | 'ALL';

export type AuditLogTargetType = 'PROJECT' | 'USER_DELEGATION';

export type AuditLogItem = {
  id: string;
  kind: AuditLogKind;
  occurredAt: string;
  title: string;
  description?: string;
  actor?: {
    id: string;
    name: string;
  } | null;
  target?: {
    id: string;
    type: AuditLogTargetType;
    name: string;
    refNo?: string | null;
  } | null;
  details: Record<string, unknown>;
};

export const AUDIT_LOG_KIND_LABELS: Record<AuditLogKind, string> = {
  PROJECT_HISTORY: 'Project history',
  PROJECT_CANCELLATION: 'Project cancellation',
  USER_DELEGATION: 'User delegation',
};
