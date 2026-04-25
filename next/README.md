# Next.js Exercises

Next.js coding exercises.

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` to see the list of exercises.

## Exercises

- [01 — Debounced Search](src/app/01-debounced-search/) — URL-synced search with 300ms debounce
- [02 — Generic Filter Component](src/app/02-filter-component/) — Reusable `MultiSelectFilter<T>` with TypeScript generics
- [03 — Infinite Scroll](src/app/03-infinite-scroll/) — `useInfiniteQuery` + Intersection Observer

## Adding a new exercise

1. Create `src/app/<nn>-<name>/page.tsx`
2. Add an entry to the `exercises` array in `src/app/page.tsx`
3. Done — Next.js picks it up automatically
