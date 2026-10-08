import { h } from './dom.js';
import { UNITS } from '../data/units.js';
import { loadProgress, loadSession } from '../lib/storage.js';
import { formatTime, remainingSeconds } from '../lib/timer.js';
import { starsFor, overallProgress } from '../lib/gamify.js';
import { screenRoot } from './questionView.js';
import { unitIllustration, mascot, UNIT_EMOJI } from './illustrations.js';
import { progressRing, starRow, progressBar } from './widgets.js';

export function homeView(ctx, arg = {}) {
  const progress = loadProgress(ctx.store);
  const overall = overallProgress(progress);
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
      { class: 'card unit-card', 'data-unit': String(u.id) },
      h(
        'div',
        { class: 'unit-art' },
        unitIllustration(u.id),
        h('span', { class: 'unit-badge' }, h('span', { 'aria-hidden': 'true' }, `${UNIT_EMOJI[u.id]} `), `Ünite ${u.id}`),
        studied ? h('span', { class: 'ribbon tag-studied' }, '✓ Çalışıldı') : null,
      ),
      h(
        'div',
        { class: 'unit-body' },
        h('h2', { class: 'unit-title', lang: 'en' }, u.name),
        h('p', { class: 'unit-tr', lang: 'tr' }, u.trName),
        starRow(starsFor(best)),
        h('p', { class: 'unit-tags' }, best ? h('span', { class: 'tag' }, `Alıştırma: ${best.correct}/${best.total}`) : null),
        h(
          'button',
          { type: 'button', class: 'btn btn-unit', onclick: () => ctx.go('study', u.id) },
          `Üniteyi aç: ${u.name}`,
        ),
      ),
    );
  });

  const examCard = h(
    'section',
    { class: 'card exam-card boss-card', 'aria-labelledby': 'exam-card-title' },
    h('div', { class: 'boss-trophy', 'aria-hidden': 'true' }, '🏆'),
    h(
      'div',
      { class: 'boss-body' },
      h('p', { class: 'boss-kicker' }, 'Final seviyesi'),
      h('h2', { id: 'exam-card-title' }, 'Final Sınavı'),
      h('p', null, '10 soru, 15 dakika. Her üniteden bir soru. Önce üniteleri çalışman önerilir.'),
      h(
        'p',
        { class: 'exam-best' },
        progress.bestExam === null ? 'En iyi puan: henüz çözülmedi' : `En iyi puan: ${progress.bestExam}/10`,
      ),
      h(
        'button',
        { type: 'button', class: 'btn btn-primary btn-big', onclick: start },
        session ? `Sınava devam et (${left} kaldı)` : 'Sınava başla',
      ),
    ),
  );

  const hero = h(
    'section',
    { class: 'hero', 'aria-labelledby': 'home-title' },
    h('div', { class: 'hero-mascot' }, mascot('happy')),
    h(
      'div',
      { class: 'hero-text' },
      h('p', { class: 'hero-greeting' }, 'Merhaba! Hazır mısın? 🚀'),
      h('h1', { id: 'home-title' }, 'LGS İngilizce – Ders 1'),
      h(
        'p',
        { class: 'intro' },
        'Bu derste 8. sınıf İngilizce müfredatındaki 10 üniteyi tekrar edeceksin. Her ünitede kelimeleri, kalıpları ve dilbilgisini çalış, kısa alıştırmayı çöz; sonra LGS tarzı final sınavına gir.',
      ),
    ),
    h(
      'div',
      { class: 'hero-progress' },
      progressRing(overall.percent / 100, `%${overall.percent}`),
      h(
        'div',
        { class: 'hero-stats' },
        progressBar(`Genel ilerleme: %${overall.percent}`, overall.percent, 100),
        h('p', { class: 'hero-stat' }, h('span', { 'aria-hidden': 'true' }, '📘 '), `${overall.studied}/10 ünite çalışıldı`),
        h('p', { class: 'hero-stat' }, h('span', { 'aria-hidden': 'true' }, '⭐ '), `${overall.stars}/30 yıldız`),
      ),
    ),
  );

  const el = screenRoot(
    'home',
    hero,
    arg.expired ? h('p', { class: 'card notice', role: 'status' }, 'Önceki sınavın süresi doldu.') : null,
    session
      ? h(
          'div',
          { class: 'resume-banner card' },
          h('p', null, h('span', { 'aria-hidden': 'true' }, '⏳ '), 'Yarım kalmış bir sınavın var.'),
          h('button', { type: 'button', class: 'btn btn-primary', onclick: resume }, `Sınava devam et (${left} kaldı)`),
        )
      : null,
    h('h2', { class: 'section-title' }, h('span', { class: 'section-icon', 'aria-hidden': 'true' }, '🗺️ '), 'Üniteler'),
    h('ul', { class: 'unit-grid' }, unitCards),
    examCard,
  );
  return { el, title: 'Ana sayfa' };
}
