import { describe, it, expect } from 'vitest';
import { renderFlashcards } from '../src/ui/flashcards.js';

const WORDS = [{ en: 'cat', tr: 'kedi' }, { en: 'dog', tr: 'köpek' }, { en: 'bird', tr: 'kuş' }];
const q = (el, s) => el.querySelector(s);
const card = (el) => q(el, '.flashcard');
const btn = (el, t) => [...el.querySelectorAll('button')].find((b) => b.textContent.trim().includes(t));

describe('renderFlashcards', () => {
  it('starts at 1 / n showing EN', () => {
    const el = renderFlashcards(WORDS);
    expect(el.textContent).toContain('1 / 3');
    expect(card(el).textContent).toContain('cat');
    expect(card(el).textContent).not.toContain('kedi');
  });
  it('click flips to TR and back', () => {
    const el = renderFlashcards(WORDS);
    card(el).click();
    expect(card(el).textContent).toContain('kedi');
    card(el).click();
    expect(card(el).textContent).toContain('cat');
  });
  it('card is a native button; live region announces', () => {
    const el = renderFlashcards(WORDS);
    expect(card(el).tagName).toBe('BUTTON');
    const live = q(el, '[aria-live]');
    card(el).click();
    expect(live.textContent).toContain('kedi');
  });
  it('Next advances, counter updates, flip resets', () => {
    const el = renderFlashcards(WORDS);
    card(el).click();
    btn(el, 'Sonraki').click();
    expect(el.textContent).toContain('2 / 3');
    expect(card(el).textContent).toContain('dog');
    expect(card(el).textContent).not.toContain('köpek');
  });
  it('Prev at 1 stays at 1, disabled; Next at n stays at n, disabled', () => {
    const el = renderFlashcards(WORDS);
    expect(btn(el, 'Önceki').disabled).toBe(true);
    btn(el, 'Önceki').click();
    expect(el.textContent).toContain('1 / 3');
    btn(el, 'Sonraki').click();
    btn(el, 'Sonraki').click();
    expect(el.textContent).toContain('3 / 3');
    expect(btn(el, 'Sonraki').disabled).toBe(true);
    btn(el, 'Sonraki').click();
    expect(el.textContent).toContain('3 / 3');
    btn(el, 'Önceki').click();
    expect(el.textContent).toContain('2 / 3');
    expect(btn(el, 'Sonraki').disabled).toBe(false);
  });
  it('UI chrome is Turkish', () => {
    const el = renderFlashcards(WORDS);
    expect(el.textContent).toContain('İngilizce');
    expect(el.textContent).not.toMatch(/English|Prev|Next/);
    expect(card(el).getAttribute('aria-label')).toContain('Kartı çevir');
    expect(btn(el, 'Önceki').getAttribute('aria-label')).toBe('Önceki kart');
    expect(btn(el, 'Sonraki').getAttribute('aria-label')).toBe('Sonraki kart');
    card(el).click();
    expect(card(el).textContent).toContain('Türkçe');
  });
  it('words render as text only', () => {
    const el = renderFlashcards([{ en: '<img src=x onerror=alert(1)>', tr: '<b>x</b>' }]);
    expect(el.querySelector('img')).toBeNull();
    card(el).click();
    expect(el.querySelector('b')).toBeNull();
    expect(card(el).textContent).toContain('<b>x</b>');
  });
  it('empty list is harmless', () => {
    const el = renderFlashcards([]);
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.querySelector('.flashcard')).toBeNull();
  });
  it('script/b payload renders as text', () => {
    const el = renderFlashcards([{ en: '<script>1</script><b>x</b>', tr: 't' }]);
    expect(el.querySelector('script')).toBeNull();
    expect(el.querySelector('b')).toBeNull();
  });
  it('focus moves to card when focused button becomes disabled', () => {
    const el = renderFlashcards(WORDS);
    document.body.appendChild(el);
    btn(el, 'Sonraki').click();
    btn(el, 'Sonraki').focus();
    btn(el, 'Sonraki').click();
    expect(document.activeElement).toBe(card(el));
    el.remove();
  });
});
