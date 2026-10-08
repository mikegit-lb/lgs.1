import { describe, it, expect } from 'vitest';
import { EXAM_QUESTIONS } from '../src/data/examQuestions.js';
import { validateExam } from '../src/lib/validate.js';

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

describe('EXAM_QUESTIONS', () => {
  it('passes validateExam', () => {
    expect(validateExam(EXAM_QUESTIONS)).toEqual([]);
  });

  it('has ids e1..e10', () => {
    expect(EXAM_QUESTIONS.map((q) => q.id)).toEqual(Array.from({ length: 10 }, (_, i) => `e${i + 1}`));
  });

  it('uses each answer letter A-D at least twice', () => {
    for (let k = 0; k < 4; k++) {
      expect(EXAM_QUESTIONS.filter((q) => q.answer === k).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps every passage between 70 and 100 words', () => {
    const passages = EXAM_QUESTIONS.filter((q) => q.exhibit && q.exhibit.kind === 'passage');
    expect(passages.length).toBe(3);
    for (const q of passages) {
      const n = words(q.exhibit.text);
      expect(n, q.id).toBeGreaterThanOrEqual(70);
      expect(n, q.id).toBeLessThanOrEqual(100);
    }
  });

  it('has an explanationTr of at least 40 characters', () => {
    for (const q of EXAM_QUESTIONS) expect(q.explanationTr.length, q.id).toBeGreaterThanOrEqual(40);
  });
});
