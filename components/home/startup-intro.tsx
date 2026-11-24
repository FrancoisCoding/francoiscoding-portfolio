import type { CSSProperties } from 'react';

const duration = 1_200;
const entryKey = 'portfolio-startup-intro';

function playStartupIntro(duration: number, entryKey: string) {
  function inheritedEntry(savedEntry: string) {
    try {
      return window.opener?.sessionStorage.getItem(entryKey) === savedEntry;
    } catch {
      return false;
    }
  }

  try {
    const savedEntry = window.sessionStorage.getItem(entryKey);
    if (savedEntry && !inheritedEntry(savedEntry)) return;
    window.sessionStorage.setItem(entryKey, crypto.randomUUID());
  } catch {
    return;
  }

  const [navigation] = performance.getEntriesByType(
    'navigation',
  ) as PerformanceNavigationTiming[];
  const motionPreference = window.__portfolioMotionPreference;
  if (
    window.location.pathname !== '/' ||
    window.location.hash ||
    (navigation && navigation.type !== 'navigate') ||
    !motionPreference ||
    motionPreference.getSnapshot()
  ) {
    return;
  }

  const intro = document.querySelector<HTMLDialogElement>(
    'dialog#startup-intro',
  );
  if (!intro?.showModal) return;
  const dialog = intro;
  const skipButton = dialog.querySelector('button');
  const introContent = dialog.querySelector<HTMLElement>('[tabindex="-1"]');

  if (introContent) introContent.autofocus = true;
  dialog.showModal();
  introContent?.removeAttribute('autofocus');

  const unsubscribe = motionPreference.subscribe(() => {
    if (motionPreference.getSnapshot()) closeIntro();
  });
  const timer = window.setTimeout(closeIntro, duration);

  function closeIntro(restoreFocus = false) {
    if (!dialog.open) return;
    const hadButtonFocus = document.activeElement === skipButton;
    window.clearTimeout(timer);
    window.removeEventListener('pagehide', handlePageHide);
    unsubscribe();
    dialog.close();
    if (restoreFocus || hadButtonFocus) {
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
  }

  function handlePageHide() {
    closeIntro();
  }

  skipButton?.addEventListener('click', () => closeIntro(true));
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeIntro(true);
  });
  window.addEventListener('pagehide', handlePageHide);
}

const startupIntroScript = `(${playStartupIntro.toString()})(${duration}, ${JSON.stringify(entryKey)});`;

/** Provides the optional homepage intro before the rest of the page hydrates. */
export function StartupIntro() {
  return (
    <>
      <dialog
        id="startup-intro"
        className="startup-intro"
        aria-label="Startup intro"
        style={{ '--startup-intro-duration': `${duration}ms` } as CSSProperties}
        suppressHydrationWarning
      >
        <div
          className="flex size-full items-center justify-center outline-none"
          tabIndex={-1}
        >
          <div
            className="grid -translate-y-3 justify-items-center gap-9"
            aria-hidden="true"
          >
            <span className="startup-intro-mark">IF</span>
            <div className="startup-intro-track">
              <span />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] mx-auto min-h-11 w-fit rounded-md px-4 text-sm text-[#b9b9c0] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Skip intro
        </button>
      </dialog>
      <script dangerouslySetInnerHTML={{ __html: startupIntroScript }} />
    </>
  );
}
