import { describe, it, expect } from 'vitest';
import { h, svg } from '../src/ui/dom.js';
import { renderExhibit } from '../src/ui/exhibits.js';

const XSS = '<img src=x onerror=alert(1)>';

describe('h helper', () => {
  it('sets class, id, text and attributes', () => {
    const el = h('div', { class: 'a b', id: 'x', 'data-k': '1', role: 'note', text: 'hi' });
    expect(el.className).toBe('a b');
    expect(el.id).toBe('x');
    expect(el.getAttribute('data-k')).toBe('1');
    expect(el.getAttribute('role')).toBe('note');
    expect(el.textContent).toBe('hi');
  });
  it('handles boolean / nullish attributes', () => {
    const el = h('button', { disabled: true, hidden: false, 'aria-label': null, tabindex: undefined });
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.hasAttribute('hidden')).toBe(false);
    expect(el.hasAttribute('aria-label')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
  });
  it('wires on<Event> listeners', () => {
    let n = 0;
    const el = h('button', { onclick: () => n++ });
    el.click();
    expect(n).toBe(1);
  });
  it('flattens children, skips null/false, strings become text', () => {
    const el = h('p', null, 'a', [h('b', null, 'b'), ['c', null, false]], null, false);
    expect(el.textContent).toBe('abc');
    expect(el.querySelector('b')).not.toBeNull();
  });
  it('does not parse strings as HTML', () => {
    const el = h('p', null, XSS);
    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent).toBe(XSS);
  });
  it('svg creates namespaced elements', () => {
    const el = svg('rect', { width: 5 });
    expect(el.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(el.getAttribute('width')).toBe('5');
  });
});

describe('hardening', () => {
  it('non-function on* values are not set as attributes', () => {
    const el = h('div', { onclick: 'alert(1)', onmouseover: 5 });
    expect(el.hasAttribute('onclick')).toBe(false);
    expect(el.hasAttribute('onmouseover')).toBe(false);
  });
  it('negative / non-finite values clamp to zero height', () => {
    const el = renderExhibit({ kind: 'barChart', title: 'T', unitLabel: 'u', bars: [{ label: 'A', value: -5 }, { label: 'B', value: NaN }, { label: 'C', value: 4 }] });
    const hs = [...el.querySelectorAll('rect')].map((r) => Number(r.getAttribute('height')));
    expect(hs[0]).toBe(0);
    expect(hs[1]).toBe(0);
    expect(hs[2]).toBeGreaterThan(0);
  });
  it('bar heights are proportional', () => {
    const el = renderExhibit({ kind: 'barChart', title: 'T', unitLabel: 'u', bars: [{ label: 'A', value: 10 }, { label: 'B', value: 20 }] });
    const hs = [...el.querySelectorAll('rect')].map((r) => Number(r.getAttribute('height')));
    expect(hs[1]).toBeCloseTo(hs[0] * 2, 1);
  });
  it('table wrapper is keyboard-scrollable region', () => {
    const el = renderExhibit({ kind: 'table', caption: 'Cap', headers: ['A'], rows: [['1']] });
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-label')).toBe('Cap');
  });
  it('gap has accessible blank text and keeps underscores', () => {
    const el = renderExhibit({ kind: 'dialogue', lines: [{ speaker: 'A', text: 'x _____ y' }] });
    expect(el.querySelector('.gap .visually-hidden').textContent).toBe('boşluk');
    expect(el.querySelector('.gap [aria-hidden="true"]').textContent).toBe('_____');
  });
  it('script/b payloads create no elements', () => {
    const P = '<script>alert(1)</script><b>x</b>';
    const els = [
      renderExhibit({ kind: 'passage', text: P }),
      renderExhibit({ kind: 'table', caption: 'c', headers: ['h'], rows: [[P]] }),
    ];
    for (const el of els) {
      expect(el.querySelector('script')).toBeNull();
      expect(el.querySelector('b')).toBeNull();
      expect(el.textContent).toContain(P);
    }
  });
});

