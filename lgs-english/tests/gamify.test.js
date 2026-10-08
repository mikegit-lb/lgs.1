import { describe, it, expect } from 'vitest';
import { starsFor, overallProgress, moodForNet, praiseFor, COMFORT, ringGeometry, timerLevel } from '../src/lib/gamify.js';

describe('starsFor', () => {
  it('maps a best practice score to 0..3 stars', () => {
    expect(starsFor(undefined)).toBe(0);
    expect(starsFor(null)).toBe(0);
    expect(starsFor({ correct: 0, total: 3 })).toBe(0);
    expect(starsFor({ correct: 1, total: 3 })).toBe(1);
    expect(starsFor({ correct: 2, total: 3 })).toBe(2);
    expect(starsFor({ correct: 3, total: 3 })).toBe(3);
    expect(starsFor({ correct: 5, total: 10 })).toBe(2);
  });
  it('is safe on malformed input', () => {
    expect(starsFor({ correct: 9, total: 3 })).toBe(3);
    expect(starsFor({ correct: 1, total: 0 })).toBe(0);
    expect(starsFor({ correct: 'x', total: 3 })).toBe(0);
  });
});

describe('overallProgress', () => {
  it('is zero for empty progress', () => {
    expect(overallProgress({ studied: [], practice: {}, bestExam: null })).toEqual({
      studied: 0, studiedMax: 10, stars: 0, starsMax: 30, percent: 0,
    });
  });
  it('combines studied units and stars equally', () => {
    const p = { studied: [1, 2, 3, 4, 5], practice: { 1: { correct: 3, total: 3 }, 2: { correct: 2, total: 3 } }, bestExam: 4 };
    const o = overallProgress(p);
    expect(o.studied).toBe(5);
    expect(o.stars).toBe(5);
    expect(o.percent).toBe(Math.round(((5 / 10 + 5 / 30) / 2) * 100));
  });
  it('reaches 100 when everything is done', () => {
    const practice = Object.fromEntries([...Array(10)].map((_, i) => [i + 1, { correct: 3, total: 3 }]));
    expect(overallProgress({ studied: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], practice }).percent).toBe(100);
  });
});

describe('moodForNet', () => {
  it('cheers at 7+, is happy at 4..6.99, thinks/oops below', () => {
    expect(moodForNet(10)).toBe('cheer');
    expect(moodForNet(7)).toBe('cheer');
    expect(moodForNet(6.99)).toBe('happy');
    expect(moodForNet(4)).toBe('happy');
    expect(moodForNet(3.99)).toBe('think');
    expect(moodForNet(2)).toBe('think');
    expect(moodForNet(1.99)).toBe('oops');
    expect(moodForNet(-1)).toBe('oops');
  });
});

describe('praiseFor', () => {
  it('varies by index and always cycles through Turkish praise', () => {
    const seen = new Set([0, 1, 2, 3, 4, 5].map(praiseFor));
    expect(seen.size).toBeGreaterThan(2);
    expect(praiseFor(0)).toBe(praiseFor(0));
    expect([...seen].some((p) => p.includes('Harika'))).toBe(true);
    expect(COMFORT).toContain('Olsun');
  });
});

describe('ringGeometry', () => {
  it('computes circumference and dash offset', () => {
    const g = ringGeometry(0.25, 10);
    expect(g.circumference).toBeCloseTo(2 * Math.PI * 10);
    expect(g.offset).toBeCloseTo(g.circumference * 0.75);
    expect(ringGeometry(2, 10).offset).toBe(0);
    expect(ringGeometry(-1, 10).offset).toBeCloseTo(g.circumference);
  });
});

describe('timerLevel', () => {
  it('ok above 5 minutes, warn below, low under 60 s', () => {
    expect(timerLevel(900)).toBe('ok');
    expect(timerLevel(300)).toBe('ok');
    expect(timerLevel(299)).toBe('warn');
    expect(timerLevel(60)).toBe('warn');
    expect(timerLevel(59)).toBe('low');
  });
});
