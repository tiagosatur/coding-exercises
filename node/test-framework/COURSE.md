# Build Your Own Test Framework

## What you'll build

A miniature version of Jest — in about 40 lines of plain JavaScript. You'll implement three functions:

- `it(description, fn)` — runs a single test and logs whether it passed or failed
- `exec(actual)` — wraps a value so you can assert things about it: `exec(actual).isEqual(expected)`
- `isEqual(a, b)` — deep structural equality, the engine behind the assertion

A spec file (`tests.js`) is already written and uses all three. Your job is to make it run: every passing test logs `✅`, every failing test logs `❌` with a reason. The exercise comes in two chapters — first **synchronous** tests, then **asynchronous** ones.

Every test framework you've ever used — Jest, Vitest, Mocha — is this same idea with more features bolted on. By building it from scratch, you'll understand exactly what `expect(x).toBe(y)` is doing under the hood.

---

## The spec comes first

Before writing a single line of `framework.js`, open `tests.js` and read it. **The test file is the specification.** You don't get told the signatures — you reverse-engineer them from how each function is called.

Look at one line:

```js
exec(1 + 1).isEqual(2);
```

Read it slowly and you can deduce the entire shape of `exec`:

- `exec` is called with **one argument** — the *actual* value (`1 + 1`).
- It returns **something that has an `.isEqual` method** — so `exec` returns an object.
- `.isEqual` is called with **one argument** — the *expected* value (`2`).

So `exec` is a factory: it takes the actual value and hands back a little object of matchers. This is exactly Jest's `expect(actual).toBe(expected)`. Same pattern, different names.

Now look at `it`:

```js
it('adds two numbers', () => {
  exec(1 + 1).isEqual(2);
});
```

- `it` takes a **string** (the description) and a **function** (the test body).
- The test body runs the assertions. If an assertion is unhappy, something has to go wrong in a way `it` can detect.

That last point is the key design decision of the whole exercise, so let's make it explicit before coding.

> **Reading the call sites first is the actual skill being tested.** In a live interview, narrate it out loud: "okay, `exec` takes the actual value and returns an object with `isEqual`, so it's a factory returning a matcher." That sentence *is* the interview.

---

## The one idea that unlocks everything: assertions throw

How does `it` know whether a test passed? The test body doesn't `return true` or `return false` — look at it again, it returns nothing. So how does failure travel from deep inside `.isEqual` back up to `it`?

**By throwing.**

When `exec(actual).isEqual(expected)` finds a mismatch, it `throw`s an error. When the values match, it does nothing and returns quietly. That means:

- Test passed → the body runs to the end without throwing.
- Test failed → an assertion throws somewhere inside the body.

And `it` just wraps the whole thing in a `try/catch`:

- Nothing thrown → log `✅`.
- Caught something → log `❌`.

This is how real test frameworks work, and it's why you can put *many* assertions in one test — the first one to fail throws, and the rest never run. Hold onto this idea; everything else follows from it.

---

# Chapter A — synchronous

## Step 1: `isEqual` — deep equality

### Why not just `===`?

They named it `isEqual`, not `isStrictEqual`. That's a hint. Look at this test:

```js
exec({ name: 'Ada', address: { city: 'London' } })
  .isEqual({ name: 'Ada', address: { city: 'London' } });
```

Those two objects have identical contents but are **different references**. `===` on objects compares identity, not contents, so `{a:1} === {a:1}` is `false`. If you used `===`, this test would fail even though the objects are clearly "equal." You need a function that walks into objects and arrays and compares them **structurally**.

### The mental model

Deep equality is naturally **recursive**: two values are equal if they're the same primitive, *or* they're objects with the same set of keys whose values are — recursively — deeply equal. The function calls itself on each nested level until it bottoms out at primitives.

### What to do

```js
export function isEqual(a, b) {
  // 1. Same primitive, or the exact same reference → done.
  if (a === b) return true;

  // 2. If either side isn't a non-null object, and they weren't ===,
  //    they can't be equal.
  if (
    typeof a !== 'object' || a === null ||
    typeof b !== 'object' || b === null
  ) {
    return false;
  }

  // 3. Both are objects. Compare their keys.
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  // 4. Recurse into every value.
  return keysA.every((key) => isEqual(a[key], b[key]));
}
```

### Why each guard exists

- **`a === b` first** handles all primitives (`2 === 2`, `'x' === 'x'`) and the case where both are literally the same object. It's also the recursion's base case.
- **The `typeof`/`null` guard** catches "one is a primitive, the other is an object" and the infamous `typeof null === 'object'` trap. If we got past `===` and either side isn't a real object, they differ.
- **Key-length check** is a fast exit: `{a:1}` and `{a:1, b:2}` can't be equal.
- **`every` + recursion** is the heart. Arrays are just objects whose keys are `'0'`, `'1'`, `'2'`… so `Object.keys` covers arrays and objects with the same code. `every` short-circuits — it stops at the first key that isn't equal.

