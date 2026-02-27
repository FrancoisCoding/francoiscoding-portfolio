'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export function AdminSignOutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    setIsSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
    setIsSubmitting(false);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleSignOut}
      disabled={isSubmitting}
    >
      <LogOut className="size-4" />
      {isSubmitting ? 'Signing Out...' : 'Sign Out'}
    </Button>
  );
}
