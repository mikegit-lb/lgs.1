# LGS English – Lesson 1 Implementation Plan (v2, expanded content)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static web app in which a student completes Lesson 1: study each of the 10 MEB units, drill each with instant-feedback practice, then sit a strict, timed 10-question LGS-style English mini-exam and review the results.

**Architecture:** Vanilla JS (ES modules) + Vite, no framework. Pure logic (`src/lib/*`), content (`src/data/*`) and DOM rendering (`src/ui/*`) are separate. All content is checked by a unit-tested validator, so exam-format and coverage rules are enforced by tests, not by convention.

**Tech Stack:** Node 24, Vite, Vitest + jsdom, plain CSS. No runtime dependencies.

**Spec:** None on disk. The user's request (Turkish LGS English preparation; the 10 MEB units; skills measured: paragraph reading and interpretation, visual/table/graph/dialogue interpretation, vocabulary and everyday expressions such as inviting, accepting, refusing) plus "add more content" is the spec. Its requirements are in Global Constraints.

## Global Constraints

- Repo root is `C:\Users\mike\Documents\TEACHING#2\LGS` (`git init` there). The web project lives in sub folder `lgs-english/`. Plans/docs live in root `docs/`.
- The 10 units, in this order, exact names: 1 Friendship, 2 Teen Life, 3 In The Kitchen, 4 On The Phone, 5 The Internet, 6 Adventures, 7 Tourism, 8 Chores, 9 Science, 10 Natural Forces.
- **Final exam (strict LGS English format):** exactly 10 questions, 4 options labelled A–D, exactly one correct answer, no negative marking, **15-minute limit** (LGS: 75 min / 50 verbal questions = 1.5 min each), one question per unit in unit order (Q1 = Unit 1 … Q10 = Unit 10).
- **Exam type counts (exact):** `paragraph` ×3, `visual` ×3 (table, graph, poster/ad/chat), `dialogue` ×2 (everyday expressions), `vocabulary` ×2.
- **Practice bank:** exactly 30 drill questions = 3 per unit, same schema and A–D format as the exam; each unit's 3 drills use ≥2 distinct types; bank totals `paragraph` 8, `visual` 8, `dialogue` 7, `vocabulary` 7; across the bank `dialogue` items collectively cover inviting, accepting, refusing, apologising, asking for/giving directions, and making requests.
- **Study page per unit:** 8–10 key words (EN + TR), 3–5 useful phrases, one grammar focus (title + 2–3 points + 2 examples each), one model text (passage or dialogue exhibit), one Turkish exam tip.
- No practice or study item may repeat an exam question's stem or passage.
- Exam content is English; UI chrome, grammar explanations, tips and `explanationTr` are Turkish.
- Content is original (not copied from MEB or published test books), level A2–B1 (8th-grade LGS).
- All content is rendered with DOM APIs (`textContent`), never `innerHTML` with content strings.
- Offline-capable from `npm run build` output; no network calls, no analytics.

## Review Focus

Failure modes the spec implies but no happy path covers (each gets a test in the owning task):

1. Submitting the exam with unanswered questions → they count as wrong; a dialog states the blank count (Tasks 5, 9).
2. Timer reaches 0 → exam auto-submits exactly once; a reload after expiry never resumes a live exam (Tasks 6, 9).
3. Reload mid-exam/mid-practice → answers, position and remaining time restored; corrupt or unavailable `localStorage` falls back to a fresh start without throwing (Task 6).
4. Changing/clearing an exam answer, or double-clicking an option → last selection wins, never two answers; in practice, an answer locks after reveal (Task 5).
5. Phone/keyboard use: options reachable by Tab and selectable with keys A–D; usable at 375 px; bar chart has a text alternative (Tasks 8, 9).

---

### Task 1: Repo, scaffold and unit catalogue (expanded study content)

