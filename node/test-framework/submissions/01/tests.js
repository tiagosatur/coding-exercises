import { it, exec, isEqual } from './framework.js';

// ───────────────────────────────────────────────────────────────
// This is the SPEC. Don't edit it — make it pass by implementing
// `it`, `exec`, and `isEqual` in framework.js.
//
//   • Every passing test should log a ✅ line.
//   • Every failing test should log a ❌ line with a reason.
//
// Run it with:  node tests.js   (or: npm test)
// ───────────────────────────────────────────────────────────────

// ===================== Chapter A — synchronous =====================

it('adds two numbers', () => {
  exec(1 + 1).isEqual(2);
});

it('compares strings', () => {
  exec('nursa'.toUpperCase()).isEqual('NURSA');
});

it('compares objects deeply', () => {
  exec({ name: 'Ada', address: { city: 'London' } })
    .isEqual({ name: 'Ada', address: { city: 'London' } });
});

it('compares nested arrays deeply', () => {
  exec([1, [2, 3]]).isEqual([1, [2, 3]]);
});

it('isEqual is also usable on its own', () => {
  if (!isEqual([1, 2], [1, 2])) {
    throw new Error('isEqual([1, 2], [1, 2]) should be true');
  }
});

it('this one is meant to FAIL ❌', () => {
  exec('hello').isEqual('world');
});

// ===================== Chapter B — asynchronous =====================

function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

it('awaits a resolved value', async () => {
  const value = await Promise.resolve(42);
  exec(value).isEqual(42);
});

it('awaits a delayed value', async () => {
  const value = await delay(20, 'done');
  exec(value).isEqual('done');
});

it('awaits and compares an object', async () => {
  const user = await delay(10, { id: 1, role: 'nurse' });
  exec(user).isEqual({ id: 1, role: 'nurse' });
});

// The async tests above resolve later than the sync ones, but your
// output should still print every test in the order it was declared.
