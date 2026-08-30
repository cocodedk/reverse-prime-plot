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

### Marker state encoding

Bit 0 = `n` is prime, bit 1 = `reverse(n)` is prime, so 3 = both. `createPlotData` zeroes the state
of any marker whose reversal falls outside the interval, which is why the marker-extraction pass
tests only `states[index] > 0` and never repeats the range check. Both the renderer's
`MARKER_PASSES` table and `Legend`'s items depend on this encoding; nothing enforces agreement.

### Progress phase strings are load-bearing

The phase names `createPlotData` emits are asserted by `src/lib/primeNumbers.test.js` **and** used as
i18n lookup keys in `src/i18n/*.js`. Renaming one touches a unit test and both dictionaries.

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

`base` in `vite.config.js` is `/reverse-prime-plot/` and must match the repo name, or every asset —
including the worker chunk — 404s under the Pages subpath.

Static files belong in `public/`; Vite copies that to the dist root. A file at the repo root
(`llms.txt`) does **not** reach the deployed site, which is why there is a copy in `public/`.

## Repo automation

- The CI job is named `verify` and is the required status check on `main`. Renaming it silently
  disables branch protection's gate.
- Releases are manual (`workflow_dispatch`). Git tags are the canonical version; root `version.txt`
  is only the bootstrap base for when no tag exists yet, so the first release tags `v0.1.1`.
- `main` requires a PR (0 approvals). Hooks are installed via `./scripts/install-hooks.sh` and
  enforce Conventional Commits, which rejects default `Merge branch ...` messages.
