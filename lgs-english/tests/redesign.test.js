import { describe, it, expect, afterEach } from 'vitest';
import { mountApp } from '../src/ui/app.js';
import { UNITS } from '../src/data/units.js';
import { EXAM_QUESTIONS } from '../src/data/examQuestions.js';
import { practiceFor } from '../src/data/practice.js';

const PROGRESS_KEY = 'lgs-english:lesson1:progress';

function memStore(init = {}) {
  const data = new Map(Object.entries(init));
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)), removeItem: (k) => data.delete(k) };
}

const mounted = [];
function setup(store = memStore(), clock = { t: 1_000_000 }) {
  const timers = new Map();
  let id = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = mountApp(root, {
    store,
    now: () => clock.t,
    setIntervalFn: (fn) => (timers.set(++id, fn), id),
    clearIntervalFn: (i) => timers.delete(i),
  });
  mounted.push(app);
  return {
    root,
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

const btn = (root, text) => [...root.querySelectorAll('button')].find((b) => b.textContent.includes(text));
const click = (root, text) => btn(root, text).click();
const options = (root) => [...root.querySelectorAll('.option')];
const screen = (root) => root.querySelector('[data-screen]')?.dataset.screen;

describe('App shell header', () => {
  it('renders a header with brand, progress chip and a home button, without an h1', () => {
    const { root } = setup();
    const header = root.querySelector('header.app-header');
    expect(header).not.toBeNull();
    expect(header.textContent).toContain('LGS İngilizce');
    expect(header.querySelector('h1')).toBeNull();
    expect(header.querySelector('.xp-chip').textContent).toContain('0/30 yıldız');
    expect(header.querySelector('.home-link').getAttribute('aria-current')).toBe('page');
    expect(root.getAttribute('translate')).toBe('no');
  });
  it('home button navigates home and the chip refreshes after practice', () => {
    const { root } = setup();
    click(root, 'Friendship');
    expect(root.querySelector('.home-link').hasAttribute('aria-current')).toBe(false);
    click(root, 'Alıştırmaya başla');
    for (const [i, q] of practiceFor(1).entries()) {
      options(root)[q.answer].click();
      click(root, i < 2 ? 'Sonraki soru' : 'Bitir');
    }
    expect(root.querySelector('.xp-chip').textContent).toContain('3/30 yıldız');
    root.querySelector('.home-link').click();
    expect(screen(root)).toBe('home');
  });
});

describe('Home redesign', () => {
  it('hero greets, shows overall progress and themed unit cards with illustrations and stars', () => {
    const store = memStore({ [PROGRESS_KEY]: JSON.stringify({ studied: [1], practice: { 1: { correct: 2, total: 3 } }, bestExam: 7 }) });
    const { root } = setup(store);
    expect(root.textContent).toContain('Merhaba! Hazır mısın?');
    expect(root.querySelector('.hero [role="progressbar"]')).not.toBeNull();
    const cards = [...root.querySelectorAll('.unit-card')];
    cards.forEach((c, i) => {
      expect(c.dataset.unit).toBe(String(UNITS[i].id));
      expect(c.querySelector('svg.illus[aria-hidden="true"]')).not.toBeNull();
    });
    expect(cards[0].textContent).toContain('2/3 yıldız');
    expect(cards[1].textContent).toContain('0/3 yıldız');
    expect(cards[0].querySelector('.ribbon').textContent).toContain('Çalışıldı');
    const boss = root.querySelector('.exam-card');
    expect(boss.textContent).toContain('En iyi puan: 7/10');
    expect(root.querySelector('.hero svg.mascot[aria-hidden="true"]')).not.toBeNull();
  });
});

describe('Study redesign', () => {
  it('hero banner is themed and English blocks keep lang="en"', () => {
    const { root } = setup();
    click(root, 'Teen Life');
    const main = root.querySelector('[data-screen="study"]');
    expect(main.dataset.unit).toBe('2');
    expect(main.querySelector('.study-hero svg.illus')).not.toBeNull();
    expect(main.querySelectorAll('.word-chip').length).toBe(UNITS[1].words.length);
    for (const chip of main.querySelectorAll('.word-chip [lang="en"]')) expect(chip.textContent.length).toBeGreaterThan(0);
    expect(main.querySelector('.phrase-list').getAttribute('lang')).toBe('en');
    expect(main.querySelector('.tip-callout').textContent).toContain(UNITS[1].tipTr);
    for (const icon of main.querySelectorAll('.section-icon')) expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('Practice micro-feedback', () => {
  it('correct answer shows Turkish praise; wrong answer shows a kind nudge', () => {
    const { root } = setup();
    click(root, 'Friendship');
    click(root, 'Alıştırmaya başla');
    const [q1, q2] = practiceFor(1);
    options(root)[q1.answer].click();
    expect(root.querySelector('.cheer').textContent).toMatch(/Harika|Süpersin|Doğru bildin|Müthiş|Bravo/);
    click(root, 'Sonraki soru');
    options(root)[(q2.answer + 1) % 4].click();
    expect(root.querySelector('.cheer').textContent).toContain('Olsun, bir daha!');
    expect(root.textContent).toContain(q2.explanationTr);
  });
});

describe('Exam redesign', () => {
  it('side panel shows answered progress, timer pill levels with a text cue', () => {
    const s = setup();
    click(s.root, 'Sınava başla');
    const side = s.root.querySelector('.exam-side');
    expect(side.querySelector('.nav-strip')).not.toBeNull();
    expect(s.root.querySelector('.exam-layout > .timer-pill [role="timer"]')).not.toBeNull();
    const bar = () => s.root.querySelector('.answered-progress');
    expect(bar().textContent).toContain('Cevaplanan 0/10');
    options(s.root)[0].click();
    expect(bar().textContent).toContain('Cevaplanan 1/10');
    expect(bar().querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('1');
    expect(s.root.querySelector('.question[lang="en"], [lang="en"] .question')).not.toBeNull();
    const pill = s.root.querySelector('.timer-pill');
    expect(pill.dataset.level).toBe('ok');
    s.advance(11 * 60_000);
    expect(pill.dataset.level).toBe('warn');
    s.advance(3 * 60_000 + 30_000);
    expect(pill.dataset.level).toBe('low');
    expect(pill.textContent).toContain('Acele et');
  });
  it('the shell header is inert while the submit dialog is open', () => {
    const { root } = setup();
    click(root, 'Sınava başla');
    click(root, 'Sınavı bitir');
    expect(root.querySelector('.app-header').hasAttribute('inert')).toBe(true);
    click(root, 'Vazgeç');
    expect(root.querySelector('.app-header').hasAttribute('inert')).toBe(false);
  });
});

describe('Results redesign', () => {
  function finishWith(root, nCorrect) {
    click(root, 'Sınava başla');
    for (let i = 0; i < nCorrect; i++) {
      root.querySelectorAll('.nav-btn')[i].click();
      options(root)[EXAM_QUESTIONS[i].answer].click();
    }
    click(root, 'Sınavı bitir');
    click(root, 'Evet, bitir');
  }
  it('high net: cheer mascot, confetti (decorative), score ring', () => {
    const { root } = setup();
    finishWith(root, 8);
    expect(root.querySelector('.results-hero svg.mascot-cheer')).not.toBeNull();
    const confetti = root.querySelector('.confetti');
    expect(confetti).not.toBeNull();
    expect(confetti.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.score-ring svg[aria-hidden="true"]')).not.toBeNull();
    expect(root.textContent).toContain('3 yanlış cevap 1 doğru cevabı götürür');
    expect(root.querySelectorAll('.breakdown-card').length).toBeGreaterThan(0);
  });
  it('low net: no confetti, encouraging mascot copy', () => {
    const { root } = setup();
    finishWith(root, 1);
    expect(root.querySelector('.confetti')).toBeNull();
    expect(root.querySelector('.results-hero svg.mascot-oops')).not.toBeNull();
    expect(root.querySelector('.mood-message').textContent).toContain('Olsun');
  });
});
