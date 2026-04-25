# Form Validation Lab

Validate a user form and add users to a list using vanilla JavaScript and DOM manipulation.

## Concepts practiced

- `getElementById` for DOM references
- `addEventListener` (`submit`, `input`, custom events)
- `classList.add` / `remove` (`invalid`, `hidden`)
- `textContent` / `innerHTML` for error messages and clearing lists
- `preventDefault()` to stop form submission
- `createElement` / `appendChild` to add `<li>` items to `#user-list`
- `CustomEvent` / `dispatchEvent` to decouple data from rendering
- `Array.some()` for case-insensitive duplicate detection
- `form.reset()` to clear inputs after success

## Validation rules

1. **First Name** — required, not empty
2. **Last Name** — required, not empty
3. **Duplicate** — if user already exists (case-insensitive), show general error

## Behavior

**On valid submit:**
- Add the user via `addUser()` which dispatches `users-changed`
- The `users-changed` listener calls `renderUserList()` to rebuild the `<ul>`
- Clear the form inputs

**On typing:**
- Clear the field's error state
- Clear the general error message

## Getting started

```bash
pnpm install
pnpm dev
```
