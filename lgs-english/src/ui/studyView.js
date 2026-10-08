import { h } from './dom.js';
import { UNITS } from '../data/units.js';
import { loadProgress, saveProgress, markStudied } from '../lib/storage.js';
import { renderExhibit } from './exhibits.js';
import { renderFlashcards } from './flashcards.js';
import { screenRoot } from './questionView.js';
import { unitIllustration, UNIT_EMOJI } from './illustrations.js';

const section = (icon, title, cls, ...children) =>
  h(
    'section',
    { class: `card study-section ${cls}` },
    h('h2', null, h('span', { class: 'section-icon', 'aria-hidden': 'true' }, `${icon} `), title),
    ...children,
  );

export function studyView(ctx, unitId) {
  const u = UNITS.find((x) => x.id === unitId) ?? UNITS[0];
  const studiedNow = () => loadProgress(ctx.store).studied.includes(u.id);

  const status = h('p', { class: 'studied-status', role: 'status' });
  const markBtn = h('button', { type: 'button', class: 'btn btn-secondary', onclick: mark }, 'Çalıştım olarak işaretle');
  let studied = studiedNow();
  function paint() {
    status.textContent = studied ? '✓ Çalışıldı' : '';
    markBtn.disabled = studied;
  }
  function mark() {
    const p = markStudied(loadProgress(ctx.store), u.id);
    saveProgress(p, ctx.store);
    studied = true;
    paint();
    ctx.refresh?.();
  }
  paint();

  const hero = h(
    'section',
    { class: 'study-hero' },
    h(
      'div',
      { class: 'study-hero-text' },
      h('p', { class: 'unit-number' }, h('span', { 'aria-hidden': 'true' }, `${UNIT_EMOJI[u.id]} `), `Ünite ${u.id} – `, h('span', { lang: 'en' }, u.name)),
      h('h1', null, u.trName),
      h('p', { class: 'hero-sub' }, `${u.words.length} kelime · ${u.phrases.length} kalıp · dilbilgisi · örnek metin`),
    ),
    h('div', { class: 'study-hero-art' }, unitIllustration(u.id)),
  );

  const left = h(
    'div',
    { class: 'study-col' },
    section(
      '🃏',
      'Kelimeler',
      'words-section',
      renderFlashcards(u.words),
      h(
        'ul',
        { class: 'word-list' },
        u.words.map((w) => h('li', { class: 'word-chip' }, h('strong', { lang: 'en' }, w.en), h('span', { class: 'word-sep' }, ' – '),h('span', { lang: 'tr' }, w.tr))),
      ),
    ),
  );

  const right = h(
    'div',
    { class: 'study-col' },
    section('💬', 'Kalıp cümleler', 'phrases-section', h('ul', { class: 'phrase-list', lang: 'en' }, u.phrases.map((p) => h('li', { class: 'bubble' }, p)))),
    section(
      '🧩',
      'Dilbilgisi',
      'grammar-card',
      h('h3', null, u.grammar.title),
      h('ul', { class: 'grammar-points' }, u.grammar.points.map((p) => h('li', null, p))),
      h('p', { class: 'examples-label' }, 'Örnekler:'),
      h('ul', { class: 'examples', lang: 'en' }, u.grammar.examples.map((e) => h('li', null, e))),
    ),
    section('📖', 'Örnek metin', 'model-card', h('div', { lang: 'en' }, renderExhibit(u.model))),
    h(
      'aside',
      { class: 'tip-callout', 'aria-labelledby': `tip-${u.id}` },
      h('span', { class: 'tip-icon', 'aria-hidden': 'true' }, '💡'),
      h('div', null, h('h2', { id: `tip-${u.id}` }, 'Sınav ipucu'), h('p', { class: 'tip' }, u.tipTr)),
    ),
  );

  const el = screenRoot(
    'study',
    hero,
    h('div', { class: 'study-grid' }, left, right),
    h(
      'div',
      { class: 'actions study-actions' },
      markBtn,
      status,
      h('button', { type: 'button', class: 'btn btn-primary btn-big', onclick: () => ctx.go('practice', u.id) }, h('span', { 'aria-hidden': 'true' }, '🎯 '), 'Alıştırmaya başla'),
      h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('home') }, 'Ana sayfa'),
    ),
  );
  el.dataset.unit = String(u.id);
  return { el, title: u.trName };
}
