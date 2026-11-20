'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

import {
  motionPreferenceStorageKey,
  reducedMotionQuery,
} from '@/lib/motion-preference';

const preferenceChangeEvent = 'motion-preference-change';
let sessionPreference: boolean | undefined;

interface IReducedMotionContext {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const ReducedMotionContext = createContext<IReducedMotionContext>({
  reduceMotion: false,
  toggleReduceMotion: () => {},
});

function getSnapshot() {
  if (sessionPreference !== undefined) return sessionPreference;
  try {
    const preference = localStorage.getItem(motionPreferenceStorageKey);
    if (preference === 'true' || preference === 'false')
      return preference === 'true';
  } catch {}
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  const systemMotion = window.matchMedia(reducedMotionQuery);
  systemMotion.addEventListener('change', callback);
  window.addEventListener(preferenceChangeEvent, callback);
  window.addEventListener('storage', callback);
  return () => {
    systemMotion.removeEventListener('change', callback);
    window.removeEventListener(preferenceChangeEvent, callback);
    window.removeEventListener('storage', callback);
  };
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

  useEffect(() => {
    document.documentElement.dataset.motion = getSnapshot() ? 'reduce' : 'full';
  }, [reduceMotion]);

  const toggleReduceMotion = useCallback(() => {
    const next = !getSnapshot();
    try {
      localStorage.setItem(motionPreferenceStorageKey, String(next));
    } catch {
      sessionPreference = next;
    }
    window.dispatchEvent(new Event(preferenceChangeEvent));
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
