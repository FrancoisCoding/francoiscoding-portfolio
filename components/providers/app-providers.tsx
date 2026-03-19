'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { useState } from 'react';

import { ReducedMotionProvider } from '@/hooks/use-reduced-motion';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ReducedMotionProvider>{children}</ReducedMotionProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
