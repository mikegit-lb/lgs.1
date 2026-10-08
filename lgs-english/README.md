# LGS English – Lesson 1

Offline practice app for the English section of the Turkish LGS exam (8th grade, 10 MEB units).
Vanilla JS (ES modules) + Vite + Vitest. No runtime dependencies, no network calls; the UI is Turkish.

## Lesson flow

1. **Home** – the 10 units and the student's progress.
2. **Unit study page** – key points, vocabulary and phrases, with **flashcards**.
3. **Practice** – 3 instant-feedback questions per unit (30 in total).
4. **Final Exam** – strict LGS format: 10 questions, A–D, one per unit in unit order, **15-minute** countdown.
5. **Results** – score, breakdown by question type, weak units, and a review of every question with explanations.

## What it looks like

A colourful, full-width app for 12–14 year-olds, fully offline (no fonts, images or CDNs: every picture is
inline SVG, CSS gradients or emoji):

- **Header bar** – Lingo the owl mascot, "LGS İngilizce", a progress chip (stars / units studied) and *Ana sayfa*.
- **Home** – a hero with the mascot, "Merhaba! Hazır mısın? 🚀" and an overall progress ring; a 1–5 column grid
  of unit cards, each with its own colour theme and illustration, ⭐ stars from the best practice score
  ("2/3 yıldız") and a "✓ Çalışıldı" ribbon; the Final Exam is a big gold "boss level" card 🏆.
- **Unit page** – a themed hero banner, then two columns on wide screens: flip flashcards and word chips on the
  left; speech-bubble phrases, a grammar card, the model text and a 💡 exam tip on the right.
- **Practice** – big A–D option cards with coloured letter badges and short Turkish praise ("Harika! 🎉") or
  encouragement ("Olsun, bir daha! 💪") next to the explanation.
- **Exam** – question on the left, a sticky side panel on the right (timer pill that turns amber under 5 min and
  red with "Acele et!" under 1 min, "Cevaplanan 4/10" bar, numbered grid, actions); one column on phones,
  where the timer floats in the corner.
- **Results** – a hero with a score ring, the mascot's reaction (by net) and confetti for nets of 7+, then
  breakdown cards and the question review.

Unit themes are CSS custom properties set by `data-unit="1..10"` (`src/themes.css`); scenes and the mascot live in
`src/ui/illustrations.js` / `src/ui/mascot.js`; stars, the progress ring and moods come from `src/lib/gamify.js`.
Animations are switched off under `prefers-reduced-motion`. The page sets `translate="no"` and
`<meta name="google" content="notranslate">` so browsers do not auto-translate the Turkish interface.

## Run, test, build

```
npm install
npm run dev       # dev server
npm test          # vitest run (jsdom)
npm run build     # static site in dist/
npx vite preview  # serve dist/ (default port 4173)
```

### The `#` in the folder name

The project lives under `TEACHING#2`. Vite/Vitest break on a `#` in the path, so `npm test` and
`npm run dev` fail from there (`npm run build` works). Workaround: map a drive and work from it:

```
subst L: "C:\Users\mike\Documents\TEACHING#2\LGS"
cd L:\lgs-english
```

Better: rename the folder (for example `TEACHING-2`) and the workaround is no longer needed.

## Where content lives

- `src/data/units.js` – study content for the 10 units (and flashcards).
- `src/data/examQuestions.js` – the 10 exam questions.
- `src/data/practice-units1-5.js`, `practice-units6-10.js` – drills; `practice.js` combines them into the 30-question bank.

A question has `id`, `unit`, `type` (`paragraph` | `visual` | `dialogue` | `vocabulary`), `stem`, `options` (4), `answer` (0..3),
`explanationTr`, and an `exhibit` (passage, dialogue, table or bar chart; none for vocabulary).

## Content rules (`src/lib/validate.js`, enforced by tests)

`validateExam(questions)` returns a list of problems (empty = valid):
- exactly 10 questions, one per unit, units 1..10 in order;
- types: paragraph 3, visual 3, dialogue 2, vocabulary 2.

`validatePractice(questions, exam)`:
- 30 questions, exactly 3 per unit, at least 2 distinct types per unit;
- type totals paragraph 8, visual 8, dialogue 7, vocabulary 7;
- ids unique across exam + practice; no practice stem or passage repeats an exam one.

Per question (both): 4 options, no duplicate option text, `answer` an integer 0..3, non-empty `explanationTr`,
exhibit required unless `vocabulary`; a dialogue needs a dialogue exhibit with the gap `_____` in exactly one line
(or in the stem); bar-chart values finite and non-negative; table rows as long as the headers.

### Adding Lesson 2

Copy `src/data/*` as Lesson 2 data files, replace the content, mirror the tests in `tests/` for the new files,
and run `npm test`: the validators report exactly which rule a new question breaks. Change the storage keys
(see below) so Lesson 1 and 2 progress do not collide.

## Scoring and saved state

- Net = correct − wrong / 3 (as in the LGS: 3 wrong cancel 1 correct). Blank questions do not affect the net.
- The exam ends after 15 minutes (or on submit); unanswered questions are submitted as blank.
  Submitting with blanks asks for confirmation.
- `localStorage` keys: `lgs-english:lesson1:session` (exam in progress, with its deadline) and
  `lgs-english:lesson1:progress` (studied units, practice scores, exam result).
  Reloading mid-exam resumes with the original deadline; corrupt data is discarded safely.

## Accessibility

- Keys **a–d** choose options in the exam and in practice; all controls are real buttons with labels.
- Bar charts have a visually hidden text/table alternative; tables are scrollable, labelled regions.
- Answer and review states use text/symbols (`✓ Doğru!`, `✗ Yanlış.`, "İşaretli", "boş"), not colour alone.
- Layout works from 320 px to wide desktop screens; touch targets are at least 44 px.
- Decorative SVGs, emoji and confetti are `aria-hidden`; stars have a text alternative ("2/3 yıldız").
- Colour pairs meet WCAG AA (white text only on deep unit colours, dark text on tints).

## Architecture

Three layers:
- `src/data` – content only.
- `src/lib` – pure, unit-tested engines: `exam`, `practice`, `results`, `timer`, `storage`, `validate`, `gamify`.
- `src/ui` – DOM views (`homeView`, `studyView`, `flashcards`, `practiceView`, `examView`, `resultsView`,
  `questionView`, `exhibits`) plus `header`, `widgets`, `illustrations` and `mascot`.
  Styles: `src/styles.css` (tokens, components), `src/layout.css` (shell, screens), `src/themes.css` (unit themes, motion). `mountApp(root, deps)` in `src/ui/app.js` wires them together; `src/main.js` calls it.
  Dependencies such as the storage `store` can be injected for tests.
