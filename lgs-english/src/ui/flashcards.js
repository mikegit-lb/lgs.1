import { h } from './dom.js';

export function renderFlashcards(words) {
  const root = h('div', { class: 'flashcards' });
  if (!Array.isArray(words) || words.length === 0) {
    root.appendChild(h('p', { class: 'empty' }, 'No words yet.'));
    return root;
  }

  let index = 0;
  let flipped = false;

  const live = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
  const cardBtn = h('button', { class: 'flashcard', type: 'button' });
  const counter = h('span', { class: 'flashcard-counter' });
  const prev = h('button', { class: 'btn btn-secondary', type: 'button', onclick: () => go(-1) }, '‹ Prev');
  const next = h('button', { class: 'btn btn-secondary', type: 'button', onclick: () => go(1) }, 'Next ›');

  function paint(announce) {
    const w = words[index];
    const text = flipped ? w.tr : w.en;
    cardBtn.textContent = '';
    cardBtn.appendChild(h('span', { class: 'flashcard-lang' }, flipped ? 'Türkçe' : 'English'));
    cardBtn.appendChild(h('span', { class: 'flashcard-word' }, text));
    cardBtn.classList.toggle('flipped', flipped);
    cardBtn.setAttribute('aria-label', `${flipped ? 'Türkçe' : 'English'}: ${text}. Press to flip.`);
    counter.textContent = `${index + 1} / ${words.length}`;
    prev.disabled = index === 0;
    next.disabled = index === words.length - 1;
    live.textContent = announce ? `${flipped ? 'Türkçe' : 'English'}: ${text}` : '';
  }

  function go(delta) {
    const n = Math.min(words.length - 1, Math.max(0, index + delta));
    if (n === index) return;
    index = n;
    flipped = false;
    paint(true);
  }

  cardBtn.addEventListener('click', () => {
    flipped = !flipped;
    paint(true);
  });

  root.append(cardBtn, h('div', { class: 'flashcard-controls' }, prev, counter, next), live);
  paint(false);
  return root;
}
