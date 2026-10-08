import { describe, it, expect } from 'vitest';
import { createPractice, choose, nextQuestion, isComplete, practiceScore } from '../src/lib/practice.js';

const qs = [
  { id: 'a', answer: 0 },
  { id: 'b', answer: 1 },
  { id: 'c', answer: 2 },
];

describe('practice engine', () => {
  it('creates fresh state', () => {
    const s = createPractice(qs);
    expect(s.chosen).toEqual([null, null, null]);
    expect(s.current).toBe(0);
    expect(isComplete(s)).toBe(false);
  });

  it('choose records first choice and ignores second; input untouched', () => {
    const s0 = createPractice(qs);
    const s1 = choose(s0, 0, 2);
    expect(s0.chosen[0]).toBeNull();
    expect(s1.chosen[0]).toBe(2);
    expect(choose(s1, 0, 0)).toEqual(s1);
  });

  it('ignores invalid index/option', () => {
    const s = createPractice(qs);
    for (const [i, o] of [[-1, 0], [3, 0], [0, 4], [0, -1], [0, 1.2], [NaN, 0]]) {
      expect(choose(s, i, o)).toEqual(s);
    }
  });

  it('nextQuestion clamps at last', () => {
    let s = createPractice(qs);
    s = nextQuestion(nextQuestion(s));
    expect(s.current).toBe(2);
    expect(nextQuestion(s).current).toBe(2);
  });

  it('isComplete only when all answered', () => {
    let s = createPractice(qs);
    s = choose(s, 0, 0);
    s = choose(s, 1, 3);
    expect(isComplete(s)).toBe(false);
    expect(isComplete(choose(s, 2, 2))).toBe(true);
  });

  it('practiceScore counts correct', () => {
    let s = createPractice(qs);
    s = choose(choose(choose(s, 0, 0), 1, 3), 2, 2);
    expect(practiceScore(s)).toEqual({ correct: 2, total: 3 });
  });
});