**Files:**
- Create: root `.gitignore` (`node_modules`, `dist`, `.superpowers`)
- Create: `lgs-english/package.json`, `lgs-english/vite.config.js` (vitest `environment: 'jsdom'`), `lgs-english/index.html`, `lgs-english/src/main.js` (placeholder), `lgs-english/README.md`
- Create: `lgs-english/src/data/units.js`
- Test: `lgs-english/tests/units.test.js`

**Interfaces:**
- Produces:
  ```
  UNITS: Array<{
    id: number; name: string; trName: string;
    words: Array<{en: string; tr: string}>;          // 8–10
    phrases: string[];                               // 3–5
    grammar: { title: string; points: string[]; examples: string[] };   // points 2–3, examples 2–4 (title/points in Turkish, examples English)
    model: Exhibit;                                  // kind 'passage' or 'dialogue' (Exhibit defined in Task 2)
    tipTr: string
  }>
  ```
  ids 1..10 in order. npm scripts `dev`, `build`, `test` (`vitest run`).

- [ ] **Step 1: Write failing test** `tests/units.test.js`: length 10; names deep-equal the exact list; ids 1..10; each unit satisfies every count above; no duplicate `en` word within a unit; `model.kind` ∈ {passage, dialogue}; `tipTr` non-empty; Unit 4 phrases include a match for `/would you like/i`, `/I'd love to/i` and `/can't/i`; Unit 1 phrases include an apology (`/sorry|apolog/i`).
- [ ] **Step 2: Run** `cd lgs-english && npx vitest run tests/units.test.js` → FAIL.
- [ ] **Step 3:** At repo root `git init`. Hand-scaffold Vite vanilla (`"type": "module"`, devDeps `vite`, `vitest`, `jsdom`), `npm install`. Implement `units.js` with original content. Topic/grammar plan:

  | Unit | Vocabulary/phrase focus | Grammar focus |
  |---|---|---|
  | 1 Friendship | personality adjectives (loyal, generous, shy…), apologising/accepting apology | comparatives & "as … as" for describing people |
  | 2 Teen Life | hobbies, free time, social media habits, peer pressure | present simple + adverbs of frequency |
  | 3 In The Kitchen | cooking verbs, ingredients, containers/quantities | sequence words, countable/uncountable (some/any/much/many), imperatives |
  | 4 On The Phone | phone etiquette, inviting/accepting/refusing | "Would you like to…?", "I'd love to, but…", polite requests |
  | 5 The Internet | online safety, cyberbullying, netiquette | should/shouldn't, must/mustn't |
  | 6 Adventures | extreme sports, travel mishaps | past simple (regular/irregular), past continuous with "while/when" |
  | 7 Tourism | accommodation, sightseeing, transport, prices | "going to"/will for plans, asking for directions |
  | 8 Chores | household chores, family routines | have to/don't have to, "too/enough" |
  | 9 Science | inventions, experiments, scientists | passive voice (basic), purpose "to + verb" / "so that" |
  | 10 Natural Forces | earthquake, flood, volcano, tornado, drought, precautions | first conditional, "If … will …" for warnings |

- [ ] **Step 4: Run** `npx vitest run` → PASS; `npm run build` succeeds.
- [ ] **Step 5: Commit** (`chore: scaffold lgs-english app and expanded unit catalogue`).

---

### Task 2: Question/Exhibit schema and validators

**Files:**
- Create: `lgs-english/src/lib/validate.js`
- Test: `lgs-english/tests/validate.test.js`

**Interfaces:**
- Consumes: `UNITS` (Task 1).
- Produces (shared schema, used by every later task):
  ```
  Question = {
    id: string, unit: 1..10,
    type: 'paragraph'|'visual'|'dialogue'|'vocabulary',
    stem: string, exhibit: Exhibit | null,           // null only for 'vocabulary'
    options: [string, string, string, string],       // A, B, C, D
    answer: 0|1|2|3, explanationTr: string
  }
  Exhibit =
    { kind: 'passage',  title?: string, text: string }
  | { kind: 'dialogue', lines: Array<{speaker: string, text: string}> }     // a gap is written "_____"
  | { kind: 'table',    caption: string, headers: string[], rows: string[][] }
  | { kind: 'barChart', title: string, unitLabel: string, bars: Array<{label: string, value: number}> }
  | { kind: 'poster',   heading: string, lines: string[] }

  validateQuestion(q: Question): string[]            // problems; [] = valid
  validateExam(qs: Question[]): string[]             // 10-question exam rules
  validatePractice(qs: Question[], exam: Question[]): string[]   // 30-item bank rules + no overlap with exam
  ```

