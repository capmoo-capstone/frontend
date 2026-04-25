const THAI_HOLIDAY_ICAL_URL =
  'https://calendar.google.com/calendar/ical/th.th%23holiday%40group.v.calendar.google.com/public/basic.ics';

const holidayCache = new Map<number, Promise<Set<string>>>();

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export async function fetchThaiHolidays(year: number): Promise<Set<string>> {
  const res = await fetch(THAI_HOLIDAY_ICAL_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch holidays: ${res.status}`);
  }

  const text = await res.text();

  // Parse DTSTART lines like: DTSTART;VALUE=DATE:20250101
  const dates = new Set<string>();
  const re = /DTSTART(?:;[^:]+)?:(\d{4})(\d{2})(\d{2})/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m[1] === String(year)) {
      dates.add(`${m[1]}-${m[2]}-${m[3]}`);
    }
  }

  return dates;
}

export async function getThaiHolidays(year: number): Promise<Set<string>> {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const request = fetchThaiHolidays(year).catch(() => new Set<string>());
  holidayCache.set(year, request);
  return request;
}
