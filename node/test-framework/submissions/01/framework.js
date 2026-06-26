// A tiny test framework — the core of Jest in ~40 lines.
//
// Public API:
//   it(description, fn)         register + run a test, log ✅ / ❌
//   exec(actual).isEqual(exp)   assert deep equality (throws on mismatch)
//   isEqual(a, b)               deep structural equality, returns boolean

// Tests are chained onto a private promise so they always run in the order
// they were declared — whether they're synchronous or asynchronous (Ch. B).
let queue = Promise.resolve();

export function it(description, fn) {
  queue = queue.then(async () => {
    try {
      // `await` resolves a Promise (async test) and is a no-op for a plain
      // value (sync test), so this single line handles both chapters.
      await fn();
      console.log(`✅ PASS: ${description}`);
    } catch (error) {
      // Assertions signal failure by throwing — we catch it here.
      console.log(`❌ FAIL: ${description}`);
      console.log(`        ${error.message}`);
    }
  });
}

export function exec(actual) {
  // A factory returning a matcher object — the same shape as Jest's
  // `expect(actual).toBe(expected)`.
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

export function isEqual(a, b) {
  // Same primitive, or the exact same object reference.
  if (a === b) return true;

  // If either side isn't a non-null object (and they weren't ===), they differ.
  if (
    typeof a !== 'object' || a === null ||
    typeof b !== 'object' || b === null
  ) {
    return false;
  }

  // Arrays are objects whose keys are their indices, so Object.keys covers both.
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  // Every key must exist on both sides and be deeply equal.
  return keysA.every((key) => isEqual(a[key], b[key]));
}

function format(value) {
  return JSON.stringify(value);
}
