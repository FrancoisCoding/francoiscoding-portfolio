'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';

const STORAGE_KEY = 'reduce-motion';

interface IReducedMotionContext {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const ReducedMotionContext = createContext<IReducedMotionContext>({
  reduceMotion: false,
  toggleReduceMotion: () => {},
});

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
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

  // Keep the class in sync with the state
  if (typeof document !== 'undefined') {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }

  const toggleReduceMotion = useCallback(() => {
    const current = localStorage.getItem(STORAGE_KEY) === 'true';
    const next = !current;
    localStorage.setItem(STORAGE_KEY, String(next));
    // Dispatch storage event so useSyncExternalStore picks up the change
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  }, []);

  return (
    <ReducedMotionContext.Provider value={{ reduceMotion, toggleReduceMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionPreference() {
  return useContext(ReducedMotionContext);
}
