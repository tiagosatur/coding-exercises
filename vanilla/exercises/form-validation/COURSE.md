# Form Validation with Vanilla JavaScript

## What you'll build

A user form with two inputs (First Name, Last Name) and a User List beside it. When you submit valid names, they appear in the list. When something is wrong, the form tells you exactly what — with red borders and error messages.

This is the kind of validation that runs on every form you've ever filled out online. By building it from scratch, you'll understand what frameworks like React or Angular are doing for you under the hood.

---

## The rules

Before writing any code, let's be crystal clear about the behavior we need:

1. **Empty fields on submit** — both inputs get a red border and a red error message underneath saying the field is required.
2. **Typing clears errors** — validation already runs as you type (the input "knows" it's empty), but the error messages only appear after you click Submit. Once you start fixing an input, its error should go away.
3. **Duplicate users** — if "John Smith" is already in the list and you try to add "john smith" again (case-insensitive), don't add it. Instead, show a general error message above the Submit button saying the user already exists.
4. **Valid submit** — add the full name as a new item to the User List, clear the inputs.

Read these rules twice. Every bug in form validation comes from not fully understanding the expected behavior before coding.

---

## Step 1: Get references to your DOM elements

### Why this matters

Every interaction in vanilla JS starts the same way: you need a reference to the HTML element you want to work with. Think of it like grabbing a tool off the shelf before you can use it. You grab it once and keep it in a variable.

### What to do

At the top of `script.js`, grab references to everything you'll need:

- The form itself (to listen for submit)
- Both inputs (to read values and toggle classes)
- Both error `<span>` elements (to set error text)
- The general errors element (for non-field-specific errors like duplicates)
- The user list `<ul>` (to append new names)
- The user list section (to show/hide it)

### How

```js
const form = document.getElementById('user-form');
```

`getElementById` returns the single element with that ID, or `null` if it doesn't exist. Since IDs are unique per page, this is the most direct way to grab something.

You could also use `querySelector('#user-form')` — it does the same thing here but accepts any CSS selector, which makes it more flexible. For IDs, either works.

**Your task:** grab all 8 elements listed above and store them in variables. Look at `index.html` to find the right IDs.

---

## Step 2: Listen for the form submit

### The mental model

The browser fires **events** when things happen: clicks, key presses, form submissions, page loads. Your job is to tell the browser: "when *this* event happens on *this* element, run *this* function."

That's what `addEventListener` does. It takes two arguments: the event name (a string) and a callback function.

### Why `submit` and not `click`?

You might think: "I'll listen for a click on the button." That works, but it misses something — users can also submit forms by pressing Enter while focused on an input. The `submit` event catches both.

### The default behavior problem

When a form submits, the browser's default behavior is to **reload the page** (it tries to send the data to a server). We don't want that. We want to handle everything in JavaScript.

That's what `event.preventDefault()` is for — it tells the browser: "I've got this, don't do your normal thing."

### What to do

```js
function onFormSubmit() {
  // All your validation logic will go here
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  onFormSubmit();
});
```

Extract your logic into a named function (`onFormSubmit`) and keep the listener thin — just `preventDefault` and the function call. This keeps the listener focused on the event plumbing and your logic easy to read and test on its own.

**Your task:** add this listener. Inside `onFormSubmit`, try a `console.log('submitted!')` and verify it works when you click the button AND when you press Enter in an input.

---

## Step 3: Read and trim input values

### Why trim?

If a user types `"  "` (just spaces), that's technically not empty — it has a length of 2. But it's not a real name. `trim()` removes whitespace from both ends of a string, so `"  "` becomes `""` and `" John "` becomes `"John"`.

Always trim user input. This is a habit that will save you from subtle bugs in every project.

### What to do

Inside your submit handler, read both values:

```js
const firstName = firstNameInput.value.trim();
const lastName = lastNameInput.value.trim();
```

`.value` is the property on every `<input>` element that holds whatever the user typed.

---

## Step 4: Validate empty fields

### Think before you code

Here's the logic in plain English:

> Start by assuming the form is valid. Check each field — if it's empty, mark the form as invalid, add the `invalid` class to that input, and set the error message. If the form is still valid after checking all fields, proceed to add the user.

The reason we use a flag (`isValid`) instead of returning early on the first error is that **we want to show all errors at once**. If both fields are empty, both should turn red — not just the first one.

### What to do

Extract the validation into its own function. It checks each field, marks invalid ones, and returns whether the form is valid overall:

```js
function isValid(value) {
  return value !== '';
}

function validateInputs({ firstName, lastName }) {
  const isFirstValid = isValid(firstName);
  const isLastValid = isValid(lastName);

  if (!isFirstValid) {
    markInputInvalid({ inputElement: firstNameInput, errorElement: firstNameError });
  }

  if (!isLastValid) {
    markInputInvalid({ inputElement: lastNameInput, errorElement: lastNameError });
  }

  return isFirstValid && isLastValid;
}
```

Notice we check **both** fields before returning. We don't return early on the first invalid one — we want to show all errors at once. If both fields are empty, both should turn red, not just the first one.

The `markInputInvalid` function handles the visual side — adding the `invalid` class and setting the error text. This keeps `validateInputs` focused on logic, not DOM manipulation.

### Toggling visual state with classList

Every DOM element has a `classList` property with three methods you'll use constantly:

- `classList.add('invalid')` — adds the CSS class
- `classList.remove('invalid')` — removes it
- `classList.contains('invalid')` — checks if it's there

In the CSS, `.invalid` already has `border-color: #ef4444` (red). So adding the class instantly turns the border red. You're not writing style logic — you're toggling a class, and CSS handles the rest. This separation is important: JS controls *when* styles apply, CSS controls *what* they look like.

**Your task:** implement `isValid`, `markInputInvalid`, and `validateInputs`. When you submit with empty fields, both inputs should get red borders and show an error message like "Required field".

---

## Step 5: Clear previous errors

### The problem

Try this: submit the form empty (both errors appear), then type a name in the first field and submit again. The first field's error is gone, but what if you had fixed it? Without clearing errors at the start, stale error states pile up.

### The fix

At the **beginning** of your submit handler (before any validation), reset everything to a clean state. Extract each reset into its own function — one per field, one for general errors, and one that calls them all:

```js
function resetFirstNameError() {
  firstNameInput.classList.remove('invalid');
  firstNameError.textContent = '';
  firstNameError.classList.remove('invalid');
}

function resetLastNameError() {
  lastNameInput.classList.remove('invalid');
  lastNameError.textContent = '';
  lastNameError.classList.remove('invalid');
}

function resetGeneralErrors() {
  generalErrors.classList.add('hidden');
}

function resetErrors() {
  resetGeneralErrors();
  resetFirstNameError();
  resetLastNameError();
}
```

Why separate functions? Because you'll reuse the individual ones later (Step 8) when clearing errors on typing. Each function has one job: reset one specific piece of error state.

This is a common pattern: **reset first, then validate**. It's simpler and less error-prone than trying to surgically remove only the errors that were fixed.

**Your task:** implement the reset functions and call `resetErrors()` at the top of your submit handler. Verify that fixing one field and resubmitting correctly clears that field's error.

---

## Step 6: Add the user to the list (with custom events)

### The problem with doing everything in one place

The most obvious approach is to push the name to the array *and* create the `<li>` element right there in the submit handler. That works, but it means your submit handler is responsible for two different concerns: **managing data** and **updating the UI**.

What if later you add another way to create users (an import button, a keyboard shortcut)? You'd have to duplicate the DOM rendering logic in each place. And if the data and the DOM ever get out of sync, you'll have bugs that are hard to trace.

### A better mental model: events as bridges

Think about how the browser itself works. When you click a button, the browser doesn't hard-code what happens — it fires a `click` **event**, and any listener reacts to it. The button doesn't know or care who's listening.

You can use the same pattern with your own custom events:

1. **Data logic** — a function updates the `users` array and announces: "hey, the data changed" by dispatching a custom event.
2. **Rendering logic** — a separate listener hears that announcement and rebuilds the UI from the array.

These two pieces don't know about each other. The event is the bridge.

### Step 6a: The data function

Create a function whose only job is to update the array and fire the signal:

```js
function addUser(fullName) {
  users.push(fullName);
  document.dispatchEvent(new CustomEvent('users-changed'));
}
```

`CustomEvent` is a built-in browser API. The first argument is the event name (any string you choose). You could optionally pass data via a `detail` property, but here the render function already has access to the `users` array, so there's no need.

We dispatch on `document` because it's a global, always-available target. Think of it as a public bulletin board that any part of your code can post to or read from.

### Step 6b: The render function

Now write a function that rebuilds the `<ul>` from scratch:

```js
function showUserListSection() {
  if (users.length === 0) return;
  userListSection.classList.remove('hidden');
}

function renderUserList() {
  userList.innerHTML = '';
  users.forEach((name) => {
    const li = document.createElement('li');
    li.textContent = name;
    userList.appendChild(li);
  });

  showUserListSection();
}
```

`innerHTML = ''` clears all existing `<li>` elements first. Then we loop over the array and create fresh ones. This "clear and rebuild" approach is simple and guarantees the DOM always matches the data exactly.

`createElement('li')` makes a new `<li>` in memory. `textContent` sets what it displays. `appendChild` sticks it at the end of the `<ul>`.

`showUserListSection` has a guard — if the array is empty, it returns early so you don't show an empty "Users" heading. Otherwise it removes the `hidden` class.

### Initial render

Call `renderUserList()` once right after defining it, so any pre-existing data in the `users` array gets displayed on page load:

```js
renderUserList();
```

This also means if you later seed the array with test data (e.g. `const users = ['Lunna Blue']`), it will show up immediately without extra wiring.

### Step 6c: Wire them together with a listener

```js
document.addEventListener('users-changed', () => {
  renderUserList();
});
```

That's it. Now whenever *anything* calls `addUser()`, the list re-renders automatically. The submit handler doesn't need to touch the DOM at all — it just calls `addUser(fullName)`.

### Clear the inputs after success

After a successful add, reset the form so the user can immediately type another name:

```js
form.reset();
```

`reset()` is a built-in method on form elements. It restores all inputs to their initial values (empty, in our case). Simpler than manually setting each `.value = ''`.

### Why this matters beyond this exercise

This is the same pattern that scales to real applications. Backend APIs fire events when data changes, UI components listen and re-render. React's `setState` triggering a re-render is the same idea, just with more machinery around it. By doing it manually here, you see exactly what frameworks automate for you.

**Your task:** implement all three pieces — `addUser`, `renderUserList`, and the event listener. In your submit handler, call `addUser(fullName)` instead of manipulating the DOM directly. Verify that submitting a valid name makes it appear in the list.

---

## Step 7: Prevent duplicate users

### Think before you code

We need to check if the name already exists in the list. But where does "the list" live? Right now, the names only exist as `<li>` text inside the DOM. We *could* read them from the DOM every time, but there's a better way.

**Keep a JavaScript data structure that mirrors what's on the page.** An array of strings works perfectly:

```js
const users = []; // at the top of your file, outside the handler
```

When you add a user, push to this array. When you need to check for duplicates, check this array. The DOM is for *displaying* data, not for *storing* it. This separation makes your code easier to reason about.

### The check

Extract the duplicate check into its own function. Use `Array.some()` instead of `Array.includes()` — this lets you compare with `.toLowerCase()` so "John Smith" and "john smith" are treated as the same person:

```js
function findDuplicateUser(fullName) {
  return users.some((user) => user.toLowerCase() === fullName.toLowerCase());
}
```

`includes` only does exact string matching. `some` lets you define the comparison — it loops over the array and returns `true` as soon as your callback returns `true` for any element.

Store the original casing in the array (so names display nicely in the list), and only lowercase when comparing.

Then in your submit handler, after validation passes:

```js
const fullName = `${firstName} ${lastName}`;
const isDuplicateUser = findDuplicateUser(fullName);

if (isDuplicateUser) {
  showDuplicateUserError();
  return;
}
```

Notice that this check lives in the submit handler, **before** `addUser()`. The `addUser` function trusts that it's only called with valid, non-duplicate data. The submit handler is the gatekeeper.

### Where to show the duplicate error

Extract the error display into its own function:

```js
function showDuplicateUserError() {
  generalErrors.textContent = "User already exists";
  generalErrors.classList.remove('hidden');
}
```

The duplicate error is about the *combination* of both inputs, not either one individually. That's why it goes in a dedicated general error element above the submit button, not under a specific field.

**Your task:** implement `findDuplicateUser` and `showDuplicateUserError`. Add "John Smith" twice and verify the second attempt shows the error. Try "john smith" too — it should also be caught as a duplicate.

---

## Step 8: Clear errors on input

### The idea

Right now, errors only disappear when you submit again. A better experience: when the user starts typing in a field, clear that field's error **and** the general error immediately. This gives instant feedback that they're fixing the problem.

Why clear the general error too? Because the "User already exists" message was about a past submission. The moment the user edits either field, that message is stale — they're clearly trying something new.

### How

Each input can have its own `input` event listener. The `input` event fires on every keystroke (and paste, and delete).

```js
firstNameInput.addEventListener('input', function () {
  resetGeneralErrors();
  resetFirstNameError();
});

lastNameInput.addEventListener('input', function () {
  resetGeneralErrors();
  resetLastNameError();
});
```

This is where the individual reset functions from Step 5 pay off — you compose them differently depending on the context. The submit handler calls `resetErrors()` (everything), the `input` listeners call only what's relevant.

---

## Step 9: Delete users from the list

### The payoff of good architecture

Here's the exciting part: because you built the rendering around a data array and a custom event, adding deletion is almost free. You don't need to figure out how to find and remove a specific `<li>` from the DOM. You just remove the name from the `users` array, dispatch `users-changed`, and the existing `renderUserList` rebuilds everything automatically.

This is exactly why we set up the event-driven pattern in Step 6. The code you wrote then is doing work for you now.

### Step 9a: Add a delete button to each list item

Right now, `renderUserList` creates a simple `<li>` with just text. We need to restructure each item to hold two things: the name and a delete button.

Wrap the name in a `<span>` so it and the button can sit side by side:

```js
users.forEach((name, index) => {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = name;
  span.classList.add('label');

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerHTML = '&times;';

  li.appendChild(span);
  li.appendChild(deleteBtn);
  userList.appendChild(li);
});
```

Notice we're using `forEach`'s second argument — `index`. We haven't needed it before, but now it tells us *which* user this button should delete. Hold that thought.

### Step 9b: Wire up the delete

Each button needs a click listener that removes its user from the array. This is where `splice` comes in:

```js
deleteBtn.addEventListener('click', () => {
  users.splice(index, 1);
  document.dispatchEvent(new CustomEvent('users-changed'));
});
```

`splice(index, 1)` says: "starting at position `index`, remove 1 element." It mutates the array in place — after this call, the user is gone from the data.

Then we dispatch `users-changed`, and `renderUserList` fires, rebuilding the `<ul>` from the now-shorter array. The deleted user simply isn't there anymore.

**Why does `index` stay correct?** Each time `renderUserList` runs, it creates *new* closures with *fresh* `index` values from the current state of the array. Old closures from the previous render are garbage collected. So even after deletions shift everything around, the next render always has the right indices.

### Step 9c: Hide the section when the list is empty

Try adding one user and then deleting them. The "Users" heading stays visible with nothing under it. That's because `showUserListSection` only knows how to *show* the section — it never hides it again.

Fix this by handling both cases:

```js
function showUserListSection() {
  if (users.length === 0) {
    userListSection.classList.add('hidden');
  } else {
    userListSection.classList.remove('hidden');
  }
}
```

Now it mirrors the data in both directions: show when there are users, hide when there aren't. Since `renderUserList` calls `showUserListSection` at the end, this runs on every add *and* every delete.

### Step 9d: Show the button only on hover (CSS)

A delete button sitting next to every name adds visual noise. A cleaner pattern: hide it by default and reveal it when the user hovers over that row.

Use `visibility` rather than `opacity` or `display` for this:

- **`visibility: hidden`** — the button is invisible *and* not clickable, but still takes up its space in the layout. This means the row won't shift or resize on hover.
- **`opacity: 0`** — the button is invisible but *still clickable*. Users could accidentally delete someone.
- **`display: none`** — fully removes the button from layout, so the row changes size on hover. Feels jumpy.

```css
#user-list li .delete-btn {
  visibility: hidden;
}

#user-list li:hover .delete-btn {
  visibility: visible;
}
```

The first rule hides every delete button. The second says: "when a list item is hovered, show *its* delete button." The selector `li:hover .delete-btn` means "a `.delete-btn` that is a child of a `li` that is currently being hovered."

You'll also want to override the global `button` styles so the delete button doesn't look like the big blue Submit button. Give it a transparent background, auto width, and a color change on hover for feedback.

**Your task:** implement the delete button in `renderUserList`, add the CSS for hover visibility, and update `showUserListSection` to hide when empty. Verify that deleting the last user hides the "Users" section entirely.

---

## Step 10: Edit a user's name

### The idea

Right now, if you misspell a name, your only option is to delete it and type it again. That works, but a better experience is to let the user click an edit button, change the name in place, and save it — all without leaving the list.

This step introduces a common UI pattern: **swapping between a "display" state and an "edit" state** for the same piece of data. You'll see this everywhere — todo apps, settings pages, spreadsheets. The user sees text, clicks edit, the text becomes an input, they make their change, and it goes back to text.

### Think about the states

Each list item has two modes:

1. **Display mode** — shows the name as text, with edit and delete buttons
2. **Edit mode** — shows an input pre-filled with the name, with a save button

Only one item should be in edit mode at a time. When you click edit on one item, any other item being edited should go back to display mode. The simplest way to handle this: don't track edit state at all — just re-render the whole list with one item in edit mode.

### Step 10a: Add the edit button

In `renderUserList`, create an edit button alongside the delete button. It gets the same hover treatment — hidden by default, visible when hovering the row:

```js
const editBtn = document.createElement('button');
editBtn.classList.add('edit-btn');
editBtn.innerHTML = '&#9998;'; // pencil character
editBtn.addEventListener('click', () => {
  renderUserList(index);
});
```

Notice what happens on click: we call `renderUserList(index)`. We're passing the index of the item being edited, so the render function knows which item to show as an input instead of text. This avoids the need for separate "state" variables — the render function itself handles both modes.

### Step 10b: Update `renderUserList` to handle edit mode

Add an `editingIndex` parameter to `renderUserList`. When `editingIndex` matches the current item's index, render an input instead of a text span:

```js
function renderUserList(editingIndex = -1) {
  userList.innerHTML = '';

  users.forEach((name, index) => {
    const li = document.createElement('li');

    if (index === editingIndex) {
      // Edit mode — show an input with the current name
      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('edit-input');
      input.value = name;

      const saveBtn = document.createElement('button');
      saveBtn.classList.add('save-btn');
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', () => {
        const newName = input.value.trim();
        if (newName !== '') {
          users[index] = newName;
          document.dispatchEvent(new CustomEvent('users-changed'));
        }
      });

      li.appendChild(input);
      li.appendChild(saveBtn);
    } else {
      // Display mode — show name, edit, and delete buttons
      // (your existing code for span, editBtn, deleteBtn)
    }

    userList.appendChild(li);
  });

  showUserListSection();
}
```

The default value of `-1` means "nothing is being edited," so on a normal render (from `users-changed`), every item shows in display mode.

When the user clicks save, we update the array directly with `users[index] = newName` and dispatch `users-changed`. The re-render happens with the default `editingIndex = -1`, so the item goes back to display mode automatically.

### Why not `splice` for updating?

For deletion, we used `splice(index, 1)` because we needed to *remove* an element. For updating, we can assign directly: `users[index] = newName`. This replaces the value at that position without removing or adding anything. Use the simplest tool for the job.

### Step 10c: Handle Enter and Escape keys

Clicking a save button works, but keyboard users expect Enter to save and Escape to cancel. Add a `keydown` listener to the input:

```js
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    saveBtn.click();
  } else if (event.key === 'Escape') {
    renderUserList(); // re-render without editingIndex, cancels the edit
  }
});
```

`saveBtn.click()` is a neat trick — instead of duplicating the save logic, you programmatically trigger a click on the button you already wired up. One source of truth for the save behavior.

For Escape, we just re-render without an `editingIndex`. Since we never changed the array, the original name is still there. The edit is silently discarded.

### Step 10d: Auto-focus the input

When the user clicks edit, their intent is to type. Don't make them click the input too — focus it automatically:

```js
input.focus();
```

Call this after `li.appendChild(input)` — the element needs to be in the DOM before it can receive focus. This is a small detail that makes the interaction feel responsive.

### Step 10e: CSS for the edit state

The edit input should look like it belongs in the list item, not like a separate form. Give it a style that fits the row, and style the save button to be compact:

```css
#user-list li .edit-btn {
  visibility: hidden;
  padding: 0.25rem 0.5rem;
  background: transparent;
}

#user-list li:hover .edit-btn {
  visibility: visible;
}

#user-list li .edit-input {
  flex-grow: 1;
}

#user-list li .save-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}
```

The `.edit-btn` gets the same `visibility` hover treatment as the delete button. The `.edit-input` uses `flex-grow: 1` to fill the available space in the row. The `.save-btn` is compact so it doesn't dominate the row.

**Your task:** add the edit button, update `renderUserList` to accept an `editingIndex` parameter, handle Enter/Escape, and auto-focus the input. Verify that:
- Clicking edit shows an input with the current name
- Pressing Enter or clicking Save updates the name in the list
- Pressing Escape cancels the edit without changing anything
- Editing one item while another is in edit mode cancels the first

---

## Summary: the complete flow

Here's the full logic in plain English, from start to finish:

1. User clicks Submit (or presses Enter)
2. Prevent the page from reloading
3. Clear all previous error states
4. Read and trim both input values
5. Check if first name is empty — if so, flag invalid, show error
6. Check if last name is empty — if so, flag invalid, show error
7. If anything was invalid, stop here
8. Build the full name string
9. Check if it already exists in the users array — if so, show duplicate error, stop
10. Call `addUser(fullName)` — which pushes to the array and dispatches `users-changed`
11. The `users-changed` listener fires `renderUserList()`, which rebuilds the `<ul>` from the array
12. Reset the form

**On delete:**
1. User hovers a list item — the delete button becomes visible (CSS `visibility`)
2. User clicks the delete button
3. `splice(index, 1)` removes the user from the array
4. Dispatch `users-changed` — the same event as adding
5. `renderUserList` rebuilds the list, `showUserListSection` hides the section if the array is empty

**On edit:**
1. User hovers a list item — the edit button becomes visible
2. User clicks the edit button
3. `renderUserList(index)` re-renders the list with that item as an input
4. User edits the name and presses Enter (or clicks Save)
5. `users[index] = newName` updates the array, dispatches `users-changed`
6. `renderUserList()` re-renders — back to display mode with the updated name

The submit handler only knows about **data and validation**. It never touches the DOM list directly. The rendering is a separate concern that reacts to data changes via a custom event — and that same event handles both adding and deleting.

---

## Key concepts you practiced

| Concept | What you used it for |
|---|---|
| `getElementById` / `querySelector` | Getting references to DOM elements |
| `addEventListener` | Reacting to submit, input, and custom events |
| `event.preventDefault()` | Stopping the page from reloading |
| `classList.add/remove` | Toggling visual error states |
| `textContent` / `innerHTML` | Setting error messages and clearing lists |
| `.value` and `.trim()` | Reading and cleaning user input |
| `createElement` + `appendChild` | Dynamically adding elements to the page |
| `CustomEvent` + `dispatchEvent` | Decoupling data changes from UI rendering |
| `form.reset()` | Clearing inputs after success |
| Data array + `.some()` | Tracking state in JS, case-insensitive duplicate detection |
| `Array.splice()` | Removing an element from an array by index |
| `visibility: hidden/visible` | Hiding elements without affecting layout or allowing clicks |
| Closure over loop variable | Each delete button captures its own `index` from `forEach` |
| Display/edit state toggle | Rendering the same data differently based on a parameter |
| `element.focus()` | Auto-focusing an input for better UX |
| `keydown` event + `event.key` | Handling Enter to save and Escape to cancel |
| `element.click()` | Programmatically triggering a click to reuse existing logic |

These aren't "exercise concepts" — they're the foundation of every interactive web page. The custom event pattern you used here is the same idea behind every reactive framework — data changes, an event fires, the UI re-renders. You just built it from scratch.
