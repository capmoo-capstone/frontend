import { format } from 'date-fns';
import { th } from 'date-fns/locale';

/**
 * Formats a date to Thai Buddhist Era string.
 * Example: 19 มกราคม 2569
 * @param date - Date object or ISO date string
 * @param formatStr - Optional format string (default: 'd MMMM yyyy')
 */
export const formatDateThai = (
  date: Date | string | undefined | null,
  formatStr: string = 'd MMMM yyyy'
): string => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // 1. Format the date using Thai locale
  // This gives AD year (e.g., 2026)
  const formatted = format(dateObj, formatStr, { locale: th });

  // 2. Convert AD Year (ค.ศ.) to BE Year (พ.ศ.)
  // We look for 4 digits that match the AD year and add 543
  const yearAD = dateObj.getFullYear();
  const yearBE = yearAD + 543;

  return formatted.replace(String(yearAD), String(yearBE));
};

/**
 * Short format Example: 19 ม.ค. 2569
 */
export const formatDateThaiShort = (date: Date | string | undefined | null) => {
  return formatDateThai(date, 'd MMM yyyy');
};
