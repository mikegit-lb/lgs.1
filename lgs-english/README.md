# LGS English

Offline LGS (8th-grade) English practice app. Vanilla JS + Vite, no runtime dependencies.

```
npm install
npm run dev     # local dev server
npm test        # vitest run
npm run build   # static build in dist/
```

Note: Vite/Vitest cannot load tests when the project path contains `#`
(e.g. `TEACHING#2`). Map a drive first: `subst L: "C:\Users\mike\Documents\TEACHING#2\LGS"`
and run commands from `L:\lgs-english`.

Unit catalogue: `src/data/units.js`.
