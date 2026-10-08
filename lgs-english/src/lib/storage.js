import { EXAM_SECONDS } from './timer.js';

const SESSION_KEY = 'lgs-english:lesson1:session';
const PROGRESS_KEY = 'lgs-english:lesson1:progress';
const DEFAULTS = () => ({ studied: [], practice: {}, bestExam: null });

function defaultStore() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage || null;
  } catch {
    return null;
  }
}

function read(store, key) {
  try {
    return store ? store.getItem(key) : null;
  } catch {
    return null;
  }
}
function write(store, key, value) {
  try {
    if (store) store.setItem(key, value);
  } catch {
    /* quota / unavailable */
  }
}
function remove(store, key) {
  try {
    if (store) store.removeItem(key);
  } catch {
    /* ignore */
  }
}

const isNum = (n) => typeof n === 'number' && Number.isFinite(n);
const validExam = (n) => Number.isInteger(n) && n >= 0 && n <= 10;
const validScore = (v) =>
  !!v && Number.isInteger(v.correct) && Number.isInteger(v.total) &&
  v.total >= 1 && v.total <= 10 && v.correct >= 0 && v.correct <= v.total;
const isUnit = (n) => Number.isInteger(n) && n >= 1 && n <= 10;

export function saveSession(session, store = defaultStore()) {
  try {
    write(store, SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function clearSession(store = defaultStore()) {
  remove(store, SESSION_KEY);
}

function validSession(s) {
  if (!s || typeof s !== 'object' || !isNum(s.deadlineMs)) return false;
  const e = s.exam;
  if (!e || typeof e !== 'object') return false;
  if (!Array.isArray(e.answers) || e.answers.length !== 10) return false;
  if (!e.answers.every((a) => a === null || (Number.isInteger(a) && a >= 0 && a <= 3))) return false;
  if (!Number.isInteger(e.current) || e.current < 0 || e.current > 9) return false;
  if (!Array.isArray(e.questions) || e.questions.length !== 10) return false;
  if (!Array.isArray(e.flagged) || e.flagged.length !== 10) return false;
  if (!e.flagged.every((f) => typeof f === 'boolean')) return false;
  if (typeof e.submitted !== 'boolean') return false;
  return true;
}

export function loadSession(nowMs = Date.now(), store = defaultStore()) {
  const raw = read(store, SESSION_KEY);
  if (raw === null) return null;
  let s;
  try {
    s = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!validSession(s)) return null;
  if (s.exam.submitted || s.deadlineMs <= nowMs || s.deadlineMs - nowMs > EXAM_SECONDS * 1000) {
    remove(store, SESSION_KEY);
    return null;
  }
  return s;
}

export function loadProgress(store = defaultStore()) {
  const raw = read(store, PROGRESS_KEY);
  if (raw === null) return DEFAULTS();
  let p;
  try {
    p = JSON.parse(raw);
  } catch {
    return DEFAULTS();
  }
  if (!p || typeof p !== 'object' || Array.isArray(p)) return DEFAULTS();
  const out = DEFAULTS();
  if (Array.isArray(p.studied)) {
    out.studied = [...new Set(p.studied.filter(isUnit))].sort((a, b) => a - b);
  }
  if (p.practice && typeof p.practice === 'object' && !Array.isArray(p.practice)) {
    for (const [k, v] of Object.entries(p.practice)) {
      if (!isUnit(Number(k)) || !v || typeof v !== 'object') continue;
      if (validScore(v)) {
        out.practice[k] = { correct: v.correct, total: v.total };
      }
    }
  }
  out.bestExam = validExam(p.bestExam) ? p.bestExam : null;
  return out;
}

export function saveProgress(p, store = defaultStore()) {
  try {
    write(store, PROGRESS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function markStudied(p, unitId) {
  if (!isUnit(unitId)) return p;
  return { ...p, studied: [...new Set([...p.studied, unitId])].sort((a, b) => a - b) };
}

export function recordPractice(p, unitId, score) {
  if (!isUnit(unitId) || !validScore(score)) return p;
  const prev = p.practice[unitId];
  if (prev && prev.correct >= score.correct) return p;
  return { ...p, practice: { ...p.practice, [unitId]: { correct: score.correct, total: score.total } } };
}

export function recordExam(p, correct) {
  if (!validExam(correct)) return p;
  if (p.bestExam !== null && p.bestExam >= correct) return p;
  return { ...p, bestExam: correct };
}
