# Reverse Prime Plot

[![CI](https://github.com/cocodedk/reverse-prime-plot/actions/workflows/ci.yml/badge.svg)](https://github.com/cocodedk/reverse-prime-plot/actions/workflows/ci.yml)

Take an integer `n`, reverse its digits, and you get a second number. Reverse Prime Plot
puts the two on a coordinate plane: for every integer in an interval you choose, it plots
the point `(n, reverse(n))` and marks how the two numbers relate to primality. A marker's
top half is filled when `n` is prime, its bottom half when `reverse(n)` is prime, and the
whole circle when both are. Everything runs in the browser, so you can widen the interval
and watch what the base-10 mirror does to the primes.

## Website

- [Live site (English)](https://cocodedk.github.io/reverse-prime-plot/)
- [نسخهٔ فارسی / Persian version](https://cocodedk.github.io/reverse-prime-plot/fa/)

## Features

- **Any interval from 0 to 10,000,000.** Type the endpoints, or start from one of the
  presets (0–50, 0–100, 0–250). The interval is inclusive at both ends.
- **Half-filled markers.** A circle's top half is filled when `n` is prime, the bottom
  half when `reverse(n)` is prime, and the full circle when both are. Points where
  neither is prime are left out entirely, so the plot only carries signal.
- **Sieve of Eratosthenes in a Web Worker.** Digit reversal, sieving, and classification
  all run off the main thread. The results come back as typed arrays that are
  *transferred* rather than copied, so the UI stays responsive and the buffers are moved rather than copied.
- **Two rendering paths.** Up to 5,000 points the canvas draws real circles with outlines.
  Above that the renderer switches to writing `ImageData` pixels directly — a wide
  interval becomes a dense pixel plot instead of a smear of overlapping discs.
- **Live progress.** The worker reports its phase (reversing digits, finding primes,
  classifying points, preparing markers) and a percentage while it works.
- **Flip the vertical axis.** Put the interval's lower endpoint at the bottom or at the
  top, whichever reading of the mirror you prefer.
- **Counts for the interval.** How many numbers were checked, how many markers are drawn,
  how many `n` are prime, how many reversals are prime, and how many are both.
- **Honest about what is off-screen.** A reversal can land outside the chosen interval
  (reverse(19) = 91 is outside 0–50). Those points cannot be plotted on a square axis, so
  they are dropped and the count of them is reported under the plot.
- **Bilingual.** English and Persian, each its own entry point with its own locale, digit
  formatting, and text direction.
- **Accessible.** The canvas carries a text description of what is drawn, the progress bar
  is a real ARIA progressbar, and the legend is readable without colour vision.

## Run it locally

Requires a recent Node.js LTS release and npm.

```bash
git clone https://github.com/cocodedk/reverse-prime-plot.git
cd reverse-prime-plot
npm install
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm test` | Run the vitest unit suite once |
| `npm run build` | Produce a production build in `dist/` |

## Project structure

```
index.html                 English entry point
fa/index.html              Persian entry point
src/
  App.jsx                  Page layout, interval state, stats
  main.jsx                 React entry point
  appStyles.stylex.js      StyleX styles for the page
  global.css               Base document styles
  components/
    IntervalControls.jsx   Interval form, presets, axis-direction switch
    Legend.jsx             Marker legend (SVG glyphs)
    PrimePlot.jsx          Canvas element and draw lifecycle
  hooks/
    usePlotData.js         Spawns the worker, tracks progress and errors
  workers/
    plotDataWorker.js      Runs createPlotData, transfers the typed arrays back
  lib/
    primeNumbers.js        Digit reversal, sieve, marker packing
    drawPrimePlot.js       Grid, markers, dense pixel path, axis frame
    plotGeometry.js        Canvas dimensions, tick selection, scales
    palette.js             Colours shared by the canvas and the legend
  i18n/
    index.js, en.js, fa.js Locale detection and the two dictionaries
```

Marker state is bit-packed in `primeNumbers.js` — bit 0 means `n` is prime, bit 1 means
`reverse(n)` is prime — which is what lets the renderer draw each visual layer in a single
sweep and the worker ship three compact typed arrays instead of an array of objects.

### Stack

| Piece | Used for |
| --- | --- |
| [Vite](https://vite.dev) 8 | Dev server, build, worker bundling, one entry per language |
| [React](https://react.dev) 19 | UI state and the canvas lifecycle |
| [StyleX](https://stylexjs.com) | Styling, compiled to atomic CSS |
| [Vitest](https://vitest.dev) | Unit tests for the maths and the geometry |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Author

**Babak Bandpey** — [https://cocode.dk](https://cocode.dk) | [LinkedIn](https://linkedin.com/in/babakbandpey) | [GitHub](https://github.com/cocodedk)

Created by [Babak Bandpey](https://linkedin.com/in/babakbandpey). Built by [Cocode](https://cocode.dk).

## License

Apache-2.0 | © 2026 [Cocode](https://cocode.dk) | Created by [Babak Bandpey](https://linkedin.com/in/babakbandpey)
