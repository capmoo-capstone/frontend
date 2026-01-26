import { type UnitResponsibleType } from '@/types/project';

export const getResponsibleTypeFormat = (type: UnitResponsibleType) => {
  switch (type) {
    case 'LT100K':
      return 'ซื้อ/จ้าง แบบเจาะจง ไม่เกิน 1 แสน';
    case 'LT500K':
      return 'ซื้อ/จ้าง แบบเจาะจง 1 - 5 แสน';
    case 'MT500K':
      return 'ซื้อ/จ้าง แบบเจาะจง เกิน 5 แสน';
    case 'SELECTION':
      return 'ซื้อ/จ้าง แบบคัดเลือก';
    case 'EBIDDING':
      return 'ซื้อ/จ้าง แบบ e-bidding';
    case 'CONTRACT':
      return 'บริหารสัญญา';
    default:
      return type;
  }
};
