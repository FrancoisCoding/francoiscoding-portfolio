interface ISendThrottleResult {
  allowed: boolean;
  message: string;
}

interface ISendThrottleState {
  dayKey: string;
  dayCount: number;
  lastSentAt: number;
}

const sendThrottleState: ISendThrottleState = {
  dayKey: '',
  dayCount: 0,
  lastSentAt: 0,
};

function getCurrentUtcDayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function enforceSendThrottle() {
  const currentDayKey = getCurrentUtcDayKey();
  const now = Date.now();
  const maxDailySends = Number.parseInt(
    process.env.ADMIN_MAX_SENDS_PER_DAY ?? '10',
    10,
  );

  if (sendThrottleState.dayKey !== currentDayKey) {
    sendThrottleState.dayKey = currentDayKey;
    sendThrottleState.dayCount = 0;
    sendThrottleState.lastSentAt = 0;
  }

  if (sendThrottleState.dayCount >= maxDailySends) {
    return {
      allowed: false,
      message: `Daily send cap reached (${maxDailySends}/day).`,
    } satisfies ISendThrottleResult;
  }

  const elapsedMs = now - sendThrottleState.lastSentAt;
  if (sendThrottleState.lastSentAt && elapsedMs < 60_000) {
    const retrySeconds = Math.ceil((60_000 - elapsedMs) / 1000);
    return {
      allowed: false,
      message: `Per-minute throttle active. Retry in ${retrySeconds}s.`,
    } satisfies ISendThrottleResult;
  }

  sendThrottleState.dayCount += 1;
  sendThrottleState.lastSentAt = now;

  return {
    allowed: true,
    message: 'Allowed',
  } satisfies ISendThrottleResult;
}
