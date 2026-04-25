# CSV Inventory Upload & Analysis — Course Guide

## What you'll build

A Node.js HTTP server with one endpoint: `POST /analyze-inventory`. It receives a CSV file, parses it entirely in memory, processes inventory movements in chronological order, and returns a JSON report with current stock levels, low-stock alerts, and anomalies for products that went negative at any point during processing.

The interesting challenge isn't the server setup — it's the analysis. The CSV is not sorted. A product can go negative mid-stream and recover. Your code needs to handle all of it gracefully, including malformed rows that should be skipped without crashing.

---

## Before you write a line of code

Open `inventory.csv` and study it. Notice:

- Rows are **not in timestamp order** — you'll need to sort before processing
- Some rows are **malformed** — missing fields, non-numeric values
- `type` is lowercase `in` or `out`, quantity is always a positive integer
- Some products go negative mid-stream and recover — those still count as anomalies

Understanding your data before writing any logic is the most important habit in backend engineering.

---

## Project structure

```
submissions/01/
├── server.js                      ← Express app entry point
├── routes/
│   └── router.js                  ← Route definitions + Multer middleware
├── controllers/
│   └── inventory.controller.js    ← HTTP layer: reads req, sends res
├── service/
│   └── inventory.service.js       ← Orchestrates the analysis pipeline
├── analyze.js                     ← Pure analysis functions (tested in isolation)
└── package.json
```

### Why this structure?

Each layer has a single responsibility:

- **router** — maps HTTP routes to controllers, attaches middleware
- **controller** — handles HTTP concerns (reading `req.file`, sending `res.json`, error status codes)
- **service** — orchestrates business logic, knows nothing about HTTP
- **analyze.js** — pure functions that do the actual work, no HTTP, no I/O

The key insight: `analyze.js` functions take plain values (strings, arrays, objects) and return plain values. This makes them testable without a running server. The service is the only layer that knows about Multer's file format.

---

## Step 1: Set up Express

### Why Express and not the built-in `http` module?

Node.js ships with an `http` module. You could use it. But handling a file upload with raw `http` means manually parsing the multipart body — reading byte chunks, finding boundaries, extracting file content. That's several hundred lines of low-level code before you even get to the interesting part.

Express wraps `http` and makes routing and middleware a one-liner. Use it for what it is: infrastructure that lets you focus on the actual problem.

### What to do

```js
// server.js
import express from 'express';
import router from './routes/router.js';

const PORT = 3000;
const app = express();

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

Note the `.js` extension on the import. With `"type": "module"` in `package.json`, Node treats your files as ESM (ECMAScript Modules). ESM follows the browser spec — it requires exact file paths, no automatic extension resolution. CommonJS (the old Node default) would resolve extensions automatically, but ESM does not.

Run it: `node server.js`. You should see the log. That's your server alive and listening.

---

## Step 2: Handle file uploads with Multer

### Why you can't use `req.body` for files

When curl or a browser sends a file, it uses `multipart/form-data` encoding. The request body contains multiple "parts" separated by a boundary string, each with its own headers. Express's built-in body parsers don't understand this format — they expect JSON or URL-encoded data. You need Multer.

### Memory storage vs disk storage

Multer can write the file to disk or hold it in memory as a `Buffer`. Since we're parsing the CSV immediately and discarding it, disk storage is unnecessary overhead. Memory storage keeps it simple.

### Where Multer lives

Multer is middleware — it runs before your controller and attaches the parsed file to `req.file`. It belongs in the router, not the controller, because middleware is a routing concern.

```js
// routes/router.js
import { Router } from 'express';
import multer from 'multer';
import { inventoryAnalyzeController } from '../controllers/inventory.controller.js';

const router = Router();

const uploadMiddleware = (fieldname) => {
  const upload = multer({ storage: multer.memoryStorage() });
  return upload.single(fieldname);
};

router.post('/analyze-inventory', uploadMiddleware('inventory'), inventoryAnalyzeController);

export default router;
```

`upload.single('inventory')` reads the multipart body, finds the part named `inventory`, and attaches it to `req.file`. The field name must match what the client sends (`-F "inventory=@file.csv"` in curl).

### Why `memoryStorage()`?

Without it, Multer writes to `os.tmpdir()` by default. You'd get a file path instead of a buffer, and you'd need to read the file from disk — unnecessary for a small CSV that you're processing immediately. Memory storage gives you `req.file.buffer` directly.

Test it:
```bash
curl -X POST http://localhost:3000/api/analyze-inventory -F "inventory=@inventory.csv"
```

---

## Step 3: The controller

The controller's only job is HTTP: read the request, call the service, send the response. It should contain no business logic.

```js
// controllers/inventory.controller.js
import { inventoryAnalyzeService } from '../service/inventory.service.js';

