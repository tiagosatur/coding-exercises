# Vanilla JS Exercises

A collection of vanilla JavaScript exercises, each in its own folder with its own HTML page.

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` to see the list of exercises.

## Exercises

- [Form Validation](exercises/form-validation/) — Validate a user form and add users to a list using DOM manipulation.

## Adding a new exercise

1. Create `exercises/<name>/` with `index.html`, `script.js`, `style.css`, `README.md`
2. Add one `<li>` to root `index.html`
3. Done — `vite.config.js` auto-discovers it, dev server picks it up immediately
