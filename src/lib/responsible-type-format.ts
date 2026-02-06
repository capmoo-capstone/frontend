import { type UnitResponsibleType } from '@/types/project';

export const getResponsibleTypeFormat = (type: UnitResponsibleType) => {
  switch (type) {
    case 'LT100K':
      return {
        label: 'ซื้อ/จ้าง แบบเจาะจง ไม่เกิน 1 แสน',
        indicator: 'var(--chart-1-dark)',
        bg: 'var(--chart-1-light)',
      };

    case 'LT500K':
      return {
        label: 'ซื้อ/จ้าง แบบเจาะจง 1 - 5 แสน',
        indicator: 'var(--chart-2-dark)',
        bg: 'var(--chart-2-light)',
      };

    case 'MT500K':
      return {
        label: 'ซื้อ/จ้าง แบบเจาะจง เกิน 5 แสน',
        indicator: 'var(--chart-3-dark)',
        bg: 'var(--chart-3-light)',
      };

    case 'SELECTION':
      return {
        label: 'ซื้อ/จ้าง แบบคัดเลือก',
        indicator: 'var(--chart-4-dark)',
        bg: 'var(--chart-4-light)',
      };

    case 'EBIDDING':
      return {
        label: 'ซื้อ/จ้าง แบบประกาศเชิญชวนทั่วไป',
        indicator: 'var(--chart-5-dark)',
        bg: 'var(--chart-5-light)',
      };
    case 'CONTRACT':
      return {
        label: 'บริหารสัญญา',
        indicator: 'var(--chart-6-dark)',
        bg: 'var(--chart-6-light)',
      };

    default:
      return {
        label: type,
        indicator: 'var(--foreground)',
        bg: 'var(--background)',
      };
  }
};
