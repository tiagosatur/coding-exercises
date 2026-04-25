# Exercise 02 — Generic Filter Component

## Goal

Build a reusable `MultiSelectFilter<T>` component that works for **any string-based filter** — cities, bedroom counts, property types, or anything else — without duplicating logic.

## Key Concepts

### TypeScript Generics

A generic component accepts a **type parameter** that gets substituted at the call site:

```ts
function MultiSelectFilter<T extends string>(props: MultiSelectFilterProps<T>) {}
```

The constraint `T extends string` ensures `T` is always a string (or string literal union), which lets you use `Array<T>.includes()` safely.

### Why `readonly T[]` for options?

Arrays defined with `as const` are typed as `readonly`:

```ts
const CITIES = ["Madrid", "Barcelona"] as const;
// type: readonly ["Madrid", "Barcelona"]
```

Using `readonly T[]` in your props lets you pass `as const` arrays directly without casting.

### The toggle pattern

```ts
const toggle = (option: T) => {
  selected.includes(option)
    ? onChange(selected.filter(o => o !== option))
    : onChange([...selected, option]);
};
```

This is a functional update — it never mutates the existing array, always returns a new one.

### Empty array = show all

```ts
cities.length === 0 || cities.includes(p.city)
```

An empty selection means "no filter applied" (show everything), not "show nothing".

---

## Implementation Checklist

- [ ] Add `<T extends string>` to `MultiSelectFilterProps` and the function signature
- [ ] Replace every `string` annotation inside the component with `T`
- [ ] Implement `toggle`: remove if present, append if absent
- [ ] Implement `filtered` using all three state arrays with the empty-means-all pattern
- [ ] Restore state types to `City[]`, `BedroomOption[]`, `PropertyType[]` now that the generic enforces them

## Accessibility Reminders

- Add `type="button"` to all `<button>` elements
- Add `aria-pressed={active}` to toggle buttons so screen readers announce state
- Add `aria-label` to the `<aside>` filter panel

## Performance Note

Wrap `filtered` in `useMemo` — it prevents re-running the filter on every render when only unrelated state changes:

```ts
const filtered = useMemo(
  () => PROPERTIES.filter(p => ...),
  [cities, bedrooms, types],
);
```
