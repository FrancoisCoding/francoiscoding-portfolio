'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserPlus2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsHydrated } from '@/hooks/use-is-hydrated';
import {
  buildCalendarDays,
  calendarWeekdayLabels,
  formatDateButtonLabel,
  formatDateHeading,
  formatMonthLabel,
  formatTimeLabel,
  getCurrentMonthValue,
  shiftMonthValue,
} from '@/lib/calendly/calendar';
import {
  calendlyBookingFormSchema,
  type TCalendlyBookingFormValues,
} from '@/lib/validation/calendly';
import { siteConfig } from '@/lib/site-config';

interface ICalendlyAvailabilityDay {
  date: string;
  startTimes: string[];
}

interface ICalendlyAvailabilityPayload {
  days: ICalendlyAvailabilityDay[];
  eventLabel: string;
  source: 'demo' | 'live';
}

interface ICalendlyBookingPayload {
  cancelUrl?: string;
  eventUri?: string;
  rescheduleUrl?: string;
  source: 'demo' | 'live';
  startTime: string;
}

interface ICalendlyBookingResponse {
  booking: ICalendlyBookingPayload;
  success: true;
}

interface ICalendlyBookingErrorResponse {
  error?: string;
  issues?: Record<string, string[] | undefined>;
}

const budgetOptions = ['$1k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'];

const defaultFormValues: TCalendlyBookingFormValues = {
  budgetRange: '',
  email: '',
  guests: [],
  name: '',
  notes: '',
  websiteUrl: '',
};

const configuredCalendlyTimeZone =
  process.env.NEXT_PUBLIC_CALENDLY_TIMEZONE?.trim() || '';
const fallbackCalendlyTimeZone = 'America/New_York';

async function fetchCalendlyAvailability(
  month: string,
  timeZone: string,
): Promise<ICalendlyAvailabilityPayload> {
  const response = await fetch(
    `/api/calendly/availability?month=${encodeURIComponent(month)}&timezone=${encodeURIComponent(timeZone)}`,
    {
      cache: 'no-store',
    },
  );

  const payload = (await response.json()) as ICalendlyAvailabilityPayload & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? 'Unable to load availability.');
  }

  return payload;
}

async function submitCalendlyBooking(payload: {
  budgetRange: string;
  email: string;
  guests: string[];
  name: string;
  notes: string;
  startTime: string;
  timeZone: string;
  websiteUrl: string;
}) {
  const response = await fetch('/api/calendly/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      budgetRange: payload.budgetRange,
      email: payload.email,
      guests: payload.guests,
      name: payload.name,
      notes: payload.notes,
      startTime: payload.startTime,
      timezone: payload.timeZone,
      websiteUrl: payload.websiteUrl,
    }),
  });

  const result = (await response.json()) as
    | ICalendlyBookingResponse
    | ICalendlyBookingErrorResponse;

  if (!response.ok) {
    const errorMessage = 'error' in result ? result.error : undefined;
    throw new Error(errorMessage ?? 'Unable to complete booking.');
  }

  if (!('success' in result)) {
    throw new Error(result.error ?? 'Unable to complete booking.');
  }

  return result.booking;
}

