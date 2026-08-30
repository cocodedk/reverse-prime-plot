# Contributing to Reverse Prime Plot

Bug reports, fixes, and ideas are all welcome. This is a small project, so the process is
short.

## Local setup

1. Install a recent Node.js LTS release and npm.
2. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/cocodedk/reverse-prime-plot.git
   cd reverse-prime-plot
   npm install
   ```

3. Install the git hooks:

   ```bash
   ./scripts/install-hooks.sh
   ```

   This points `core.hooksPath` at `.githooks/`. The pre-commit hook runs `npm test`, and
   the pre-push hook blocks force-pushes and deletions of protected branches.
4. Start the dev server with `npm run dev` and open the URL it prints.

## Build and test commands

```bash
npm run dev      # Vite dev server with hot reload
npm test         # vitest, single run
npm run build    # production build into dist/
```

The unit tests live next to the code they cover, in `src/lib/*.test.js`, and exercise the
pure parts: digit reversal, interval validation, the plot-data pipeline, tick selection,
and the coordinate scales. Vite disables the StyleX and React plugins in test mode, so
tests must not import components — keep new logic in `src/lib` where it can be tested
directly.

## Coding style

- Modern ES modules, JSX for components. No TypeScript, no build-time codegen beyond what
  Vite and StyleX already do.
- Keep files under 200 lines. If a module grows past that, split it — the existing
  `src/lib` split (maths, geometry, drawing, palette) is the pattern to follow.
- Name things in full: `markerReversed`, not `mr`. The maths is dense enough already.
- Comment the *why*, not the *what*. The existing comments explain non-obvious decisions
  (why marker state is bit-packed, why a dense plot needs its own canvas context, why the
  worker collapses repeated progress values) rather than restating the code.
- All user-visible text goes through `src/i18n`. Add the key to **both** `en.js` and
  `fa.js`; never inline an English string in a component.
- Styling is StyleX. Canvas and SVG colours come from `src/lib/palette.js`.
- Keep the plot accessible: the canvas has a text description, the progress bar is a real
  ARIA progressbar, and controls stay reachable by keyboard.

## Performance notes

The rendering path is deliberately split at 5,000 points: below it the canvas draws
outlined circles, above it the renderer writes `ImageData` pixels directly. Sieving and
classification happen in a Web Worker and return transferable typed arrays. Changes that
touch `src/lib/primeNumbers.js`, `src/lib/drawPrimePlot.js`, or `src/workers/` should be
checked at both ends of the range — a small interval such as 0–100 and a wide one such as
0–1,000,000 — before opening a PR.

## Pull requests

Open an issue first for anything larger than a bug fix, so the approach can be agreed
before the work happens.

- [ ] `npm test` passes.
- [ ] `npm run build` succeeds.
- [ ] Manually checked in a browser: a small interval and a wide one, both axis
      directions, and both languages if the change touches the UI.
- [ ] New user-visible strings added to `en.js` and `fa.js`.
- [ ] Docs updated if behaviour changed.
- [ ] Commits are focused and their messages say why the change was made.

## License

By contributing you agree that your contributions are licensed under the
[Apache License 2.0](LICENSE), the same license that covers this project.
