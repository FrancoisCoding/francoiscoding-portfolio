export default function AdminSettingsPage() {
  return (
    <section className="space-y-2">
      <h1 className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
        Settings
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Configure admin allowlist, send limits, and provider keys in environment
        variables.
      </p>
    </section>
  );
}
