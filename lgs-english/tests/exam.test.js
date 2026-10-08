import { describe, it, expect } from 'vitest';
import { createExam, selectAnswer, goTo, toggleFlag, unansweredCount, submit, score } from '../src/lib/exam.js';
import { EXAM_QUESTIONS } from '../src/data/examQuestions.js';

const snap = (s) => JSON.stringify(s);

describe('exam engine', () => {
  it('creates a fresh state', () => {
    const s = createExam(EXAM_QUESTIONS);
    expect(s.answers).toEqual(Array(10).fill(null));
    expect(s.flagged).toEqual(Array(10).fill(false));
    expect(s.current).toBe(0);
    expect(s.submitted).toBe(false);
    expect(unansweredCount(s)).toBe(10);
  });

  it('selects, replaces, toggles off, without mutating input', () => {
    const s0 = createExam(EXAM_QUESTIONS);
    const before = snap(s0);
    const s1 = selectAnswer(s0, 2, 1);
    expect(snap(s0)).toBe(before);
    expect(s1.answers[2]).toBe(1);
    const s2 = selectAnswer(s1, 2, 3);
    expect(s2.answers[2]).toBe(3);
    expect(s1.answers[2]).toBe(1);
    expect(selectAnswer(s2, 2, 3).answers[2]).toBeNull();
  });

  it('ignores selection after submit', () => {
    const s = submit(selectAnswer(createExam(EXAM_QUESTIONS), 0, 1));
    expect(selectAnswer(s, 0, 2)).toEqual(s);
  });

  it('ignores out-of-range index or option', () => {
    const s = createExam(EXAM_QUESTIONS);
    for (const [i, o] of [[-1, 0], [10, 0], [0, 4], [0, -1], [0, 1.5], [0.5, 1], [NaN, 0], [0, null]]) {
      expect(selectAnswer(s, i, o)).toEqual(s);
    }
    expect(toggleFlag(s, 10)).toEqual(s);
    expect(toggleFlag(s, -1)).toEqual(s);
    expect(goTo(s, NaN)).toEqual(s);
  });

  it('goTo clamps', () => {
    const s = createExam(EXAM_QUESTIONS);
    expect(goTo(s, -3).current).toBe(0);
    expect(goTo(s, 99).current).toBe(9);
    expect(goTo(s, 4).current).toBe(4);
    expect(s.current).toBe(0);
  });

  it('toggleFlag twice returns to false, input untouched', () => {
    const s = createExam(EXAM_QUESTIONS);
    const f = toggleFlag(s, 3);
    expect(f.flagged[3]).toBe(true);
    expect(s.flagged[3]).toBe(false);
    expect(toggleFlag(f, 3).flagged[3]).toBe(false);
  });

  it('unansweredCount after 3 answers is 7', () => {
    let s = createExam(EXAM_QUESTIONS);
    s = selectAnswer(selectAnswer(selectAnswer(s, 0, 0), 1, 1), 2, 2);
    expect(unansweredCount(s)).toBe(7);
  });

  it('score counts only correct keys; null is wrong', () => {
    let s = createExam(EXAM_QUESTIONS);
    expect(score(s)).toBe(0);
    EXAM_QUESTIONS.forEach((q, i) => { s = selectAnswer(s, i, q.answer); });
    expect(score(s)).toBe(10);
    const wrong = selectAnswer(s, 0, (EXAM_QUESTIONS[0].answer + 1) % 4);
    expect(score(wrong)).toBe(9);
    expect(score(selectAnswer(s, 1, EXAM_QUESTIONS[1].answer))).toBe(9); // toggled off -> null
  });

  it('submit is idempotent and pure', () => {
    const s = createExam(EXAM_QUESTIONS);
    const a = submit(s);
    expect(s.submitted).toBe(false);
    expect(a.submitted).toBe(true);
    expect(submit(a)).toEqual(a);
  });

  it('state is JSON-serialisable', () => {
    const s = selectAnswer(createExam(EXAM_QUESTIONS), 1, 2);
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
});
