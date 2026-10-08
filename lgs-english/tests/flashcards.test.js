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
    btn(el, 'Next').click();
    expect(el.textContent).toContain('2 / 3');
    expect(card(el).textContent).toContain('dog');
    expect(card(el).textContent).not.toContain('köpek');
  });
  it('Prev at 1 stays at 1, disabled; Next at n stays at n, disabled', () => {
    const el = renderFlashcards(WORDS);
    expect(btn(el, 'Prev').disabled).toBe(true);
    btn(el, 'Prev').click();
    expect(el.textContent).toContain('1 / 3');
    btn(el, 'Next').click();
    btn(el, 'Next').click();
    expect(el.textContent).toContain('3 / 3');
    expect(btn(el, 'Next').disabled).toBe(true);
    btn(el, 'Next').click();
    expect(el.textContent).toContain('3 / 3');
    btn(el, 'Prev').click();
    expect(el.textContent).toContain('2 / 3');
    expect(btn(el, 'Next').disabled).toBe(false);
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
});
