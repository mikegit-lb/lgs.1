import { h } from './dom.js';
import { UNITS } from '../data/units.js';
import { practiceFor } from '../data/practice.js';
import { createPractice, choose, nextQuestion, practiceScore } from '../lib/practice.js';
import { loadProgress, saveProgress, recordPractice } from '../lib/storage.js';
import { renderQuestion, screenRoot } from './questionView.js';
import { praiseFor, COMFORT, starsFor } from '../lib/gamify.js';
import { mascot } from './illustrations.js';
import { starRow } from './widgets.js';

export function practiceView(ctx, unitId) {
  const u = UNITS.find((x) => x.id === unitId) ?? UNITS[0];
  let state = createPractice(practiceFor(u.id));
  const el = screenRoot('practice');
  el.dataset.unit = String(u.id);

  const homeBtn = () =>
    h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('home') }, 'Ana sayfa');

  function renderQ(focusFeedback) {
    const i = state.current;
    const q = state.questions[i];
    const chosen = state.chosen[i];
    const last = i === state.questions.length - 1;
    el.textContent = '';
    el.dataset.screen = 'practice';
    let feedback = null;
    if (chosen !== null) {
      const ok = chosen === q.answer;
      feedback = h(
        'div',
        { class: `feedback card ${ok ? 'feedback-correct' : 'feedback-incorrect'}`, tabindex: '-1' },
        h('p', { class: 'feedback-verdict' }, ok ? '✓ Doğru!' : '✗ Yanlış.', ' ', h('span', { class: 'cheer' }, ok ? praiseFor(i) : COMFORT)),
        h('p', { class: 'explanation' }, q.explanationTr),
        h(
          'button',
          { type: 'button', class: 'btn btn-primary', onclick: last ? showSummary : next },
          last ? 'Bitir' : 'Sonraki soru',
        ),
      );
    }
    // Element.append() stringifies null, so filter out the absent feedback block.
    const parts = [
      h(
        'div',
        { class: 'practice-head' },
        h('p', { class: 'unit-number' }, `Ünite ${u.id} – ${u.trName}`),
        h('h1', null, `Alıştırma: Soru ${i + 1}/${state.questions.length}`),
        h('div', { class: 'step-dots', 'aria-hidden': 'true' }, state.questions.map((_, k) => h('span', { class: `dot${k < i ? ' done' : k === i ? ' now' : ''}` }))),
      ),
      h('div', { class: 'card question-card', lang: 'en' }, renderQuestion(q, { reveal: chosen === null ? null : { chosen }, onChoose: pick })),
      feedback,
      h('div', { class: 'actions' }, homeBtn()),
    ];
    el.append(...parts.filter(Boolean));
    if (focusFeedback && feedback) feedback.focus();
  }

  function pick(option) {
    const before = state;
    state = choose(state, state.current, option);
    if (state !== before) renderQ(true);
  }
  function next() {
    state = nextQuestion(state);
    renderQ(false);
    el.querySelector('h1')?.focus();
  }
  function showSummary() {
    const s = practiceScore(state);
    saveProgress(recordPractice(loadProgress(ctx.store), u.id, s), ctx.store);
    ctx.refresh?.();
    el.textContent = '';
    el.dataset.screen = 'practice-summary';
    const h1 = h('h1', { tabindex: '-1' }, 'Alıştırma bitti');
    const stars = starsFor(s);
    el.append(
      h(
        'section',
        { class: 'card summary-card' },
        h('div', { class: 'summary-mascot' }, mascot(stars === 3 ? 'cheer' : stars >= 2 ? 'happy' : 'think')),
        h(
          'div',
          null,
          h('p', { class: 'unit-number' }, `Ünite ${u.id} – ${u.trName}`),
          h1,
          h('p', { class: 'score-big' }, `Puanın: ${s.correct}/${s.total}`),
          starRow(stars),
        ),
      ),
      h(
        'div',
        { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-primary', onclick: () => ctx.go('practice', u.id) }, 'Tekrar dene'),
        h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('study', u.id) }, 'Üniteye dön'),
        homeBtn(),
      ),
    );
    h1.focus();
  }

  function onKey(e) {
    if (el.dataset.screen !== 'practice' || state.chosen[state.current] !== null) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
    const k = String(e.key);
    const idx = k.length === 1 ? 'abcd'.indexOf(k.toLowerCase()) : -1;
    if (idx >= 0) {
      e.preventDefault();
      pick(idx);
    }
  }

  renderQ(false);
  document.addEventListener('keydown', onKey);
  return {
    el,
    title: `Alıştırma – ${u.trName}`,
    dispose: () => document.removeEventListener('keydown', onKey),
  };
}
