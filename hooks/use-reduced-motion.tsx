'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';

import { getMotionPreferenceStore } from '@/lib/motion-preference';

interface IReducedMotionContext {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const ReducedMotionContext = createContext<IReducedMotionContext>({
  reduceMotion: false,
  toggleReduceMotion: () => {},
});

function getSnapshot() {
  return getMotionPreferenceStore().getSnapshot();
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  return getMotionPreferenceStore().subscribe(callback);
}

function toggleReduceMotion() {
  getMotionPreferenceStore().toggle();
}

export function ReducedMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <ReducedMotionContext.Provider value={{ reduceMotion, toggleReduceMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionPreference() {
  return useContext(ReducedMotionContext);
}
