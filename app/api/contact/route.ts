import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

import { enforceRateLimit } from '@/lib/rate-limit';
import { siteConfig } from '@/lib/site-config';
import { contactSubmissionSchema } from '@/lib/validation/contact';

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ITurnstileVerificationResponse {
  success: boolean;
}

function getRequestIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

async function verifyTurnstile(
  turnstileToken: string,
  remoteIp: string,
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return process.env.NODE_ENV !== 'production';
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', turnstileToken);
  if (remoteIp !== 'unknown') {
    formData.append('remoteip', remoteIp);
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as ITurnstileVerificationResponse;
  return result.success;
}

export async function POST(request: NextRequest) {
  const requestIp = getRequestIp(request);
  const rateLimitResult = enforceRateLimit({
    key: `contact:${requestIp}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error:
          'Too many submissions from this IP. Please wait before trying again.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.retryAfterSeconds) },
      },
    );
  }

  try {
    const body = await request.json();
    const validationResult = contactSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Please review your form values and try again.',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, message, turnstileToken } = validationResult.data;
    const isTurnstileValid = await verifyTurnstile(turnstileToken, requestIp);

    if (!isTurnstileValid) {
      return NextResponse.json(
        {
          error:
            'Spam verification failed. Please complete the challenge again.',
        },
        { status: 400 },
      );
    }

    if (!resendClient) {
      return NextResponse.json({
        success: true,
        message:
          'Message validated successfully, but RESEND_API_KEY is not configured yet.',
      });
    }

    await resendClient.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [siteConfig.email],
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully.',
    });
  } catch {
    return NextResponse.json(
      {
        error:
          'Unable to process your message right now. Please try again later.',
      },
      { status: 500 },
    );
  }
}
