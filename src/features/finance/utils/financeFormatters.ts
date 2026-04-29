import type { FinanceExportItem } from '../types';

export const FINANCE_STATUS_FORMATS = {
  NOT_EXPORTED: {
    label: 'รอส่งเบิกการเงิน',
    variant: 'secondary' as const,
  },
  EXPORTED: {
    label: 'ส่งการเงินแล้ว',
    variant: 'info' as const,
  },
  CLOSED: {
    label: 'ปิดโครงการ',
    variant: 'success' as const,
  },
  WAITING_EDIT: {
    label: 'การเงินส่งคืน',
    variant: 'destructive' as const,
  },
};

export const getFinanceStatusFormat = (status: FinanceExportItem['export_status']) =>
  FINANCE_STATUS_FORMATS[status];

export const needsFinanceExportCompletion = (item: FinanceExportItem) =>
  item.project_status === 'IN_PROGRESS' &&
  item.procurement_status === 'COMPLETED' &&
  item.contract_status === 'NOT_EXPORTED';

export const isReadyToCloseProject = (item: FinanceExportItem) =>
  item.export_status === 'EXPORTED' || item.export_status === 'WAITING_EDIT';
