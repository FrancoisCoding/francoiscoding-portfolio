export interface ICalendarDay {
  dateKey: string;
  dayNumber: string;
  isCurrentMonth: boolean;
}

export interface ICalendlyAvailabilityDay {
  date: string;
  startTimes: string[];
}

const millisecondsPerDay = 86_400_000;

export const calendarWeekdayLabels = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

/** Checks for a four-digit Gregorian year and a month from 01 through 12. */
export function isCalendarMonth(value: string) {
  return /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

/** Checks whether the runtime can format dates in the given booking time zone. */
export function isBookingTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** Converts an offset-bearing timestamp to UTC while retaining its fractional precision. */
export function normalizeBookingSlot(value: string) {
  const slotTimestamp =
    /^(?!0000)\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.(\d+))?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(
      value,
    );

  if (!slotTimestamp) {
    return null;
  }

  const dateKey = value.slice(0, 10);
  const civilDate = new Date(`${dateKey}T00:00:00Z`);
  const instant = new Date(value);

  if (
    !Number.isFinite(civilDate.getTime()) ||
    civilDate.toISOString().slice(0, 10) !== dateKey ||
    !Number.isFinite(instant.getTime()) ||
    instant.getUTCFullYear() < 1 ||
    instant.getUTCFullYear() > 9999
  ) {
    return null;
  }

  // Date converts the offset but truncates precision beyond milliseconds.
  const fractionalRemainder = (slotTimestamp[1] ?? '')
    .slice(3)
    .replace(/0+$/, '');
  return `${instant.toISOString().slice(0, -1)}${fractionalRemainder}Z`;
}

/** Uses the configured zone when valid, then the browser zone, then New York. */
export function resolveBookingTimeZone(
  configuredZone: string,
  browserZone: string,
) {
  return (
    [configuredZone, browserZone].find(isBookingTimeZone) ?? 'America/New_York'
  );
}

/** Returns the current calendar month in the booking time zone. */
export function getCurrentMonthValue(timeZone: string) {
  return createZonedDateKey(timeZone)(new Date()).slice(0, 7);
}

export function shiftMonthValue(monthValue: string, monthOffset: number) {
  const nextDate = parseCivilDate(`${monthValue}-01`);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + monthOffset);
  const nextMonth = formatUtcDateKey(nextDate).slice(0, 7);
  return nextDate.getUTCFullYear() <= 9999 && isCalendarMonth(nextMonth)
    ? nextMonth
    : monthValue;
}

export function buildCalendarDays(monthValue: string) {
  const firstDayOfMonth = parseCivilDate(`${monthValue}-01`);
  const monthIndex = firstDayOfMonth.getUTCMonth();
  const lastDayOfMonth = new Date(firstDayOfMonth);
  lastDayOfMonth.setUTCMonth(monthIndex + 1, 0);

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

export function formatMonthLabel(monthValue: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return formatter.format(parseCivilDate(`${monthValue}-01`));
}

export function formatDateHeading(dateKey: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });

  return formatter.format(parseCivilDate(dateKey)).replace(',', '');
}

export function formatDateButtonLabel(dateKey: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return formatter.format(parseCivilDate(dateKey));
}

function createZonedDateKey(timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  });

  return (date: Date) => {
    const parts = formatter.formatToParts(date);
    const year = parts.find((part) => part.type === 'year')!.value;
    const month = parts.find((part) => part.type === 'month')!.value;
    const day = parts.find((part) => part.type === 'day')!.value;

    return `${year.padStart(4, '0')}-${month}-${day}`;
  };
}

