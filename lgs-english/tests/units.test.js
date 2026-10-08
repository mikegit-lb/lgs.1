import { describe, it, expect } from 'vitest';
import { UNITS } from '../src/data/units.js';

const NAMES = [
  'Friendship', 'Teen Life', 'In The Kitchen', 'On The Phone', 'The Internet',
  'Adventures', 'Tourism', 'Chores', 'Science', 'Natural Forces',
];

describe('UNITS catalogue', () => {
  it('has 10 units with exact names and ids 1..10', () => {
    expect(UNITS).toHaveLength(10);
    expect(UNITS.map((u) => u.name)).toEqual(NAMES);
    expect(UNITS.map((u) => u.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  for (const [i, name] of NAMES.entries()) {
    it(`unit ${i + 1} (${name}) satisfies content counts`, () => {
      const u = UNITS[i];
      expect(u.trName).toBeTruthy();
      expect(u.words.length).toBeGreaterThanOrEqual(8);
      expect(u.words.length).toBeLessThanOrEqual(10);
      for (const w of u.words) {
        expect(w.en).toBeTruthy();
        expect(w.tr).toBeTruthy();
      }
      const ens = u.words.map((w) => w.en.toLowerCase());
      expect(new Set(ens).size).toBe(ens.length);
      expect(u.phrases.length).toBeGreaterThanOrEqual(3);
      expect(u.phrases.length).toBeLessThanOrEqual(5);
      expect(u.grammar.title).toBeTruthy();
      expect(u.grammar.points.length).toBeGreaterThanOrEqual(2);
      expect(u.grammar.points.length).toBeLessThanOrEqual(3);
      expect(u.grammar.examples.length).toBeGreaterThanOrEqual(2);
      expect(u.grammar.examples.length).toBeLessThanOrEqual(4);
      expect(['passage', 'dialogue']).toContain(u.model.kind);
      if (u.model.kind === 'passage') expect(u.model.text).toBeTruthy();
      else expect(u.model.lines.length).toBeGreaterThan(0);
      expect(u.tipTr.trim().length).toBeGreaterThan(0);
    });
  }

  it('unit 4 phrases cover inviting/accepting/refusing', () => {
    const p = UNITS[3].phrases;
    expect(p.some((s) => /would you like/i.test(s))).toBe(true);
    expect(p.some((s) => /I'd love to/i.test(s))).toBe(true);
    expect(p.some((s) => /can't/i.test(s))).toBe(true);
  });

  it('unit 1 phrases include an apology', () => {
    expect(UNITS[0].phrases.some((s) => /sorry|apolog/i.test(s))).toBe(true);
  });
});