- [ ] **Step 1: Write failing tests** with valid fixtures (10 exam, 30 practice) asserting `[]`, then one mutation test per rule asserting a non-empty result naming the rule: option count ≠ 4; answer out of range/non-integer; duplicate option text; empty `explanationTr`; null exhibit on non-vocabulary; dialogue exhibit with no `"_____"` gap when the stem says "complete the dialogue" (stem contains `"_____"` for dialogue-gap questions only — rule: a dialogue question needs a gap in a line or in the stem); barChart negative/non-finite value; table row length ≠ headers length; exam count ≠ 10; unit order not 1..10; exam type counts ≠ {3,3,2,2}; practice count ≠ 30; any unit ≠ 3 drills; a unit whose drills have <2 distinct types; practice type totals ≠ {8,8,7,7}; duplicate ids across exam+practice; a practice stem equal to an exam stem.
- [ ] **Step 2: Run** `npx vitest run tests/validate.test.js` → FAIL.
- [ ] **Step 3: Implement** one small check function per rule; validators concatenate results.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** (`feat: question schema and validators`).

---

### Task 3: Final-exam questions (10)

**Files:**
- Create: `lgs-english/src/data/examQuestions.js`
- Test: `lgs-english/tests/examQuestions.test.js`

**Interfaces:**
- Produces: `EXAM_QUESTIONS: Question[]`, ids `e1`..`e10`.

- [ ] **Step 1: Write failing test:** `validateExam(EXAM_QUESTIONS)` equals `[]`; each answer letter A–D is the key at least twice; every passage exhibit is 70–100 words; every `explanationTr` is ≥ 40 characters.
- [ ] **Step 2: Run** `npx vitest run tests/examQuestions.test.js` → FAIL.
- [ ] **Step 3: Author** the 10 questions to this fixed plan (LGS-style plausible distractors):

  | Q | Unit | Type | Exhibit | Tests |
  |---|---|---|---|---|
  | e1 | Friendship | dialogue | dialogue with gap | apologising / accepting an apology |
  | e2 | Teen Life | visual | table: weekly free-time survey, 4 teens × 3 activities | reading a table, comparing |
  | e3 | In The Kitchen | vocabulary | none (gap sentence in stem) | cooking verbs / sequence words |
  | e4 | On The Phone | dialogue | dialogue with gap | inviting, accepting, refusing |
  | e5 | The Internet | paragraph | passage (online safety) | main idea / detail |
  | e6 | Adventures | paragraph | passage (past-tense trip) | detail / inference |
  | e7 | Tourism | visual | poster: city-tour ad with times and prices | extracting facts from an ad |
  | e8 | Chores | visual | barChart: hours of chores per family member | comparing graph values |
  | e9 | Science | paragraph | passage (inventor/experiment) | purpose / vocabulary in context |
  | e10 | Natural Forces | vocabulary | none | disaster vocabulary / precautions |

- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** (`feat: 10-question LGS-style final exam`).

---

### Task 4: Practice bank (30 drills) – two content batches

**Files:**
- Create: `lgs-english/src/data/practice.js` (exports `PRACTICE_QUESTIONS`, assembled from the two batch files)
- Create: `lgs-english/src/data/practice-units1-5.js`, `lgs-english/src/data/practice-units6-10.js` (each exports an array of 15 `Question`)
- Test: `lgs-english/tests/practice.test.js`

