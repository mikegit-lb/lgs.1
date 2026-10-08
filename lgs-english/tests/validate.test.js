import { describe, it, expect } from 'vitest';
import { validateQuestion, validateExam, validatePractice } from '../src/lib/validate.js';

const EXAM_TYPES = ['paragraph', 'visual', 'dialogue', 'vocabulary', 'paragraph', 'visual', 'dialogue', 'vocabulary', 'paragraph', 'visual'];
const PRACTICE_TYPES = [
  ['paragraph', 'visual', 'dialogue'], ['paragraph', 'visual', 'vocabulary'], ['paragraph', 'dialogue', 'vocabulary'],
  ['paragraph', 'visual', 'dialogue'], ['paragraph', 'visual', 'vocabulary'], ['paragraph', 'dialogue', 'vocabulary'],
  ['paragraph', 'visual', 'dialogue'], ['paragraph', 'visual', 'vocabulary'], ['visual', 'dialogue', 'vocabulary'],
  ['visual', 'dialogue', 'vocabulary'],
];

const exhibitFor = (type, tag) => ({
  paragraph: { kind: 'passage', text: `Passage ${tag}` },
  visual: { kind: 'table', caption: `Cap ${tag}`, headers: ['A', 'B'], rows: [['1', '2']] },
  dialogue: { kind: 'dialogue', lines: [{ speaker: 'A', text: 'Hi' }, { speaker: 'B', text: '_____' }] },
  vocabulary: null,
}[type]);

const mk = (id, unit, type) => ({
  id, unit, type, stem: `Stem ${id}`, exhibit: exhibitFor(type, id),
  options: ['a', 'b', 'c', 'd'], answer: 1, explanationTr: 'Açıklama',
});
const exam = () => EXAM_TYPES.map((t, i) => mk(`e${i + 1}`, i + 1, t));
const practice = () => PRACTICE_TYPES.flatMap((ts, u) => ts.map((t, k) => mk(`p${u + 1}-${k}`, u + 1, t)));
const has = (probs, s) => probs.some((p) => p.includes(s));

describe('validateQuestion', () => {
  it('accepts valid questions', () => {
    for (const q of [...exam(), ...practice()]) expect(validateQuestion(q)).toEqual([]);
  });
  const bad = (mut, s) => {
    const q = mk('x', 1, 'paragraph');
    mut(q);
    expect(has(validateQuestion(q), s)).toBe(true);
  };
  it('option count', () => bad((q) => { q.options = ['a', 'b', 'c']; }, 'options must have 4'));
  it('answer range', () => bad((q) => { q.answer = 4; }, 'answer must be'));
  it('answer non-integer', () => bad((q) => { q.answer = 1.5; }, 'answer must be'));
  it('duplicate options', () => bad((q) => { q.options = ['a', 'a', 'c', 'd']; }, 'duplicate option'));
  it('empty explanation', () => bad((q) => { q.explanationTr = '  '; }, 'explanationTr'));
  it('null exhibit on non-vocabulary', () => bad((q) => { q.exhibit = null; }, 'exhibit required'));
  it('dialogue without gap', () => {
    const q = mk('d', 1, 'dialogue');
    q.exhibit.lines[1].text = 'Fine';
    expect(has(validateQuestion(q), 'dialogue gap')).toBe(true);
  });
  it('dialogue gap in stem is ok', () => {
    const q = mk('d', 1, 'dialogue');
    q.exhibit.lines[1].text = 'Fine';
    q.stem = 'Choose: _____';
    expect(validateQuestion(q)).toEqual([]);
  });
  it('dialogue with gap in two lines', () => {
    const q = mk('d', 1, 'dialogue');
    q.exhibit.lines[0].text = '_____';
    expect(has(validateQuestion(q), 'dialogue gap')).toBe(true);
  });
  it('dialogue needs dialogue exhibit', () => {
    const q = mk('d', 1, 'dialogue');
    q.exhibit = { kind: 'passage', text: 'x' };
    expect(has(validateQuestion(q), 'dialogue exhibit')).toBe(true);
  });
  it('barChart bad value', () => {
    for (const v of [-1, NaN, Infinity]) {
      const q = mk('b', 1, 'visual');
      q.exhibit = { kind: 'barChart', title: 't', unitLabel: 'u', bars: [{ label: 'a', value: v }] };
      expect(has(validateQuestion(q), 'barChart value')).toBe(true);
    }
  });
  it('table row length', () => bad((q) => {
    q.exhibit = { kind: 'table', caption: 'c', headers: ['A', 'B'], rows: [['1']] };
  }, 'table row'));
});

describe('validateExam', () => {
  it('accepts valid exam', () => expect(validateExam(exam())).toEqual([]));
  it('count', () => expect(has(validateExam(exam().slice(0, 9)), 'exactly 10')).toBe(true));
  it('unit order', () => {
    const e = exam();
    [e[0], e[1]] = [e[1], e[0]];
    expect(has(validateExam(e), 'unit order')).toBe(true);
  });
  it('type counts', () => {
    const e = exam();
    e[3] = mk('e4', 4, 'paragraph');
    expect(has(validateExam(e), 'type counts')).toBe(true);
  });
  it('reports invalid question', () => {
    const e = exam();
    e[0].options = ['a'];
    expect(has(validateExam(e), 'e1')).toBe(true);
  });
});

describe('validatePractice', () => {
  it('accepts valid bank', () => expect(validatePractice(practice(), exam())).toEqual([]));
  it('count', () => expect(has(validatePractice(practice().slice(1), exam()), 'exactly 30')).toBe(true));
  it('per-unit count', () => {
    const p = practice();
    p[0].unit = 2;
    expect(has(validatePractice(p, exam()), 'unit 1 must have 3')).toBe(true);
  });
  it('distinct types per unit', () => {
    const p = practice();
    p[1] = mk('p1-1', 1, 'paragraph');
    p[2] = mk('p1-2', 1, 'paragraph');
    expect(has(validatePractice(p, exam()), 'unit 1 needs at least 2 distinct')).toBe(true);
  });
  it('type totals', () => {
    const p = practice();
    p[2] = mk('p1-2', 1, 'paragraph'); // unit 1 still has 2 types, totals shift
    expect(has(validatePractice(p, exam()), 'practice type counts')).toBe(true);
  });
  it('duplicate ids', () => {
    const p = practice();
    p[0].id = 'e1';
    expect(has(validatePractice(p, exam()), 'duplicate id')).toBe(true);
  });
  it('stem equal to exam stem', () => {
    const p = practice();
    p[0].stem = exam()[0].stem;
    expect(has(validatePractice(p, exam()), 'repeats exam stem')).toBe(true);
  });
  it('passage equal to exam passage', () => {
    const p = practice();
    p[0].exhibit = { kind: 'passage', text: exam()[0].exhibit.text };
    expect(has(validatePractice(p, exam()), 'repeats exam passage')).toBe(true);
  });
});
