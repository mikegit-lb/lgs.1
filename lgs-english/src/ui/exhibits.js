import { h, svg } from './dom.js';

const GAP = '_____';
let chartSeq = 0;

function withGap(text) {
  const parts = String(text).split(GAP);
  const out = [];
  parts.forEach((part, i) => {
    if (i > 0) out.push(h('span', { class: 'gap' }, h('span', { class: 'visually-hidden' }, 'blank'), h('span', { 'aria-hidden': 'true' }, GAP)));
    if (part) out.push(part);
  });
  return out;
}

function passage(ex) {
  return h(
    'figure',
    { class: 'exhibit exhibit-passage' },
    ex.title ? h('figcaption', { class: 'exhibit-title' }, ex.title) : null,
    h('blockquote', null, ex.text),
  );
}

function dialogue(ex) {
  return h(
    'div',
    { class: 'exhibit exhibit-dialogue' },
    ex.lines.map((l) =>
      h('p', { class: 'dialogue-line' }, h('strong', { class: 'speaker' }, `${l.speaker}: `), withGap(l.text)),
    ),
  );
}

function table(ex) {
  return h(
    'div',
    { class: 'exhibit exhibit-table table-scroll', tabindex: '0', role: 'region', 'aria-label': ex.caption },
    h(
      'table',
      null,
      h('caption', null, ex.caption),
      h('thead', null, h('tr', null, ex.headers.map((t) => h('th', { scope: 'col' }, t)))),
      h('tbody', null, ex.rows.map((row) => h('tr', null, row.map((c) => h('td', null, c))))),
    ),
  );
}

function barChart(ex) {
  const bars = ex.bars;
  const max = Math.max(0, ...bars.map((b) => num(b.value)));
  const W = 360;
  const H = 220;
  const top = 28;
  const bottom = 40;
  const plotH = H - top - bottom;
  const slot = W / Math.max(1, bars.length);
  const barW = Math.min(56, slot * 0.6);
  const id = `chart-title-${++chartSeq}`;
  const base = top + plotH;

  const marks = bars.map((b, i) => {
    const v = num(b.value);
    const bh = max > 0 ? (v / max) * plotH : 0;
    const x = i * slot + (slot - barW) / 2;
    const cx = x + barW / 2;
    return [
      svg('rect', { class: 'bar', x: round(x), y: round(base - bh), width: round(barW), height: round(bh) }),
      svg('text', { class: 'bar-value', x: round(cx), y: round(base - bh - 6), 'text-anchor': 'middle' }, String(b.value)),
      svg('text', { class: 'bar-label', x: round(cx), y: base + 18, 'text-anchor': 'middle' }, b.label),
    ];
  });

  const chart = svg(
    'svg',
    { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-labelledby': id, class: 'bar-chart' },
    svg('title', { id }, `${ex.title} (${ex.unitLabel})`),
    svg('line', { class: 'axis', x1: 0, y1: base, x2: W, y2: base }),
    marks,
  );

  const alt = h(
    'div',
    { class: 'visually-hidden' },
    h(
      'table',
      null,
      h('caption', null, `${ex.title} (${ex.unitLabel})`),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Category'), h('th', { scope: 'col' }, ex.unitLabel))),
      h('tbody', null, bars.map((b) => h('tr', null, h('td', null, b.label), h('td', null, String(b.value))))),
    ),
  );

  return h(
    'figure',
    { class: 'exhibit exhibit-chart' },
    h('figcaption', { class: 'exhibit-title', 'aria-hidden': 'true' }, ex.title),
    chart,
    alt,
  );
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

function poster(ex) {
  return h(
    'div',
    { class: 'exhibit exhibit-poster' },
    h('h3', { class: 'poster-heading' }, ex.heading),
    h('ul', null, ex.lines.map((l) => h('li', null, l))),
  );
}

const RENDERERS = { passage, dialogue, table, barChart, poster };

export function renderExhibit(exhibit) {
  const fn = exhibit && RENDERERS[exhibit.kind];
  if (!fn) return h('div', { class: 'exhibit' });
  return fn(exhibit);
}
