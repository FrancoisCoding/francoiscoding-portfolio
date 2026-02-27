import { AdminShell } from '@/components/admin/admin-shell';
import { requireAdminUser } from '@/lib/auth/admin';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <AdminShell userEmail={user.email ?? 'unknown'}>{children}</AdminShell>
  );
}
