# Infinite Scroll

## Before you touch any code — think first

You're looking at a list of 3.099 apartments. The user wants to browse them without clicking "Next page" every 15 results.

**Question:** How would you naively implement this with a scroll event listener?

Take 30 seconds and think about it. Seriously, don't skip this.

---

You probably thought of something like:

```js
window.addEventListener('scroll', () => {
  const nearBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 200
  if (nearBottom) loadMore()
})
```

This works. But what's wrong with it?

- `scroll` fires **dozens of times per second** as the user scrolls
- You'd call `loadMore()` dozens of times before the first response even comes back
- You need debouncing, you need a "loading" flag, you need to remove the listener... it becomes a mess fast

There's a better primitive.

---

## The Intersection Observer

The browser has a built-in API for exactly this: **detecting when an element enters or exits the viewport**.

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible!')
    }
  })
})

observer.observe(document.querySelector('#my-element'))
```

Instead of watching the scroll position, you place an invisible `<div>` (called a **sentinel**) at the bottom of your list and watch *it*. When it becomes visible, the user has scrolled to the bottom — time to load more.

**Why is this better than a scroll listener?**

1. The callback only fires when visibility *changes* — not on every pixel scrolled
2. No debouncing needed
3. The browser handles the heavy lifting off the main thread

**Your turn:** Before moving on, answer this: where should the sentinel `<div>` be placed in the DOM relative to your list items? Think about what "reaching the bottom" means visually.

---

## What `useInfiniteQuery` gives you

Open `submissions/01/index.tsx`. The query is already configured:

```ts
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({ ... })
```

Here's what each piece does:

| Value | Type | What it is |
|---|---|---|
| `data.pages` | `NormalisedPage[]` | Every page fetched so far, in order |
| `fetchNextPage` | `() => void` | Triggers fetching the next page |
| `hasNextPage` | `boolean` | `true` if `getNextPageParam` returned something |
| `isFetchingNextPage` | `boolean` | `true` while the next page is loading |

Notice that `fetchNextPage` is just a function. It doesn't know about scroll. It doesn't know about the DOM. **It just fetches the next page when called.**

Your job is to call it at the right moment — and that's exactly what the Intersection Observer will do.

**Question:** What two conditions should be true before you call `fetchNextPage()`? (Hint: look at the values in the table above. Calling it when one of them is false would cause a bug.)

---

## Step 1 — Attach the ref

The sentinel `<div>` is already in the JSX:

```tsx
<div ref={sentinelRef} className="h-12 ...">
```

And `sentinelRef` is already created:

```ts
const sentinelRef = useRef<HTMLDivElement>(null)
```

A `ref` gives you direct access to a DOM element. After the component mounts, `sentinelRef.current` will be the actual `<div>`.

**Try it:** Add a `useEffect` that just logs `sentinelRef.current` after mount. Confirm it's the DOM element, not `null`.

---

## Step 2 — Create the observer

Now create the `IntersectionObserver` inside that `useEffect`:

```ts
useEffect(() => {
  const el = sentinelRef.current
  if (!el) return

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    // What goes here?
  })

  observer.observe(el)
}, [])
```

**Question:** The dependency array is empty (`[]`). Is that correct? Think about what `fetchNextPage`, `hasNextPage`, and `isFetchingNextPage` are — do they change over time? What happens if your callback closes over a stale value?

---

## Step 3 — The stale closure problem

This is the most common bug in Intersection Observer + React code.

If you write:

```ts
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchNextPage() // ← this captures the value from the first render
    }
  })
  // ...
}, []) // ← never re-runs
```

The callback is created once and **closes over** the initial values of `hasNextPage` and `isFetchingNextPage`. Even as those values change across renders, your callback is still looking at the original snapshot.

The fix: add the values you use inside the callback to the dependency array. When they change, React re-runs the effect — tearing down the old observer and creating a new one with fresh values.

**Try it now:** Write the full `useEffect` with the correct dependency array. Don't look at the hints below until you've tried.

<details>
<summary>Hint — what the dependency array should include</summary>

```ts
}, [fetchNextPage, hasNextPage, isFetchingNextPage])
```

</details>

<details>
<summary>Hint — don't forget cleanup</summary>

Every `useEffect` that sets up a subscription should return a cleanup function. Without it, every re-run of the effect creates a *new* observer without destroying the old one.

```ts
return () => observer.disconnect()
```

</details>

---

## Step 4 — Guard the call

Inside the observer callback, don't call `fetchNextPage()` unconditionally:

```ts
if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
  fetchNextPage()
}
```

**Why each guard:**
- `entry.isIntersecting` — only act when the sentinel enters the viewport (not when it leaves)
- `hasNextPage` — stop fetching when there are no more pages
- `!isFetchingNextPage` — don't fire a second request while the first is still in flight

---

## Now implement it

Open `submissions/01/index.tsx`. Find the `// TODO` block and write the `useEffect`. You have everything you need.

