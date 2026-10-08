// "Lingo" the owl mascot as a decorative inline SVG. Moods: happy | cheer | think | oops.
import { svg } from './dom.js';

export const MOODS = ['happy', 'cheer', 'think', 'oops'];

const BODY = '#7C3AED';
const BELLY = '#EDE9FE';
const INK = '#1C2233';
const BEAK = '#F59E0B';
const SUN = '#FACC15';

const s = (tag, attrs) => svg(tag, attrs);
const stroke = (d, color = INK, w = 4) =>
  s('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });

function eyes(dx, dy) {
  return [
    s('circle', { cx: 46, cy: 50, r: 16, fill: '#fff' }),
    s('circle', { cx: 74, cy: 50, r: 16, fill: '#fff' }),
    s('circle', { cx: 46 + dx, cy: 50 + dy, r: 7, fill: INK }),
    s('circle', { cx: 74 + dx, cy: 50 + dy, r: 7, fill: INK }),
    s('circle', { cx: 48 + dx, cy: 47 + dy, r: 2.2, fill: '#fff' }),
    s('circle', { cx: 76 + dx, cy: 47 + dy, r: 2.2, fill: '#fff' }),
  ];
}

const MOOD_PARTS = {
  happy: () => [
    ...eyes(0, 1),
    stroke('M50 82 Q60 90 70 82'),
    s('ellipse', { cx: 20, cy: 92, rx: 10, ry: 22, fill: BODY, transform: 'rotate(15 20 92)' }),
    s('ellipse', { cx: 100, cy: 92, rx: 10, ry: 22, fill: BODY, transform: 'rotate(-15 100 92)' }),
  ],
  cheer: () => [
    ...eyes(0, -1),
    s('path', { d: 'M48 80 Q60 96 72 80Z', fill: '#B91C1C' }),
    s('ellipse', { cx: 16, cy: 56, rx: 10, ry: 24, fill: BODY, transform: 'rotate(-35 16 56)' }),
    s('ellipse', { cx: 104, cy: 56, rx: 10, ry: 24, fill: BODY, transform: 'rotate(35 104 56)' }),
    s('path', { d: 'M8 20 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z', fill: SUN }),
    s('path', { d: 'M110 14 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z', fill: SUN }),
  ],
  think: () => [
    ...eyes(4, -5),
    stroke('M52 84 H68'),
    s('ellipse', { cx: 20, cy: 92, rx: 10, ry: 22, fill: BODY, transform: 'rotate(15 20 92)' }),
    s('ellipse', { cx: 84, cy: 84, rx: 9, ry: 20, fill: BODY, transform: 'rotate(-60 84 84)' }),
    s('circle', { cx: 106, cy: 18, r: 12, fill: '#fff', stroke: BODY, 'stroke-width': 3 }),
    stroke('M102 14 Q106 8 110 14 Q110 18 106 20 V22', BODY, 3),
  ],
  oops: () => [
    ...eyes(0, 2),
    stroke('M50 86 Q55 80 60 86 Q65 92 70 86'),
    s('path', { d: 'M96 30 Q102 40 96 44 Q90 40 96 30Z', fill: '#60A5FA' }),
    s('ellipse', { cx: 20, cy: 92, rx: 10, ry: 22, fill: BODY, transform: 'rotate(15 20 92)' }),
    s('ellipse', { cx: 100, cy: 92, rx: 10, ry: 22, fill: BODY, transform: 'rotate(-15 100 92)' }),
  ],
};

/** Friendly owl mascot (decorative, aria-hidden). Unknown moods fall back to 'happy'. */
export function mascot(mood = 'happy') {
  const m = MOODS.includes(mood) ? mood : 'happy';
  return svg(
    'svg',
    { class: `mascot mascot-${m}`, viewBox: '0 0 120 140', 'aria-hidden': 'true', focusable: 'false' },
    s('ellipse', { cx: 60, cy: 134, rx: 36, ry: 5, fill: 'rgba(28,34,51,0.15)' }),
    s('path', { d: 'M24 30 L30 8 L44 24Z', fill: BODY }),
    s('path', { d: 'M96 30 L90 8 L76 24Z', fill: BODY }),
    s('ellipse', { cx: 60, cy: 76, rx: 42, ry: 56, fill: BODY }),
    s('ellipse', { cx: 60, cy: 96, rx: 28, ry: 32, fill: BELLY }),
    stroke('M48 98 q4 4 8 0 M64 98 q4 4 8 0 M56 110 q4 4 8 0', '#C4B5FD', 2.5),
    ...MOOD_PARTS[m](),
    s('path', { d: 'M54 64 L66 64 L60 74Z', fill: BEAK }),
    s('ellipse', { cx: 48, cy: 130, rx: 8, ry: 4, fill: BEAK }),
    s('ellipse', { cx: 72, cy: 130, rx: 8, ry: 4, fill: BEAK }),
  );
}
