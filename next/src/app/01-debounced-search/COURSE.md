# Exercise 01 — Debounced Search

## Goal

Build a search input that filters a list in real time, but only updates the URL **300ms after the user stops typing** — not on every keystroke. The active query is stored in the URL so the result is shareable and survives a page refresh.

## Key Concepts

### Why debounce?

Without debouncing, every keystroke triggers a `router.push` and a URL update. At fast typing speeds that's 5–10 navigations per second — noisy history, unnecessary re-renders, and a bad user experience.

Debouncing collapses a burst of calls into one, fired only after the burst stops:

```
keystrokes:  r  a  f  a  e  l
timeouts:    ×  ×  ×  ×  ×  ✓ ← only this one fires (300ms after last key)
```

### Why `useRef` for the timer?

```ts
const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
```

Three reasons `useRef` is the right tool here:

1. **Persists across renders** — a plain `let` inside the component resets to `undefined` on every render, so you'd never be able to clear the previous timeout.
2. **Doesn't cause re-renders** — unlike `useState`, mutating `ref.current` is invisible to React. The component only re-renders when the URL (and therefore `query`) changes.
3. **Holds any mutable value** — `useRef` isn't just for DOM nodes; it's the escape hatch for any value you need to keep between renders without triggering a re-render.

### `ReturnType<typeof setTimeout>`

`setTimeout` returns a `number` in the browser but a `NodeJS.Timeout` in Node. Using `ReturnType<typeof setTimeout>` is the cross-environment safe type — TypeScript infers the correct one for the runtime.

### Why `| undefined` and not `| null`?

```ts
clearTimeout(undefined); // ✅ no-op, perfectly valid
clearTimeout(null);      // ❌ TypeScript error — not in the overload signature
```

`clearTimeout` accepts `undefined` by design (so you can call it safely before any timer is set), but its type signature does not include `null`.

### URL sync with `useSearchParams`

```ts
const query = searchParams.get("search")?.toLowerCase() ?? "";
```

- `useSearchParams` reads the current URL search params — this is the single source of truth for the active query.
- `router.push("?search=rafael")` updates the URL without a full page reload, which triggers React to re-render with the new `searchParams`.
- Because the input is **uncontrolled** (no `value` prop), the browser owns its display value and it stays in sync naturally as the user types.

### Controlled vs uncontrolled inputs

| | Controlled | Uncontrolled |
|---|---|---|
| Value owned by | React state | DOM |
| How to read value | `value` state | `e.target.value` in handler |
| Use when | You need to programmatically set or reset the value | You only need to react to changes |

This exercise uses uncontrolled because the URL is the source of truth, not a React state variable.

---

## Implementation Checklist

- [ ] Import `useRef` from React
- [ ] Import `useRouter` and `useSearchParams` from `next/navigation`
- [ ] Read `query` from `searchParams.get("search")?.toLowerCase() ?? ""`
- [ ] Create `timeoutRef` with `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`
- [ ] In `onChange`: clear the previous timeout with `clearTimeout(timeoutRef.current)`
- [ ] Set a new 300ms timeout that calls `router.push(\`?search=\${value}\`)`
- [ ] Assign the timeout ID back to `timeoutRef.current`
