import { ContactForm } from '@/components/contact/contact-form';
import { ContactMethods } from '@/components/contact/contact-methods';

export default function ContactPage() {
  return (
    <section className="space-y-8 py-16">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
          Contact
        </h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">
          Reach Isaiah directly by email or phone, or send a message using the
          protected form below.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ContactMethods />
        <ContactForm />
      </div>
    </section>
  );
}
