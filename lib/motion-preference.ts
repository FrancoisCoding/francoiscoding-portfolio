const storageKey = 'reduce-motion';
const systemQuery = '(prefers-reduced-motion: reduce)';
const browserStoreKey = '__portfolioMotionPreference';

declare global {
  interface Window {
    [browserStoreKey]?: ReturnType<typeof initializeBrowserMotionPreference>;
  }
}

function initializeBrowserMotionPreference(key: string, query: string) {
  const systemMotion = window.matchMedia(query);
  const listeners = new Set<() => void>();
  let sessionPreference: boolean | undefined;
  let reduceMotion = resolvePreference();

  function resolvePreference() {
    if (sessionPreference !== undefined) return sessionPreference;
    try {
      const savedPreference = window.localStorage.getItem(key);
      if (savedPreference === 'true') return true;
      if (savedPreference === 'false') return false;
    } catch {}
    return systemMotion.matches;
  }

  function applyPreference() {
    document.documentElement.dataset.motion = reduceMotion ? 'reduce' : 'full';
  }

  function updatePreference() {
    const nextPreference = resolvePreference();
    if (nextPreference === reduceMotion) return;
    reduceMotion = nextPreference;
    applyPreference();
    listeners.forEach((listener) => listener());
  }

  function toggle() {
    const nextPreference = !reduceMotion;
    try {
      window.localStorage.setItem(key, String(nextPreference));
      sessionPreference = undefined;
    } catch {
      sessionPreference = nextPreference;
    }
    updatePreference();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key !== key && event.key !== null) return;
    try {
      if (event.storageArea !== window.localStorage) return;
    } catch {
      return;
    }
    updatePreference();
  }

  applyPreference();
  systemMotion.addEventListener('change', updatePreference);
  window.addEventListener('storage', handleStorage);

  return {
    getSnapshot: () => reduceMotion,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    toggle,
  };
}

export const motionPreferenceScript =
  `window.${browserStoreKey} = (${initializeBrowserMotionPreference.toString()})` +
  `(${JSON.stringify(storageKey)}, ${JSON.stringify(systemQuery)});`;

/** Returns the browser's shared motion preference store. */
export function getMotionPreferenceStore() {
  return (window[browserStoreKey] ??= initializeBrowserMotionPreference(
    storageKey,
    systemQuery,
  ));
}
