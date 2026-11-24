import { Resend } from 'resend';

import {
  buildDemoSlots,
  getCalendarRange,
  groupBookingSlots,
  splitRangeIntoWeeklyChunks,
  type ICalendlyAvailabilityDay,
} from '@/lib/calendly/calendar';
import { siteConfig } from '@/lib/site-config';

interface ICalendlyAvailableTimeResource {
  start_time: string;
}

interface ICalendlyAvailabilityApiResponse {
  collection: ICalendlyAvailableTimeResource[];
  pagination?: {
    next_page?: string | null;
    next_page_token?: string | null;
  };
}

interface ICalendlyInviteeApiResponse {
  resource?: {
    cancel_url?: string;
    reschedule_url?: string;
    scheduling_url?: string;
    uri?: string;
  };
}

export interface ICalendlyAvailabilityPayload {
  days: ICalendlyAvailabilityDay[];
  eventLabel: string;
  source: 'demo' | 'live';
}

export interface ICalendlyBookingInput {
  budgetRange: string;
  email: string;
  guests: string[];
  name: string;
  notes: string;
  startTime: string;
  timeZone: string;
  websiteUrl: string;
}

export interface ICalendlyBookingPayload {
  cancelUrl?: string;
  eventUri?: string;
  rescheduleUrl?: string;
  source: 'demo' | 'live';
  startTime: string;
}

const calendlyApiBaseUrl = 'https://api.calendly.com';

export class CalendlySlotConflict extends Error {
  constructor() {
    super('That slot is no longer available. Please choose another time.');
  }
}

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getCalendlyConfiguration() {
  return {
    apiToken: process.env.CALENDLY_API_TOKEN ?? '',
    eventLabel: process.env.CALENDLY_EVENT_LABEL ?? '15 minute intro',
    eventTypeUri: process.env.CALENDLY_EVENT_TYPE_URI ?? '',
  };
}

function hasCalendlyConfiguration() {
  const configuration = getCalendlyConfiguration();
  return Boolean(configuration.apiToken && configuration.eventTypeUri);
}

async function calendlyFetch<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const configuration = getCalendlyConfiguration();

  if (!configuration.apiToken) {
    throw new Error('Missing CALENDLY_API_TOKEN.');
  }

  const response = await fetch(`${calendlyApiBaseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${configuration.apiToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (
      path === '/invitees' &&
      (response.status === 404 || response.status === 409)
    ) {
      throw new CalendlySlotConflict();
    }

    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      title?: string;
    } | null;

    throw new Error(
      payload?.message ?? payload?.title ?? 'Calendly API request failed.',
    );
  }

  return (await response.json()) as TResponse;
}

export async function getCalendlyAvailability(
  month: string,
  timeZone: string,
): Promise<ICalendlyAvailabilityPayload> {
  const configuration = getCalendlyConfiguration();

  if (!hasCalendlyConfiguration()) {
    return {
      days: buildDemoSlots(month, timeZone),
      eventLabel: '15 minute intro',
      source: 'demo',
    };
  }

  const { start, end } = getCalendarRange(month);
  const chunks = splitRangeIntoWeeklyChunks(start, end);
  const startTimes: string[] = [];
  const now = new Date();
  const minimumAllowedStartTime = new Date(now.getTime() + 60_000);

  for (const chunk of chunks) {
    if (chunk.end <= minimumAllowedStartTime) {
      continue;
    }

    const chunkStartTime =
      chunk.start > minimumAllowedStartTime
        ? chunk.start
        : minimumAllowedStartTime;

    if (chunkStartTime >= chunk.end) {
      continue;
    }

    const baseQuery = new URLSearchParams({
      event_type: configuration.eventTypeUri,
      start_time: chunkStartTime.toISOString(),
      end_time: chunk.end.toISOString(),
      timezone: timeZone,
      count: '100',
    });
    let pageToken = '';

    while (true) {
      const query = new URLSearchParams(baseQuery);

      if (pageToken) {
        query.set('page_token', pageToken);
      }

      const payload = await calendlyFetch<ICalendlyAvailabilityApiResponse>(
        `/event_type_available_times?${query.toString()}`,
      );

      for (const item of payload.collection ?? []) {
        startTimes.push(item.start_time);
      }

      const nextPageToken = getCalendlyNextPageToken(payload.pagination);

      if (!nextPageToken) {
        break;
      }

      pageToken = nextPageToken;
    }
  }

  return {
    days: groupBookingSlots(startTimes, month, timeZone),
    eventLabel: configuration.eventLabel,
    source: 'live',
  };
}

export async function bookCalendlyInvitee(
  input: ICalendlyBookingInput,
): Promise<ICalendlyBookingPayload> {
  const configuration = getCalendlyConfiguration();

  if (!hasCalendlyConfiguration()) {
    return {
      source: 'demo',
      startTime: input.startTime,
    };
  }

  const payload = await calendlyFetch<ICalendlyInviteeApiResponse>(
    '/invitees',
    {
      method: 'POST',
      body: JSON.stringify({
        event_type: configuration.eventTypeUri,
        start_time: input.startTime,
        invitee: {
          email: input.email,
          name: input.name,
          timezone: input.timeZone,
        },
        event_guests: input.guests,
      }),
    },
  );

  await sendCalendlyLeadNotification(input);

  return {
    cancelUrl: payload.resource?.cancel_url,
    eventUri: payload.resource?.uri,
    rescheduleUrl: payload.resource?.reschedule_url,
    source: 'live',
    startTime: input.startTime,
  };
}

function getCalendlyNextPageToken(
  pagination: ICalendlyAvailabilityApiResponse['pagination'],
) {
  if (pagination?.next_page_token) {
    return pagination.next_page_token;
  }

  if (!pagination?.next_page) {
    return '';
  }

  try {
    const nextPageUrl = new URL(pagination.next_page);
    return nextPageUrl.searchParams.get('page_token') ?? '';
  } catch {
    return '';
  }
}

async function sendCalendlyLeadNotification(input: ICalendlyBookingInput) {
  if (!resendClient) {
    return;
  }

  const guestsLabel =
    input.guests.length > 0 ? input.guests.join(', ') : 'None';
  const websiteLabel = input.websiteUrl || 'Not provided';
  const notesLabel = input.notes || 'Not provided';

  await resendClient.emails.send({
    from: 'Portfolio Scheduling <onboarding@resend.dev>',
    to: [siteConfig.email],
    replyTo: input.email,
    subject: `Calendly booking request from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Start time: ${input.startTime}`,
      `Time zone: ${input.timeZone}`,
      `Website: ${websiteLabel}`,
      `Budget: ${input.budgetRange}`,
      `Guests: ${guestsLabel}`,
      '',
      `Notes: ${notesLabel}`,
    ].join('\n'),
  });
}
