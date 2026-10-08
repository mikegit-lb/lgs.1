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

describe('exhibit kinds and malformed input', () => {
  it('accepts valid barChart (with a zero bar) and poster', () => {
    const b = mk('b', 1, 'visual');
    b.exhibit = { kind: 'barChart', title: 't', unitLabel: 'u', bars: [{ label: 'a', value: 0 }, { label: 'b', value: 3.5 }] };
    const po = mk('po', 1, 'visual');
    po.exhibit = { kind: 'poster', heading: 'h', lines: ['x', 'y'] };
    expect(validateQuestion(b)).toEqual([]);
    expect(validateQuestion(po)).toEqual([]);
  });
  it('rejects gap in a line AND in the stem', () => {
    const q = mk('d', 1, 'dialogue');
    q.stem = 'Fill _____';
    expect(has(validateQuestion(q), 'dialogue gap')).toBe(true);
  });
  const nonEmpty = (f) => { let r; expect(() => { r = f(); }).not.toThrow(); expect(r.length).toBeGreaterThan(0); };
  const dlg = (ex) => { const q = mk('d', 1, 'dialogue'); q.exhibit = ex; return q; };
  const vis = (ex) => { const q = mk('v', 1, 'visual'); q.exhibit = ex; return q; };
  it('validateQuestion never throws', () => {
    for (const q of [null, undefined, 5,
      dlg({ kind: 'dialogue' }), dlg({ kind: 'dialogue', lines: [null] }), dlg({ kind: 'dialogue', lines: [{ speaker: 'A' }] }),
      vis({ kind: 'barChart', title: 't', unitLabel: 'u' }), vis({ kind: 'barChart', bars: [null] }),
      vis({ kind: 'table', caption: 'c', rows: [] }), vis({ kind: 'table', headers: ['A'] }), vis({ kind: 'table', headers: ['A'], rows: [null] }),
      { ...mk('x', 1, 'paragraph'), options: null }]) nonEmpty(() => validateQuestion(q));
  });
  it('validateExam never throws', () => {
    for (const e of [null, undefined, 'x', [null], [...exam().slice(0, 9), null]]) nonEmpty(() => validateExam(e));
  });
  it('validatePractice never throws', () => {
    nonEmpty(() => validatePractice(null, exam()));
    nonEmpty(() => validatePractice(practice(), undefined));
    nonEmpty(() => validatePractice(practice(), 'x'));
    nonEmpty(() => validatePractice([null, ...practice().slice(1)], exam()));
    nonEmpty(() => validatePractice(practice(), [null, ...exam().slice(1)]).concat(['x']));
  });
  it('exam duplicate ids', () => {
    const e = exam();
    e[1].id = 'e1';
    expect(has(validateExam(e), 'duplicate id')).toBe(true);
  });
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
