// Pure results summary. Safe on partly-answered or blank states; never mutates input.
import { score } from './exam.js';
import { UNITS } from '../data/units.js';

const TYPES = ['paragraph', 'visual', 'dialogue', 'vocabulary'];

export function summarize(state) {
  const total = state.questions.length;
  const correct = score(state);
  const byType = Object.fromEntries(TYPES.map((t) => [t, { correct: 0, total: 0 }]));
  const items = state.questions.map((q, index) => {
    const chosen = state.answers[index] ?? null;
    const status = chosen === null ? 'blank' : chosen === q.answer ? 'correct' : 'wrong';
    const unitName = UNITS.find((u) => u.id === q.unit)?.name ?? `Unit ${q.unit}`;
    const bucket = (byType[q.type] ??= { correct: 0, total: 0 });
    bucket.total += 1;
    if (status === 'correct') bucket.correct += 1;
    return { index, unitId: q.unit, unitName, type: q.type, chosen, answer: q.answer, status };
  });
  const seen = new Set();
  const weakUnits = [];
  for (const it of items) {
    if (it.status === 'correct' || seen.has(it.unitId)) continue;
    seen.add(it.unitId);
    weakUnits.push({ unitId: it.unitId, unitName: it.unitName });
  }
  const wrong = items.filter((it) => it.status === 'wrong').length;
  const blank = items.filter((it) => it.status === 'blank').length;
  return { correct, wrong, blank, total, percent: total ? Math.round((correct / total) * 100) : 0, byType, items, weakUnits };
}