**Your task:** implement `isEqual`. If you want to spot-check it before wiring up the rest, drop a couple of `console.log(isEqual(...))` lines at the bottom of `framework.js` and run `node framework.js`, then delete them.

> **Edge cases worth *mentioning* in an interview** (you don't have to handle them all): `NaN` is never `===` to itself, `Date`s compare by reference, and `Map`/`Set` aren't covered by `Object.keys`. The recursive version above is what they want first — name the edge cases to show you see them.

---

## Step 2: `exec` — the matcher that throws

Now build the assertion. From Step 1's reading of the spec, `exec` takes the actual value and returns an object with an `isEqual` method. That method compares and **throws on mismatch**.

```js
export function exec(actual) {
  return {
    isEqual(expected) {
      if (!isEqual(actual, expected)) {
        throw new Error(
          `expected ${format(expected)} but got ${format(actual)}`,
        );
      }
    },
  };
}

function format(value) {
  return JSON.stringify(value);
}
```

### Why a returned object?

`exec` "remembers" the `actual` value via closure, and hands back an object whose methods can use it. This is what lets you write the readable `exec(actual).isEqual(expected)` chain. If you later wanted more matchers (`.isGreaterThan`, `.isTruthy`), you'd just add more methods to this object — exactly how Jest grows `.toBe`, `.toEqual`, `.toContain`, and so on.

### Why a good error message matters

When `isEqual` returns `false`, throwing a bare `Error()` would tell you *that* a test failed but not *why*. By interpolating both values (`JSON.stringify` turns objects into readable strings), the `❌` line tells you `expected "world" but got "hello"`. In a real framework this is the difference between a useful failure and a frustrating one.

**Your task:** implement `exec`. You can't fully test it until `it` exists to catch the throw — that's next.

---

## Step 3: `it` — run the test and report

This is where the "assertions throw" idea cashes out. `it` runs the test body inside a `try/catch`:

```js
export function it(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
  } catch (error) {
    console.log(`❌ FAIL: ${description}`);
    console.log(`        ${error.message}`);
  }
}
```

### Read it as plain English

> Run the test body. If it finishes without throwing, it passed — log `✅`. If it threw, it failed — log `❌` and show the reason from the error we caught.

Notice how *thin* `it` is. It doesn't know anything about equality, objects, or matchers. It only knows the contract: "a thrown error means failure." All the real comparison logic lives in `isEqual`, surfaced through `exec`. That separation is why this design scales.

**Your task:** implement this synchronous `it`, then run `npm test` (or `node tests.js`). The Chapter A tests should all report, including the one deliberately written to fail:

```
✅ PASS: adds two numbers
✅ PASS: compares strings
✅ PASS: compares objects deeply
✅ PASS: compares nested arrays deeply
✅ PASS: isEqual is also usable on its own
❌ FAIL: this one is meant to FAIL ❌
        expected "world" but got "hello"
```

If you see that, Chapter A is done. But scroll down in `tests.js` — the async tests are silently broken. That's Chapter B.

---

# Chapter B — asynchronous

## Step 4: see the problem first

Look at an async test in the spec:

```js
it('awaits a delayed value', async () => {
  const value = await delay(20, 'done');
  exec(value).isEqual('done');
});
```

The test body is now an `async` function. Run your Chapter A code against it and watch what breaks:

1. **The pass/fail report is a lie.** An `async` function returns a **Promise immediately** — before any `await` inside it has resolved. So `fn()` returns right away without throwing, your `try` block "succeeds," and you log `✅`… even if the assertion is destined to fail 20ms later.
2. **Failures escape as unhandled rejections.** When the assertion *does* throw later, it happens inside the Promise, long after your `try/catch` has moved on. The error rejects the Promise instead of being caught, and Node prints an ugly `UnhandledPromiseRejection` instead of your tidy `❌`.

The root cause: your `try/catch` finished before the async work did. You caught nothing because there was nothing to catch *yet*.

## Step 5: `await` the test body

The fix is one keyword. Make `it`'s wrapper `async` and `await` the call to `fn()`:

```js
export async function it(description, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${description}`);
  } catch (error) {
    console.log(`❌ FAIL: ${description}`);
    console.log(`        ${error.message}`);
  }
}
```

### Why this works for *both* chapters

`await` on a Promise waits for it to settle — and crucially, if that Promise **rejects**, `await` re-throws the rejection right here, where your `try/catch` can see it. And `await` on a plain value (a synchronous test that returns `undefined`) just resolves immediately and moves on.

So this single version handles synchronous *and* asynchronous tests. You don't need two code paths. That elegance — one `await` covering both — is exactly the insight the second chapter is testing for.

**Your task:** add `async`/`await` to `it` and run the tests again. The async tests now report correctly. But run it a few times and watch the **order**…

## Step 6: keep tests in declaration order

### The new problem

Now that every `it` is `async`, all of them kick off almost at once and finish whenever their internal timers resolve. A test that `await delay(20, …)` logs *after* one that `await delay(10, …)`, regardless of which you wrote first. Your output order becomes non-deterministic — and real test runners report tests in the order you wrote them. We want that.

### The fix: a private promise chain

Keep a module-level Promise that represents "everything queued so far." Each `it` tacks its work onto the **end** of that chain with `.then`, so tests run strictly one after another, in the order they were declared:

```js
let queue = Promise.resolve();

