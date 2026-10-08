import { describe, it, expect } from 'vitest';
import { PRACTICE_QUESTIONS, practiceFor } from '../src/data/practice.js';
import { EXAM_QUESTIONS } from '../src/data/examQuestions.js';
import { validatePractice, validateQuestion } from '../src/lib/validate.js';

const passageText = (q) => (q.exhibit && q.exhibit.kind === 'passage' ? q.exhibit.text : null);
const batchA = PRACTICE_QUESTIONS.filter((q) => q.unit >= 1 && q.unit <= 5);

describe('practice bank: batch A (units 1-5)', () => {
  it('has 15 questions that each pass validateQuestion', () => {
    expect(batchA.length).toBe(15);
    for (const q of batchA) expect(validateQuestion(q), q.id).toEqual([]);
  });

  it('uses ids p<unit>-<n> in order p1-1..p5-3', () => {
    const want = [];
    for (let u = 1; u <= 5; u++) for (let n = 1; n <= 3; n++) want.push(`p${u}-${n}`);
    expect(batchA.map((q) => q.id)).toEqual(want);
    for (const q of batchA) expect(q.id.startsWith(`p${q.unit}-`), q.id).toBe(true);
  });

  it('has exactly 3 drills per unit with at least 2 distinct types', () => {
    for (let u = 1; u <= 5; u++) {
      const qs = practiceFor(u);
      expect(qs.length, `unit ${u}`).toBe(3);
      expect(new Set(qs.map((q) => q.type)).size, `unit ${u}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('never repeats an exam stem or passage', () => {
    const stems = new Set(EXAM_QUESTIONS.map((q) => q.stem));
    const passages = new Set(EXAM_QUESTIONS.map(passageText).filter(Boolean));
    for (const q of PRACTICE_QUESTIONS) {
      expect(stems.has(q.stem), q.id).toBe(false);
      const p = passageText(q);
      if (p) expect(passages.has(p), q.id).toBe(false);
    }
  });

  it('has a Turkish explanation of at least 30 characters', () => {
    for (const q of PRACTICE_QUESTIONS) expect(q.explanationTr.trim().length, q.id).toBeGreaterThanOrEqual(30);
  });

  it('practiceFor returns 3 for unit 4 and [] for unknown units', () => {
    expect(practiceFor(4).length).toBe(3);
    expect(practiceFor(11)).toEqual([]);
  });
});

describe('practice bank: full (30)', () => {
  it('passes validatePractice against the exam', () => {
    expect(validatePractice(PRACTICE_QUESTIONS, EXAM_QUESTIONS)).toEqual([]);
  });

  it('covers every dialogue function across dialogue items', () => {
    const text = PRACTICE_QUESTIONS.filter((q) => q.type === 'dialogue')
      .map((q) => [q.stem, ...q.exhibit.lines.map((l) => l.text)].join('\n'))
      .join('\n');
    for (const re of [/invit/i, /accept|love to/i, /sorry|can't/i, /apolog|sorry/i,
      /direction|where is|how (can|do) I get/i, /could you|can you|would you/i]) {
      expect(text, String(re)).toMatch(re);
    }
  });
});
