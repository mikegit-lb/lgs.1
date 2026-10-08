import { describe, it, expect, vi } from 'vitest';
import { EXAM_SECONDS, formatTime, remainingSeconds, createCountdown } from '../src/lib/timer.js';

describe('formatTime', () => {
  it('formats', () => {
    expect(EXAM_SECONDS).toBe(900);
    expect(formatTime(905)).toBe('15:05');
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(-5)).toBe('00:00');
    expect(formatTime(NaN)).toBe('00:00');
  });
});

describe('remainingSeconds', () => {
  it('floors and clamps', () => {
    expect(remainingSeconds(10000, 0)).toBe(10);
    expect(remainingSeconds(10999, 0)).toBe(10);
    expect(remainingSeconds(1000, 5000)).toBe(0);
  });
});

function fake(deadlineMs, startMs = 0) {
  let t = startMs, cb = null, cleared = false;
  const onTick = vi.fn(), onExpire = vi.fn();
  const cd = createCountdown({
    deadlineMs, now: () => t, onTick, onExpire,
    setIntervalFn: (f) => { cb = f; return 7; },
    clearIntervalFn: (id) => { if (id === 7) cleared = true; },
  });
  return { cd, onTick, onExpire, tick: (ms) => { t += ms; cb(); }, isCleared: () => cleared };
}

describe('createCountdown', () => {
  it('ticks and expires exactly once', () => {
    const f = fake(3000);
    f.tick(1000);
    expect(f.onTick).toHaveBeenLastCalledWith(2);
    f.tick(2000);
    f.tick(1000);
    f.tick(1000);
    expect(f.onExpire).toHaveBeenCalledTimes(1);
    expect(f.isCleared()).toBe(true);
  });
  it('expires immediately if deadline already passed', () => {
    const f = fake(1000, 5000);
    expect(f.onExpire).toHaveBeenCalledTimes(1);
    expect(f.onTick).not.toHaveBeenCalled();
    expect(f.isCleared()).toBe(true);
  });
  it('first immediate tick reports remaining seconds', () => {
    const f = fake(3500);
    expect(f.onTick).toHaveBeenCalledTimes(1);
    expect(f.onTick).toHaveBeenCalledWith(3);
  });
  it('stop twice is safe', () => {
    const f = fake(3000);
    f.cd.stop();
    expect(() => f.cd.stop()).not.toThrow();
  });
  it('stop silences', () => {
    const f = fake(3000);
    f.onTick.mockClear();
    f.cd.stop();
    f.tick(5000);
    expect(f.onExpire).not.toHaveBeenCalled();
    expect(f.onTick).not.toHaveBeenCalled();
  });
});

describe('default store getter', () => {
  it('throwing localStorage getter yields safe behaviour', async () => {
    const { loadSession, loadProgress, saveSession } = await import('../src/lib/storage.js');
    const orig = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('denied'); } });
    try {
      expect(loadSession()).toBeNull();
      expect(loadProgress()).toEqual({ studied: [], practice: {}, bestExam: null });
      expect(() => saveSession({}, undefined)).not.toThrow();
    } finally {
      if (orig) Object.defineProperty(globalThis, 'localStorage', orig); else delete globalThis.localStorage;
    }
  });
});
