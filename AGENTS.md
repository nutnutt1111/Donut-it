# AGENTS.md

## Cursor Cloud specific instructions

This is a zero-dependency static PWA (Progressive Web App) called "DONUT IT". There is no package manager, no build system, no database, and no backend.

### Running the app

Serve the files with any static HTTP server from the repository root:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in a browser.

### Key notes

- The app is entirely client-side: a single `index.html` with inline CSS/JS, a `manifest.webmanifest`, and a `sw.js` service worker.
- No lint, test, or build commands exist — there are no configuration files for these tools.
- Service workers require HTTPS or `localhost` to function; use `localhost` during development.
- The app is in Thai language. The three main features are tab-based: Installment Calculator, Delivery Cost, and Work Check-in.