describe('renderExhibit', () => {
  it('passage', () => {
    const el = renderExhibit({ kind: 'passage', title: 'T', text: 'Body text.' });
    expect(el.querySelector('blockquote')).not.toBeNull();
    expect(el.textContent).toContain('T');
    expect(el.textContent).toContain('Body text.');
  });
  it('dialogue with gap', () => {
    const el = renderExhibit({ kind: 'dialogue', lines: [{ speaker: 'Ali', text: 'Hi' }, { speaker: 'Zeynep', text: 'I _____ it.' }] });
    expect(el.textContent).toContain('Ali');
    expect(el.textContent).toContain('_____');
    expect(el.querySelector('.gap')).not.toBeNull();
  });
  it('table: one th per header, one td per cell, caption', () => {
    const ex = { kind: 'table', caption: 'Cap', headers: ['A', 'B', 'C'], rows: [['1', '2', '3'], ['4', '5', '6']] };
    const el = renderExhibit(ex);
    expect(el.querySelector('caption').textContent).toBe('Cap');
    expect(el.querySelectorAll('th[scope="col"]').length).toBe(3);
    expect(el.querySelectorAll('td').length).toBe(6);
    expect(el.querySelectorAll('th').length).toBe(3);
  });
  it('barChart: rects, tallest, hidden alternative', () => {
    const ex = { kind: 'barChart', title: 'Sports', unitLabel: 'students', bars: [{ label: 'A', value: 5 }, { label: 'B', value: 20 }, { label: 'C', value: 10 }] };
    const el = renderExhibit(ex);
    const s = el.querySelector('svg');
    expect(s.getAttribute('role')).toBe('img');
    expect(s.querySelector('title').textContent).toContain('Sports');
    const rects = [...el.querySelectorAll('svg rect')];
    expect(rects.length).toBe(3);
    const hs = rects.map((r) => Number(r.getAttribute('height')));
    expect(hs[1]).toBe(Math.max(...hs));
    expect(hs[1]).toBeGreaterThan(hs[2]);
    expect(hs[2]).toBeGreaterThan(hs[0]);
    const alt = el.querySelector('.visually-hidden table');
    expect(alt).not.toBeNull();
    expect(alt.textContent).toContain('students');
    expect(alt.querySelectorAll('tbody tr').length).toBe(3);
    expect(el.querySelectorAll('svg text').length).toBeGreaterThanOrEqual(6);
  });
  it('barChart: zero max has no NaN', () => {
    const el = renderExhibit({ kind: 'barChart', title: 'Z', unitLabel: 'u', bars: [{ label: 'A', value: 0 }, { label: 'B', value: 0 }] });
    for (const node of el.querySelectorAll('svg *')) {
      for (const a of node.attributes) expect(a.value).not.toMatch(/NaN|Infinity/);
    }
    expect([...el.querySelectorAll('rect')].every((r) => Number(r.getAttribute('height')) === 0)).toBe(true);
  });
  it('poster', () => {
    const el = renderExhibit({ kind: 'poster', heading: 'HEAD', lines: ['l1', 'l2'] });
    expect(el.textContent).toContain('HEAD');
    expect(el.querySelectorAll('li, p').length).toBeGreaterThanOrEqual(2);
  });
  it('unknown kind does not throw', () => {
    expect(() => renderExhibit({ kind: 'nope' })).not.toThrow();
  });
  it('injection: everything renders as text', () => {
    const cases = [
      { kind: 'passage', title: XSS, text: XSS },
      { kind: 'dialogue', lines: [{ speaker: XSS, text: XSS + ' _____' }] },
      { kind: 'table', caption: XSS, headers: [XSS], rows: [[XSS]] },
      { kind: 'barChart', title: XSS, unitLabel: XSS, bars: [{ label: XSS, value: 3 }] },
      { kind: 'poster', heading: XSS, lines: [XSS] },
    ];
    for (const ex of cases) {
      const el = renderExhibit(ex);
      expect(el.querySelector('img')).toBeNull();
      expect(el.textContent).toContain(XSS);
    }
  });
});
