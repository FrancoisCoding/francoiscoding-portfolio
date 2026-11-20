export const motionPreferenceStorageKey = 'reduce-motion';
export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

export const motionPreferenceScript = `
  (() => {
    let preference;
    try { preference = localStorage.getItem(${JSON.stringify(motionPreferenceStorageKey)}); } catch {}
    const reduce = preference === 'true' ||
      (preference !== 'false' && matchMedia(${JSON.stringify(reducedMotionQuery)}).matches);
    document.documentElement.dataset.motion = reduce ? 'reduce' : 'full';
  })();
`;
