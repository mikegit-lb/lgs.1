import { describe, it, expect, afterEach } from 'vitest';
import { mountApp } from '../src/ui/app.js';
import { UNITS } from '../src/data/units.js';
import { EXAM_QUESTIONS } from '../src/data/examQuestions.js';
import { practiceFor } from '../src/data/practice.js';
import { loadProgress, loadSession, saveSession } from '../src/lib/storage.js';
import { createExam } from '../src/lib/exam.js';

const SESSION_KEY = 'lgs-english:lesson1:session';
const PROGRESS_KEY = 'lgs-english:lesson1:progress';

function memStore(init = {}) {
  const data = new Map(Object.entries(init));
  const log = [];
  return {
    log,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => {
      log.push(k);
      data.set(k, String(v));
    },
    removeItem: (k) => data.delete(k),
  };
}

const mounted = [];
function setup(store = memStore(), clock = { t: 1_000_000 }) {
  const timers = new Map();
  let id = 0;
  const deps = {
    store,
    now: () => clock.t,
    setIntervalFn: (fn) => {
      timers.set(++id, fn);
      return id;
    },
    clearIntervalFn: (i) => timers.delete(i),
  };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = mountApp(root, deps);
  mounted.push(app);
  return {
    root,
    store,
    clock,
    timers,
    app,
    advance(ms) {
      clock.t += ms;
      for (const fn of [...timers.values()]) fn();
    },
  };
}

afterEach(() => {
  while (mounted.length) mounted.pop().destroy();
  document.body.textContent = '';
});

const buttons = (root) => [...root.querySelectorAll('button')];
const btn = (root, text) => buttons(root).find((b) => b.textContent.includes(text));
const click = (root, text) => {
  const b = btn(root, text);
  if (!b) throw new Error(`no button "${text}"`);
  b.click();
};
const screen = (root) => root.querySelector('[data-screen]')?.dataset.screen;
const options = (root) => [...root.querySelectorAll('.option')];
const navBtns = (root) => [...root.querySelectorAll('.nav-btn')];
const key = (k) => document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
const startExam = (root) => click(root, 'Sınava başla');

describe('Home', () => {
  it('lists 10 unit cards and the final exam card', () => {
    const { root } = setup();
    expect(screen(root)).toBe('home');
    expect(root.querySelectorAll('.unit-card').length).toBe(10);
    for (const u of UNITS) {
      expect(root.textContent).toContain(u.name);
      expect(root.textContent).toContain(u.trName);
    }
    expect(root.textContent).toContain('Final Sınavı');
    expect(root.textContent).toContain('henüz çözülmedi');
    expect(root.querySelectorAll('h1').length).toBe(1);
  });

  it('corrupt store content starts on Home without throwing', () => {
    const store = memStore({ [SESSION_KEY]: '{not json', [PROGRESS_KEY]: '[[[' });
    const { root } = setup(store);
    expect(screen(root)).toBe('home');
    expect(btn(root, 'Sınava devam et')).toBeUndefined();
  });

  it('throwing storage still renders Home', () => {
    const bad = {
      getItem() {
        throw new Error('denied');
      },
      setItem() {
        throw new Error('denied');
      },
      removeItem() {
        throw new Error('denied');
      },
    };
    const { root } = setup(bad);
    expect(screen(root)).toBe('home');
    startExam(root);
    expect(screen(root)).toBe('exam');
  });
});

describe('Study', () => {
  it('shows words, phrases, grammar, model text and tip', () => {
    const { root } = setup();
    click(root, 'Friendship');
    const u = UNITS[0];
    expect(screen(root)).toBe('study');
    expect(root.querySelector('h1').textContent).toContain(u.trName);
    expect(root.querySelector('.flashcards')).not.toBeNull();
    for (const w of u.words) expect(root.textContent).toContain(w.tr);
    for (const p of u.phrases) expect(root.textContent).toContain(p);
    expect(root.textContent).toContain(u.grammar.title);
    for (const p of u.grammar.points) expect(root.textContent).toContain(p);
    for (const e of u.grammar.examples) expect(root.textContent).toContain(e);
    expect(root.textContent).toContain(u.model.lines[0].text);
    expect(root.textContent).toContain(u.tipTr);
    expect(root.querySelectorAll('h1').length).toBe(1);
  });

  it('"Çalıştım" persists and shows the studied tag after remount', () => {
    const store = memStore();
    const a = setup(store);
    click(a.root, 'Friendship');
    click(a.root, 'Çalıştım olarak işaretle');
    expect(a.root.textContent).toContain('✓');
    expect(loadProgress(store).studied).toEqual([1]);
    const b = setup(store);
    const card = b.root.querySelectorAll('.unit-card')[0];
    expect(card.textContent).toContain('✓ Çalışıldı');
    expect(b.root.querySelectorAll('.unit-card')[1].textContent).not.toContain('Çalışıldı');
  });
});

