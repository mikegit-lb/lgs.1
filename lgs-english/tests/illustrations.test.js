import { describe, it, expect } from 'vitest';
import { unitIllustration, mascot, MOODS } from '../src/ui/illustrations.js';

describe('unitIllustration', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('unit %i returns a decorative, non-empty svg', (id) => {
    const el = unitIllustration(id);
    expect(el.tagName.toLowerCase()).toBe('svg');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.getAttribute('focusable')).toBe('false');
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.getAttribute('viewBox')).toBe('0 0 320 200');
    expect(el.children.length).toBeGreaterThan(4);
    expect(el.querySelector('title, text, script, foreignObject')).toBeNull();
  });
  it('scenes differ per unit and unknown ids fall back to a scene', () => {
    const a = unitIllustration(1).innerHTML;
    const b = unitIllustration(2).innerHTML;
    expect(a).not.toBe(b);
    expect(unitIllustration(99).getAttribute('aria-hidden')).toBe('true');
  });
});

describe('mascot', () => {
  it.each(MOODS)('mood %s renders a decorative svg', (mood) => {
    const el = mascot(mood);
    expect(el.tagName.toLowerCase()).toBe('svg');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.getAttribute('class')).toContain(`mascot-${mood}`);
    expect(el.children.length).toBeGreaterThan(4);
  });
  it('lists the four moods and falls back to happy', () => {
    expect(MOODS).toEqual(['happy', 'cheer', 'think', 'oops']);
    expect(mascot('nope').getAttribute('class')).toContain('mascot-happy');
  });
});
