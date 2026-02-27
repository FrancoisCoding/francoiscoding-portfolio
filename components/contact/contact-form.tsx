'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { Loader2, Send } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  type TContactFormValues,
  contactFormSchema,
} from '@/lib/validation/contact';

const defaultValues: TContactFormValues = {
  name: '',
  email: '',
  message: '',
};

type TFormErrors = Partial<
  Record<keyof TContactFormValues | 'turnstileToken', string>
>;

export function ContactForm() {
  const [formValues, setFormValues] =
    useState<TContactFormValues>(defaultValues);
  const [formErrors, setFormErrors] = useState<TFormErrors>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
  const isCaptchaConfigured = Boolean(turnstileSiteKey);
  const canSubmit =
    isCaptchaConfigured && turnstileToken.length > 0 && !isSubmitting;

  const formValidationResult = useMemo(
    () => contactFormSchema.safeParse(formValues),
    [formValues],
  );

  const updateField = (field: keyof TContactFormValues, value: string) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('');

    const fieldErrors: TFormErrors = {};

    if (!formValidationResult.success) {
      const flattenedErrors = formValidationResult.error.flatten().fieldErrors;
      fieldErrors.name = flattenedErrors.name?.[0];
      fieldErrors.email = flattenedErrors.email?.[0];
      fieldErrors.message = flattenedErrors.message?.[0];
    }

    if (!turnstileToken) {
      fieldErrors.turnstileToken = 'Please complete spam verification.';
    }

    setFormErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          turnstileToken,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatusMessage(payload.error ?? 'Unable to submit your message.');
        return;
      }

      setStatusMessage(payload.message ?? 'Message sent successfully.');
      setFormValues(defaultValues);
      setTurnstileToken('');
      setFormErrors({});
    } catch {
      setStatusMessage(
        'Unable to submit your message right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-white/5"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
        Send a Message
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        All submissions are rate-limited and spam-protected.
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formValues.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Your full name"
            required
            aria-invalid={Boolean(formErrors.name)}
            aria-describedby={formErrors.name ? 'name-error' : undefined}
          />
          {formErrors.name ? (
            <p
              id="name-error"
              className="text-xs text-rose-600 dark:text-rose-300"
            >
              {formErrors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="you@company.com"
            required
            aria-invalid={Boolean(formErrors.email)}
            aria-describedby={formErrors.email ? 'email-error' : undefined}
          />
          {formErrors.email ? (
            <p
              id="email-error"
              className="text-xs text-rose-600 dark:text-rose-300"
            >
              {formErrors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={formValues.message}
            onChange={(event) => updateField('message', event.target.value)}
            placeholder="Share context about the role, project, or collaboration."
            required
            aria-invalid={Boolean(formErrors.message)}
            aria-describedby={formErrors.message ? 'message-error' : undefined}
          />
          {formErrors.message ? (
            <p
              id="message-error"
              className="text-xs text-rose-600 dark:text-rose-300"
            >
              {formErrors.message}
            </p>
          ) : null}
        </div>

        {isCaptchaConfigured ? (
          <div className="space-y-2">
            <Turnstile
              siteKey={turnstileSiteKey}
              options={{ theme: 'auto', size: 'normal' }}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken('')}
            />
            {formErrors.turnstileToken ? (
              <p className="text-xs text-rose-600 dark:text-rose-300">
                {formErrors.turnstileToken}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Turnstile is not configured. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to
            enable form submission.
          </p>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Send Message
            </>
          )}
        </Button>

        {statusMessage ? (
          <p
            className="text-sm text-slate-700 dark:text-slate-200"
            aria-live="polite"
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
