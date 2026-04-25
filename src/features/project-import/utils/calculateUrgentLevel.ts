import { addDays, differenceInCalendarDays, isWeekend, startOfDay } from 'date-fns';

import {
  type ProjectUrgentStatus,
  type UnitResponsibleType,
} from '@/features/projects/types/enums';
import { getThaiHolidays, toDateKey } from '@/lib/thai-holidays';

const isNonWorkingDaySync = (date: Date, holidaysByYear: Map<number, Set<string>>): boolean => {
  if (isWeekend(date)) return true;
  const holidays = holidaysByYear.get(date.getFullYear());
  if (!holidays) return false;
  return holidays.has(toDateKey(date));
};

const addWorkingDaysSync = (
  fromDate: Date,
  workingDays: number,
  holidaysByYear: Map<number, Set<string>>
): Date => {
  if (workingDays <= 0) return fromDate;

  let cursor = startOfDay(fromDate);
  let countedDays = 0;

  while (countedDays < workingDays) {
    cursor = addDays(cursor, 1);
    if (!isNonWorkingDaySync(cursor, holidaysByYear)) {
      countedDays += 1;
    }
  }

  return cursor;
};

const getWorkingDaysDiffSync = (
  deliveryDate: Date,
  holidaysByYear: Map<number, Set<string>>
): number => {
  const today = startOfDay(new Date());
  const target = startOfDay(deliveryDate);
  const calendarDiff = differenceInCalendarDays(target, today);

  if (calendarDiff <= 0) return calendarDiff;

  let workingDays = 0;

  for (let offset = 1; offset <= calendarDiff; offset += 1) {
    const candidate = addDays(today, offset);
    if (!isNonWorkingDaySync(candidate, holidaysByYear)) {
      workingDays += 1;
    }
  }

  return workingDays;
};

export const getDefaultDeliveryDate = async (
  unitResponsibilityType: UnitResponsibleType,
  holidaysByYear?: Map<number, Set<string>>
): Promise<Date> => {
  const baseDate = startOfDay(new Date());

  // Prefetch holidays if not provided
  const holidays = holidaysByYear ?? (await prefetchHolidaysByYear([baseDate]));

  let workingDaysNeeded = 60; // Default

  if (unitResponsibilityType === 'LT100K' || unitResponsibilityType === 'INTERNAL') {
    workingDaysNeeded = 30;
  } else if (
    unitResponsibilityType === 'LT500K' ||
    unitResponsibilityType === 'MT500K' ||
    unitResponsibilityType === 'SELECTION'
  ) {
    workingDaysNeeded = 60;
  } else if (unitResponsibilityType === 'EBIDDING') {
    workingDaysNeeded = 120;
  }

  return addWorkingDaysSync(baseDate, workingDaysNeeded, holidays);
};

export const calculateUrgentLevel = (
  deliveryDate: Date | undefined,
  unitResponsibilityType: UnitResponsibleType,
  holidaysByYear?: Map<number, Set<string>>
): Promise<ProjectUrgentStatus> => {
  if (!deliveryDate || Number.isNaN(deliveryDate.getTime())) return Promise.resolve('NORMAL');

  // Prefetch holidays if not provided (for backward compatibility)
  return (
    holidaysByYear ? Promise.resolve(holidaysByYear) : prefetchHolidaysByYear([deliveryDate])
  ).then((holidays) => {
    const diffDays = getWorkingDaysDiffSync(deliveryDate, holidays);
    if (
      diffDays <= 3 &&
      (unitResponsibilityType === 'LT100K' || unitResponsibilityType === 'LT500K')
    ) {
      return 'SUPER_URGENT';
    }

    if (unitResponsibilityType === 'SELECTION') {
      if (diffDays <= 30) return 'URGENT';
      if (diffDays <= 60) return 'NORMAL';
      return 'NORMAL';
    }

    if (unitResponsibilityType === 'EBIDDING') {
      if (diffDays <= 60) return 'VERY_URGENT';
      if (diffDays <= 90) return 'URGENT';
      return 'NORMAL';
    }

    if (unitResponsibilityType === 'LT100K' || unitResponsibilityType === 'INTERNAL') {
      if (diffDays <= 7) return 'VERY_URGENT';
      if (diffDays <= 15) return 'URGENT';
      return 'NORMAL';
    }

    if (unitResponsibilityType === 'LT500K' || unitResponsibilityType === 'MT500K') {
      if (diffDays <= 15) return 'VERY_URGENT';
      if (diffDays <= 30) return 'URGENT';
      return 'NORMAL';
    }
    return 'NORMAL';
  });
};

export const prefetchHolidaysByYear = async (dates: Date[]): Promise<Map<number, Set<string>>> => {
  const yearsNeeded = new Set(dates.map((d) => d.getFullYear()));
  const results = await Promise.all(Array.from(yearsNeeded).map((year) => getThaiHolidays(year)));

  const holidaysByYear = new Map<number, Set<string>>();
  Array.from(yearsNeeded).forEach((year, idx) => {
    holidaysByYear.set(year, results[idx]);
  });

  return holidaysByYear;
};