When it works, you'll see new cards loading automatically as you scroll to the bottom.

---

## Checklist before checking the solution

- [ ] Cards load on first render (page 1)
- [ ] Scrolling to the bottom automatically loads more cards
- [ ] "Loading more..." text appears while fetching
- [ ] A second request is not fired while the first is loading
- [ ] "No more listings" appears when all pages are exhausted
- [ ] No console errors or warnings

---

## Full solution

<details>
<summary>Reveal only after you've tried</summary>

```ts
useEffect(() => {
  const el = sentinelRef.current
  if (!el) return

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  })

  observer.observe(el)

  return () => observer.disconnect()
}, [fetchNextPage, hasNextPage, isFetchingNextPage])
```

That's it. 10 lines.

The power here is the separation of concerns:
- `useInfiniteQuery` owns *what* to fetch and *when* data is ready
- `IntersectionObserver` owns *when* to trigger the next fetch
- They're connected by a single function call: `fetchNextPage()`

</details>

---

## Going further (after the interview)

You solved the core. Now let's make it production-quality.

---

### `rootMargin` — load before the user notices

Right now, loading starts the moment the sentinel enters the viewport. That means the user literally sees the bottom of the list before new cards appear — a flash of empty space.

`rootMargin` expands the observer's detection area beyond the actual viewport:

```ts
const observer = new IntersectionObserver((entries) => {
  // ...
}, {
  rootMargin: "200px", // fire when sentinel is 200px *below* the viewport
})
```

Think of it as a buffer zone. With `"200px"`, loading starts while the user still has 200px of content left to scroll — by the time they reach the bottom, new cards are already there.

**Try it:** Set `rootMargin: "0px"` vs `"400px"` and scroll quickly. Notice the difference.

**Question:** What's the downside of setting `rootMargin` too high, like `"2000px"`?

<details>
<summary>Answer</summary>

You'd start fetching page 2 almost immediately after page 1 loads, before the user has scrolled at all. With a very large margin you're essentially prefetching every page eagerly — wasting bandwidth for users who don't scroll far.

The right value depends on how tall your cards are and how fast your API responds. 200–400px is a common sweet spot.

</details>

---

### `threshold` — control when "visible" means visible

`threshold` is a number between `0` and `1` representing what fraction of the element must be visible for the callback to fire.

- `threshold: 0` (default) — fires as soon as **1 pixel** enters the viewport
- `threshold: 0.5` — fires when **50%** of the element is visible
- `threshold: 1` — fires only when the element is **fully** visible

```ts
const observer = new IntersectionObserver(callback, {
  threshold: 0,     // fires the instant the sentinel peeks in
})
```

For a sentinel div that's meant to be invisible, `threshold: 0` is almost always correct — you want it to trigger as early as possible.

Where `threshold` is more useful: imagine you want to animate a card only after it's mostly visible, not just partially. You'd use `threshold: 0.7` on the card itself.

**Question:** Could you combine `rootMargin` and `threshold` on the same observer? What would `rootMargin: "200px", threshold: 1` mean?

<details>
<summary>Answer</summary>

Yes. It would mean: expand the detection zone 200px below the viewport, and within that zone, fire only when the element is 100% visible. In practice this is unusual for a sentinel — but it's a valid combination for animating elements that should be fully "in frame" before triggering.

</details>

---

### Error state — what happens when a page fails?

Right now if the API returns an error, the page just stops. The user has no way to retry.

`useInfiniteQuery` gives you everything you need:

