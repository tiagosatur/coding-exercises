// Implement the three functions below so that tests.js passes.
// Run `node tests.js` (or `npm test`) to see ✅ / ❌ output.
//
// Read tests.js FIRST — the way each function is *called* there tells you
// exactly what signature it needs.

/**
 * Registers and runs a single test.
 * - Runs `fn`. If it throws, the test failed; otherwise it passed.
 * - Logs `✅ PASS: <description>` or `❌ FAIL: <description>` (+ the reason).
 * - Chapter B: must also work when `fn` is async (returns a Promise), and
 *   tests must still print in the order they were declared.
 */
export function it(description, fn) {
  // TODO
}

/**
 * Wraps an actual value and returns a matcher object.
 * `exec(actual).isEqual(expected)` should throw when the two are not
 * deeply equal, and do nothing when they are.
 */
export function exec(actual) {
  // TODO
}

/**
 * Deep structural equality. Returns true when `a` and `b` are the same
 * primitive, or objects/arrays with the same keys and deeply-equal values.
 */
export function isEqual(a, b) {
  // TODO
}
