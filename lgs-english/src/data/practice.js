// Practice bank: 3 drills per unit, assembled from two authoring batches.
import { PRACTICE_UNITS_1_5 } from './practice-units1-5.js';
import { PRACTICE_UNITS_6_10 } from './practice-units6-10.js';

export const PRACTICE_QUESTIONS = [...PRACTICE_UNITS_1_5, ...PRACTICE_UNITS_6_10];

export function practiceFor(unitId) {
  return PRACTICE_QUESTIONS.filter((q) => q.unit === unitId);
}
