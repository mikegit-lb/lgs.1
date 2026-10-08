// App shell: in-memory screen switching with per-screen disposal.
import { homeView } from './homeView.js';
import { studyView } from './studyView.js';
import { practiceView } from './practiceView.js';
import { examView } from './examView.js';
import { resultsView } from './resultsView.js';
import { h } from './dom.js';
import { createHeader } from './header.js';

const VIEWS = { home: homeView, study: studyView, practice: practiceView, exam: examView, results: resultsView };

/**
 * deps: { store?, now?, setIntervalFn?, clearIntervalFn? } — all optional.
 * Returns { destroy } (stops timers/listeners of the current screen).
 */
export function mountApp(root, deps = {}) {
  let dispose = null;
  let destroyed = false;
  const ctx = {
    store: deps.store, // undefined -> storage.js falls back to localStorage
    now: deps.now ?? (() => Date.now()),
    setIntervalFn: deps.setIntervalFn ?? ((fn, ms) => setInterval(fn, ms)),
    clearIntervalFn: deps.clearIntervalFn ?? ((id) => clearInterval(id)),
    go,
    refresh: () => header.update(),
    setChromeInert: (on) => header.el.toggleAttribute('inert', !!on),
  };
  const header = createHeader(ctx);
  const content = h('div', { class: 'app-content' });
  root.classList.add('app-shell');
  root.setAttribute('translate', 'no');
  root.textContent = '';
  root.append(header.el, content);

  function go(name, arg) {
    if (destroyed) return;
    if (dispose) {
      const d = dispose;
      dispose = null;
      d();
    }
    content.textContent = '';
    header.el.removeAttribute('inert');
    const view = VIEWS[name](ctx, arg);
    dispose = view.dispose ?? null;
    content.appendChild(view.el);
    header.update(view.el.dataset.screen);
    if (typeof document !== 'undefined') {
      if (view.title) document.title = `${view.title} | LGS İngilizce`;
      const h1 = view.el.querySelector('h1');
      if (h1) {
        h1.setAttribute('tabindex', '-1');
        h1.focus();
      }
      if (typeof window !== 'undefined' && window.scrollTo && !/jsdom/i.test(navigator.userAgent)) {
        window.scrollTo(0, 0);
      }
    }
  }

  go('home');
  return {
    destroy() {
      if (dispose) dispose();
      dispose = null;
      destroyed = true;
      root.textContent = '';
    },
  };
}