**Interfaces:**
- Consumes: `validatePractice`, `EXAM_QUESTIONS`.
- Produces: `PRACTICE_QUESTIONS: Question[]` (30, ordered by unit, ids `p1-1`..`p10-3`), `practiceFor(unitId: number): Question[]` (the 3 for that unit).

- [ ] **Step 1: Write failing test:** `validatePractice(PRACTICE_QUESTIONS, EXAM_QUESTIONS)` equals `[]`; `practiceFor(4).length === 3`; `practiceFor(11)` returns `[]`; the union of dialogue-item stems/lines across the bank matches each of `/invit/i`, `/accept|love to/i`, `/sorry|can't/i` (refusing), `/apolog|sorry/i`, `/direction|where is|how (can|do) I get/i`, `/could you|can you|would you/i`; each `explanationTr` ≥ 30 characters.
- [ ] **Step 2: Run** `npx vitest run tests/practice.test.js` → FAIL.
- [ ] **Step 3: Author** the 30 drills. Per-unit type mix (bank totals 8/8/7/7):

  | Unit | Drill 1 | Drill 2 | Drill 3 |
  |---|---|---|---|
  | 1 Friendship | vocabulary (personality adj.) | dialogue (apology) | paragraph (describing a best friend) |
  | 2 Teen Life | visual (chat/messages) | paragraph (teen routine) | vocabulary (hobbies) |
  | 3 In The Kitchen | visual (recipe table: ingredient/quantity) | dialogue (ordering/asking for ingredient) | vocabulary (containers/quantities) |
  | 4 On The Phone | dialogue (accept invitation) | dialogue (refuse politely) | paragraph (phone-etiquette tips) |
  | 5 The Internet | paragraph (cyberbullying) | visual (bar chart: hours online by age group) | vocabulary (internet terms) |
  | 6 Adventures | paragraph (mountain trip) | vocabulary (adventure verbs, past) | visual (poster: adventure-park rules) |
  | 7 Tourism | dialogue (asking directions) | visual (table: hotel prices/facilities) | paragraph (tourist blog) |
  | 8 Chores | visual (bar chart: chores per day) | dialogue (making a request) | vocabulary (chore verbs) |
  | 9 Science | paragraph (famous scientist) | visual (table: experiment results) | vocabulary (lab/invention words) |
  | 10 Natural Forces | paragraph (earthquake safety) | visual (poster: flood warning) | dialogue (giving advice / warnings) |

  Implement in two batches (units 1–5, then 6–10) with a commit after each; run `npx vitest run tests/practice.test.js` after each (the full-bank assertions are skipped until both batches exist: guard the test with `describe.runIf(PRACTICE_QUESTIONS.length === 30)`, then remove the guard in Step 4).
- [ ] **Step 4: Remove the guard; run** `npx vitest run` → PASS.
- [ ] **Step 5: Commit** (`feat: 30-item practice bank`).

---

### Task 5: Exam and practice engines (pure state)

**Files:**
- Create: `lgs-english/src/lib/exam.js`, `lgs-english/src/lib/practice.js`
- Test: `lgs-english/tests/exam.test.js`, `lgs-english/tests/practice.test.js` (name `practiceEngine.test.js` to avoid clashing with Task 4)

**Interfaces:**
- Consumes: `Question` (Task 2).
- Produces (all pure, return new objects, never mutate input):
  ```
  // exam.js
  ExamState = { questions: Question[], answers: (0|1|2|3|null)[], flagged: boolean[], current: number, submitted: boolean }
  createExam(questions): ExamState
  selectAnswer(state, index, option): ExamState     // same option again clears it; no-op after submit
  goTo(state, index): ExamState                     // clamps to 0..length-1
  toggleFlag(state, index): ExamState
  unansweredCount(state): number
  submit(state): ExamState                          // idempotent
  score(state): number

  // practice.js
  PracticeState = { questions: Question[], chosen: (0|1|2|3|null)[], current: number }
  createPractice(questions): PracticeState
  choose(state, index, option): PracticeState       // locks: ignored if chosen[index] !== null
  nextQuestion(state): PracticeState                // clamps at last
  isComplete(state): boolean                        // every chosen !== null
  practiceScore(state): { correct: number, total: number }
  ```
