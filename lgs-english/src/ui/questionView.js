// Shared renderer: exhibit + stem + A–D option buttons (used by practice, exam and results).
import { h } from './dom.js';
import { renderExhibit } from './exhibits.js';

export const LETTERS = ['A', 'B', 'C', 'D'];

export function renderStem(stem) {
  return h(
    'div',
    { class: 'stem' },
    String(stem)
      .split(/\n{2,}/)
      .map((p) => h('p', null, p)),
  );
}

/**
 * opts: { selected?: number|null, reveal?: { chosen: number|null } | null, onChoose?: (i) => void }
 * With `reveal`, options are marked correct/incorrect with visible text (R9).
 */
export function renderOptions(q, { selected = null, reveal = null, onChoose } = {}) {
  return h(
    'div',
    { class: 'options', role: 'group', 'aria-label': 'Seçenekler' },
    q.options.map((text, i) => {
      const cls = ['option'];
      let note = null;
      if (reveal) {
        if (i === q.answer) {
          cls.push('correct');
          note = 'Doğru cevap';
        } else if (i === reveal.chosen) {
          cls.push('incorrect');
          note = 'Senin cevabın';
        }
        if (i === q.answer && i === reveal.chosen) note = 'Doğru cevap (senin cevabın)';
      } else if (i === selected) cls.push('selected');
      const label = `${LETTERS[i]}: ${text}${note ? ` (${note})` : ''}`;
      return h(
        'button',
        {
          type: 'button',
          class: cls.join(' '),
          'aria-label': label,
          'aria-pressed': reveal ? null : String(i === selected),
          'aria-disabled': reveal ? 'true' : null,
          'data-index': String(i),
          onclick: onChoose ? () => onChoose(i) : null,
        },
        h('span', { class: 'letter', 'aria-hidden': 'true' }, LETTERS[i]),
        h('span', { class: 'option-text' }, text),
        note ? h('span', { class: 'option-note' }, note) : null,
      );
    }),
  );
}

export function renderQuestion(q, opts) {
  return h(
    'div',
    { class: 'question' },
    q.exhibit ? renderExhibit(q.exhibit) : null,
    renderStem(q.stem),
    renderOptions(q, opts),
  );
}

export function screenRoot(name, ...children) {
  return h('main', { class: 'screen', 'data-screen': name, tabindex: '-1' }, ...children);
}