export function it(description, fn) {
  queue = queue.then(async () => {
    try {
      await fn();
      console.log(`✅ PASS: ${description}`);
    } catch (error) {
      console.log(`❌ FAIL: ${description}`);
      console.log(`        ${error.message}`);
    }
  });
}
```

### How to read this

- `queue` starts as an already-resolved Promise.
- Every call to `it` does `queue = queue.then(runThisTest)`. Because each test is appended to the *previous* `queue`, test N+1 can't start until test N has fully settled — including its `await`s.
- Each reassignment moves the "tail" of the chain forward. When `tests.js` finishes calling all the `it`s, you've built one long chain that drains itself in order.

Notice `it` is no longer declared `async` itself — it just schedules work and returns. The `async` lives on the inner function passed to `.then`. The caller (`tests.js`) doesn't await anything; the chain runs to completion on its own.

This is a real technique, not a toy. Sequential async execution via a promise chain is the same pattern behind task queues, rate limiters, and `for await` loops.

**Your task:** switch `it` to the promise-chain version and run `npm test`. Every test — sync and async — should now print in the exact order it appears in `tests.js`, matching `submissions/01`.

---

## Summary: the whole framework in plain English

1. `tests.js` calls `it(description, fn)` many times. Each call appends a job to a private promise chain so jobs run one at a time, in order.
2. When a job runs, `it` does `await fn()` inside a `try/catch`.
3. `fn` is the test body. It calls `exec(actual).isEqual(expected)`.
4. `exec` remembers `actual` in a closure and returns a matcher object.
5. `.isEqual(expected)` calls `isEqual(actual, expected)`. If they're **not** deeply equal, it **throws** an Error with a readable message.
6. `isEqual` recursively compares primitives, objects, and arrays.
7. Back in `it`: if `fn` finished without throwing → `✅`. If `await` re-threw a rejection or a sync throw bubbled up → `❌` with the error message.

The genius is the division of labor: `it` only understands "thrown = failed," `exec` only builds matchers, `isEqual` only compares values. Three small functions, each with one job, compose into a working test runner.

---

## Key concepts you practiced

| Concept | What you used it for |
|---|---|
| Reading call sites to infer signatures | The test file is the spec — `exec(x).isEqual(y)` told you `exec` is a factory |
| The matcher pattern | `exec` returns an object of assertions, like Jest's `expect` |
| Closures | `exec` remembers `actual` for its returned `isEqual` method |
| Throwing to signal failure | The contract between assertions and the runner |
| `try/catch` as a boundary | `it` turns a thrown error into a `❌` line |
| Recursion | `isEqual` walking nested objects and arrays |
| `Object.keys` + `every` | Structural comparison with short-circuit on first mismatch |
| `typeof` / `null` guards | Separating primitives from objects safely |
| `await` on a value vs. a Promise | One `it` handling both sync and async tests |
| Unhandled rejection, understood | *Why* a sync `try/catch` misses async failures |
| Promise chaining (`queue = queue.then(...)`) | Running async tests sequentially, in declaration order |

These aren't "exercise concepts" — the matcher pattern, throw-to-fail, and sequential promise chains show up across real codebases. You just rebuilt the spine of every JavaScript test framework from scratch.

---

## Interview notes: how to run this live

This exercise shows up as a surprise live-coding round ("build something like Jest"). A routine that makes it fast and visible:

1. **Read the test file out loud before coding.** Narrate the signatures you infer from the call sites. This is the part they're scoring; silent staring isn't.
2. **State the core idea early:** "assertions will throw, and `it` will catch — that's how pass/fail travels." Saying it shows you have the design, not just syntax.
3. **Get one test green, then deepen.** Make `exec(2).isEqual(2)` pass with a shallow check first, see the `✅`, *then* make `isEqual` recursive. Don't perfect `isEqual` before anything runs.
4. **For Chapter B, lead with the bug.** Explain *why* the sync version mislogs async tests (the Promise returns before the `await` resolves) before fixing it. Diagnosing it is more impressive than just typing `async`.
5. **Async is a one-keyword change, then an ordering refinement.** `await fn()` makes it correct; the promise chain makes it ordered. Two small, explainable steps.

The whole framework is ~40 lines. What's actually being measured is whether you can read an unfamiliar API from its usage and reason about synchronous vs. asynchronous control flow on the spot — both rehearsable. Reaching for an external AI here is slower than thinking it through, and looking off-screen reads as exactly what these rounds screen against. Do it by hand; it's faster than it looks.