```ts
const { error, isError, refetch } = useInfiniteQuery({ ... })
```

But there's a subtlety: `refetch` retries the *whole* query from scratch. To retry just the *last failed page*, use:

```ts
const { fetchNextPage } = useInfiniteQuery({ ... })
// fetchNextPage() will retry the last page if it failed
```

**Try implementing this:** When `isError` is true *and* `data` already exists (some pages loaded successfully), show a "Failed to load. Try again" button at the bottom instead of replacing the whole list. Clicking it calls `fetchNextPage()`.

```tsx
{isError && data && (
  <div className="text-center mt-6">
    <p className="text-red-500 text-sm mb-2">Failed to load more listings.</p>
    <button
      onClick={() => fetchNextPage()}
      className="px-4 py-2 bg-red-500 text-white rounded text-sm"
    >
      Try again
    </button>
  </div>
)}
```

**Question:** Why check `&& data` before showing the retry button? What should happen if the *very first* page fails?

<details>
<summary>Answer</summary>

If the first page fails, `data` is undefined — there's nothing to show. In that case a full-page error state makes more sense than an inline retry button. The `&& data` condition separates "initial load failed" from "a subsequent page failed while scrolling."

</details>

---

### Virtualization — when the DOM becomes the bottleneck

After enough scrolling you might have 200, 500, 1000 cards in the DOM simultaneously. Each one is a real DOM node with styles, images, event listeners. The browser has to keep all of them in memory and recalculate layout whenever anything changes.

**The problem:** rendering everything doesn't scale.

**The solution:** only render what the user can actually see.

This is virtualization. `@tanstack/react-virtual` measures your container, calculates which items fall within the visible window, and only renders those — plus a small buffer above and below. Items outside the view are replaced by empty space that maintains the scroll height.

```
Without virtualization:   [card][card][card]...[card x 1000]  ← all in DOM
With virtualization:      [spacer][card][card][card][spacer]  ← only ~10 in DOM
```

The core API:

```ts
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: allProperties.length,
  getScrollElement: () => parentRef.current,  // the scrollable container
  estimateSize: () => 350,                    // estimated card height in px
  overscan: 5,                                // render 5 extra items above/below
})
```

Then instead of `.map()` over all items, you render only `virtualizer.getVirtualItems()`:

```tsx
<div
  ref={parentRef}
  style={{ height: '100vh', overflow: 'auto' }}
>
  {/* Total height spacer — keeps scrollbar accurate */}
  <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
    {virtualizer.getVirtualItems().map((virtualRow) => (
      <div
        key={virtualRow.key}
        style={{
          position: 'absolute',
          top: virtualRow.start,
          width: '100%',
        }}
      >
        <PropertyCard property={allProperties[virtualRow.index]} />
      </div>
    ))}
  </div>
</div>
```

**The key insight:** the outer div is as tall as if all items were rendered (`getTotalSize()`), so the scrollbar behaves normally. But only ~10 cards exist in the DOM at any time.

**Question:** Virtualization uses `estimateSize`. What happens when cards have variable heights (some with photos, some without)?

<details>
<summary>Answer</summary>

`useVirtualizer` supports dynamic measurement via `measureElement`. After each item renders, the virtualizer measures its actual height and adjusts the layout. You pass a `ref` callback to each rendered item:

```tsx
<div ref={virtualizer.measureElement} data-index={virtualRow.index}>
  <PropertyCard ... />
</div>
```

Without this, cards with variable heights will overlap or leave gaps because the virtualizer is working with wrong estimates.

</details>

**Should you add virtualization now?** Only if you actually have a performance problem. Open DevTools → Performance tab, scroll fast, and check if frame rate drops. For 200 items it's probably fine. For 2000+ items, virtualize.

---

### URL sync — shareable pages and working back button

Open the real Chaves na Mão site and watch the Network tab as you scroll. You'll notice the URL changes to `?pg=2`, `?pg=3`... And if you paste `?pg=5` directly, the next scroll fetches page 6 — it started from page 5, not 1.

This is URL sync. It gives you three things for free:
- **Shareable links** — copy the URL at `?pg=8`, send it, the recipient lands at page 8
- **Working back button** — back goes to the previous page, not to the home page
- **Resilience** — refresh the page and you're back where you were