describe('Practice', () => {
  it('reveals feedback on click and ignores a second click on another option', () => {
    const { root } = setup();
    click(root, 'Friendship');
    click(root, 'Alıştırmaya başla');
    expect(screen(root)).toBe('practice');
    const q = practiceFor(1)[0];
    const wrong = (q.answer + 1) % 4;
    options(root)[wrong].click();
    expect(root.textContent).toContain(q.explanationTr);
    expect(root.textContent).toContain('Doğru cevap');
    expect(root.textContent).toContain('Senin cevabın');
    expect(options(root)[q.answer].classList.contains('correct')).toBe(true);
    expect(options(root)[wrong].classList.contains('incorrect')).toBe(true);
    options(root)[q.answer].click();
    expect(options(root)[wrong].classList.contains('incorrect')).toBe(true);
    expect(root.querySelectorAll('.option.incorrect').length).toBe(1);
  });

  it('summary shows k/3 and saves best score; retry resets', () => {
    const store = memStore();
    const { root } = setup(store);
    click(root, 'Friendship');
    click(root, 'Alıştırmaya başla');
    const qs = practiceFor(1);
    qs.forEach((q, i) => {
      options(root)[i === 0 ? (q.answer + 1) % 4 : q.answer].click();
      click(root, i < qs.length - 1 ? 'Sonraki soru' : 'Bitir');
    });
    expect(screen(root)).toBe('practice-summary');
    expect(root.textContent).toContain('2/3');
    expect(loadProgress(store).practice[1]).toEqual({ correct: 2, total: 3 });
    click(root, 'Tekrar');
    expect(screen(root)).toBe('practice');
    expect(root.querySelectorAll('.option.correct').length).toBe(0);
    click(root, 'Ana sayfa');
    expect(root.querySelectorAll('.unit-card')[0].textContent).toContain('2/3');
  });
});

