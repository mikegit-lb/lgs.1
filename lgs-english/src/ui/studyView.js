import { h } from './dom.js';
import { UNITS } from '../data/units.js';
import { loadProgress, saveProgress, markStudied } from '../lib/storage.js';
import { renderExhibit } from './exhibits.js';
import { renderFlashcards } from './flashcards.js';
import { screenRoot } from './questionView.js';

const section = (title, ...children) => h('section', { class: 'card study-section' }, h('h2', null, title), ...children);

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
  }
  paint();

  const el = screenRoot(
    'study',
    h('p', { class: 'unit-number' }, `Ünite ${u.id} – ${u.name}`),
    h('h1', null, u.trName),
    section(
      'Kelimeler',
      renderFlashcards(u.words),
      h(
        'ul',
        { class: 'word-list' },
        u.words.map((w) => h('li', null, h('strong', { lang: 'en' }, w.en), ' – ', w.tr)),
      ),
    ),
    section('Kalıp cümleler', h('ul', { class: 'phrase-list', lang: 'en' }, u.phrases.map((p) => h('li', null, p)))),
    section(
      'Dilbilgisi',
      h('h3', null, u.grammar.title),
      h('ul', null, u.grammar.points.map((p) => h('li', null, p))),
      h('p', { class: 'examples-label' }, 'Örnekler:'),
      h('ul', { class: 'examples', lang: 'en' }, u.grammar.examples.map((e) => h('li', null, e))),
    ),
    section('Örnek metin', h('div', { lang: 'en' }, renderExhibit(u.model))),
    section('Sınav ipucu', h('p', { class: 'tip' }, u.tipTr)),
    h(
      'div',
      { class: 'actions' },
      markBtn,
      status,
      h('button', { type: 'button', class: 'btn btn-primary', onclick: () => ctx.go('practice', u.id) }, 'Alıştırmaya başla'),
      h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('home') }, 'Ana sayfa'),
    ),
  );
  return { el, title: u.trName };
}
