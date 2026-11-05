# Reverse Prime Plot

Interactive plot of `(n, reverse(n))` over an interval, marking which of the pair are prime.
Vite 8 + React 19 + StyleX, deployed to GitHub Pages in English and Persian.

## Commands

```bash
npm run dev      # dev server
npm test         # vitest run — src/lib only, see "Test coverage" below
npm run build    # builds both language entry points into dist/
```

## Architecture notes

These are the things that are easy to get wrong here; the rest is discoverable from the code.

### Two entry points, one per language

`index.html` (en) and `fa/index.html` (fa, `dir="rtl"`) are separate Vite inputs, registered in
`vite.config.js`. There is no router. `src/i18n/index.js` reads the locale **once** from
`document.documentElement.lang` at startup — it is not React state and cannot change at runtime.

Adding UI copy means adding the key to **both** `src/i18n/en.js` and `src/i18n/fa.js`.

Numbers go through `formatNumber()`, never `.toLocaleString()` directly: the `fa-IR` locale is
what produces Persian digits in the stats, the canvas tick labels and the axis titles.

### The design system

Mathematical minimalism: monochrome data on paper, mono type for anything numeric, hairline rules
instead of cards and shadows, and a single accent (`#1f4bff`) reserved for interaction and for the
rare deep chain results. The page leads with a worked specimen (`13 -> 31`, both prime) rather than
a title, because on a phone the old layout gave no clue what the page was about.

`pickSpecimen` draws that lead example from the plotted data, so it can never contradict the plot.

### Do not add `font: inherit` for buttons or inputs

`global.css` deliberately does not reset button and input fonts. That rule is unlayered, so it
outranks StyleX's layered output and silently discards every `fontFamily`/`fontSize` set on a
control — the mono type on buttons simply vanishes with no warning. Style controls in StyleX only.

### Canvas text scales to the rendered width

The canvas draws in `CANVAS_SIZE` units, so a label sized in those units shrinks with the element:
at phone width the axis labels rendered around 6px. `useElementWidth` feeds a `textScale` into the
drawing code to hold labels near 12 real pixels at any size. It must come from a ResizeObserver, not
a one-off measurement inside the draw effect — the first paint can land before layout settles, and
the stale scale then persists because nothing redraws on resize.

### StyleX only accepts static values

`stylex.create()` rejects anything it cannot analyse statically — an imported constant throws
`Only static values are allowed inside of a create() call` **at build time, not test time**, so
`npm test` stays green through a broken build. Consequences:

- `src/lib/palette.js` is consumed by the canvas renderer and the SVG legend only. `appStyles.stylex.js`
  and `global.css` keep their own colour literals on purpose. Changing a brand colour means editing
  all three.
- RTL overrides live in `global.css`, not StyleX. They work because StyleX emits into a cascade
  layer and unlayered rules outrank it — no `!important` needed.

Run `npm run build` after touching anything StyleX-related; it is the only gate that catches this.

Colours live in `src/tokens.stylex.js` as `stylex.defineVars`. A plain imported constant is rejected
by `stylex.create`, but a defineVars token is statically analysable and accepted — which is why the
two sheets can share one palette. `palette.js` is separate on purpose: canvas needs real colour
values, not CSS variables.

`appStyles.test.js` fails on a component naming a style key its sheet does not define. That renders
no class and says nothing, and it shipped twice before the test existed.

Styles are split in two: `appStyles.stylex.js` (page shell, shared by both pages) and
`chainStyles.stylex.js` (chains page only). Legend styles live in `appStyles` because both legends
use them — a component referencing a key that is not in the sheet it imported gets `undefined` and
renders unstyled, silently.

`palette.js` holds *data* colours for the canvas and SVG markers. Those are not text, so the
text-contrast rules do not apply to them — `#f15a37` stays vivid for markers while the UI chrome
that carries text uses darkened variants that clear WCAG AA. Don't "unify" the two.

### The worker boundary

`src/lib/primeNumbers.js` runs inside the Web Worker. Keep it free of DOM and i18n imports.
`src/lib/drawPrimePlot.js` is main-thread only and may import the locale module.

The worker collapses repeated progress messages; without that, one plot fires ~370 postMessages
where only ~95 differ, and each one re-renders the whole tree.

### Two render paths