export async function inventoryAnalyzeController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const result = await inventoryAnalyzeService(req.file);

    return res.status(200).json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
```

Notice the controller passes `req.file` to the service — the whole Multer file object. The service knows how to read it. The controller doesn't need to know about buffers or CSV.

---

## Step 4: The service

The service orchestrates the pipeline. It knows about the file format (Multer buffer → string), but delegates all analysis to `analyze.js`.

```js
// service/inventory.service.js
import { parseCSV, isValidRow, buildStockMap, buildResponse } from '../analyze.js';

export function inventoryAnalyzeService(file) {
  const text = file.buffer.toString('utf-8');
  const rows = parseCSV(text).filter(isValidRow);
  rows.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
  const stockMap = buildStockMap(rows);
  return buildResponse(stockMap);
}
```

This is the only place that calls `file.buffer.toString('utf-8')`. The pure functions in `analyze.js` receive plain strings and arrays — they never touch the Multer file object.

---

## Step 5: Parse the CSV (`analyze.js`)

### Do you need an external library?

No. Libraries like `csv-parse` handle edge cases: quoted fields containing commas, escaped quotes, multiline values. Our CSV has none of those — it's predictable, delimited data. Pure string methods are sufficient, and writing the parser yourself teaches the mechanics.

### The structure of a CSV

- Line 1: header row — names each column
- Lines 2+: data rows — values map to the corresponding column by index

The header row makes the file self-describing. Extract column names first, then use them to build objects. This way the parser works regardless of column order.

```js
export function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row = {};

    for (const [idx, header] of headers.entries()) {
      row[header] = values[idx];
    }

    return row;
  });
}
```

Why iterate headers instead of values? Because you're building an object keyed by header name — starting from the headers reads more naturally, and you get the key for free at each step.

After parsing, each row is a plain object:
```js
{
  timestamp: '1704844800',
  product_id: 'A1',
  product_name: 'Wireless Earbuds',
  type: 'in',
  quantity: '100'
}
```

Everything is a **string**. CSV has no types. You'll coerce them later.

### Why `.trim()` everywhere?

CSV files from Windows use `\r\n` line endings. Without `.trim()`, values like `'100\r'` won't coerce to a number and will silently become `NaN`, corrupting your totals.

---

## Step 6: Validate rows (`analyze.js`)

The CSV contains rows with missing fields, empty lines, and non-numeric values. If your code tries to do arithmetic on these, it will either crash or produce silent incorrect results.

The right approach: validate each row after parsing and skip anything that doesn't meet expectations.

```js
export function isValidRow(row) {
  const qty = Number(row?.quantity);

  return (
    !!row.timestamp && !isNaN(Number(row.timestamp)) &&
    row?.product_id?.length > 0 &&
    row?.product_name?.length > 0 &&
    (row?.type === 'in' || row?.type === 'out') &&
    Number.isInteger(qty) && qty > 0
  );
}
```

### Why `!!row.timestamp && !isNaN(Number(row.timestamp))`?

`Number('')` returns `0`, and `!isNaN(0)` is `true` — so an empty timestamp would pass `!isNaN` alone. The `!!row.timestamp` check catches empty strings first.

### Why `Number.isInteger` and not just `Number`?

`Number.isInteger` is a **check** (returns boolean), not a conversion. You must convert first with `Number()`, then check:

```js
const qty = Number(row.quantity); // convert: '100' → 100
Number.isInteger(qty)             // check: is it a whole number?
```

`Number.isInteger('100')` would return `false` — it only returns `true` for actual number values, not strings.

### Why `Number.isInteger` and not `> 0`?

`qty > 0` alone would accept decimals like `1.5`. `Number.isInteger` rejects those. Combined, they reject zero, negatives, and decimals.

### Why validate separately and not during aggregation?

Mixing validation into aggregation makes both harder to read and test. Keep concerns separate: parse → validate → aggregate. Each step receives clean input.

---

## Step 7: Sort by timestamp

This is the subtlest requirement: anomaly detection depends on processing transactions in chronological order.

Imagine a product with these transactions (in CSV order):
```
in  20
out 30   ← stock hits -10: anomaly
in  15   ← stock recovers to 5
```

If you process the `in 15` before the `out 30`, stock goes `20 → 35 → 5` — never negative, anomaly missed entirely.

After filtering, sort ascending:

```js
rows.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
```

One line. But its position — after filtering, before aggregating — is what makes everything correct.

---

## Step 8: Aggregate with `reduce` (`analyze.js`)

### The mental model

Think of `reduce` as walking through the sorted list carrying a bag. You start with an empty bag. For each transaction, you update the bag and hand it to the next step. At the end, the bag is your final state.

```js
const result = rows.reduce((acc, row) => {
  // acc = the bag so far
  // row = current transaction
  return acc; // return the updated bag
}, {}); // start with an empty bag
```

### What to track per product

```js
export function buildStockMap(rows) {
  return rows.reduce((acc, row) => {
    const { product_id, product_name, type, quantity } = row;

    if (!acc[product_id]) {
      acc[product_id] = { product_name, quantity: 0, anomaly: false };
    }

    const qty = Number(quantity);
    acc[product_id].quantity += type === 'in' ? qty : -qty;

    if (acc[product_id].quantity < 0) {
      acc[product_id].anomaly = true;
    }

    return acc;
  }, {});
}
```

### Why `if (!acc[product_id])`?

The CSV has multiple rows per product. The first time you see a product the accumulator has no entry — create one with zeroed values. Every subsequent row updates the existing entry. Without this check you'd overwrite the running total on every row.

### Why check for anomaly inside the loop?

Because anomaly detection is about what happens **during** processing, not just the final state. A product that goes negative and recovers must still be flagged. The flag is set the moment quantity drops below zero and stays `true` even if later transactions bring it back up.

### Why `+= type === 'in' ? qty : -qty`?

Adding a negative number is the same as subtracting. It's a shorthand for:
```js
if (type === 'in') {
  acc[product_id].quantity += qty;
} else {
  acc[product_id].quantity -= qty;
}
```
Both are correct — matter of preference.

---

## Step 9: Build the response (`analyze.js`)

The stock map is an object keyed by `product_id`. The response requires arrays.

```js
export function buildResponse(stockMap) {
  return Object.entries(stockMap).reduce((acc, [product_id, product]) => {
    const { product_name, quantity, anomaly } = product;

    acc.stock.push({ product_id, product_name, quantity });

    if (anomaly) {
      acc.anomalies.push({ product_id, product_name, message: 'Stock went negative' });
    } else if (quantity < 10) {
      acc.low_stock.push({ product_id, product_name, quantity });
    }

    return acc;
  }, { stock: [], low_stock: [], anomalies: [] });
}
```

### Why `Object.entries`?

`Object.entries(stockMap)` gives you `[[product_id, product], ...]` — both the key and value in one destructured step.

### Why `else if` for `low_stock`?

An anomaly product doesn't belong in `low_stock` too — those are different problems. The `else if` ensures each product appears in at most one alert list.

### Why `reduce` instead of a `for` loop?

Both work. `reduce` is idiomatic for transforming a collection into a new accumulated value. A `for` loop with `push` is equally valid and arguably more readable. Use whatever is clearer to you.

---

## Expected results for the sample CSV

After uploading `inventory.csv` (3 malformed rows skipped):

| Product | Final Quantity | Alert |
|---------|---------------|-------|
| A1 — Wireless Earbuds | 40 | — |
| A2 — USB-C Cable | -20 | anomaly (went negative, stayed negative) |
| B1 — Laptop Stand | 17 | — |
| B2 — Mechanical Keyboard | 15 | anomaly (went negative, then recovered) |
| C1 — Notebook | 150 | — |
| C2 — Desk Lamp | 8 | low_stock |
| C3 — Coffee Mug | -10 | anomaly |
| D1 — Monitor | 10 | — |
| D2 — Mouse Pad | 65 | — |
| D3 — Water Bottle | 45 | — |

3 anomalies (A2, B2, C3). 1 low_stock (C2). B2 is the interesting case — it ends positive but still appears in anomalies because it dipped below zero mid-stream.

---

## Things to watch out for

**ESM requires explicit `.js` extensions on local imports.** With `"type": "module"` in `package.json`, Node uses ESM which follows browser spec — no automatic extension resolution. `import router from './routes/router'` will throw. You need `'./routes/router.js'`.

**Sorting is not optional.** If you aggregate before sorting, anomaly detection silently produces wrong results. No error — just incorrect output.

**The `trim()` calls matter.** Without them, Windows line endings leave `\r` on values, silently corrupting number coercions.

**`Number()` vs `parseInt`.** `Number('')` returns `0`, `parseInt('')` returns `NaN`. In `isValidRow` you want empty strings to fail — use `!!row.timestamp` before `Number()`.

**`Number.isInteger` is a check, not a conversion.** Always convert with `Number()` first, then check with `Number.isInteger()`.

**JavaScript won't tell you when your function signature is wrong.** `array.reduce(acc, callback)` passes the wrong arguments silently — `acc` becomes the callback argument and your actual callback becomes the initial value. No error. TypeScript catches this immediately.

**Setting the anomaly flag once is enough.** A boolean is sufficient — the moment `quantity < 0`, set `anomaly = true`. It stays set even after recovery.
