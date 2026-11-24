'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserPlus2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  getBookableTimes,
  getBookingSlotDate,
  getCurrentMonthValue,
  resolveBookingTimeZone,
  shiftMonthValue,
} from '@/lib/calendly/calendar';
import type {
  ICalendlyAvailabilityPayload,
  ICalendlyBookingInput,
  ICalendlyBookingPayload,
} from '@/lib/calendly/server';
import {
  calendlyBookingFormSchema,
  type TCalendlyBookingFormValues,
} from '@/lib/validation/calendly';

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

class BookingRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

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

async function submitCalendlyBooking(payload: ICalendlyBookingInput) {
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
    throw new BookingRequestError(
      errorMessage ?? 'Unable to complete booking.',
      response.status,
    );
  }

  if (!('success' in result)) {
    throw new Error(result.error ?? 'Unable to complete booking.');
  }

  return result.booking;
}

/** Renders availability, booking details, and confirmation on the contact page. */
export function CalendlyPanel() {
  const isHydrated = useIsHydrated();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null,
  );
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [formValues, setFormValues] =
    useState<TCalendlyBookingFormValues>(defaultFormValues);
  const [guestInput, setGuestInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [unavailableStartTimes, setUnavailableStartTimes] = useState(
    () => new Set<string>(),
  );
  const [completedBooking, setCompletedBooking] =
    useState<ICalendlyBookingPayload | null>(null);
  const browserTimeZone = isHydrated
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : '';
  const timeZone = resolveBookingTimeZone(
    configuredCalendlyTimeZone,
    browserTimeZone,
  );
  const monthValue = selectedMonth ?? getCurrentMonthValue(timeZone);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef('calendar');
  const calendarControlRef = useRef<HTMLButtonElement>(null);

  const availabilityQuery = useQuery({
    queryKey: ['calendly-availability', monthValue, timeZone],
    enabled: isHydrated,
    queryFn: async () => fetchCalendlyAvailability(monthValue, timeZone),
  });
  const availabilityData = availabilityQuery.data;
  const availableDays = availabilityData?.days ?? [];
  const getDateTimes = (dateKey: string) =>
    getBookableTimes(availableDays, monthValue, dateKey).filter(
      (startTime) => !unavailableStartTimes.has(startTime),
    );
  const resolvedSelectedDateKey =
    selectedDateKey ??
    availableDays.find(({ date }) => getDateTimes(date).length > 0)?.date ??
    null;
  const selectedDateTimes = resolvedSelectedDateKey
    ? getDateTimes(resolvedSelectedDateKey)
    : [];
  const activeStartTime =
    selectedStartTime && selectedDateTimes.includes(selectedStartTime)
      ? selectedStartTime
      : null;
  const bookingMutation = useMutation({
    mutationFn: async (startTime: string) => {
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
        startTime,
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
    onError: (error: Error, startTime) => {
      setStatusMessage(error.message);

      if (error instanceof BookingRequestError && error.status === 409) {
        setUnavailableStartTimes((previous) =>
          new Set(previous).add(startTime),
        );
        setSelectedStartTime(null);
        void availabilityQuery.refetch();
      }
    },
  });

  const formStartTime = bookingMutation.isPending
    ? bookingMutation.variables
    : activeStartTime;
  const step = completedBooking
    ? 'confirmation'
    : formStartTime
      ? 'form'
      : 'calendar';
  const monthLabel = formatMonthLabel(monthValue);
  const selectedDateHeading = resolvedSelectedDateKey
    ? formatDateHeading(resolvedSelectedDateKey)
    : '';
  const isLoadingAvailability = availabilityQuery.isPending;
  const availabilityMessage = isLoadingAvailability
    ? 'Loading available times.'
    : availabilityQuery.isError && !availabilityData
      ? availabilityQuery.error.message
      : !availableDays.some(({ date }) => getDateTimes(date).length > 0)
        ? `No available times in ${monthLabel}. Try another month.`
        : 'No available times for this day.';

  useEffect(() => {
    if (previousStepRef.current !== step) {
      stepHeadingRef.current?.focus();
      previousStepRef.current = step;
      return;
    }

    const calendarControl = calendarControlRef.current;
    if (
      step === 'calendar' &&
      calendarControl &&
      (document.activeElement === document.body ||
        document.activeElement === calendarControl) &&
      (!calendarControl.isConnected || calendarControl.disabled)
    ) {
      stepHeadingRef.current?.focus();
    }
  }, [availabilityData, step]);

  if (
    selectedStartTime &&
    !activeStartTime &&
    !completedBooking &&
    !bookingMutation.isPending
  ) {
    setSelectedStartTime(null);
    setStatusMessage(
      'That slot is no longer available. Please choose another time.',
    );
  }

  const handleChangeMonth = (monthOffset: number) => {
    setSelectedMonth(shiftMonthValue(monthValue, monthOffset));
    setSelectedDateKey(null);
    setSelectedStartTime(null);
    setStatusMessage('');
  };

  const handleSelectDate = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    setSelectedStartTime(null);
    setCompletedBooking(null);
    setStatusMessage('');
  };

  const handleSelectTime = (startTime: string) => {
    setSelectedMonth(monthValue);
    setSelectedDateKey(resolvedSelectedDateKey);
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

  if (!isHydrated) {
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

  if (completedBooking) {
    const { dateKey } = getBookingSlotDate(
      completedBooking.startTime,
      timeZone,
    );
    return (
      <div className="mx-auto max-w-[26rem] rounded-[2rem] border border-white/10 bg-[#111112] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
        <div className="space-y-3">
          <p className="text-sm text-white/55">Booking confirmed</p>
          <h3
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-3xl font-semibold tracking-tight text-white"
          >
            You&apos;re booked.
          </h3>
          <p className="text-sm leading-6 text-white/68">
            {formatDateButtonLabel(dateKey)} at{' '}
            {formatTimeLabel(completedBooking.startTime, timeZone, timeFormat)}
          </p>
          <p className="text-xs text-white/60">Times shown in {timeZone}</p>
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
              void availabilityQuery.refetch();
            }}
            className="rounded-xl border-white/10 bg-white/8 text-white hover:bg-white/12"
          >
            Book another time
          </Button>
        </div>
      </div>
    );
  }

  if (formStartTime) {
    return (
      <div className="mx-auto max-w-[28rem] rounded-[2rem] border border-white/10 bg-[#111112] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
        <div className="space-y-3">
          <p className="text-sm text-white/55">{selectedDateHeading}</p>
          <h3
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-3xl font-semibold tracking-tight text-white"
          >
            {formatTimeLabel(formStartTime, timeZone, timeFormat)}
          </h3>
          <p className="text-sm text-white/58">
            {availabilityData?.eventLabel}
          </p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (activeStartTime && !bookingMutation.isPending) {
              bookingMutation.mutate(activeStartTime);
            }
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
            <p className="text-sm text-rose-300" role="alert">
              {statusMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              disabled={bookingMutation.isPending}
              onClick={() => {
                setSelectedStartTime(null);
                setStatusMessage('');
              }}
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
      <div
        className="grid lg:grid-cols-[1.18fr_0.82fr]"
        onFocusCapture={({ target }) => {
          calendarControlRef.current =
            target instanceof HTMLButtonElement ? target : null;
        }}
        onBlurCapture={({ currentTarget, relatedTarget }) => {
          if (
            relatedTarget &&
            relatedTarget !== document.body &&
            !currentTarget.contains(relatedTarget)
          ) {
            calendarControlRef.current = null;
          }
        }}
      >
        <div className="border-b border-white/8 p-5 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.9rem] font-semibold tracking-tight text-white">
              {monthLabel}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleChangeMonth(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/58 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                aria-label="View previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleChangeMonth(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/58 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                aria-label="View next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5 sm:mt-6 sm:gap-2">
            {calendarWeekdayLabels.map((day) => (
              <span
                key={day}
                className="px-0 py-1.5 text-center text-[0.67rem] font-semibold tracking-[0.1em] text-white/48 uppercase sm:px-2 sm:py-2 sm:text-xs sm:tracking-[0.12em]"
              >
                {day}
              </span>
            ))}

            {buildCalendarDays(monthValue).map((day) => {
              const isDateSelectable = getDateTimes(day.dateKey).length > 0;
              const isSelected = resolvedSelectedDateKey === day.dateKey;

              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => handleSelectDate(day.dateKey)}
                  disabled={!isDateSelectable}
                  aria-label={formatDateButtonLabel(day.dateKey)}
                  aria-pressed={isSelected}
                  className={[
                    'relative inline-flex h-10 w-full items-center justify-center rounded-2xl border text-[0.92rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none sm:h-12 sm:text-sm',
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
                      className="absolute bottom-1.5 h-1 w-1 rounded-full bg-white/42 sm:bottom-2"
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
              <h3
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-2xl font-semibold tracking-tight text-white"
              >
                {selectedDateHeading || 'Select a day'}
              </h3>
              <p className="mt-1 text-sm text-white/48">
                {availabilityData?.eventLabel}
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
            {statusMessage ? (
              <p className="text-sm text-rose-300" role="alert">
                {statusMessage}
              </p>
            ) : null}
            <div
              role="status"
              className={
                selectedDateTimes.length > 0
                  ? 'sr-only'
                  : 'rounded-2xl border border-white/8 bg-white/5 px-4 py-5 text-sm text-white/58'
              }
            >
              {selectedDateTimes.length > 0 && resolvedSelectedDateKey
                ? `${selectedDateTimes.length} available ${selectedDateTimes.length === 1 ? 'time' : 'times'} on ${formatDateButtonLabel(resolvedSelectedDateKey)}.`
                : availabilityMessage}
            </div>
            <div className="space-y-3 empty:hidden" aria-live="polite">
              {selectedDateTimes.map((startTime) => (
                <button
                  key={startTime}
                  type="button"
                  onClick={() => handleSelectTime(startTime)}
                  className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/8 bg-transparent text-sm font-medium text-white transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  {formatTimeLabel(startTime, timeZone, timeFormat)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
