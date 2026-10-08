import { h } from './dom.js';
import { EXAM_QUESTIONS } from '../data/examQuestions.js';
import { createExam, selectAnswer, goTo, toggleFlag, unansweredCount, submit, score } from '../lib/exam.js';
import { EXAM_SECONDS, formatTime, remainingSeconds, createCountdown } from '../lib/timer.js';
import { saveSession, clearSession, loadProgress, saveProgress, recordExam } from '../lib/storage.js';
import { renderQuestion, screenRoot } from './questionView.js';
import { resultsView } from './resultsView.js';

const ANNOUNCE = [
  [300, '5 dakika kaldı.'],
  [60, '1 dakika kaldı.'],
  [30, '30 saniye kaldı.'],
];
const isTextField = (t) =>
  !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''));

/** Records the final result once and clears the stored session. */
function finalize(ctx, state) {
  const final = submit(state);
  clearSession(ctx.store);
  saveProgress(recordExam(loadProgress(ctx.store), score(final)), ctx.store);
  return final;
}

/** arg: { session?: {exam, deadlineMs} } — resume when given, otherwise a fresh exam. */
export function examView(ctx, arg = {}) {
  let state;
  let deadlineMs;
  if (arg.session) {
    // R8: never trust stored questions.
    state = { ...arg.session.exam, questions: [...EXAM_QUESTIONS], submitted: false };
    deadlineMs = arg.session.deadlineMs;
  } else {
    clearSession(ctx.store);
    state = createExam(EXAM_QUESTIONS);
    deadlineMs = ctx.now() + EXAM_SECONDS * 1000;
  }

  let countdown = null;
  let finished = false;
  let constructing = true;
  let expiredEarly = false;
  let dialog = null;
  const announced = new Set();
  const startRemaining = remainingSeconds(deadlineMs, ctx.now());

  const timerEl = h('span', { class: 'timer', role: 'timer', 'aria-label': 'Kalan süre' });
  const live = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
  const body = h('div', { class: 'exam-body' });
  const main = h(
    'div',
    { class: 'exam-main' },
    h(
      'div',
      { class: 'exam-header' },
      h('h1', null, 'Final Sınavı'),
      h('p', { class: 'timer-wrap' }, 'Kalan süre: ', timerEl),
    ),
    h('p', { class: 'exam-note' }, '3 yanlış cevap 1 doğru cevabı götürür. Boş bıraktığın sorular puanını etkilemez.'),
    body,
  );
  const el = screenRoot('exam', main, live);

  const persist = () => saveSession({ exam: state, deadlineMs }, ctx.store);

  function finish() {
    if (finished) return;
    finished = true;
    countdown?.stop();
    const final = finalize(ctx, state);
    if (constructing) {
      expiredEarly = final;
      return;
    }
    ctx.go('results', final);
  }

  function update(next, focusSel) {
    if (finished || next === state) return;
    state = next;
    persist();
    render(focusSel);
  }

  function choose(i) {
    if (state.answers[state.current] === i) return; // R7: select-only
    update(selectAnswer(state, state.current, i), `.option[data-index="${i}"]`);
  }
  function clearAnswer() {
    const cur = state.answers[state.current];
    if (cur !== null) update(selectAnswer(state, state.current, cur), '.clear-btn');
  }

  function navButton(i) {
    const answered = state.answers[i] !== null;
    const flagged = state.flagged[i];
    const cls = ['nav-btn'];
    if (answered) cls.push('answered');
    if (flagged) cls.push('flagged');
    if (i === state.current) cls.push('current');
    const label = `Soru ${i + 1}, ${answered ? 'cevaplandı' : 'boş'}${flagged ? ', işaretlendi' : ''}`;
    return h(
      'button',
      {
        type: 'button',
        class: cls.join(' '),
        'aria-label': label,
        'aria-current': i === state.current ? 'step' : null,
        'data-nav': String(i),
        onclick: () => update(goTo(state, i), `[data-nav="${i}"]`),
      },
      String(i + 1),
    );
  }

  function render(focusSel) {
    const i = state.current;
    const q = state.questions[i];
    const n = state.questions.length;
    body.textContent = '';
    body.append(
      h('nav', { class: 'nav-strip', 'aria-label': 'Sorular' }, state.questions.map((_, k) => navButton(k))),
      h('h2', { class: 'question-number' }, `Soru ${i + 1} / ${n}`, state.flagged[i] ? h('span', { class: 'tag tag-flag' }, ' İşaretli') : null),
      h('div', { lang: 'en' }, renderQuestion(q, { selected: state.answers[i], onChoose: choose })),
      h('p', { class: 'key-hint' }, 'İpucu: A, B, C, D tuşlarıyla da seçebilirsin.'),
      h(
        'div',
        { class: 'actions exam-actions' },
        h('button', { type: 'button', class: 'btn btn-secondary prev-btn', disabled: i === 0, onclick: () => update(goTo(state, i - 1), '.prev-btn') }, '‹ Önceki'),
        h('button', { type: 'button', class: 'btn btn-secondary next-btn', disabled: i === n - 1, onclick: () => update(goTo(state, i + 1), '.next-btn') }, 'Sonraki ›'),
        h('button', { type: 'button', class: 'btn btn-secondary flag-btn', 'aria-pressed': String(state.flagged[i]), onclick: () => update(toggleFlag(state, i), '.flag-btn') }, state.flagged[i] ? 'Bayrağı kaldır' : 'Bayrakla'),
        h('button', { type: 'button', class: 'btn btn-secondary clear-btn', disabled: state.answers[i] === null, onclick: clearAnswer }, 'Cevabı temizle'),
        h('button', { type: 'button', class: 'btn btn-primary submit-btn', onclick: openDialog }, 'Sınavı bitir'),
        h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('home') }, 'Ana sayfaya dön (ilerlemen kaydedilir, süre işlemeye devam eder)'),
      ),
    );
    if (focusSel) {
      const target = body.querySelector(focusSel);
      if (target && !target.disabled) target.focus();
    }
  }

  function openDialog() {
    if (dialog || finished) return;
    const blank = unansweredCount(state);
    const msg =
      blank > 0
        ? `${blank} soru boş. Boş sorular puanını etkilemez; ancak istersen geri dönüp cevaplayabilirsin.`
        : 'Tüm soruları cevapladın.';
    const cancel = h('button', { type: 'button', class: 'btn btn-secondary', onclick: closeDialog }, 'Vazgeç');
    const confirm = h('button', { type: 'button', class: 'btn btn-primary', onclick: finish }, 'Evet, bitir');
    const box = h(
      'div',
      { class: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'submit-title', 'aria-describedby': 'submit-desc' },
      h('h2', { id: 'submit-title' }, 'Sınavı bitir'),
      h('p', null, 'Sınavı bitirmek istiyor musun?'),
      h('p', { id: 'submit-desc' }, msg),
      h('div', { class: 'dialog-actions' }, cancel, confirm),
    );
    dialog = { backdrop: h('div', { class: 'dialog-backdrop' }, box), first: cancel, last: confirm };
    el.appendChild(dialog.backdrop);
    main.setAttribute('inert', '');
    cancel.focus();
  }
  function closeDialog() {
    if (!dialog) return;
    main.removeAttribute('inert');
    dialog.backdrop.remove();
    dialog = null;
    body.querySelector('.submit-btn')?.focus();
  }

  function onKey(e) {
    if (finished) return;
    if (dialog) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog();
      } else if (e.key === 'Tab') {
        const a = document.activeElement;
        if (e.shiftKey && a === dialog.first) {
          e.preventDefault();
          dialog.last.focus();
        } else if (!e.shiftKey && a === dialog.last) {
          e.preventDefault();
          dialog.first.focus();
        }
      }
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || isTextField(e.target)) return;
    const idx = 'abcd'.indexOf(String(e.key).toLowerCase());
    if (idx >= 0 && String(e.key).length === 1) {
      e.preventDefault();
      choose(idx);
    }
  }

  function onTick(remaining) {
    timerEl.textContent = formatTime(remaining);
    timerEl.classList.toggle('low', remaining < 60);
    for (const [t, text] of ANNOUNCE) {
      if (remaining <= t && startRemaining > t && !announced.has(t)) {
        announced.add(t);
        live.textContent = text;
      }
    }
  }

  render();
  if (!arg.session) persist();
  document.addEventListener('keydown', onKey);
  countdown = createCountdown({
    deadlineMs,
    now: ctx.now,
    onTick,
    onExpire: finish,
    setIntervalFn: ctx.setIntervalFn,
    clearIntervalFn: ctx.clearIntervalFn,
  });
  constructing = false;

  if (expiredEarly) {
    document.removeEventListener('keydown', onKey);
    return resultsView(ctx, expiredEarly);
  }
  return {
    el,
    title: 'Final Sınavı',
    dispose() {
      countdown.stop();
      document.removeEventListener('keydown', onKey);
    },
  };
}
