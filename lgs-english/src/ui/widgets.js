// Small shared visual widgets: progress ring, star row, linear progress bar, confetti.
import { h, svg } from './dom.js';
import { ringGeometry } from '../lib/gamify.js';

/** Decorative SVG ring; pair it with visible text (the ring itself is aria-hidden). */
export function progressRing(fraction, centerText, cls = '') {
  const r = 52;
  const g = ringGeometry(fraction, r);
  return h(
    'div',
    { class: `ring ${cls}`.trim() },
    svg(
      'svg',
      { viewBox: '0 0 120 120', 'aria-hidden': 'true', focusable: 'false' },
      svg('circle', { class: 'ring-track', cx: 60, cy: 60, r, fill: 'none', 'stroke-width': 12 }),
      svg('circle', {
        class: 'ring-fill', cx: 60, cy: 60, r, fill: 'none', 'stroke-width': 12, 'stroke-linecap': 'round',
        'stroke-dasharray': g.circumference.toFixed(2), 'stroke-dashoffset': g.offset.toFixed(2), transform: 'rotate(-90 60 60)',
      }),
    ),
    h('span', { class: 'ring-text', 'aria-hidden': 'true' }, centerText),
  );
}

/** k of 3 stars, glyphs decorative, with a visible text alternative "k/3 yıldız". */
export function starRow(k) {
  return h(
    'p',
    { class: 'stars' },
    h('span', { class: 'star-glyphs', 'aria-hidden': 'true' }, [0, 1, 2].map((i) => h('span', { class: i < k ? 'star on' : 'star off' }, '★'))),
    h('span', { class: 'star-text' }, `${k}/3 yıldız`),
  );
}

/** Accessible linear progress bar with a visible label. */
export function progressBar(label, value, max, cls = '') {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return h(
    'div',
    { class: `bar-wrap ${cls}`.trim() },
    h('p', { class: 'bar-label' }, label),
    h(
      'div',
      { class: 'progress', role: 'progressbar', 'aria-label': label, 'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(value) },
      h('div', { class: 'progress-fill', style: `width: ${pct}%` }),
    ),
  );
}

/** Pure-CSS confetti burst (decorative; hidden under prefers-reduced-motion). */
export function confetti(count = 24) {
  return h(
    'div',
    { class: 'confetti', 'aria-hidden': 'true' },
    Array.from({ length: count }, (_, i) =>
      h('span', { class: `confetti-piece c${i % 6}`, style: `--i:${i};--x:${(i * 37) % 100}%;--d:${(i % 5) * 0.12}s` }),
    ),
  );
}
