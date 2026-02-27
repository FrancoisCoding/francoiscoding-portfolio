import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Background, engineering philosophy, and collaboration style for Isaiah Francois.',
  openGraph: {
    title: 'About | Isaiah Francois',
    description:
      'Learn about Isaiah Francois, a Senior Full Stack Engineer focused on scalable delivery.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <section className="py-16">
      <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
        About
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        A complete background summary is in progress and will include role
        focus, leadership, and collaboration style.
      </p>
    </section>
  );
}