**Question:** Your current implementation uses `router.replace` to update the URL. What's the difference between `replace` and `push`, and which one should you use here?

<details>
<summary>Answer</summary>

- `router.replace` — overwrites the current history entry. Back button skips over it entirely.
- `router.push` — adds a new history entry. Back button returns to it.

For infinite scroll, you want `push` for each new page loaded by scrolling, so back steps through pages. But for the *first* page load you want `replace` — you're just setting the initial URL, not adding a navigation.

</details>

---

#### The stale closure problem, again

If you naively add URL sync inside your existing `useEffect`, you'll hit the same stale closure issue from Step 3 — but worse.

**Question:** Before reading on, think about this: you want to call `router.push('?pg=2')` after page 2 loads. Where do you put that logic — inside the Intersection Observer callback, or in a separate `useEffect`?

Take a moment.

---

The answer is a **separate `useEffect`** that watches `data?.pages.length`:

```ts
useEffect(() => {
  if (!data?.pages.length) return
  // ...
}, [data?.pages.length])
```

Why not inside the observer callback? The observer fires when the sentinel enters the viewport — that's *before* the fetch completes. You'd be updating the URL before the new page data exists.

A separate effect fires *after* React re-renders with the new data — exactly the right moment.

---

#### The back button problem

When the user hits back, the browser navigates to the previous URL (`?pg=2`). Your component re-renders and reads `pg=2` from `useSearchParams`. But `useInfiniteQuery` was initialized with `initialPageParam: 1` — it ignores the URL.

The fix has two parts:

**1. Read the initial page from the URL — frozen at mount:**

```ts
const searchParams = useSearchParams()
const [initialPage] = useState(() => Number(searchParams.get('pg')) || 1)
```

**Why `useState` and not a plain `const`?**

If you write `const initialPage = Number(searchParams.get('pg')) || 1`, `initialPage` re-reads `searchParams` on every render. The moment `router.push("?pg=2")` fires, the URL changes, `initialPage` becomes `2`, and the query key below changes — React Query starts a **brand new query** from page 2. But the sentinel is immediately visible with only 1 page of content, so it fires `fetchNextPage` again, pushes `?pg=3`, `initialPage` becomes `3`... and the page numbers spiral: 1 → 2 → 4 → 11.

`useState(() => ...)` runs the initializer **once on mount** and ignores subsequent URL changes. The value is frozen for the lifetime of this component instance.

**2. Include `initialPage` in the query key:**

```ts
useInfiniteQuery({
  queryKey: ["listings", initialPage], // ← this is the key piece
  initialPageParam: initialPage,
  ...
})
```

When the user does a hard refresh at `?pg=3`, the component mounts fresh, `initialPage` initializes to `3`, and the query key `["listings", 3]` tells React Query to start from page 3. Without the key, React Query would reuse the cached query from page 1 and ignore `initialPageParam` entirely.

**Back button (soft navigation):** When the user hits back within the SPA, `useSearchParams` updates but `initialPage` stays frozen — so the displayed content doesn't change. The URL and scroll position step back correctly, but items already in memory stay visible. A hard refresh at any `?pg=N` always starts clean from page N. This is the same trade-off the real Chaves na Mão makes.

**Question:** When navigating back to `?pg=3`, the list shows only page 3's items — pages 1 and 2 are missing. Is this a bug?

<details>
<summary>Answer</summary>

No — it's a deliberate trade-off. The alternative is fetching pages 1, 2, and 3 sequentially on mount, which means 3 network requests before the user sees anything. Chaves na Mão makes the same choice: paste `?pg=5` and scroll — it fetches page 6 next, with no attempt to load pages 1–4.

The UX assumption is that users who hit back want to continue from where they were, not see the full history of what they scrolled through. Starting fresh from that page is good enough.

</details>

---

#### Putting it all together — try to implement before reading

You now have all the pieces. Try to wire them up in `submissions/02/index.tsx` before looking at the full implementation below.

