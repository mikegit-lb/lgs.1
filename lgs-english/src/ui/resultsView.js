import { h } from './dom.js';
import { summarize } from '../lib/results.js';
import { clearSession } from '../lib/storage.js';
import { renderExhibit } from './exhibits.js';
import { renderStem, renderOptions, LETTERS, screenRoot } from './questionView.js';

const TYPE_LABELS = { paragraph: 'Paragraf', visual: 'Görsel/Tablo/Grafik', dialogue: 'Diyalog', vocabulary: 'Kelime' };
const STATUS = { correct: '✓ Doğru', wrong: '✗ Yanlış', blank: '– Boş bırakıldı' };

/** Pure render of a submitted exam; progress is recorded by the exam screen, never here. */
export function resultsView(ctx, examState) {
  const s = summarize(examState);

  const breakdown = Object.entries(s.byType)
    .filter(([, v]) => v.total > 0)
    .map(([type, v]) => {
      const label = TYPE_LABELS[type] ?? type;
      const pct = Math.round((v.correct / v.total) * 100);
      return h(
        'li',
        { class: 'breakdown-row' },
        h('span', { class: 'breakdown-label' }, `${label}: ${v.correct}/${v.total}`),
        h(
          'div',
          { class: 'progress', role: 'progressbar', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': String(v.total), 'aria-valuenow': String(v.correct) },
          h('div', { class: 'progress-fill', style: `width: ${pct}%` }),
        ),
      );
    });

  const review = s.items.map((it) => {
    const q = examState.questions[it.index];
    const chosenText = it.chosen === null ? 'Boş bırakıldı' : `Senin cevabın: ${LETTERS[it.chosen]}`;
    return h(
      'li',
      { class: `card review-item review-${it.status}` },
      h('h3', null, `Soru ${it.index + 1} (Ünite ${it.unitId} – ${it.unitName}): ${STATUS[it.status]}`),
      h('p', { class: 'review-summary' }, `${chosenText} · Doğru cevap: ${LETTERS[it.answer]}`),
      q.exhibit ? h('details', null, h('summary', null, 'Metni / görseli göster'), h('div', { lang: 'en' }, renderExhibit(q.exhibit))) : null,
      h('div', { lang: 'en' }, renderStem(q.stem), renderOptions(q, { reveal: { chosen: it.chosen } })),
      h('p', { class: 'explanation' }, q.explanationTr),
    );
  });

  const el = screenRoot(
    'results',
    h('h1', null, 'Sınav sonucu'),
    h(
      'section',
      { class: 'card results-score', 'data-correct': String(s.correct), 'data-wrong': String(s.wrong), 'data-blank': String(s.blank) },
      h('p', { class: 'score-big' }, `${s.correct}/${s.total}`),
      h('p', null, `Başarı: %${s.percent}`),
      h('p', null, `Doğru: ${s.correct} · Yanlış: ${s.wrong} · Boş: ${s.blank}`),
      h('p', { class: 'net' }, `Net: ${s.net.toFixed(2).replace('.', ',')} (doğru − yanlış/3)`),
      h('p', { class: 'muted' }, '3 yanlış cevap 1 doğru cevabı götürür; boş sorular neti etkilemez.'),
    ),
    h('section', { class: 'card' }, h('h2', null, 'Soru türlerine göre'), h('ul', { class: 'breakdown' }, breakdown)),
    s.weakUnits.length
      ? h(
          'section',
          { class: 'card weak-units' },
          h('h2', null, 'Tekrar etmen gereken üniteler'),
          h(
            'ul',
            null,
            s.weakUnits.map((w) =>
              h('li', null, h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('study', w.unitId) }, `Ünite ${w.unitId}: ${w.unitName}`)),
            ),
          ),
        )
      : h('p', { class: 'card' }, 'Harika! Tüm soruları doğru cevapladın.'),
    h(
      'div',
      { class: 'actions' },
      h('button', { type: 'button', class: 'btn btn-primary', onclick: () => { clearSession(ctx.store); ctx.go('exam', {}); } }, 'Tekrar dene'),
      h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('home') }, 'Ana sayfa'),
    ),
    h('section', null, h('h2', null, 'Soruları incele'), h('ol', { class: 'review-list' }, review)),
  );
  return { el, title: 'Sınav sonucu' };
}
