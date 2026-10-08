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

describe('redesign stylesheets', () => {
  const files = ['src/styles.css', 'src/layout.css', 'src/themes.css'].map((f) => [f, readFileSync(f, 'utf8')]);
  it.each(files)('%s is offline-only (no external url/@import) and free of control characters', (_, text) => {
    expect(text).not.toMatch(/@import|url\(\s*['"]?https?:/i);
    expect(/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text)).toBe(false);
  });
  it('reduced motion disables all animation and hides the confetti', () => {
    const themes = files[2][1];
    const block = themes.slice(themes.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(block).toMatch(/animation:\s*none\s*!important/);
    expect(block).toMatch(/transition:\s*none\s*!important/);
    expect(block).toMatch(/\.confetti\s*\{\s*display:\s*none/);
  });
  it('mobile exam timer is a sticky strip, never position:fixed over the options', () => {
    const layout = files[1][1];
    const mobile = layout.slice(layout.indexOf('@media (max-width: 959.98px)'));
    const block = /\.exam-layout > \.timer-pill\s*\{([^}]*)\}/.exec(mobile);
    expect(block).not.toBeNull();
    expect(block[1]).toMatch(/position:\s*sticky/);
    expect(block[1]).toMatch(/top:\s*0/);
    expect(layout).not.toMatch(/timer-pill[^{]*\{[^}]*position:\s*fixed/);
  });
  it('phone header hides chip/home labels visually only (clip, not display:none)', () => {
    const layout = files[1][1];
    const phone = layout.slice(layout.indexOf('@media (max-width: 599.98px)'));
    const rule = /\.chip-label, \.home-label\s*\{([^}]*)\}/.exec(phone);
    expect(rule).not.toBeNull();
    expect(rule[1]).toMatch(/clip/);
    expect(rule[1]).not.toMatch(/display:\s*none/);
    expect(phone).toMatch(/\.home-link\s*\{[^}]*min-width:\s*44px/);
  });
  it('defines a theme for every unit 1..10', () => {
    const themes = files[2][1];
    for (let i = 1; i <= 10; i++) expect(themes).toMatch(new RegExp(`\\[data-unit="${i}"\\]\\s*\\{[^}]*--u-deep`));
  });
});
