import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const doc = new DOMParser().parseFromString(html, 'text/html');

describe('index.html translation guard', () => {
  it('has <meta name="google" content="notranslate">', () => {
    const m = doc.querySelector('meta[name="google"]');
    expect(m).not.toBeNull();
    expect(m.getAttribute('content')).toBe('notranslate');
  });
  it('#app has translate="no" and the page stays lang="tr"', () => {
    expect(doc.getElementById('app').getAttribute('translate')).toBe('no');
    expect(doc.documentElement.getAttribute('lang')).toBe('tr');
  });
});
