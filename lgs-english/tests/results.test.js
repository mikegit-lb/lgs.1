import { describe, it, expect } from 'vitest';
import { createExam, selectAnswer, submit } from '../src/lib/exam.js';
import { summarize } from '../src/lib/results.js';
import { EXAM_QUESTIONS } from '../src/data/examQuestions.js';
import { UNITS } from '../src/data/units.js';

const fill = (picks) =>
  picks.reduce((s, p, i) => (p === null ? s : selectAnswer(s, i, p)), createExam(EXAM_QUESTIONS));
const keys = EXAM_QUESTIONS.map((q) => q.answer);
const wrongOf = (i) => (keys[i] + 1) % 4;
// correct: 0,1,4 | wrong: 2,5,7 | blank: 3,6,8,9
const MIXED = keys.map((k, i) => ([0, 1, 4].includes(i) ? k : [2, 5, 7].includes(i) ? wrongOf(i) : null));

const pattern = (c, w) => keys.map((k, i) => (i < c ? k : i < c + w ? wrongOf(i) : null));

describe('summarize net (3 yanlış 1 doğruyu götürür)', () => {
  it.each([
    [10, 0, 10],
    [7, 0, 7],
    [7, 3, 6],
    [6, 3, 5],
    [0, 10, -3.33],
  ])('%i correct, %i wrong -> net %d', (c, w, net) => {
    const r = summarize(fill(pattern(c, w)));
    expect(r.correct).toBe(c);
    expect(r.wrong).toBe(w);
    expect(r.blank).toBe(10 - c - w);
    expect(r.net).toBe(net);
    expect(r.percent).toBe(c * 10);
  });
});

describe('summarize', () => {
  it('all correct -> 100%, no weak units', () => {
    const r = summarize(fill(keys));
    expect(r).toMatchObject({ correct: 10, wrong: 0, blank: 0, total: 10, percent: 100 });
    expect(r.weakUnits).toEqual([]);
    expect(r.items.every((it) => it.status === 'correct')).toBe(true);
  });

  it('all blank -> 0%, 10 weak units', () => {
    const r = summarize(createExam(EXAM_QUESTIONS));
    expect(r).toMatchObject({ correct: 0, wrong: 0, blank: 10, total: 10, percent: 0 });
    expect(r.weakUnits).toHaveLength(10);
    expect(r.items.every((it) => it.status === 'blank' && it.chosen === null)).toBe(true);
  });

  it('mixed state gives exact counts, byType and item statuses', () => {
    const r = summarize(fill(MIXED));
    expect(r).toMatchObject({ correct: 3, wrong: 3, blank: 4, total: 10, percent: 30 });
    expect(r.byType).toEqual({
      paragraph: { correct: 1, total: 3 },
      visual: { correct: 1, total: 3 },
      dialogue: { correct: 1, total: 2 },
      vocabulary: { correct: 0, total: 2 },
    });
    expect(r.items.map((it) => it.status)).toEqual([
      'correct', 'correct', 'wrong', 'blank', 'correct', 'wrong', 'blank', 'wrong', 'blank', 'blank',
    ]);
    expect(r.items[2]).toMatchObject({ index: 2, unitId: 3, unitName: UNITS[2].name, type: 'vocabulary', chosen: wrongOf(2), answer: keys[2] });
  });

  it('weak units follow question order', () => {
    const r = summarize(fill(MIXED));
    expect(r.weakUnits).toEqual([3, 4, 6, 7, 8, 9, 10].map((id) => ({ unitId: id, unitName: UNITS[id - 1].name })));
  });

  it('correct + wrong + blank === total', () => {
    const r = summarize(fill([0, null, 2, 1, null, 3, 0, null, 1, 2]));
    expect(r.correct + r.wrong + r.blank).toBe(r.total);
  });

  it('submitted and unsubmitted states summarise identically', () => {
    const s = fill(MIXED);
    expect(summarize(submit(s))).toEqual(summarize(s));
  });

  it('does not mutate state', () => {
    const s = fill(MIXED);
    const before = JSON.stringify(s);
    summarize(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});