What you need to add:
1. Read `initialPage` from `useSearchParams` — **frozen in `useState`**, not a plain `const`
2. Add `initialPage` to `queryKey` and `initialPageParam`
3. Track `loadedPagesCount = data?.pages.length ?? 0`
4. Add a `useEffect` that pushes/replaces the URL when `loadedPagesCount` changes

<details>
<summary>Full implementation</summary>

```tsx
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"

export default function InfiniteScrollExercise() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Frozen at mount — re-reading searchParams reactively causes the query key to
  // change on every router.push, which starts a new query, making pages spiral.
  const [initialPage] = useState(() => Number(searchParams.get("pg")) || 1)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    // Including initialPage in the key means a URL change (e.g. via back button)
    // triggers a fresh query starting from the new page
    queryKey: ["listings", initialPage],
    queryFn: ({ pageParam }) => fetchListingsPage(pageParam as number, "[3099]"),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  })

  // Intersection Observer — same as submission 01
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // URL sync — runs after each new page loads
  const loadedPagesCount = data?.pages.length ?? 0
  useEffect(() => {
    if (!loadedPagesCount) return

    // Actual page number currently showing at the bottom of the list
    const currentPage = initialPage + loadedPagesCount - 1
    const url = `${pathname}?pg=${currentPage}`

    if (loadedPagesCount === 1) {
      // First load: replace so we don't add a history entry just for the initial render
      router.replace(url)
    } else {
      // New page loaded by scrolling: push so back button steps through pages
      router.push(url)
    }
  }, [loadedPagesCount])

  // ... rest of the render is identical to submission 01
}
```

**Why `currentPage = initialPage + loadedPagesCount - 1`:**

If you started at page 3 (`initialPage = 3`) and have loaded 2 pages, you're showing pages 3 and 4. The URL should say `?pg=4` — the last page visible. So: `3 + 2 - 1 = 4`. ✓

</details>

---

#### One more thing: `scroll: false`

Every `router.push` and `router.replace` call above passes `{ scroll: false }`. Without it, Next.js scrolls the window back to the top on every URL change — exactly the opposite of what you want during infinite scroll.

This is easy to forget and produces a very confusing bug where the page jumps to the top every time a new batch of cards loads.

---

### Scroll restoration — making back button scroll to the right place

URL sync gives you a working back button in terms of URL. But there's still a scroll problem.

