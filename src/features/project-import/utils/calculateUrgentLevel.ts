import { addDays, differenceInCalendarDays, isWeekend, startOfDay } from 'date-fns';
import Holidays from 'date-holidays';

import {
  type ProjectUrgentStatus,
  type UnitResponsibleType,
} from '@/features/projects/types/enums';

const holidayChecker = new Holidays('TH');

const isNonWorkingDay = (date: Date) => {
  return isWeekend(date) || Boolean(holidayChecker.isHoliday(date));
};

const addWorkingDays = (fromDate: Date, workingDays: number): Date => {
  if (workingDays <= 0) return fromDate;

  let cursor = startOfDay(fromDate);
  let countedDays = 0;

  while (countedDays < workingDays) {
    cursor = addDays(cursor, 1);
    if (!isNonWorkingDay(cursor)) {
      countedDays += 1;
    }
  }

  return cursor;
};

const getWorkingDaysDiff = (deliveryDate: Date): number => {
  const today = startOfDay(new Date());
  const target = startOfDay(deliveryDate);
  const calendarDiff = differenceInCalendarDays(target, today);

  if (calendarDiff <= 0) return calendarDiff;

  let workingDays = 0;

  for (let offset = 1; offset <= calendarDiff; offset += 1) {
    const candidate = addDays(today, offset);
    if (!isNonWorkingDay(candidate)) {
      workingDays += 1;
    }
  }

  return workingDays;
};

export const getDefaultDeliveryDate = (unitResponsibilityType: UnitResponsibleType): Date => {
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
): ProjectUrgentStatus => {
  if (!deliveryDate || Number.isNaN(deliveryDate.getTime())) return 'NORMAL';

  const diffDays = getWorkingDaysDiff(deliveryDate);

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
};
