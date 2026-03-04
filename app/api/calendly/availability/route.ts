import { NextRequest, NextResponse } from 'next/server';

import { getCalendlyAvailability } from '@/lib/calendly/server';
import { calendlyAvailabilityQuerySchema } from '@/lib/validation/calendly';

export async function GET(request: NextRequest) {
  try {
    const validationResult = calendlyAvailabilityQuerySchema.safeParse({
      month: request.nextUrl.searchParams.get('month') ?? '',
      timezone: request.nextUrl.searchParams.get('timezone') ?? '',
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid Calendly availability request.',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const payload = await getCalendlyAvailability(
      validationResult.data.month,
      validationResult.data.timezone,
    );

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load Calendly availability.',
      },
      { status: 500 },
    );
  }
}
