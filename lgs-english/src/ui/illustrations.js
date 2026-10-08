// Decorative inline-SVG unit scenes (viewBox 0 0 320 200). Colours come from the unit theme via
// CSS classes: .il-deep / .il-mid / .il-soft (see styles: [data-unit]). Always aria-hidden.
import { svg } from './dom.js';
export { mascot, MOODS } from './mascot.js';

const SKIN = '#F4C7A1';
const INK = '#1C2233';
const SUN = '#FACC15';
const WHITE = '#FFFFFF';

const deep = (tag, a) => [tag, { ...a, class: 'il-deep' }];
const mid = (tag, a) => [tag, { ...a, class: 'il-mid' }];
const soft = (tag, a) => [tag, { ...a, class: 'il-soft' }];
const fill = (color) => (tag, a) => [tag, { ...a, fill: color }];
const white = fill(WHITE);
const line = (d, stroke, w = 6, extra = {}) => ['path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }];
const heart = (x, y, s) =>
  `M${x} ${y + 22 * s} C${x - 30 * s} ${y} ${x - 20 * s} ${y - 22 * s} ${x} ${y - 8 * s} C${x + 20 * s} ${y - 22 * s} ${x + 30 * s} ${y} ${x} ${y + 22 * s}Z`;
const face = (cx, cy) => [
  fill(SKIN)('circle', { cx, cy, r: 24 }),
  fill(INK)('circle', { cx: cx - 8, cy: cy - 2, r: 3 }),
  fill(INK)('circle', { cx: cx + 8, cy: cy - 2, r: 3 }),
  line(`M${cx - 8} ${cy + 9} Q${cx} ${cy + 16} ${cx + 8} ${cy + 9}`, INK, 3),
];
const sparkle = (x, y, r = 6) =>
  fill(SUN)('path', { d: `M${x} ${y - r * 2} L${x + r * 0.6} ${y - r * 0.6} L${x + r * 2} ${y} L${x + r * 0.6} ${y + r * 0.6} L${x} ${y + r * 2} L${x - r * 0.6} ${y + r * 0.6} L${x - r * 2} ${y} L${x - r * 0.6} ${y - r * 0.6}Z` });

const BACKDROP = [soft('rect', { x: 0, y: 0, width: 320, height: 200, rx: 24 }), white('ellipse', { cx: 160, cy: 186, rx: 150, ry: 22, opacity: 0.7 })];

const SCENES = {
  1: [ // Friendship: two kids holding hands, hearts
    deep('rect', { x: 78, y: 104, width: 58, height: 72, rx: 26 }),
    mid('rect', { x: 184, y: 104, width: 58, height: 72, rx: 26 }),
    line('M130 132 Q160 150 190 132', SKIN, 10),
    ...face(107, 80), ...face(213, 80),
    deep('path', { d: 'M84 70 Q107 40 130 70 Q118 58 107 60 Q96 58 84 70Z' }),
    mid('path', { d: 'M190 72 Q213 38 236 72 L236 92 Q230 66 213 62 Q196 66 190 92Z' }),
    deep('path', { d: heart(160, 40, 1) }),
    mid('path', { d: heart(262, 34, 0.6) }),
    mid('path', { d: heart(54, 44, 0.5) }),
  ],
  2: [ // Teen Life: headphones, music notes, sparkles
    line('M98 126 A62 62 0 0 1 222 126', 'var(--u-deep)', 14),
    mid('rect', { x: 82, y: 108, width: 34, height: 58, rx: 14 }),
    mid('rect', { x: 204, y: 108, width: 34, height: 58, rx: 14 }),
    deep('rect', { x: 90, y: 118, width: 18, height: 38, rx: 8 }),
    deep('rect', { x: 212, y: 118, width: 18, height: 38, rx: 8 }),
    deep('circle', { cx: 150, cy: 130, r: 10 }), line('M159 130 V92 L178 86', 'var(--u-deep)', 5),
    deep('circle', { cx: 268, cy: 70, r: 8 }), line('M275 70 V40', 'var(--u-deep)', 4),
    deep('circle', { cx: 48, cy: 84, r: 8 }), line('M55 84 V54 L68 50', 'var(--u-deep)', 4),
    sparkle(160, 40), sparkle(290, 130, 4), sparkle(30, 140, 4),
  ],
  3: [ // In The Kitchen: pan on flame, steam, chef hat
    fill('#3B3F4C')('ellipse', { cx: 140, cy: 150, rx: 74, ry: 18 }),
    line('M212 148 L290 136', '#3B3F4C', 12),
    fill(SUN)('ellipse', { cx: 120, cy: 144, rx: 20, ry: 10 }),
    fill(WHITE)('ellipse', { cx: 120, cy: 141, rx: 9, ry: 5 }),
    mid('path', { d: 'M90 182 Q100 160 110 182 Q120 158 130 182 Q140 160 150 182 Q160 158 170 182 Q180 160 190 182Z' }),
    line('M110 118 Q100 104 110 90 Q120 76 110 62', 'var(--u-mid)', 5),
    line('M140 116 Q130 100 140 86 Q150 72 140 56', 'var(--u-mid)', 5),
    line('M170 118 Q160 104 170 90 Q180 76 170 62', 'var(--u-mid)', 5),
    white('rect', { x: 226, y: 54, width: 52, height: 34, rx: 6 }),
    white('circle', { cx: 236, cy: 46, r: 16 }), white('circle', { cx: 256, cy: 38, r: 18 }), white('circle', { cx: 272, cy: 48, r: 15 }),
    deep('rect', { x: 226, y: 80, width: 52, height: 10, rx: 4 }),
  ],
  4: [ // On The Phone: smartphone with chat bubbles
    deep('rect', { x: 118, y: 22, width: 84, height: 160, rx: 18 }),
    white('rect', { x: 126, y: 40, width: 68, height: 124, rx: 8 }),
    mid('rect', { x: 132, y: 50, width: 46, height: 20, rx: 10 }),
    soft('rect', { x: 142, y: 78, width: 46, height: 20, rx: 10, stroke: 'var(--u-deep)', 'stroke-width': 2 }),
    mid('rect', { x: 132, y: 106, width: 40, height: 20, rx: 10 }),
    white('circle', { cx: 160, cy: 173, r: 5 }),
    mid('path', { d: 'M222 46 h70 a12 12 0 0 1 12 12 v22 a12 12 0 0 1 -12 12 h-48 l-14 12 v-12 h-8 a12 12 0 0 1 -12 -12 v-22 a12 12 0 0 1 12 -12Z' }),
    white('circle', { cx: 244, cy: 69, r: 5 }), white('circle', { cx: 260, cy: 69, r: 5 }), white('circle', { cx: 276, cy: 69, r: 5 }),
    deep('path', { d: 'M98 110 h-62 a12 12 0 0 0 -12 12 v18 a12 12 0 0 0 12 12 h40 l14 12 v-12 h8 a12 12 0 0 0 12 -12 v-18 a12 12 0 0 0 -12 -12Z' }),
    deep('path', { d: heart(66, 128, 0.35) }),
  ],
  5: [ // The Internet: globe, wifi, browser window
    white('rect', { x: 186, y: 40, width: 112, height: 86, rx: 10, stroke: 'var(--u-deep)', 'stroke-width': 3 }),
    deep('rect', { x: 186, y: 40, width: 112, height: 18, rx: 8 }),
    white('circle', { cx: 198, cy: 49, r: 3 }), white('circle', { cx: 208, cy: 49, r: 3 }), white('circle', { cx: 218, cy: 49, r: 3 }),
    soft('rect', { x: 196, y: 68, width: 92, height: 10, rx: 5 }), mid('rect', { x: 196, y: 86, width: 60, height: 10, rx: 5 }), soft('rect', { x: 196, y: 104, width: 76, height: 10, rx: 5 }),
    mid('circle', { cx: 104, cy: 110, r: 60 }),
    line('M44 110 H164 M104 50 V170', WHITE, 3),
    ['ellipse', { cx: 104, cy: 110, rx: 26, ry: 60, fill: 'none', stroke: WHITE, 'stroke-width': 3 }],
    line('M54 80 Q104 96 154 80 M54 140 Q104 124 154 140', WHITE, 3),
    line('M226 160 Q244 146 262 160', 'var(--u-deep)', 6), line('M214 148 Q244 124 274 148', 'var(--u-deep)', 6),
    deep('circle', { cx: 244, cy: 172, r: 6 }),
  ],
  6: [ // Adventures: mountains, flag, sun
    fill(SUN)('circle', { cx: 262, cy: 50, r: 24 }),
    mid('polygon', { points: '10,182 110,62 210,182' }),
    deep('polygon', { points: '120,182 210,48 310,182' }),
    white('polygon', { points: '110,62 92,84 104,80 116,90 128,82' }),
    white('polygon', { points: '210,48 190,78 204,72 214,84 228,74' }),
    line('M210 48 V14', INK, 4), fill('#EF4444')('polygon', { points: '212,14 240,22 212,30' }),
    white('ellipse', { cx: 60, cy: 40, rx: 26, ry: 10 }), white('ellipse', { cx: 80, cy: 34, rx: 18, ry: 10 }),
  ],
  7: [ // Tourism: plane, suitcase, tower, sun
    fill(SUN)('circle', { cx: 50, cy: 46, r: 22 }),
    deep('path', { d: 'M150 50 L250 40 Q268 40 268 48 Q268 56 250 56 L150 52Z' }),
    mid('polygon', { points: '196,46 172,20 186,20 220,46' }), mid('polygon', { points: '196,52 176,76 190,76 220,52' }),
    line('M110 60 Q130 50 146 52', 'var(--u-mid)', 3, { 'stroke-dasharray': '6 6' }),
    deep('rect', { x: 40, y: 104, width: 82, height: 64, rx: 10 }),
    line('M66 104 V92 H96 V104', 'var(--u-deep)', 6),
    mid('rect', { x: 40, y: 126, width: 82, height: 10 }),
    fill(INK)('circle', { cx: 56, cy: 172, r: 5 }), fill(INK)('circle', { cx: 106, cy: 172, r: 5 }),
    mid('rect', { x: 206, y: 98, width: 40, height: 84, rx: 4 }),
    deep('polygon', { points: '200,100 226,62 252,100' }),
    white('rect', { x: 218, y: 112, width: 16, height: 18, rx: 8 }), white('rect', { x: 218, y: 142, width: 16, height: 18, rx: 8 }),
  ],
  8: [ // Chores: bucket, broom, bubbles
    deep('path', { d: 'M60 110 H140 L130 178 H70Z' }),
    line('M64 110 Q100 70 136 110', 'var(--u-deep)', 5),
    white('ellipse', { cx: 100, cy: 110, rx: 40, ry: 8 }),
    line('M230 20 L190 140', '#8B5A2B', 8),
    mid('polygon', { points: '176,136 206,146 196,184 150,170' }),
    line('M160 172 L176 140 M172 176 L186 144 M184 180 L196 148', 'var(--u-deep)', 3),
    ['circle', { cx: 84, cy: 70, r: 14, fill: WHITE, stroke: 'var(--u-mid)', 'stroke-width': 3 }],
    ['circle', { cx: 118, cy: 50, r: 10, fill: WHITE, stroke: 'var(--u-mid)', 'stroke-width': 3 }],
    ['circle', { cx: 262, cy: 92, r: 16, fill: WHITE, stroke: 'var(--u-mid)', 'stroke-width': 3 }],
    ['circle', { cx: 284, cy: 140, r: 9, fill: WHITE, stroke: 'var(--u-mid)', 'stroke-width': 3 }],
    sparkle(250, 40, 5),
  ],
  9: [ // Science: flask, atom, stars
    white('path', { d: 'M76 30 H116 V80 L150 160 Q156 178 136 178 H56 Q36 178 42 160 L76 80Z', stroke: 'var(--u-deep)', 'stroke-width': 4 }),
    mid('path', { d: 'M60 128 H132 L148 162 Q152 172 138 172 H54 Q40 172 44 162Z' }),
    white('circle', { cx: 80, cy: 150, r: 6 }), white('circle', { cx: 104, cy: 140, r: 4 }), white('circle', { cx: 118, cy: 158, r: 5 }),
    ['ellipse', { cx: 232, cy: 100, rx: 62, ry: 22, fill: 'none', stroke: 'var(--u-deep)', 'stroke-width': 4 }],
    ['ellipse', { cx: 232, cy: 100, rx: 62, ry: 22, fill: 'none', stroke: 'var(--u-deep)', 'stroke-width': 4, transform: 'rotate(60 232 100)' }],
    ['ellipse', { cx: 232, cy: 100, rx: 62, ry: 22, fill: 'none', stroke: 'var(--u-deep)', 'stroke-width': 4, transform: 'rotate(120 232 100)' }],
    mid('circle', { cx: 232, cy: 100, r: 12 }),
    sparkle(160, 36, 6), sparkle(292, 30, 4), sparkle(176, 170, 4),
  ],
  10: [ // Natural Forces: volcano, lava, smoke, lightning, waves
    fill('#9CA3AF')('circle', { cx: 120, cy: 40, r: 18 }), fill('#9CA3AF')('circle', { cx: 142, cy: 30, r: 14 }), fill('#9CA3AF')('circle', { cx: 100, cy: 30, r: 12 }),
    deep('polygon', { points: '30,180 104,70 140,70 214,180' }),
    mid('path', { d: 'M104 70 H140 L132 92 Q126 84 122 100 Q118 86 112 94Z' }),
    mid('circle', { cx: 112, cy: 56, r: 6 }), mid('circle', { cx: 132, cy: 50, r: 5 }),
    fill(SUN)('polygon', { points: '256,14 228,74 250,74 236,118 284,52 260,52 274,14' }),
    line('M196 170 Q212 156 228 170 T260 170 T292 170', 'var(--u-mid)', 6),
    line('M206 186 Q222 172 238 186 T270 186 T302 186', 'var(--u-deep)', 6),
  ],
};

// var() is not reliable inside SVG presentation attributes, so theme colours move to `style`.
function themed(attrs) {
  const out = { ...attrs };
  const style = [];
  for (const k of ['fill', 'stroke']) {
    if (typeof out[k] === 'string' && out[k].startsWith('var(')) {
      style.push(`${k}:${out[k]}`);
      delete out[k];
    }
  }
  if (style.length) out.style = style.join(';');
  return out;
}

function build(cls, viewBox, shapes) {
  return svg(
    'svg',
    { class: cls, viewBox, 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'xMidYMid meet' },
    shapes.map(([tag, attrs]) => svg(tag, themed(attrs))),
  );
}

/** Decorative scene for a unit (1..10); unknown ids get a generic sparkle scene. */
export function unitIllustration(unitId) {
  const scene = SCENES[unitId] ?? [sparkle(110, 90, 10), sparkle(200, 110, 8), sparkle(160, 60, 5), mid('circle', { cx: 160, cy: 120, r: 30 })];
  return build('illus', '0 0 320 200', [...BACKDROP, ...scene]);
}
