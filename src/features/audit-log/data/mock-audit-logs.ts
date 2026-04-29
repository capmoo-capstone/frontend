import type { AuditLogItem } from '../types';

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: 'audit-001',
    kind: 'PROJECT_HISTORY',
    occurredAt: '2026-04-29T08:45:00.000Z',
    title: 'Project status changed',
    description: 'Project moved from pending assignment to in progress.',
    actor: {
      id: 'user-001',
      name: 'Somchai Jaidee',
    },
    target: {
      id: 'project-001',
      type: 'PROJECT',
      name: 'Medical equipment procurement',
      refNo: '123',
    },
    details: {
      action: 'STATUS_CHANGED',
      oldValue: {
        status: 'PENDING_ASSIGNMENT',
      },
      newValue: {
        status: 'IN_PROGRESS',
      },
      comment: 'Staff accepted the assignment.',
      systemTimestamp: '2026-04-29T08:45:00.000Z',
    },
  },
  {
    id: 'audit-002',
    kind: 'PROJECT_CANCELLATION',
    occurredAt: '2026-04-28T10:30:00.000Z',
    title: 'Project cancellation approved',
    description: 'Head of unit approved the cancellation request.',
    actor: {
      id: 'user-006',
      name: 'Kanya Prasert',
    },
    target: {
      id: 'project-002',
      type: 'PROJECT',
      name: 'Laboratory supplies purchase',
      refNo: '118',
    },
    details: {
      reason: 'Budget was reallocated to another urgent procurement.',
      isActive: false,
      isCancelled: true,
      requestedBy: 'Narin Suttipong',
      requestedAt: '2026-04-27T07:20:00.000Z',
      approvedBy: 'Kanya Prasert',
      approvedAt: '2026-04-28T10:30:00.000Z',
      cancelledAt: '2026-04-28T10:30:00.000Z',
    },
  },
  {
    id: 'audit-003',
    kind: 'PROJECT_HISTORY',
    occurredAt: '2026-04-28T03:15:00.000Z',
    title: 'Project returned for correction',
    description: 'Head returned the project with a correction comment.',
    actor: {
      id: 'user-003',
      name: 'Warin Chaiyo',
    },
    target: {
      id: 'project-003',
      type: 'PROJECT',
      name: 'Annual cleaning service contract',
      refNo: '116',
    },
    details: {
      action: 'RETURNED',
      oldValue: {
        status: 'WAITING_REVIEW',
      },
      newValue: {
        status: 'RETURNED',
      },
      comment: 'Please attach the updated vendor quotation before resubmitting.',
      manualDate: '2026-04-25',
      systemTimestamp: '2026-04-28T03:15:00.000Z',
    },
  },
  {
    id: 'audit-004',
    kind: 'PROJECT_CANCELLATION',
    occurredAt: '2026-04-27T07:20:00.000Z',
    title: 'Project cancellation requested',
    description: 'Staff submitted a cancellation request for approval.',
    actor: {
      id: 'user-004',
      name: 'Narin Suttipong',
    },
    target: {
      id: 'project-002',
      type: 'PROJECT',
      name: 'Laboratory supplies purchase',
      refNo: '118',
    },
    details: {
      reason: 'Budget was reallocated to another urgent procurement.',
      isActive: true,
      isCancelled: false,
      requestedBy: 'Narin Suttipong',
      requestedAt: '2026-04-27T07:20:00.000Z',
      approvedBy: null,
      approvedAt: null,
      cancelledAt: null,
    },
  },
  {
    id: 'audit-005',
    kind: 'USER_DELEGATION',
    occurredAt: '2026-04-26T02:00:00.000Z',
    title: 'User delegation configured',
    description: 'Temporary approval authority was assigned.',
    actor: {
      id: 'user-007',
      name: 'Admin User',
    },
    target: {
      id: 'delegation-001',
      type: 'USER_DELEGATION',
      name: 'Kanya Prasert to Warin Chaiyo',
    },
    details: {
      delegator: 'Kanya Prasert',
      delegatee: 'Warin Chaiyo',
      startDate: '2026-04-26T00:00:00.000Z',
      endDate: '2026-05-03T23:59:59.000Z',
      isActive: true,
      scope: 'Head of unit approval tasks',
    },
  },
  {
    id: 'audit-006',
    kind: 'PROJECT_HISTORY',
    occurredAt: '2026-04-25T04:10:00.000Z',
    title: 'Project owner changed',
    description: 'Responsible staff was changed before assignment acceptance.',
    actor: {
      id: 'user-003',
      name: 'Warin Chaiyo',
    },
    target: {
      id: 'project-004',
      type: 'PROJECT',
      name: 'Patient monitor replacement',
      refNo: '111',
    },
    details: {
      action: 'ASSIGNEE_CHANGED',
      oldValue: {
        assignee: 'Pimchanok Lert',
      },
      newValue: {
        assignee: 'Somchai Jaidee',
      },
      comment: 'Original assignee had not accepted the task.',
    },
  },
  {
    id: 'audit-007',
    kind: 'USER_DELEGATION',
    occurredAt: '2026-04-20T17:00:00.000Z',
    title: 'User delegation expired',
    description: 'Temporary delegation period ended and became inactive.',
    actor: null,
    target: {
      id: 'delegation-002',
      type: 'USER_DELEGATION',
      name: 'Pimchanok Lert to Somchai Jaidee',
    },
    details: {
      delegator: 'Pimchanok Lert',
      delegatee: 'Somchai Jaidee',
      startDate: '2026-04-15T00:00:00.000Z',
      endDate: '2026-04-20T16:59:59.000Z',
      isActive: false,
      closedBy: 'SYSTEM',
    },
  },
  {
    id: 'audit-008',
    kind: 'PROJECT_HISTORY',
    occurredAt: '2026-04-18T06:35:00.000Z',
    title: 'Urgent flag updated',
    description: 'Project was marked urgent with a required completion date.',
    actor: {
      id: 'user-005',
      name: 'Pimchanok Lert',
    },
    target: {
      id: 'project-005',
      type: 'PROJECT',
      name: 'Emergency generator maintenance',
      refNo: '104',
    },
    details: {
      action: 'URGENCY_UPDATED',
      oldValue: {
        urgent: false,
        requiredCompletionDate: null,
      },
      newValue: {
        urgent: true,
        requiredCompletionDate: '2026-04-30',
      },
      comment: 'Vendor lead time requires expedited processing.',
    },
  },
];
