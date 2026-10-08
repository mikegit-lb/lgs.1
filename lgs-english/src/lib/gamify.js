// Pure, client-side gamification helpers derived from stored progress (no new storage).

/** 0..3 stars from a best practice score { correct, total }. */
export function starsFor(best) {
  if (!best || !Number.isFinite(best.correct) || !Number.isFinite(best.total) || best.total <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, best.correct / best.total));
  return Math.round(ratio * 3);
}

/** Overall progress: studied units and practice stars, weighted equally. */
export function overallProgress(progress) {
  const studied = Array.isArray(progress?.studied) ? progress.studied.length : 0;
  const practice = progress?.practice ?? {};
  let stars = 0;
  for (let id = 1; id <= 10; id++) stars += starsFor(practice[id]);
  const percent = Math.round(((studied / 10 + stars / 30) / 2) * 100);
  return { studied, studiedMax: 10, stars, starsMax: 30, percent };
}

/** Mascot mood for an exam net score (net = correct - wrong/3). */
export function moodForNet(net) {
  if (net >= 7) return 'cheer';
  if (net >= 4) return 'happy';
  if (net >= 2) return 'think';
  return 'oops';
}

export const MOOD_MESSAGES = {
  cheer: 'Muhteşem! LGS’ye hazırsın! 🏆',
  happy: 'Çok iyi gidiyorsun! Biraz daha tekrarla zirvedesin. 🌟',
  think: 'Güzel başlangıç! Zayıf üniteleri tekrar edip yeniden dene. 💡',
  oops: 'Olsun, her deneme bir adım! Üniteleri çalışıp tekrar dene. 💪',
};

const PRAISE = ['Harika! 🎉', 'Süpersin! 🌟', 'Doğru bildin! ⭐', 'Müthiş! 🚀', 'Bravo! 👏'];
export const COMFORT = 'Olsun, bir daha! 💪';

/** Deterministic, varied praise for the n-th question. */
export function praiseFor(n) {
  const i = Number.isInteger(n) ? n : 0;
  return PRAISE[((i % PRAISE.length) + PRAISE.length) % PRAISE.length];
}

/** Stroke-dash geometry for a progress ring of radius r showing `fraction` (clamped 0..1). */
export function ringGeometry(fraction, r) {
  const f = Math.min(1, Math.max(0, Number(fraction) || 0));
  const circumference = 2 * Math.PI * r;
  return { circumference, offset: circumference * (1 - f) };
}

/** Exam timer colour level: 'ok' | 'warn' (< 5 min) | 'low' (< 60 s). */
export function timerLevel(remaining) {
  if (remaining < 60) return 'low';
  if (remaining < 300) return 'warn';
  return 'ok';
}
