// Pure practice state engine. Choices lock after the first pick.
export function createPractice(questions) {
  return { questions: [...questions], chosen: questions.map(() => null), current: 0 };
}

export function choose(state, index, option) {
  if (!Number.isInteger(index) || index < 0 || index >= state.questions.length) return state;
  if (!Number.isInteger(option) || option < 0 || option > 3) return state;
  if (state.chosen[index] !== null) return state;
  const chosen = [...state.chosen];
  chosen[index] = option;
  return { ...state, chosen };
}

export function nextQuestion(state) {
  return { ...state, current: Math.min(state.questions.length - 1, state.current + 1) };
}

export function isComplete(state) {
  return state.chosen.every((c) => c !== null);
}

export function practiceScore(state) {
  const correct = state.questions.reduce((n, q, i) => n + (state.chosen[i] === q.answer ? 1 : 0), 0);
  return { correct, total: state.questions.length };
}
