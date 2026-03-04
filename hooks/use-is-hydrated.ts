'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => {
  return () => {};
};

/** Returns true only after the component has hydrated on the client. */
export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