**The bug:** you're on page 3. You press back. The URL changes to `?pg=2`. But you're either still at the same scroll position (middle of page 3's content) or the browser jumps you to some seemingly random position — neither of which is "the start of page 2."

**Why it happens:** when you call `router.push('?pg=2', { scroll: false })`, the browser records your current scroll position into that history entry. When you later navigate back to it, the browser tries to restore that scroll position — which was the bottom of page 1 (where the sentinel triggered), not the top of page 2.

You and the browser are fighting over scroll position. The fix is to take full control.

---

#### Step 1 — Disable browser scroll restoration

```ts
useEffect(() => {
  history.scrollRestoration = 'manual'
  return () => { history.scrollRestoration = 'auto' }
}, [])
```

`history` here is `window.history` — no import needed, it's a browser global. TypeScript types it as the `History` interface, and `scrollRestoration` is typed as `ScrollRestoration`, which is `"auto" | "manual"`.

Setting it to `'manual'` tells the browser: "I'll handle scroll restoration myself, stop doing it automatically." The cleanup restores it when the component unmounts, so other pages aren't affected.

---

#### Step 2 — Create refs for each page boundary

You need a DOM anchor to scroll to for each page. A single `useRef` holds one element — you need one per page. The pattern for a dynamic list of refs:

```ts
const pageRefs = useRef<(HTMLDivElement | null)[]>([])
```

**Why `(HTMLDivElement | null)[]` and not `HTMLDivElement[]`?**

Ref callbacks receive `null` when the element unmounts (React calls the callback with `null` to signal "element gone"). The array must be able to hold `null` at any index. If you wrote `HTMLDivElement[]`, TypeScript would complain the moment you assign `null`.

The array itself starts empty (`[]`). Indexes are populated lazily as elements mount — `pageRefs.current[2]` is `undefined` until page 3 renders.

---

#### Step 3 — Attach refs to the first element of each page

The grid renders all pages as a flat list. To get a DOM anchor per page, split it into per-page sub-grids and ref the wrapper:

```tsx
<div className="flex flex-col">
  {data?.pages.map((page, pageIndex) => (
    <div
      key={pageIndex}
      ref={el => { pageRefs.current[pageIndex] = el }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 [&:not(:first-child)]:mt-6"
    >
      {page.properties.map(p => (
        <PropertyCard key={`${pageIndex}-${p.id}`} property={p} />
      ))}
    </div>
  ))}
</div>
```

**The callback ref:** `ref={el => { pageRefs.current[pageIndex] = el }}` — React infers the type of `el` from the element (`<div>`) as `HTMLDivElement | null`. On mount, `el` is the DOM node. On unmount, `el` is `null`. Both assignments are valid because the array is typed `(HTMLDivElement | null)[]`.

**Why not `ref={pageRefs}` directly?** `useRef` gives you a single ref object. `ref={pageRefs}` would make `pageRefs.current` point to the *last* div it's assigned to — each mount overwrites the previous. The callback form lets you route each element to a specific index.

---

#### Step 4 — Handle popstate

`popstate` fires whenever the user navigates via back or forward buttons. At that point the URL has already changed.

```ts
useEffect(() => {
  history.scrollRestoration = 'manual'

  const handlePopState = () => {
    const pg = Number(new URLSearchParams(location.search).get('pg')) || 1
    const pageIndex = pg - initialPage

    if (pageIndex <= 0) {
      window.scrollTo(0, 0)
    } else {
      pageRefs.current[pageIndex]?.scrollIntoView()
    }
  }

  window.addEventListener('popstate', handlePopState)
  return () => {
    window.removeEventListener('popstate', handlePopState)
    history.scrollRestoration = 'auto'
  }
}, [initialPage])
```

**TypeScript walkthrough:**

```ts
const pg = Number(new URLSearchParams(location.search).get('pg')) || 1
```

- `location` is `window.location`, globally available, typed as `Location`
- `.get('pg')` returns `string | null`
- `Number(null)` is `0`, so the `|| 1` fallback correctly catches both `null` and `"0"`

```ts
const pageIndex = pg - initialPage
```

- Converts a URL page number to an array index
- If you started at `initialPage = 3` and navigate back to `?pg=3`, `pageIndex = 0` → scroll to top of the list (which is page 3, the first page loaded)
- If `pg < initialPage` (shouldn't happen normally), `pageIndex` is negative → `<= 0` catches it and scrolls to top

```ts
pageRefs.current[pageIndex]?.scrollIntoView()
```

- `pageRefs.current[pageIndex]` is `HTMLDivElement | null | undefined`
  - `null` if the element unmounted
  - `undefined` if `pageIndex` is out of bounds (page not loaded yet)
- `?.` optional chaining handles both: no-ops instead of throwing

**Why `[initialPage]` in the dependency array?** The handler closes over `initialPage`. Since `initialPage` comes from `useState`, it never actually changes — but declaring the dependency is correct TypeScript/ESLint practice, and it documents the intent.

---

#### The full picture

```
User on page 3
  → presses back
  → popstate fires
  → URL is now ?pg=2
  → pg = 2, initialPage = 1, pageIndex = 1
  → pageRefs.current[1] is the wrapper div for page 2's cards
  → .scrollIntoView() snaps to it
  → URL and scroll position agree ✓

User on page 2
  → presses back again
  → pg = 1, pageIndex = 0
  → window.scrollTo(0, 0) — scroll to absolute top ✓
```

**Question:** If the user navigated forward (not back), `popstate` also fires. Should that be handled differently?

<details>
<summary>Answer</summary>

For infinite scroll, forward navigation is unusual — the browser records the forward entry when the user pressed back, so clicking forward returns to `?pg=3`. `popstate` fires, `pageIndex = 2`, and you scroll to page 3's anchor. That's correct behavior.

The only edge case is if the user navigated forward to a page that hasn't been loaded yet (e.g., pasted a URL directly). In that case `pageRefs.current[pageIndex]` is `undefined`, the optional chain no-ops, and the user lands at whatever scroll position they were at. You could handle this by checking `if (!pageRefs.current[pageIndex]) window.scrollTo(0, 0)` — but it rarely matters in practice.

</details>