- [ ] **Step 1: Write failing tests:** exam — fresh state (10 nulls, current 0, not submitted); select stores/replaces/toggles-off and leaves input untouched; select after submit no-op; `goTo(-3)`→0, `goTo(99)`→9; flag twice returns to false; `unansweredCount` after 3 answers = 7; `score` counts only keys, null = wrong; `submit` twice equals once. Practice — `choose` records the first choice and ignores a second; `nextQuestion` clamps; `isComplete` false until all 3 answered; `practiceScore` counts correct.
- [ ] **Step 2: Run** `npx vitest run tests/exam.test.js tests/practiceEngine.test.js` → FAIL.
- [ ] **Step 3: Implement** with array spread copies.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** (`feat: exam and practice engines`).

---

### Task 6: Timer, session persistence and progress storage

**Files:**
- Create: `lgs-english/src/lib/timer.js`, `lgs-english/src/lib/storage.js`
- Test: `lgs-english/tests/timer.test.js`, `lgs-english/tests/storage.test.js`

**Interfaces:**
- Consumes: `ExamState`, `PracticeState` (Task 5).
- Produces:
  ```
  EXAM_SECONDS = 900
  formatTime(seconds): string                        // 905→"15:05", 59→"00:59", negative/NaN→"00:00"
  remainingSeconds(deadlineMs, nowMs): number        // whole seconds, floored at 0
  createCountdown({ deadlineMs, now = Date.now, onTick(remaining), onExpire(), setIntervalFn = setInterval, clearIntervalFn = clearInterval }): { stop(): void }   // onExpire exactly once

  // storage.js — every function takes (…, store = localStorage), never throws
  saveSession(session: { exam: ExamState, deadlineMs: number }): void
  loadSession(nowMs = Date.now()): { exam, deadlineMs } | null    // null if missing/corrupt/wrong shape/answers.length≠10/deadline passed (expired key removed)
  clearSession(): void
  Progress = { studied: number[], practice: Record<string, {correct: number, total: number}>, bestExam: number | null }
  loadProgress(): Progress                           // defaults {studied: [], practice: {}, bestExam: null} on any failure
  saveProgress(p: Progress): void
  markStudied(p: Progress, unitId: number): Progress          // pure, no duplicates, sorted
  recordPractice(p: Progress, unitId: number, score: {correct: number, total: number}): Progress   // pure, keeps the best score
  recordExam(p: Progress, correct: number): Progress          // pure, keeps the best
  ```
  Keys: `lgs-english:lesson1:session`, `lgs-english:lesson1:progress`.
- [ ] **Step 1: Write failing tests:** `formatTime`/`remainingSeconds` cases; countdown with fake clock/interval ticks, `onExpire` once even if ticks continue, `stop()` silences it; session round-trip equals; corrupt JSON → null; `getItem` throwing → null; `setItem` throwing → `saveSession` doesn't throw; expired → null and key removed; wrong answers length → null; progress defaults on corruption; `markStudied` dedupes/sorts; `recordPractice` keeps the higher score; `recordExam` keeps the best.
- [ ] **Step 2: Run** `npx vitest run tests/timer.test.js tests/storage.test.js` → FAIL.
- [ ] **Step 3: Implement**; wrap all store access in try/catch; validate loaded shapes.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** (`feat: countdown, session and progress storage`).

---

### Task 7: Results summary

**Files:**
- Create: `lgs-english/src/lib/results.js`
- Test: `lgs-english/tests/results.test.js`