export function CalendlyPanel() {
  const isHydrated = useIsHydrated();
  const [monthValue, setMonthValue] = useState(getCurrentMonthValue);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null,
  );
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [formValues, setFormValues] =
    useState<TCalendlyBookingFormValues>(defaultFormValues);
  const [guestInput, setGuestInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [completedBooking, setCompletedBooking] =
    useState<ICalendlyBookingPayload | null>(null);
  const browserTimeZone = isHydrated
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : '';
  const timeZone =
    configuredCalendlyTimeZone || browserTimeZone || fallbackCalendlyTimeZone;

  const availabilityQuery = useQuery({
    queryKey: ['calendly-availability', monthValue, timeZone],
    enabled: true,
    queryFn: async () => fetchCalendlyAvailability(monthValue, timeZone),
  });

  const availabilityByDate = useMemo(
    () =>
      new Map(
        (availabilityQuery.data?.days ?? []).map((day) => [
          day.date,
          day.startTimes,
        ]),
      ),
    [availabilityQuery.data?.days],
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(monthValue),
    [monthValue],
  );

  const resolvedSelectedDateKey = useMemo(() => {
    const firstAvailableDate = availabilityQuery.data?.days[0]?.date ?? null;

    if (selectedDateKey && availabilityByDate.has(selectedDateKey)) {
      return selectedDateKey;
    }

    return firstAvailableDate;
  }, [availabilityByDate, availabilityQuery.data?.days, selectedDateKey]);

  const selectedDateTimes = resolvedSelectedDateKey
    ? (availabilityByDate.get(resolvedSelectedDateKey) ?? [])
    : [];

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStartTime) {
        throw new Error('Please choose a time first.');
      }

      const parsedGuests = guestInput
        .split(',')
        .map((guest) => guest.trim())
        .filter(Boolean);

      const validationResult = calendlyBookingFormSchema.safeParse({
        ...formValues,
        guests: parsedGuests,
      });

      if (!validationResult.success) {
        const validationMessage = Object.values(
          validationResult.error.flatten().fieldErrors,
        )
          .flat()
          .filter(Boolean)
          .join(' ');

        throw new Error(validationMessage || 'Please review the form.');
      }

      return submitCalendlyBooking({
        ...validationResult.data,
        startTime: selectedStartTime,
        timeZone,
      });
    },
    onMutate: () => {
      setStatusMessage('');
    },
    onSuccess: (payload) => {
      setCompletedBooking(payload);
      setStatusMessage('');
    },
    onError: (error: Error) => {
      setStatusMessage(error.message);
    },
  });

  const monthLabel = timeZone
    ? formatMonthLabel(monthValue, timeZone)
    : monthValue;

  const selectedDateHeading =
    resolvedSelectedDateKey && timeZone
      ? formatDateHeading(resolvedSelectedDateKey, timeZone)
      : '';

  const handleSelectDate = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    setSelectedStartTime(null);
    setCompletedBooking(null);
    setStatusMessage('');
  };

  const handleSelectTime = (startTime: string) => {
    setSelectedStartTime(startTime);
    setCompletedBooking(null);
    setStatusMessage('');
  };

  const handleUpdateFormValue = (
    field: keyof TCalendlyBookingFormValues,
    value: string,
  ) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  if (availabilityQuery.isLoading) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0e] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4 border-b border-white/8 p-5 lg:border-r lg:border-b-0">
            <div className="h-7 w-40 rounded-full bg-white/8" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-2xl border border-white/6 bg-white/5"
                />
              ))}
            </div>
          </div>
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 rounded-2xl border border-white/6 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (availabilityQuery.isError) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-[#0d0d0e] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
        <p className="text-sm text-white/72">
          {availabilityQuery.error instanceof Error
            ? availabilityQuery.error.message
            : 'Unable to load availability right now.'}
        </p>
      </div>
    );
  }

  const availabilityData = availabilityQuery.data;

  if (!availabilityData) {
    return null;
  }

  if (availabilityData.source === 'demo') {
    const calendlyEmbedSource = `${siteConfig.calendlyUrl}?hide_gdpr_banner=1&timezone=${encodeURIComponent(timeZone)}`;

    return (
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0e] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
        <iframe
          title="Calendly scheduling"
          src={calendlyEmbedSource}
          className="h-[760px] w-full"
          loading="lazy"
        />
      </div>
    );
  }

  if (completedBooking) {
    return (
      <div className="mx-auto max-w-[26rem] rounded-[2rem] border border-white/10 bg-[#111112] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
        <div className="space-y-3">
          <p className="text-sm text-white/55">Booking confirmed</p>
          <h3 className="text-3xl font-semibold tracking-tight text-white">
            You&apos;re booked.
          </h3>
          <p className="text-sm leading-6 text-white/68">
            {formatDateHeading(
              completedBooking.startTime.slice(0, 10),
              timeZone,
            )}{' '}
            at{' '}
            {formatTimeLabel(completedBooking.startTime, timeZone, timeFormat)}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {completedBooking.rescheduleUrl ? (
            <a
              href={completedBooking.rescheduleUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              Reschedule
            </a>
          ) : null}
          {completedBooking.cancelUrl ? (
            <a
              href={completedBooking.cancelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              Cancel booking
            </a>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setCompletedBooking(null);
              setSelectedStartTime(null);
            }}
            className="rounded-xl border-white/10 bg-white/8 text-white hover:bg-white/12"
          >
            Book another time
          </Button>
        </div>
      </div>
    );
  }

  if (selectedStartTime) {
    return (
      <div className="mx-auto max-w-[28rem] rounded-[2rem] border border-white/10 bg-[#111112] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
        <div className="space-y-3">
          <p className="text-sm text-white/55">{selectedDateHeading}</p>
          <h3 className="text-3xl font-semibold tracking-tight text-white">
            {formatTimeLabel(selectedStartTime, timeZone, timeFormat)}
          </h3>
          <p className="text-sm text-white/58">{availabilityData.eventLabel}</p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            bookingMutation.mutate();
          }}
        >
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/88"
              htmlFor="booking-name"
            >
              Your name *
            </label>
            <Input
              id="booking-name"
              value={formValues.name}
              onChange={(event) =>
                handleUpdateFormValue('name', event.target.value)
              }
              className="rounded-2xl border-white/12 bg-black/28 text-white placeholder:text-white/34 dark:border-white/12 dark:bg-black/28 dark:text-white dark:placeholder:text-white/34"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/88"
              htmlFor="booking-email"
            >
              Email address *
            </label>
            <Input
              id="booking-email"
              type="email"
              value={formValues.email}
              onChange={(event) =>
                handleUpdateFormValue('email', event.target.value)
              }
              className="rounded-2xl border-white/12 bg-black/28 text-white placeholder:text-white/34 dark:border-white/12 dark:bg-black/28 dark:text-white dark:placeholder:text-white/34"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/88"
              htmlFor="booking-website"
            >
              Website or app link *
            </label>
            <Input
              id="booking-website"
              value={formValues.websiteUrl}
              onChange={(event) =>
                handleUpdateFormValue('websiteUrl', event.target.value)
              }
              className="rounded-2xl border-white/12 bg-black/28 text-white placeholder:text-white/34 dark:border-white/12 dark:bg-black/28 dark:text-white dark:placeholder:text-white/34"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/88"
              htmlFor="booking-budget"
            >
              What budget range are you considering? *
            </label>
            <div className="relative">
              <select
                id="booking-budget"
                value={formValues.budgetRange}
                onChange={(event) =>
                  handleUpdateFormValue('budgetRange', event.target.value)
                }
                className="h-12 w-full appearance-none rounded-2xl border border-white/12 bg-black/28 px-4 pr-10 text-sm text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <option value="">Select</option>
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-white/50"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/88"
              htmlFor="booking-notes"
            >
              Additional notes
            </label>
            <Textarea
              id="booking-notes"
              value={formValues.notes}
              onChange={(event) =>
                handleUpdateFormValue('notes', event.target.value)
              }
              placeholder="Please share anything that will help prepare for our meeting."
              className="min-h-[112px] rounded-2xl border-white/12 bg-black/28 text-white placeholder:text-white/34 dark:border-white/12 dark:bg-black/28 dark:text-white dark:placeholder:text-white/34"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/88"
              htmlFor="booking-guests"
            >
              Add guests
            </label>
            <div className="relative">
              <UserPlus2
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-white/42"
                aria-hidden="true"
              />
              <Input
                id="booking-guests"
                value={guestInput}
                onChange={(event) => setGuestInput(event.target.value)}
                placeholder="comma-separated guest emails"
                className="rounded-2xl border-white/12 bg-black/28 pl-11 text-white placeholder:text-white/34 dark:border-white/12 dark:bg-black/28 dark:text-white dark:placeholder:text-white/34"
              />
            </div>
          </div>

          {statusMessage ? (
            <p
              className="text-sm text-rose-300"
              role="alert"
              aria-live="polite"
            >
              {statusMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelectedStartTime(null)}
              className="rounded-xl px-0 text-white/68 hover:bg-transparent hover:text-white"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={bookingMutation.isPending}
              className="rounded-xl bg-white text-slate-950 hover:bg-slate-200"
            >
              {bookingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0e] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
        <div className="border-b border-white/8 p-5 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.9rem] font-semibold tracking-tight text-white">
              {monthLabel}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMonthValue((previous) => shiftMonthValue(previous, -1));
                  setSelectedDateKey(null);
                  setSelectedStartTime(null);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/58 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                aria-label="View previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMonthValue((previous) => shiftMonthValue(previous, 1));
                  setSelectedDateKey(null);
                  setSelectedStartTime(null);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/58 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                aria-label="View next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {calendarWeekdayLabels.map((day) => (
              <span
                key={day}
                className="px-2 py-2 text-center text-xs font-semibold tracking-[0.12em] text-white/48 uppercase"
              >
                {day}
              </span>
            ))}

            {calendarDays.map((day) => {
              const dayDate = new Date(`${day.dateKey}T12:00:00Z`);
              const dayOfWeek = dayDate.getUTCDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const isDateSelectable = day.isCurrentMonth && !isWeekend;
              const isSelected = resolvedSelectedDateKey === day.dateKey;

              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => handleSelectDate(day.dateKey)}
                  disabled={!isDateSelectable}
                  aria-label={formatDateButtonLabel(day.dateKey, timeZone)}
                  className={[
                    'relative inline-flex aspect-square min-h-12 items-center justify-center rounded-2xl border text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                    isSelected
                      ? 'border-white bg-white text-slate-950'
                      : isDateSelectable
                        ? 'border-white/8 bg-white/5 text-white/78 hover:bg-white/10'
                        : 'border-white/6 bg-white/[0.035] text-white/26',
                    !day.isCurrentMonth ? 'text-white/44' : '',
                  ].join(' ')}
                >
                  <span>{day.dayNumber}</span>
                  {isDateSelectable && !isSelected ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 h-1 w-1 rounded-full bg-white/42"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                {selectedDateHeading || 'Select a day'}
              </h3>
              <p className="mt-1 text-sm text-white/48">
                {availabilityData.eventLabel}
              </p>
              <p className="mt-1 text-xs text-white/40">
                Times shown in {timeZone}
              </p>
            </div>
            <div className="inline-flex rounded-full border border-white/8 bg-white/5 p-1 text-xs text-white/58">
              <button
                type="button"
                onClick={() => setTimeFormat('12h')}
                aria-pressed={timeFormat === '12h'}
                className={[
                  'rounded-full px-3 py-1 font-medium transition-colors',
                  timeFormat === '12h'
                    ? 'bg-white text-slate-950'
                    : 'text-white/58',
                ].join(' ')}
              >
                12h
              </button>
              <button
                type="button"
                onClick={() => setTimeFormat('24h')}
                aria-pressed={timeFormat === '24h'}
                className={[
                  'rounded-full px-3 py-1 font-medium transition-colors',
                  timeFormat === '24h'
                    ? 'bg-white text-slate-950'
                    : 'text-white/58',
                ].join(' ')}
              >
                24h
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {selectedDateTimes.length > 0 ? (
              selectedDateTimes.map((startTime) => (
                <button
                  key={startTime}
                  type="button"
                  onClick={() => handleSelectTime(startTime)}
                  className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/8 bg-transparent text-sm font-medium text-white transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  {formatTimeLabel(startTime, timeZone, timeFormat)}
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-5 text-sm text-white/58">
                No available times for this day.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