/** Groups distinct UTC instants by their civil dates in the requested month and zone. */
export function groupBookingSlots(
  startTimes: readonly string[],
  monthValue: string,
  timeZone: string,
): ICalendlyAvailabilityDay[] {
  const slotsByDate = new Map<string, Set<string>>();
  const toDateKey = createZonedDateKey(timeZone);

  for (const value of startTimes) {
    const startTime = normalizeBookingSlot(value);

    if (!startTime) {
      continue;
    }

    const dateKey = toDateKey(new Date(startTime));

    if (!dateKey.startsWith(`${monthValue}-`)) {
      continue;
    }

    const dateTimes = slotsByDate.get(dateKey) ?? new Set<string>();
    dateTimes.add(startTime);
    slotsByDate.set(dateKey, dateTimes);
  }

  return Array.from(slotsByDate.entries())
    .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
    .map(([date, dateTimes]) => ({
      date,
      startTimes: Array.from(dateTimes).sort((left, right) =>
        left.slice(0, -1).localeCompare(right.slice(0, -1)),
      ),
    }));
}

/** Resolves a slot instant to its civil date and month in the booking time zone. */
export function getBookingSlotDate(startTime: string, timeZone: string) {
  const dateKey = createZonedDateKey(timeZone)(new Date(startTime));
  return { dateKey, month: dateKey.slice(0, 7) };
}

/** Returns simulated weekday availability grouped by booking date. */
export function buildDemoSlots(month: string, timeZone: string) {
  const toDateKey = createZonedDateKey(timeZone);
  const times = ['15:00:00.000Z', '15:45:00.000Z', '16:45:00.000Z'];
  const demoSlots = buildCalendarDays(month).flatMap(
    ({ dateKey, isCurrentMonth }) => {
      const weekday = parseCivilDate(dateKey).getUTCDay();
      if (!isCurrentMonth || weekday === 0 || weekday === 6) {
        return [];
      }

      return times.map((time) => {
        const instant = new Date(`${dateKey}T${time}`);
        const localDate = toDateKey(instant);
        if (localDate !== dateKey) {
          instant.setUTCDate(
            instant.getUTCDate() + (localDate > dateKey ? -1 : 1),
          );
        }
        return instant.toISOString();
      });
    },
  );

  return groupBookingSlots(demoSlots, month, timeZone);
}

/** Returns the available instants for a date in the displayed calendar month. */
export function getBookableTimes(
  days: readonly ICalendlyAvailabilityDay[],
  month: string,
  dateKey: string,
) {
  if (!dateKey.startsWith(`${month}-`)) {
    return [];
  }

  return days.find((day) => day.date === dateKey)?.startTimes ?? [];
}

export function formatTimeLabel(
  startTime: string,
  timeZone: string,
  hourCycle: '12h' | '24h',
) {
  const fraction = startTime.slice(20, -1);
  const hasFraction = /[1-9]/.test(fraction);
  const showSeconds = hasFraction || startTime.slice(17, 19) !== '00';
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...(showSeconds ? { second: '2-digit' } : {}),
    hourCycle: hourCycle === '12h' ? 'h12' : 'h23',
    timeZone,
  });
  const parts = formatter.formatToParts(new Date(startTime));

  return parts
    .map(({ type, value }) =>
      type === 'second' && hasFraction ? `${value}.${fraction}` : value,
    )
    .join('')
    .replace(
      /\s+([AP])M$/,
      (_, meridiem: string) => `${meridiem.toLowerCase()}m`,
    );
}

export function getCalendarRange(monthValue: string) {
  const firstDayOfMonth = parseCivilDate(`${monthValue}-01`);
  const nextMonth = new Date(firstDayOfMonth);
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);

  // One UTC day of padding on each end covers dates in every booking zone.
  return {
    start: new Date(firstDayOfMonth.getTime() - millisecondsPerDay),
    end: new Date(nextMonth.getTime() + millisecondsPerDay),
  };
}

export function splitRangeIntoWeeklyChunks(start: Date, end: Date) {
  const chunks: Array<{ start: Date; end: Date }> = [];
  let chunkStart = start.getTime();
  const rangeEnd = end.getTime();

  while (chunkStart < rangeEnd) {
    const chunkEnd = Math.min(chunkStart + 7 * millisecondsPerDay, rangeEnd);

    chunks.push({
      start: new Date(chunkStart),
      end: new Date(chunkEnd),
    });

    chunkStart = chunkEnd;
  }

  return chunks;
}

function parseCivilDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

function formatUtcDateKey(date: Date) {
  const year = String(date.getUTCFullYear()).padStart(4, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
