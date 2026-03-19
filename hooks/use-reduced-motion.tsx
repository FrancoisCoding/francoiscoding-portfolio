'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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

export function ReducedMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setReduceMotion(true);
      document.documentElement.classList.add('reduce-motion');
    }
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      if (next) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
      return next;
    });
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
