// Validators return arrays of human-readable problem strings (empty = valid).
const GAP = '_____';
const TYPES = ['paragraph', 'visual', 'dialogue', 'vocabulary'];
const EXAM_COUNTS = { paragraph: 3, visual: 3, dialogue: 2, vocabulary: 2 };
const PRACTICE_COUNTS = { paragraph: 8, visual: 8, dialogue: 7, vocabulary: 7 };

const countTypes = (qs) => {
  const c = Object.fromEntries(TYPES.map((t) => [t, 0]));
  for (const q of qs) if (q.type in c) c[q.type] += 1;
  return c;
};
const countsDiffer = (qs, want) => {
  const got = countTypes(qs);
  return TYPES.some((t) => got[t] !== want[t]) ? got : null;
};
const passageText = (q) => (q.exhibit && q.exhibit.kind === 'passage' ? q.exhibit.text : null);

// --- per-question rules ---
const checkOptionCount = (q) =>
  Array.isArray(q.options) && q.options.length === 4 ? [] : ['options must have 4 entries'];
const checkAnswer = (q) =>
  Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3 ? [] : ['answer must be an integer 0..3'];
const checkDuplicateOptions = (q) =>
  Array.isArray(q.options) && new Set(q.options).size !== q.options.length ? ['duplicate option text'] : [];
const checkExplanation = (q) =>
  typeof q.explanationTr === 'string' && q.explanationTr.trim() ? [] : ['explanationTr must be non-empty'];
const checkExhibitPresent = (q) =>
  q.type !== 'vocabulary' && !q.exhibit ? ['exhibit required for non-vocabulary question'] : [];
const checkDialogue = (q) => {
  if (q.type !== 'dialogue') return [];
  if (!q.exhibit || q.exhibit.kind !== 'dialogue') return ['dialogue question needs a dialogue exhibit'];
  const gaps = q.exhibit.lines.filter((l) => l.text.includes(GAP)).length;
  const inStem = typeof q.stem === 'string' && q.stem.includes(GAP);
  return gaps + (inStem ? 1 : 0) === 1 && gaps <= 1 ? [] : ['dialogue gap "_____" must appear in exactly one line or in the stem'];
};
const checkBarChart = (q) => {
  if (!q.exhibit || q.exhibit.kind !== 'barChart') return [];
  return q.exhibit.bars.some((b) => !Number.isFinite(b.value) || b.value < 0)
    ? ['barChart value must be finite and non-negative'] : [];
};
const checkTable = (q) => {
  if (!q.exhibit || q.exhibit.kind !== 'table') return [];
  const n = q.exhibit.headers.length;
  return q.exhibit.rows.some((r) => r.length !== n) ? ['table row length must equal headers length'] : [];
};

const QUESTION_RULES = [checkOptionCount, checkAnswer, checkDuplicateOptions, checkExplanation,
  checkExhibitPresent, checkDialogue, checkBarChart, checkTable];

export function validateQuestion(q) {
  return QUESTION_RULES.flatMap((r) => r(q));
}

const questionProblems = (qs) =>
  qs.flatMap((q) => validateQuestion(q).map((p) => `${q.id}: ${p}`));

// --- exam rules ---
export function validateExam(qs) {
  if (qs.length !== 10) return [`exam must have exactly 10 questions (got ${qs.length})`];
  const out = [];
  if (!qs.every((q, i) => q.unit === i + 1)) out.push('exam unit order must be 1..10');
  const bad = countsDiffer(qs, EXAM_COUNTS);
  if (bad) out.push(`exam type counts must be paragraph 3, visual 3, dialogue 2, vocabulary 2 (got ${JSON.stringify(bad)})`);
  return [...out, ...questionProblems(qs)];
}

// --- practice rules ---
export function validatePractice(qs, exam) {
  const out = [];
  if (qs.length !== 30) out.push(`practice must have exactly 30 questions (got ${qs.length})`);
  for (let u = 1; u <= 10; u++) {
    const drills = qs.filter((q) => q.unit === u);
    if (drills.length !== 3) out.push(`unit ${u} must have 3 drills (got ${drills.length})`);
    else if (new Set(drills.map((d) => d.type)).size < 2) out.push(`unit ${u} needs at least 2 distinct drill types`);
  }
  const bad = countsDiffer(qs, PRACTICE_COUNTS);
  if (bad) out.push(`practice type counts must be paragraph 8, visual 8, dialogue 7, vocabulary 7 (got ${JSON.stringify(bad)})`);
  const seen = new Set();
  for (const q of [...exam, ...qs]) {
    if (seen.has(q.id)) out.push(`duplicate id ${q.id}`);
    seen.add(q.id);
  }
  const stems = new Set(exam.map((q) => q.stem));
  const passages = new Set(exam.map(passageText).filter(Boolean));
  for (const q of qs) {
    if (stems.has(q.stem)) out.push(`${q.id}: practice repeats exam stem`);
    const p = passageText(q);
    if (p && passages.has(p)) out.push(`${q.id}: practice repeats exam passage`);
  }
  return [...out, ...questionProblems(qs)];
}
