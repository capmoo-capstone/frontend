import { addDays, differenceInCalendarDays, isWeekend, startOfDay } from 'date-fns';

import {
  type ProjectUrgentStatus,
  type UnitResponsibleType,
} from '@/features/projects/types/enums';
import { getThaiHolidays, toDateKey } from '@/lib/thai-holidays';

const isNonWorkingDay = async (date: Date) => {
  if (isWeekend(date)) return true;
  const holidays = await getThaiHolidays(date.getFullYear());
  return holidays.has(toDateKey(date));
};

const addWorkingDays = async (fromDate: Date, workingDays: number): Promise<Date> => {
  if (workingDays <= 0) return fromDate;

  let cursor = startOfDay(fromDate);
  let countedDays = 0;

  while (countedDays < workingDays) {
    cursor = addDays(cursor, 1);
    if (!(await isNonWorkingDay(cursor))) {
      countedDays += 1;
    }
  }

  return cursor;
};

const getWorkingDaysDiff = async (deliveryDate: Date): Promise<number> => {
  const today = startOfDay(new Date());
  const target = startOfDay(deliveryDate);
  const calendarDiff = differenceInCalendarDays(target, today);

  if (calendarDiff <= 0) return calendarDiff;

  let workingDays = 0;

  for (let offset = 1; offset <= calendarDiff; offset += 1) {
    const candidate = addDays(today, offset);
    if (!(await isNonWorkingDay(candidate))) {
      workingDays += 1;
    }
  }

  return workingDays;
};

export const getDefaultDeliveryDate = async (
  unitResponsibilityType: UnitResponsibleType
): Promise<Date> => {
  const baseDate = startOfDay(new Date());

  if (unitResponsibilityType === 'LT100K' || unitResponsibilityType === 'INTERNAL') {
    return addWorkingDays(baseDate, 30);
  }

  if (
    unitResponsibilityType === 'LT500K' ||
    unitResponsibilityType === 'MT500K' ||
    unitResponsibilityType === 'SELECTION'
  ) {
    return addWorkingDays(baseDate, 60);
  }

  if (unitResponsibilityType === 'EBIDDING') {
    return addWorkingDays(baseDate, 120);
  }

  return addWorkingDays(baseDate, 60);
};

export const calculateUrgentLevel = (
  deliveryDate: Date | undefined,
  unitResponsibilityType: UnitResponsibleType
): Promise<ProjectUrgentStatus> => {
  if (!deliveryDate || Number.isNaN(deliveryDate.getTime())) return Promise.resolve('NORMAL');

  return getWorkingDaysDiff(deliveryDate).then((diffDays) => {
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
