# Inventory Analysis API

The goal of this exercise is to evaluate:

- API design
- data parsing
- clean code structure
- error handling

## Requirements

Implement an API endpoint:

```
POST /analyze-inventory
```

The endpoint should accept a CSV file upload and return the inventory summary.

## CSV Format

| Column | Description |
|--------|-------------|
| `timestamp` | Unix timestamp of the movement |
| `product_id` | Unique product identifier |
| `product_name` | Human-readable product name |
| `type` | Either `in` (stock received) or `out` (stock removed) |
| `quantity` | Number of units moved (positive integer) |

**Example:**

```csv
timestamp,product_id,product_name,type,quantity
1710000001,A1,Widget,in,100
1710000002,A1,Widget,out,30
```

> A sample file `inventory.csv` is included in the `starter/` folder.

## Expected Response

```json
{
  "stock": [
    { "product_id": "A1", "product_name": "Widget", "quantity": 70 }
  ],
  "low_stock": [
    { "product_id": "B2", "product_name": "Gadget", "quantity": 5 }
  ],
  "anomalies": [
    { "product_id": "C3", "product_name": "Doohickey", "message": "Stock went negative" }
  ]
}
```

- **`stock`** — current quantity for every product
- **`low_stock`** — products with fewer than 10 units remaining (quantity ≥ 0 and < 10)
- **`anomalies`** — products that went negative at any point during processing

If there are no low stock items or anomalies, return empty arrays for those fields.

## Notes

- The CSV may not be sorted by timestamp.
- Invalid or malformed rows should be skipped gracefully without crashing the service. A valid row must have:
  - `timestamp` — numeric (non-empty, not NaN)
  - `product_id` — non-empty string
  - `product_name` — non-empty string
  - `type` — exactly `in` or `out` (lowercase only)
  - `quantity` — positive integer (no decimals, no zero, no negatives)
- No database is required — keep everything in memory.

## Starter files

```
starter/
├── server.js        ← wire up Express + Multer here
├── analyze.js       ← implement the four analysis functions here
├── analyze.test.js  ← test suite (do not modify)
├── inventory.csv    ← sample data
└── package.json
```

The analysis logic lives in `analyze.js`, separate from the server so it can be tested without a running HTTP server. Implement each function in that file until all tests pass, then wire everything together in `server.js`.

## Running tests

```bash
cd starter
npm install
npm test
```

Tests run in watch mode. Use `npm run test:run` for a single pass.

## Getting started

Once tests pass, start the server:

```bash
node server.js
```

Test with curl:

```bash
curl -X POST http://localhost:3000/analyze-inventory \
  -F "inventory=@inventory.csv"
```
