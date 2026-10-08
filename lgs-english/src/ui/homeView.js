import { h } from './dom.js';
import { UNITS } from '../data/units.js';
import { loadProgress, loadSession } from '../lib/storage.js';
import { formatTime, remainingSeconds } from '../lib/timer.js';
import { screenRoot } from './questionView.js';

export function homeView(ctx, arg = {}) {
  const progress = loadProgress(ctx.store);
  const session = loadSession(ctx.now(), ctx.store);
  const left = session ? formatTime(remainingSeconds(session.deadlineMs, ctx.now())) : null;
  // The label may be stale: re-check on click; an expired session is discarded (same as reload).
  const resume = () => {
    const fresh = loadSession(ctx.now(), ctx.store);
    if (fresh) ctx.go('exam', { session: fresh });
    else ctx.go('home', { expired: true });
  };
  const start = () => (session ? resume() : ctx.go('exam', {}));

  const unitCards = UNITS.map((u) => {
    const studied = progress.studied.includes(u.id);
    const best = progress.practice[u.id];
    return h(
      'li',
      { class: 'card unit-card' },
      h('p', { class: 'unit-number' }, `Ünite ${u.id}`),
      h('h2', { class: 'unit-title' }, u.name),
      h('p', { class: 'unit-tr', lang: 'tr' }, u.trName),
      h(
        'p',
        { class: 'unit-tags' },
        studied ? h('span', { class: 'tag tag-studied' }, '✓ Çalışıldı') : null,
        best ? h('span', { class: 'tag' }, `Alıştırma: ${best.correct}/${best.total}`) : null,
      ),
      h(
        'button',
        { type: 'button', class: 'btn btn-secondary', onclick: () => ctx.go('study', u.id) },
        `Üniteyi aç: ${u.name}`,
      ),
    );
  });

  const examCard = h(
    'section',
    { class: 'card exam-card', 'aria-labelledby': 'exam-card-title' },
    h('h2', { id: 'exam-card-title' }, 'Final Sınavı'),
    h('p', null, '10 soru, 15 dakika. Her üniteden bir soru. Önce üniteleri çalışman önerilir.'),
    h(
      'p',
      { class: 'exam-best' },
      progress.bestExam === null ? 'En iyi puan: henüz çözülmedi' : `En iyi puan: ${progress.bestExam}/10`,
    ),
    h(
      'button',
      { type: 'button', class: 'btn btn-primary', onclick: start },
      session ? `Sınava devam et (${left} kaldı)` : 'Sınava başla',
    ),
  );

  const el = screenRoot(
    'home',
    h('h1', null, 'LGS İngilizce – Ders 1'),
    h(
      'p',
      { class: 'intro' },
      'Bu derste 8. sınıf İngilizce müfredatındaki 10 üniteyi tekrar edeceksin. Her ünitede kelimeleri, kalıpları ve dilbilgisini çalış, kısa alıştırmayı çöz; sonra LGS tarzı final sınavına gir.',
    ),
    arg.expired ? h('p', { class: 'card notice', role: 'status' }, 'Önceki sınavın süresi doldu.') : null,
    session
      ? h(
          'div',
          { class: 'resume-banner card' },
          h('p', null, 'Yarım kalmış bir sınavın var.'),
          h('button', { type: 'button', class: 'btn btn-primary', onclick: resume }, `Sınava devam et (${left} kaldı)`),
        )
      : null,
    h('ul', { class: 'unit-grid' }, unitCards),
    examCard,
  );
  return { el, title: 'Ana sayfa' };
}