describe('Exam', () => {
  it('shows Q1 with exactly 4 options labelled A–D with accessible names', () => {
    const { root } = setup();
    startExam(root);
    expect(screen(root)).toBe('exam');
    expect(root.textContent).toContain(EXAM_QUESTIONS[0].stem);
    const opts = options(root);
    expect(opts.length).toBe(4);
    opts.forEach((o, i) => {
      expect(o.tagName).toBe('BUTTON');
      expect(o.getAttribute('aria-label')).toBe(`${'ABCD'[i]}: ${EXAM_QUESTIONS[0].options[i]}`);
    });
    expect(navBtns(root).length).toBe(10);
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('[role="timer"]').textContent).toBe('15:00');
    expect(root.textContent).toContain('Yanlış cevaplar doğruları götürmez');
  });

  it('clicking the selected option keeps it (R7); "Cevabı temizle" clears; last selection wins', () => {
    const { root } = setup();
    startExam(root);
    options(root)[1].click();
    options(root)[1].click();
    expect(options(root)[1].classList.contains('selected')).toBe(true);
    options(root)[2].click();
    expect(root.querySelectorAll('.option.selected').length).toBe(1);
    expect(options(root)[2].classList.contains('selected')).toBe(true);
    click(root, 'Cevabı temizle');
    expect(root.querySelectorAll('.option.selected').length).toBe(0);
  });

  it('keys a–d (case-insensitive) select, select-only', () => {
    const { root } = setup();
    startExam(root);
    key('c');
    expect(options(root)[2].classList.contains('selected')).toBe(true);
    key('C');
    expect(options(root)[2].classList.contains('selected')).toBe(true);
    key('A');
    expect(options(root)[0].classList.contains('selected')).toBe(true);
    expect(root.querySelectorAll('.option.selected').length).toBe(1);
  });

  it('Prev/Next/number nav, nav labels and flag', () => {
    const { root } = setup();
    startExam(root);
    options(root)[0].click();
    click(root, 'Sonraki');
    expect(root.textContent).toContain(EXAM_QUESTIONS[1].stem);
    navBtns(root)[6].click();
    expect(root.textContent).toContain(EXAM_QUESTIONS[6].stem);
    expect(navBtns(root)[6].classList.contains('current')).toBe(true);
    click(root, 'Önceki');
    expect(root.textContent).toContain(EXAM_QUESTIONS[5].stem);
    click(root, 'Bayrakla');
    expect(navBtns(root)[5].classList.contains('flagged')).toBe(true);
    expect(navBtns(root)[0].getAttribute('aria-label')).toBe('Soru 1, cevaplandı');
    expect(navBtns(root)[5].getAttribute('aria-label')).toContain('işaretlendi');
  });

  it('submit with 3 blanks shows dialog with "3 soru boş"; cancel keeps exam; confirm shows results', () => {
    const store = memStore();
    const { root } = setup(store);
    startExam(root);
    for (let i = 0; i < 7; i++) {
      navBtns(root)[i].click();
      options(root)[i < 4 ? EXAM_QUESTIONS[i].answer : (EXAM_QUESTIONS[i].answer + 1) % 4].click();
    }
    click(root, 'Sınavı bitir');
    const dlg = root.querySelector('[role="dialog"]');
    expect(dlg).not.toBeNull();
    expect(dlg.getAttribute('aria-modal')).toBe('true');
    expect(dlg.textContent).toContain('3 soru boş');
    expect(dlg.contains(document.activeElement)).toBe(true);
    click(root, 'Vazgeç');
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    expect(screen(root)).toBe('exam');
    click(root, 'Sınavı bitir');
    key('Escape');
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    click(root, 'Sınavı bitir');
    click(root, 'Evet, bitir');
    expect(screen(root)).toBe('results');
    const r = root.querySelector('.results-score').dataset;
    expect(Number(r.correct)).toBe(4);
    expect(Number(r.correct) + Number(r.wrong) + Number(r.blank)).toBe(10);
    expect(Number(r.blank)).toBe(3);
    expect(root.textContent).toContain('4/10');
    expect(root.textContent).toContain('Doğru cevap');
    expect(root.textContent).toContain('Senin cevabın');
    expect(root.textContent).toContain('Boş bırakıldı');
    expect(root.textContent).toContain('Paragraf');
    expect(root.textContent).toContain('Görsel/Tablo/Grafik');
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(store.getItem(SESSION_KEY)).toBeNull();
    expect(loadProgress(store).bestExam).toBe(4);
  });

  it('dialog says all answered when no blanks', () => {
    const { root } = setup();
    startExam(root);
    for (let i = 0; i < 10; i++) {
      navBtns(root)[i].click();
      options(root)[0].click();
    }
    click(root, 'Sınavı bitir');
    expect(root.querySelector('[role="dialog"]').textContent).toContain('Tüm sorular cevaplandı');
  });

  it('auto-submits exactly once when the clock passes 15:00', () => {
    const store = memStore();
    const s = setup(store);
    startExam(s.root);
    options(s.root)[EXAM_QUESTIONS[0].answer].click();
    s.advance(60_000);
    expect(s.root.querySelector('[role="timer"]').textContent).toBe('14:00');
    s.advance(14 * 60_000 - 30_000);
    expect(s.root.querySelector('.timer').classList.contains('low')).toBe(true);
    s.advance(31_000);
    s.advance(5_000);
    expect(screen(s.root)).toBe('results');
    expect(s.root.querySelectorAll('[data-screen="results"]').length).toBe(1);
    expect(store.log.filter((k) => k === PROGRESS_KEY).length).toBe(1);
    expect(loadProgress(store).bestExam).toBe(1);
    expect(s.timers.size).toBe(0);
    expect(store.getItem(SESSION_KEY)).toBeNull();
  });

  it('leaving the exam screen stops the countdown', () => {
    const s = setup();
    startExam(s.root);
    expect(s.timers.size).toBe(1);
    click(s.root, 'Ana sayfa');
    expect(s.timers.size).toBe(0);
  });

  it('remount mid-exam restores answers, current question and remaining time', () => {
    const store = memStore();
    const clock = { t: 5_000_000 };
    const a = setup(store, clock);
    startExam(a.root);
    options(a.root)[2].click();
    navBtns(a.root)[3].click();
    options(a.root)[1].click();
    click(a.root, 'Bayrakla');
    a.advance(100_000);
    a.app.destroy();
    const b = setup(store, clock);
    const resume = btn(b.root, 'Sınava devam et');
    expect(resume.textContent).toContain('13:20');
    resume.click();
    expect(screen(b.root)).toBe('exam');
    expect(b.root.textContent).toContain(EXAM_QUESTIONS[3].stem);
    expect(options(b.root)[1].classList.contains('selected')).toBe(true);
    expect(navBtns(b.root)[0].classList.contains('answered')).toBe(true);
    expect(navBtns(b.root)[3].classList.contains('flagged')).toBe(true);
    expect(b.root.querySelector('[role="timer"]').textContent).toBe('13:20');
  });

  it('expired stored session is ignored', () => {
    const store = memStore();
    const clock = { t: 1_000_000 };
    saveSession({ exam: createExam(EXAM_QUESTIONS), deadlineMs: clock.t - 1 }, store);
    const { root } = setup(store, clock);
    expect(screen(root)).toBe('home');
    expect(btn(root, 'Sınava devam et')).toBeUndefined();
    expect(loadSession(clock.t, store)).toBeNull();
  });

  it('tampered stored questions are replaced with current EXAM_QUESTIONS (R8)', () => {
    const store = memStore();
    const clock = { t: 1_000_000 };
    const exam = createExam(EXAM_QUESTIONS);
    exam.questions = exam.questions.map((q) => ({ ...q, stem: 'HACKED <img src=x onerror=alert(1)>', answer: 0 }));
    exam.answers[0] = EXAM_QUESTIONS[0].answer;
    saveSession({ exam, deadlineMs: clock.t + 600_000 }, store);
    const { root } = setup(store, clock);
    click(root, 'Sınava devam et');
    expect(root.textContent).not.toContain('HACKED');
    expect(root.querySelector('img')).toBeNull();
    expect(root.textContent).toContain(EXAM_QUESTIONS[0].stem);
    click(root, 'Sınavı bitir');
    click(root, 'Evet, bitir');
    expect(root.querySelector('.results-score').dataset.correct).toBe('1');
  });

  it('Retake clears the session and starts a fresh exam', () => {
    const store = memStore();
    const { root } = setup(store);
    startExam(root);
    options(root)[0].click();
    click(root, 'Sınavı bitir');
    click(root, 'Evet, bitir');
    click(root, 'Tekrar dene');
    expect(screen(root)).toBe('exam');
    expect(root.querySelectorAll('.option.selected').length).toBe(0);
    expect(root.querySelector('[role="timer"]').textContent).toBe('15:00');
    const sess = loadSession(1_000_000, store);
    expect(sess.exam.answers.every((a) => a === null)).toBe(true);
  });

  it('weak-unit button opens the study page', () => {
    const { root } = setup();
    startExam(root);
    click(root, 'Sınavı bitir');
    click(root, 'Evet, bitir');
    const weak = root.querySelector('.weak-units button');
    weak.click();
    expect(screen(root)).toBe('study');
  });
  it('session expiring between Home and resume click goes straight to results (recorded once)', () => {
    const store = memStore();
    const clock = { t: 1_000_000 };
    saveSession({ exam: createExam(EXAM_QUESTIONS), deadlineMs: clock.t + 2_000 }, store);
    const s = setup(store, clock);
    clock.t += 5_000;
    click(s.root, 'Sınava devam et');
    expect(screen(s.root)).toBe('results');
    expect(s.timers.size).toBe(0);
    expect(store.log.filter((k) => k === PROGRESS_KEY).length).toBe(1);
  });

  it('announces remaining time only at thresholds', () => {
    const s = setup();
    startExam(s.root);
    const live = s.root.querySelector('[aria-live]');
    expect(s.root.querySelector('[role="timer"]').hasAttribute('aria-live')).toBe(false);
    s.advance(60_000);
    expect(live.textContent).toBe('');
    s.advance(9 * 60_000);
    expect(live.textContent).toBe('5 dakika kaldı.');
  });
});