Above 5,000 points (`usesPixelReadback`) the canvas switches from arc-drawing to writing `ImageData`
bytes directly. A 2D context locks its attributes at the **first** `getContext` call for the
element's lifetime, so `PrimePlot` keys the `<canvas>` on the draw mode — that remount is what lets
each path get a context with the right `willReadFrequently` hint. Don't remove the key and add a
conditional flag; it will silently keep whichever value the first plot used.

The dense path bypasses the marker layers entirely, so the legend's half-disc semantics do not hold
above the threshold. Known gap, not a regression.

### Digit count decides whether chains can exist

A number and its reversal agree mod 11 whenever the digit count is **odd**, because each digit then
sits an even number of places from its mirror. That forces an extra factor of 11 into the
difference on top of the 18, the quotient inherits it, and a multiple of 11 is prime only when it is
11 itself. Consequences worth knowing before someone reports a bug:

- There is not a single chain between 1,000,000 and 10,000,000. Those are the 7-digit numbers.
  Verified: 71,142 both-prime seeds, zero chains.
- 3-digit seeds can chain, but only ever to 11 (`113 -> 311`, difference 198, 198/18 = 11).
- Chains return at 10,000,000, where 8-digit numbers start. The full 8-digit band holds 9,884.

`primeChains.test.js` pins this. An empty result in an odd-digit range is correct, not a defect.

### One ceiling, and what it costs

`MAX_LIMIT` (999,999,999) is shared by all three pages. It is the largest 9-digit number: the
`PrimeTable` sieve's int32 bit operations stay exact below 2^31, and `reverseNumber` stays far from
that bound. `PrimeTable` is an odds-only bit-packed sieve, about 62 MB and several seconds at the
ceiling. The chains and sums pages keep only the hits, so they survive it. The plot page does not:
`createPlotData` allocates a value per number in the interval, so a very wide interval can run the
tab out of memory. The owner accepted that on purpose; don't lower the ceiling to "fix" it.

### The sums page counts down from N

`/sums/` takes one number N and plots `(k, N − k)` wherever both are prime (the Goldbach pairs),
reusing `PrimePlot` by giving `createSumData` the same data shape with every state 3. All points
sit on the one diagonal and each pair appears in both orders. An odd N splits only as
2 + (N − 2), so 101 shows nothing: correct, not a defect.

### WebMCP

`src/webMcp.js` is the shared registration helper (never rejects, silent without the API).
`src/sumsWebMcp.js` registers two tools on the sums pages: `describe` (read-only: N, status, the
distinct pairs, at most 100) and `plot_total` (replot for a new N through the same `setTotal` the
form uses). It is silent without `document.modelContext`. Try it in Chrome with
`chrome://flags/#enable-webmcp-testing` (or `--enable-features=WebMCP`). The API is a draft that
has moved once; re-check https://webmachinelearning.github.io/webmcp/ before changing the module.
`llms.txt` lists the tools; keep both copies in step with the module.

### The Iran page dates every event three ways

`/iran/` is the one page that is not maths. `src/data/iranEvents.json` holds each event's
Gregorian `date` and `source` (the record the timeline places) and a `found` list of every
other date a source states, in any calendar. The owner asked for **every** date found, so where
sources disagree all of them are listed, each linked to its sources; nothing is reconciled.
`datesOf` adds the date the record computes to in each calendar, starred when no source states
it, and throws on a found date more than `SOURCED_DAY_WINDOW` days off (a typo guard that
`iranEvents.test.js` runs over the whole file).

Computed dates come from `Intl` (`persian`, `islamic-umalqura`). Two gaps are expected, not bugs:
Iran starts lunar months by sighting the moon, so Ghamari dates can be a day or two off Umm
al-Qura; and ICU's Persian calendar is arithmetic and proleptic, so Jalali dates before 1925,
when Iran adopted it, can sit a day off what period sources say.

`src/iranWebMcp.js` registers one read-only `describe` tool listing the events and their dates.

`datePrimes.js` marks each date three ways: prime year, year prime both ways (1979 and 9791), and
the whole date as YYYYMMDD. `primeSummary` counts each **distinct** year (or day) once and splits
0.05 across the nine tests. Counting per event looked significant (Ghamari 19 against 8.3) only
because events cluster: 1979 alone holds six. On the real data nothing differs from chance.