**Interfaces:**
- Consumes: `ExamState`, `score` (Task 5), `UNITS`.
- Produces:
  ```
  summarize(state: ExamState): {
    correct, wrong, blank, total: 10, percent: number,      // percent = Math.round(correct/total*100)
    byType: Record<'paragraph'|'visual'|'dialogue'|'vocabulary', {correct, total}>,
    items: Array<{ index, unitId, unitName, type, chosen: number|null, answer: number, status: 'correct'|'wrong'|'blank' }>,
    weakUnits: Array<{ unitId: number, unitName: string }>      // wrong or blank, in exam order
  }
  ```
  `correct + wrong + blank === total`; `wrong` = answered but incorrect.
- [ ] **Step 1: Write failing tests:** all-correct → 100%, `weakUnits` `[]`; all-blank → blank 10, percent 0, 10 weak units; mixed → exact `byType` totals (3/3/2/2) and per-item `status`; weak order follows question order.
- [ ] **Step 2: Run** `npx vitest run tests/results.test.js` → FAIL.
- [ ] **Step 3: Implement** `summarize`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** (`feat: results summary`).

---

### Task 8: UI foundations — DOM helper, exhibits, flashcards

**Files:**
- Create: `lgs-english/src/ui/dom.js`, `lgs-english/src/ui/exhibits.js`, `lgs-english/src/ui/flashcards.js`, `lgs-english/src/styles.css`
- Test: `lgs-english/tests/exhibits.test.js`, `lgs-english/tests/flashcards.test.js`

**Interfaces:**
- Produces:
  ```
  h(tag: string, attrs?: object, ...children: (Node|string)[]): HTMLElement     // uses createElement/textContent only
  renderExhibit(exhibit: Exhibit): HTMLElement
  //   passage → <blockquote>; dialogue → speaker/line list; table → <table> with <caption> and <th scope>;
  //   barChart → inline <svg role="img"> with <title>, one <rect> per bar scaled to max value, a text value label per bar,
  //   plus a visually-hidden <table> text alternative; poster → bordered card
  renderFlashcards(words: Array<{en, tr}>): HTMLElement     // one card at a time; click/Enter/Space flips EN↔TR; Prev/Next; "k / n" counter
  ```
  `styles.css`: mobile-first, readable at 375 px, system font stack, visible `:focus-visible` outlines, AA contrast, no external fonts/CDNs.
- [ ] **Step 1: Write failing tests (jsdom):** each of the 5 exhibit kinds renders; table has one `<th>` per header and one `<td>` per cell; barChart has one `<rect>` per bar, the tallest bar has the largest height, and a hidden text-alternative table exists; a passage containing `<img src=x onerror=alert(1)>` renders as visible text with no `img` element; flashcards start on card 1/n showing EN, Space flips to TR, Next advances and the counter updates, Prev at card 1 stays at 1.
- [ ] **Step 2: Run** `npx vitest run tests/exhibits.test.js tests/flashcards.test.js` → FAIL.
- [ ] **Step 3: Implement** the modules and base styles.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** (`feat: exhibit renderer, flashcards and base styles`).

---

### Task 9: UI views and app wiring

**Files:**
- Create: `lgs-english/src/ui/homeView.js`, `studyView.js`, `practiceView.js`, `examView.js`, `resultsView.js`
- Modify: `lgs-english/src/main.js`, `lgs-english/index.html`
- Test: `lgs-english/tests/app.test.js`

**Interfaces:**
- Consumes: all earlier tasks.
- Produces: `mountApp(root: HTMLElement, deps?: { store?: Storage, now?: () => number }): void`. Screens and flow:
  1. **Home** – 10 unit cards (name, TR name, ✓ studied, best practice score) and a "Final Exam" card (best score; recommended after studying, never locked).
  2. **Unit study page** – words (with Flashcards), phrases, grammar focus, model text via `renderExhibit`, exam tip; "Mark as studied" and "Start practice".
  3. **Practice** – 3 questions; selecting an option immediately shows correct/incorrect and `explanationTr`, then locks; summary with score; saves via `recordPractice`.
  4. **Exam** – one question at a time, A–D buttons, numbered nav strip (answered/flagged/current states), Prev/Next, Flag, live `formatTime` countdown, Submit → in-page dialog stating the blank count in Turkish (e.g. "3 soru boş"). Keys `a`–`d` select; session saved after every action; `clearSession` on submit/retake.
  5. **Results** – score, percent, per-type breakdown, per-question review (chosen vs. correct + `explanationTr`), weak-unit links to the study page, Retake; saves via `recordExam`.
