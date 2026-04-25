# React Exercises

A collection of React exercises, each with a starter and one or more submissions.

## Getting started

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:5173` to see the list of exercises.

## Exercises

- [People Search](/people-search) — Search anime characters using the Jikan API with debounced input and React Query.

## Adding a new exercise

1. Create `src/routes/<name>/submissions/01/index.jsx` with `export const Route = createFileRoute(...)` and your component
2. Add any exercise-specific files (api, hooks, components) alongside the route file
3. Add an entry to the `exercises` array in `src/routes/index.jsx`

TanStack Router auto-discovers the new route. Dev server picks it up immediately.

## Stack

- React 19
- Vite
- TanStack Router (file-based routing)
- TanStack Query
- Tailwind CSS v4
- SCSS Modules
- Biome (lint + format)
