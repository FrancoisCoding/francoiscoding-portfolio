import { NextRequest, NextResponse } from 'next/server';

import { getBookableTimes, getBookingSlotDate } from '@/lib/calendly/calendar';
import {
  getCalendlyAvailability,
  bookCalendlyInvitee,
  CalendlySlotConflict,
} from '@/lib/calendly/server';
import { enforceRateLimit } from '@/lib/rate-limit';
import { calendlyBookingSubmissionSchema } from '@/lib/validation/calendly';

function getRequestIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  const requestIp = getRequestIp(request);
  const rateLimitResult = enforceRateLimit({
    key: `calendly:${requestIp}`,
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Too many booking attempts. Please wait before trying again.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.retryAfterSeconds) },
      },
    );
  }

  try {
    const body = await request.json();
    const validationResult = calendlyBookingSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Please review the booking form values and try again.',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { startTime, timezone } = validationResult.data;
    const { dateKey, month } = getBookingSlotDate(startTime, timezone);
    const { days } = await getCalendlyAvailability(month, timezone);

    if (!getBookableTimes(days, month, dateKey).includes(startTime)) {
      throw new CalendlySlotConflict();
    }

    const payload = await bookCalendlyInvitee({
      ...validationResult.data,
      timeZone: timezone,
    });

    return NextResponse.json({
      success: true,
      booking: payload,
    });
  } catch (error) {
    if (error instanceof CalendlySlotConflict) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to complete booking.',
      },
      { status: 500 },
    );
  }
}
