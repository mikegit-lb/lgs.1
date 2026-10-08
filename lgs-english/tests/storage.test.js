import { describe, it, expect } from 'vitest';
import {
  saveSession, loadSession, clearSession, loadProgress, saveProgress,
  markStudied, recordPractice, recordExam,
} from '../src/lib/storage.js';
import { EXAM_QUESTIONS } from '../src/data/examQuestions.js';

const SK = 'lgs-english:lesson1:session';
const PK = 'lgs-english:lesson1:progress';
class Fake {
  constructor() { this.m = new Map(); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
}
const boom = () => { throw new Error('boom'); };
const badGet = { getItem: boom, setItem: boom, removeItem: boom };
const exam = (o = {}) => ({
  questions: EXAM_QUESTIONS.slice(0, 10), answers: Array(10).fill(null), flagged: Array(10).fill(false),
  current: 0, submitted: false, ...o,
});
const DEF = { studied: [], practice: {}, bestExam: null };

describe('session', () => {
  it('round-trips', () => {
    const s = new Fake();
    const sess = { exam: exam({ answers: [0, 1, null, 3, 2, null, null, null, null, 1], current: 4 }), deadlineMs: 5000 };
    saveSession(sess, s);
    expect(loadSession(1000, s)).toEqual(sess);
  });
  it('missing -> null', () => expect(loadSession(0, new Fake())).toBeNull());
  it('corrupt JSON -> null', () => {
    const s = new Fake(); s.setItem(SK, '{nope');
    expect(loadSession(0, s)).toBeNull();
  });
  it('expired -> null and key removed (also at exactly deadline)', () => {
    const s = new Fake();
    saveSession({ exam: exam(), deadlineMs: 5000 }, s);
    expect(loadSession(5000, s)).toBeNull();
    expect(s.getItem(SK)).toBeNull();
  });
  it('far-future deadline -> null and cleared', () => {
    const s = new Fake();
    saveSession({ exam: exam(), deadlineMs: 900 * 1000 + 1 }, s);
    expect(loadSession(0, s)).toBeNull();
    expect(s.getItem(SK)).toBeNull();
    saveSession({ exam: exam(), deadlineMs: 900 * 1000 }, s);
    expect(loadSession(0, s)).not.toBeNull();
  });
  it('submitted -> null and cleared', () => {
    const s = new Fake();
    saveSession({ exam: exam({ submitted: true }), deadlineMs: 5000 }, s);
    expect(loadSession(0, s)).toBeNull();
    expect(s.getItem(SK)).toBeNull();
  });
  it('bad shapes -> null', () => {
    const bad = [
      { exam: exam({ answers: [null] }), deadlineMs: 5000 },
      { exam: exam({ current: 10 }), deadlineMs: 5000 },
      { exam: exam({ current: -1 }), deadlineMs: 5000 },
      { exam: exam({ answers: Array(10).fill(4) }), deadlineMs: 5000 },
      { exam: exam({ answers: Array(10).fill('a') }), deadlineMs: 5000 },
      { exam: exam({ questions: [] }), deadlineMs: 5000 },
      { exam: exam({ questions: EXAM_QUESTIONS.slice(0, 9) }), deadlineMs: 5000 },
      { exam: exam({ flagged: Array(9).fill(false) }), deadlineMs: 5000 },
      { exam: exam({ flagged: Array(10).fill(0) }), deadlineMs: 5000 },
      { exam: exam({ submitted: undefined }), deadlineMs: 5000 },
      { exam: exam({ submitted: 'no' }), deadlineMs: 5000 },
      { exam: exam(), deadlineMs: 'x' },
      { exam: null, deadlineMs: 5000 },
      [], 5, null,
    ];
    for (const b of bad) {
      const s = new Fake(); s.setItem(SK, JSON.stringify(b));
      expect(loadSession(0, s)).toBeNull();
    }
  });
  it('throwing stores never throw', () => {
    expect(loadSession(0, badGet)).toBeNull();
    expect(() => saveSession({ exam: exam(), deadlineMs: 1 }, badGet)).not.toThrow();
    expect(() => clearSession(badGet)).not.toThrow();
    expect(loadProgress(badGet)).toEqual(DEF);
    expect(() => saveProgress(DEF, badGet)).not.toThrow();
  });
  it('null store is a no-op / defaults', () => {
    expect(loadSession(0, null)).toBeNull();
    expect(() => saveSession({ exam: exam(), deadlineMs: 1 }, null)).not.toThrow();
    expect(() => clearSession(null)).not.toThrow();
    expect(loadProgress(null)).toEqual(DEF);
    expect(() => saveProgress(DEF, null)).not.toThrow();
  });
  it('default store access never throws', () => {
    expect(() => loadSession()).not.toThrow();
    expect(() => loadProgress()).not.toThrow();
  });
  it('clearSession removes', () => {
    const s = new Fake();
    saveSession({ exam: exam(), deadlineMs: 5000 }, s);
    clearSession(s);
    expect(s.getItem(SK)).toBeNull();
  });
});

describe('progress', () => {
  it('defaults on missing/corrupt', () => {
    const s = new Fake();
    expect(loadProgress(s)).toEqual(DEF);
    s.setItem(PK, 'zzz');
    expect(loadProgress(s)).toEqual(DEF);
    s.setItem(PK, '5');
    expect(loadProgress(s)).toEqual(DEF);
  });
  it('round-trips', () => {
    const s = new Fake();
    const p = { studied: [1, 3], practice: { 2: { correct: 4, total: 5 } }, bestExam: 7 };
    saveProgress(p, s);
    expect(loadProgress(s)).toEqual(p);
  });
  it('drops out-of-range progress values', () => {
    const s = new Fake();
    for (const b of [11, -1, 2.5]) {
      s.setItem(PK, JSON.stringify({ bestExam: b }));
      expect(loadProgress(s).bestExam).toBeNull();
    }
    s.setItem(PK, JSON.stringify({ bestExam: 0, practice: {
      1: { correct: 6, total: 5 }, 2: { correct: -1, total: 5 }, 3: { correct: 1, total: 0 },
      4: { correct: 1, total: 11 }, 5: { correct: 1.5, total: 5 }, 6: { correct: 0, total: 10 } } }));
    expect(loadProgress(s)).toEqual({ studied: [], practice: { 6: { correct: 0, total: 10 } }, bestExam: 0 });
  });
  it('sanitises', () => {
    const s = new Fake();
    s.setItem(PK, JSON.stringify({
      studied: [1, 1.5, 'a', 0, 11, 3, 3],
      practice: { 1: { correct: 'x', total: 5 }, 2: { correct: 3, total: 5 }, 3: 4 },
      bestExam: 'hi',
    }));
    expect(loadProgress(s)).toEqual({ studied: [1, 3], practice: { 2: { correct: 3, total: 5 } }, bestExam: null });
  });
});

describe('pure helpers', () => {
  it('markStudied dedupes, sorts, rejects, no mutation', () => {
    const p = { ...DEF, studied: [3] };
    const q = markStudied(markStudied(p, 1), 3);
    expect(q.studied).toEqual([1, 3]);
    expect(p.studied).toEqual([3]);
    expect(markStudied(p, 11)).toEqual(p);
    expect(markStudied(p, 0)).toEqual(p);
    expect(markStudied(p, 1.5)).toEqual(p);
  });
  it('recordPractice keeps better', () => {
    const p = recordPractice(DEF, 2, { correct: 3, total: 5 });
    expect(p.practice[2]).toEqual({ correct: 3, total: 5 });
    expect(recordPractice(p, 2, { correct: 2, total: 5 }).practice[2].correct).toBe(3);
    expect(recordPractice(p, 2, { correct: 5, total: 5 }).practice[2].correct).toBe(5);
    expect(DEF.practice).toEqual({});
    expect(recordPractice(DEF, 99, { correct: 1, total: 1 })).toEqual(DEF);
  });
  it('rejects invalid scores', () => {
    for (const sc of [{ correct: NaN, total: 5 }, { correct: 6, total: 5 }, { correct: -1, total: 5 },
      { correct: 1, total: 0 }, { correct: 1.5, total: 5 }, { correct: 1, total: 11 }, null, {}]) {
      expect(recordPractice(DEF, 2, sc)).toBe(DEF);
    }
    for (const c of [NaN, -1, 11, 2.5, '3', undefined, Infinity]) expect(recordExam(DEF, c)).toBe(DEF);
    expect(recordExam(DEF, 0).bestExam).toBe(0);
  });
  it('recordExam keeps best', () => {
    const p = recordExam(DEF, 6);
    expect(p.bestExam).toBe(6);
    expect(recordExam(p, 4).bestExam).toBe(6);
    expect(recordExam(p, 9).bestExam).toBe(9);
    expect(DEF.bestExam).toBeNull();
  });
});
