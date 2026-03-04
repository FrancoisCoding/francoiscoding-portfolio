export interface ICalendarDay {
  dateKey: string;
  dayNumber: string;
  isCurrentMonth: boolean;
}

export const calendarWeekdayLabels = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export function getCurrentMonthValue() {
  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  return `${currentDate.getFullYear()}-${month}`;
}

export function shiftMonthValue(monthValue: string, monthOffset: number) {
  const { year, monthIndex } = parseMonthValue(monthValue);
  const nextDate = new Date(Date.UTC(year, monthIndex + monthOffset, 1));
  const nextMonth = String(nextDate.getUTCMonth() + 1).padStart(2, '0');
  return `${nextDate.getUTCFullYear()}-${nextMonth}`;
}

export function buildCalendarDays(monthValue: string) {
  const { year, monthIndex } = parseMonthValue(monthValue);
  const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const lastDayOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0));

  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setUTCDate(
    calendarStart.getUTCDate() - calendarStart.getUTCDay(),
  );

  const calendarEnd = new Date(lastDayOfMonth);
  calendarEnd.setUTCDate(
    calendarEnd.getUTCDate() + (6 - calendarEnd.getUTCDay()),
  );

  const days: ICalendarDay[] = [];

  for (
    const currentDate = new Date(calendarStart);
    currentDate <= calendarEnd;
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
  ) {
    const dayDate = new Date(currentDate);
    days.push({
      dateKey: formatUtcDateKey(dayDate),
      dayNumber: String(dayDate.getUTCDate()),
      isCurrentMonth: dayDate.getUTCMonth() === monthIndex,
    });
  }

  return days;
}

export function formatMonthLabel(monthValue: string, timeZone: string) {
  const { year, monthIndex } = parseMonthValue(monthValue);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone,
  });

  return formatter.format(new Date(Date.UTC(year, monthIndex, 1, 12)));
}

export function formatDateHeading(dateKey: string, timeZone: string) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    timeZone,
  });

  return formatter.format(date).replace(',', '');
}

export function formatDateButtonLabel(dateKey: string, timeZone: string) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  });

  return formatter.format(date);
}

export function formatDateKeyForTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value ?? '0000';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';

  return `${year}-${month}-${day}`;
}

export function formatTimeLabel(
  startTime: string,
  timeZone: string,
  hourCycle: '12h' | '24h',
) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: hourCycle === '12h',
    timeZone,
  })
    .format(new Date(startTime))
    .replace(' AM', 'am')
    .replace(' PM', 'pm');
}

export function getCalendarRange(monthValue: string) {
  const { year, monthIndex } = parseMonthValue(monthValue);
  const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const lastDayOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0));

  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setUTCDate(
    calendarStart.getUTCDate() - calendarStart.getUTCDay(),
  );
  calendarStart.setUTCDate(calendarStart.getUTCDate() - 1);

  const calendarEnd = new Date(lastDayOfMonth);
  calendarEnd.setUTCDate(
    calendarEnd.getUTCDate() + (6 - calendarEnd.getUTCDay()),
  );
  calendarEnd.setUTCDate(calendarEnd.getUTCDate() + 1);
  calendarEnd.setUTCHours(23, 59, 59, 999);

  return {
    start: calendarStart,
    end: calendarEnd,
  };
}

export function splitRangeIntoWeeklyChunks(start: Date, end: Date) {
  const chunks: Array<{ start: Date; end: Date }> = [];
  let currentStart = new Date(start);

  while (currentStart <= end) {
    const currentEnd = new Date(currentStart);
    currentEnd.setUTCDate(currentEnd.getUTCDate() + 6);
    currentEnd.setUTCHours(23, 59, 59, 999);

    if (currentEnd > end) {
      currentEnd.setTime(end.getTime());
    }

    chunks.push({
      start: new Date(currentStart),
      end: new Date(currentEnd),
    });

    currentStart = new Date(currentEnd);
    currentStart.setUTCDate(currentStart.getUTCDate() + 1);
    currentStart.setUTCHours(0, 0, 0, 0);
  }

  return chunks;
}

function parseMonthValue(monthValue: string) {
  const [yearValue, monthValuePart] = monthValue.split('-');
  const year = Number.parseInt(yearValue ?? '', 10);
  const monthIndex = Number.parseInt(monthValuePart ?? '', 10) - 1;

  if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
    throw new Error('Invalid month value.');
  }

  return {
    year,
    monthIndex,
  };
}

function formatUtcDateKey(date: Date) {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
