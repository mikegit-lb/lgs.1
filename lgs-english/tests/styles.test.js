import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles.css', 'utf8');

function contentFor(selector) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const sels = m[1].split(',').map((s) => s.trim());
    if (!sels.some((s) => s === selector)) continue;
    const c = /content\s*:\s*([^;]+);/.exec(m[2]);
    if (c) out.push(c[1].trim());
  }
  return out;
}

describe('styles.css bytes', () => {
  it('has no control characters', () => {
    expect(/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(css)).toBe(false);
  });
  it.each([
    '.option.correct::after',
    '.option.incorrect::after',
    '.nav-btn.answered::after',
    '.nav-btn.flagged::after',
  ])('%s has a CSS-escape content marker', (sel) => {
    const vals = contentFor(sel);
    expect(vals.length).toBeGreaterThan(0);
    expect(vals.some((v) => /\\[0-9a-f]{3,6}/i.test(v))).toBe(true);
  });
  it('no content value contains U+00B9', () => {
    for (const m of css.matchAll(/content\s*:\s*([^;]+);/g)) expect(m[1]).not.toContain('¹');
  });
});
