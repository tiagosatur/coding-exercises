// Implement each function below.
// Run `npm test` to check your progress against the test suite.

/**
 * Parses a CSV string into an array of row objects.
 * Keys are taken from the header row, values are strings.
 */
export function parseCSV(text) {
  // TODO
}

/**
 * Returns true if a parsed row has all required fields in the correct format:
 * - timestamp: numeric (non-empty, not NaN)
 * - product_id: non-empty string
 * - product_name: non-empty string
 * - type: exactly 'in' or 'out' (lowercase only)
 * - quantity: positive integer (no decimals, no zero, no negatives)
 */
export function isValidRow(row) {
  // TODO
}

/**
 * Aggregates a sorted array of valid rows into a map keyed by product_id.
 * Assumes rows are already sorted by timestamp ascending.
 * Detects anomalies: products that go negative at any point during processing.
 */
export function buildStockMap(rows) {
  // TODO
}

/**
 * Transforms the stock map into the final response shape:
 * { stock, low_stock, anomalies }
 */
export function buildResponse(stockMap) {
  // TODO
}
