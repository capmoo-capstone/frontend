import { format, startOfDay } from 'date-fns';
import { th } from 'date-fns/locale';

// ==================== DATE FORMATTERS ====================

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

  // Validate that the date is valid
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDateThai:', date);
    return '-';
  }

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

type ParseThaiDateOrder = 'dmy' | 'ymd';

export const parseThaiDateString = (
  value: string,
  order: ParseThaiDateOrder = 'dmy',
  separator: '/' | '-' = '/'
): Date | undefined => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;

  const parts = trimmedValue.split(separator);
  if (parts.length !== 3) return undefined;

  const [first, second, third] = parts;
  const numbers = [first, second, third].map((part) => Number(part));
  if (numbers.some((part) => Number.isNaN(part))) return undefined;

  const [dayValue, monthValue, yearValue] =
    order === 'dmy' ? numbers : [numbers[2], numbers[1], numbers[0]];
  const normalizedYear = yearValue > 2400 ? yearValue - 543 : yearValue;

  if (monthValue < 1 || monthValue > 12) return undefined;
  if (dayValue < 1 || dayValue > 31) return undefined;
  if (normalizedYear < 1) return undefined;

  const parsed = new Date(normalizedYear, monthValue - 1, dayValue);
  if (isNaN(parsed.getTime())) return undefined;

  if (
    parsed.getFullYear() !== normalizedYear ||
    parsed.getMonth() !== monthValue - 1 ||
    parsed.getDate() !== dayValue
  ) {
    return undefined;
  }

  return startOfDay(parsed);
};

export const getFiscalYear = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // getMonth is zero-based

  // Fiscal year starts in October, so if month is Oct (10), Nov (11), or Dec (12), we consider it as next fiscal year
  return month >= 10 ? year + 544 : year + 543; // Convert to BE and adjust for fiscal year
};

export const normalizeYearToBE = (value: unknown, fallbackYearBE: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallbackYearBE;
  return parsed < 2400 ? parsed + 543 : parsed;
};