`eventCycles.js` asks whether event years recur every k years (k = 2 to 12): per calendar, the most
distinct years sharing one value of year mod k, against drawing as many different years at random
from the range. The chance is exact, counted over every possible draw (a polynomial over the k
residue classes), not simulated; `eventCycles.test.js` checks it against brute-force enumeration.
The maximum is taken over the points of the cycle, so picking the busiest point after the fact is
already priced in. 33 tests share the 0.05. On the real data no cycle beats chance (closest:
Ghamari every 2 years, p 0.08 before the split). Bunched years (2015 to 2026 holds twelve in a row)
spread evenly over the points, which pushes the test toward missing a cycle rather than inventing one.

`chineseYear.js` reads the stem and branch from Intl's `chinese` calendar, so a January or early
February event carries the previous year's animal (8 Jan 2026 is Wood Snake). That is correct, not
a bug. ICU dates Chinese New Year 1954 a day late (4 Feb; it was 3 Feb), the one day out of 46,299
since 1900 where it disagrees with `lunardate`. `chineseYear.test.js` fails if any event sits within
a day of a New Year or has a stated Gregorian date in a different Chinese year, which keeps every
event clear of that error. The meaning shows on hover (`title`) and opens on a click or tap (`<details>`).
Persian names use the element's adjective ("بز خاکی", "اژدهای چوبی"): the owner chose it over the noun
form ("بز خاک"). Water Horse would then read اسب آبی, a hippopotamus, and Water Dog سگ آبی, a beaver;
no event falls in either year yet (壬午: 1942, 2002; 壬戌: 1922, 1982).

### No third-party requests

Fonts come from `@fontsource/*`, imported in `global.css` and bundled by Vite. Never link Google
Fonts or any CDN: a third-party request hands each visitor's IP to that party (GDPR). The
`brand.cocode.dk` frame is the owner's own site on the same GitHub Pages host.

### Marker state encoding

Bit 0 = `n` is prime, bit 1 = `reverse(n)` is prime, so 3 = both. `createPlotData` zeroes the state
of any marker whose reversal falls outside the interval, which is why the marker-extraction pass
tests only `states[index] > 0` and never repeats the range check. Both the renderer's
`MARKER_PASSES` table and `Legend`'s items depend on this encoding; nothing enforces agreement.

### Some i18n keys are only reached dynamically

`ruleNote1` / `ruleNote9` / `ruleNote18` look unused to a plain grep. They are read as
``t[`ruleNote${divisor}`]`` in `ChainControls`, as `t[labelKey]` is in the legends and the axis
switch. A dead-key sweep that trusts literal `t.x` references will delete live copy.

### Progress phases are ids, not prose

`src/lib/phases.js` holds the ids; the dictionaries own the labels. This used to be keyed on English
display strings, and a phase added in the compute layer then rendered untranslated with no error —
the Persian chains page showed English through every search. `i18n.test.js` now fails if any id
lacks a label in either dictionary, or if a dictionary labels an id that no longer exists.

## Test coverage

Components are testable: `vite.config.js` runs the same plugins under vitest, with a `jsdom`
environment and `@testing-library/react`. Render tests live next to the component
(`Legend.test.jsx`).

Do **not** reintroduce a `mode === 'test'` branch that drops the plugins. Without the StyleX
transform, importing any component throws `Unexpected 'stylex.create' call at runtime` — that one
line is what previously made every `.jsx` file untestable. JSX itself was never the problem; Vite's
esbuild handles it.

The StyleX plugin leaves file watchers open, so vitest reports `close timed out` after finishing.
Tests pass and the exit code is 0; `teardownTimeout: 1000` caps the dead wait. `react()` alone exits
cleanly, so the handles are StyleX's.

Still uncovered: the canvas rendering in `drawPrimePlot.js` (no jsdom canvas) and the worker. Check
those in the browser.

## Deployment

The site is served at the root of `primes.cocode.dk` (custom domain on GitHub Pages), so `base` in
`vite.config.js` is `/`. It has to match where the site is served: with the old `/reverse-prime-plot/`
base every asset, including the worker chunk, 404ed and the page came up blank after the domain move.

Static files belong in `public/`; Vite copies that to the dist root. A file at the repo root
(`llms.txt`) does **not** reach the deployed site, which is why there is a copy in `public/`.

## Repo automation

- The CI job is named `verify` and is the required status check on `main`. Renaming it silently
  disables branch protection's gate.
- Releases are manual (`workflow_dispatch`). Git tags are the canonical version; root `version.txt`
  is only the bootstrap base for when no tag exists yet, so the first release tags `v0.1.1`.
- `main` requires a PR (0 approvals). Hooks are installed via `./scripts/install-hooks.sh` and
  enforce Conventional Commits, which rejects default `Merge branch ...` messages.
