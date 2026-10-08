export const EXAM_SECONDS = 900;

export function formatTime(seconds) {
  const s = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function remainingSeconds(deadlineMs, nowMs) {
  const r = Math.floor((deadlineMs - nowMs) / 1000);
  return Number.isFinite(r) && r > 0 ? r : 0;
}

export function createCountdown({
  deadlineMs,
  now = Date.now,
  onTick = () => {},
  onExpire = () => {},
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
}) {
  let id = null;
  let done = false;
  const stop = () => {
    done = true;
    if (id !== null) {
      clearIntervalFn(id);
      id = null;
    }
  };
  const tick = () => {
    if (done) return;
    const remaining = remainingSeconds(deadlineMs, now());
    if (remaining <= 0) {
      stop();
      onExpire();
      return;
    }
    onTick(remaining);
  };
  id = setIntervalFn(tick, 1000);
  tick();
  return { stop };
}
