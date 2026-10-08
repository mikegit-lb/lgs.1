// Pure exam state engine. Every function returns a new state; input is never mutated.
const validIndex = (state, i) => Number.isInteger(i) && i >= 0 && i < state.questions.length;
const validOption = (o) => Number.isInteger(o) && o >= 0 && o <= 3;

export function createExam(questions) {
  return {
    questions: [...questions],
    answers: questions.map(() => null),
    flagged: questions.map(() => false),
    current: 0,
    submitted: false,
  };
}

export function selectAnswer(state, index, option) {
  if (state.submitted || !validIndex(state, index) || !validOption(option)) return state;
  const answers = [...state.answers];
  answers[index] = answers[index] === option ? null : option;
  return { ...state, answers };
}

export function goTo(state, index) {
  if (!Number.isFinite(index)) return state;
  const current = Math.max(0, Math.min(state.questions.length - 1, Math.trunc(index)));
  return { ...state, current };
}

export function toggleFlag(state, index) {
  if (!validIndex(state, index)) return state;
  const flagged = [...state.flagged];
  flagged[index] = !flagged[index];
  return { ...state, flagged };
}

export function unansweredCount(state) {
  return state.answers.filter((a) => a === null).length;
}

export function submit(state) {
  return state.submitted ? state : { ...state, submitted: true };
}

export function score(state) {
  return state.questions.reduce((n, q, i) => n + (state.answers[i] === q.answer ? 1 : 0), 0);
}
