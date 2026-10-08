// Full-width app header: brand + mascot, progress chip, home button.
import { h } from './dom.js';
import { mascot } from './mascot.js';
import { loadProgress } from '../lib/storage.js';
import { overallProgress } from '../lib/gamify.js';

export function createHeader(ctx) {
  const chip = h('p', { class: 'xp-chip' });
  const home = h('button', { type: 'button', class: 'btn home-link', onclick: () => ctx.go('home') }, h('span', { 'aria-hidden': 'true' }, '🏠'), h('span', { class: 'home-label' }, ' Ana sayfa'));
  const el = h(
    'header',
    { class: 'app-header' },
    h(
      'div',
      { class: 'header-inner' },
      h('p', { class: 'brand' }, h('span', { class: 'brand-logo' }, mascot('happy')), h('span', { class: 'brand-name' }, 'LGS İngilizce')),
      chip,
      home,
    ),
  );

  function update(screenName) {
    const o = overallProgress(loadProgress(ctx.store));
    chip.textContent = '';
    chip.append(
      h('span', { class: 'chip-part' }, h('span', { 'aria-hidden': 'true' }, '⭐'), `${o.stars}/30`, h('span', { class: 'chip-label' }, ' yıldız')),
      h('span', { class: 'chip-part' }, h('span', { 'aria-hidden': 'true' }, '📘'), `${o.studied}/10`, h('span', { class: 'chip-label' }, ' ünite')),
    );
    if (screenName !== undefined) {
      if (screenName === 'home') home.setAttribute('aria-current', 'page');
      else home.removeAttribute('aria-current');
    }
  }
  return { el, update };
}