- [ ] **Step 1: Write failing tests** (jsdom, fake store + fake clock): Home lists 10 units; opening a unit shows words, phrases, grammar, model text and tip; "Mark as studied" persists and shows ✓ after remount; practice option click reveals feedback and a second click on another option is ignored; practice summary saves best score; Final Exam shows Q1 with exactly 4 options labelled A–D; same option twice clears it; keys a–d select; Prev/Next/number buttons navigate; Submit with 3 unanswered shows a dialog containing "3"; confirming shows results with correct+wrong+blank = 10; advancing the clock past 15:00 auto-submits exactly once; remounting mid-exam on the same store restores answers, current question and remaining time; an expired stored session is ignored; corrupt store content starts on Home; Retake clears the session; one `<h1>` per screen and every option button has an accessible name.
- [ ] **Step 2: Run** `npx vitest run tests/app.test.js` → FAIL.
- [ ] **Step 3: Implement** the views and `main.js` (`mountApp(document.getElementById('app'))`); simple hash-less in-memory screen switching is sufficient.
- [ ] **Step 4: Run** full `npm test` → all PASS; `npm run build` succeeds.
- [ ] **Step 5: Manual check** — `npm run dev` in the browser pane; at desktop width and at 375 px (resize) walk: Home → study one unit (flip flashcards) → practice it → full exam with a blank submit → results review → retake. Fix any layout defect found.
- [ ] **Step 6: Commit** (`feat: home, study, practice, exam and results UI`).

---

### Task 10: Docs and final verification

**Files:**
- Modify: `lgs-english/README.md` (run/test/build; how to add Lesson 2 content; the rules `validateExam`/`validatePractice` enforce), root `README.md` (one paragraph pointing to `lgs-english/`).

- [ ] **Step 1:** Write both READMEs (concise).
- [ ] **Step 2: Verify** from `lgs-english/`: `npm test` (all pass), `npm run build` (succeeds), `npx vite preview` serves `dist` and the full flow works with the network disabled.
- [ ] **Step 3: Commit** (`docs: readmes and run instructions`).

---

## Self-review

- **Spec coverage:** 10 units — Task 1 study content for each, Task 3 one exam question each, Task 4 three drills each; paragraph analysis — 3 exam + 8 drills; visual/table/graph/dialogue interpretation — exhibits (Task 8), 3 visual + 2 dialogue exam items, 8 visual + 7 dialogue drills; vocabulary and everyday expressions (inviting/accepting/refusing…) — Unit 4 study phrases, Q e4, drills in Task 4; strict structure (10 × A–D, 15 min, type counts, unit order) — `validateExam` (Task 2) and engine/timer (Tasks 5–6); "more content" — expanded study pages, flashcards, 30-item practice bank.
- **Types:** `Question`/`Exhibit` defined once in Task 2 and consumed unchanged by Tasks 1 and 3–9; engine, storage and results signatures (Tasks 5–7) match their uses in Task 9.
- **Review Focus mapping:** 1 → Task 5 `unansweredCount` + Task 9 dialog test; 2 → Task 6 countdown/expired tests + Task 9 auto-submit test; 3 → Task 6 storage tests + Task 9 remount/corrupt tests; 4 → Task 5 toggle/lock tests; 5 → Task 8 hidden-table test, Task 9 key/a11y tests + 375 px manual check.
- **Proportion:** bodies are omitted; signatures, assertions and content tables carry the decisions. The content authoring (40 questions + 10 study pages) is the bulk of the work, which is intended.
