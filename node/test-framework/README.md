# Build Your Own Test Framework

Recreate the core of a test runner like Jest in plain JavaScript. You implement three functions — `it`, `exec`, and `isEqual` — and a pre-written spec file (`tests.js`) uses them. Make every passing test log `✅` and every failing test log `❌` with a reason.

This is a common live-coding interview format: you're handed a test file and asked to build the tiny framework that runs it. The test file *is* the spec — read how each function is called and let that drive the signatures.

## Concepts practiced

- Reverse-engineering an API from how it's called (the test file is the spec)
- The matcher pattern (`exec(actual).isEqual(expected)`) — a factory returning an object with methods
- Assertions communicate failure by **throwing**; the runner catches
- Recursive deep equality over nested objects and arrays
- `try/catch` as the pass/fail boundary
- Making one runner handle **both** sync and async tests with a single `await`
- Keeping async tests in declaration order with a private promise chain

## The two chapters

- **Chapter A — synchronous:** build `it`, `exec`, and `isEqual` for plain synchronous tests.
- **Chapter B — asynchronous:** evolve `it` so tests that `await` work too, without reordering the output.

## Getting started

```bash
cd starter
npm test     # runs: node tests.js
```

Implement the three functions in `framework.js`. Don't edit `tests.js` — make it pass.

When you're done, your output should match `submissions/01` (one test is intentionally written to fail, to prove the `❌` path works).
