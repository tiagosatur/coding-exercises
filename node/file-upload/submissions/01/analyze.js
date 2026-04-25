// Implement each function below.
// Run `npm test` to check your progress against the test suite.

/**
 * Parses a CSV string into an array of row objects.
 * Keys are taken from the header row, values are strings.
 */
export function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const content = lines.slice(1);

  const cleanEmptyLines = content.filter(line => line.trim());

  const list = cleanEmptyLines.map((line) => {
    const values = line.split(',').map(c => c.trim());

    const row = {};

    for (const [idx, header] of headers.entries()) {
      row[header] = values[idx]
    }

    return row;
  })

  return list;
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
  const isValidateTimestamp = !!row.timestamp && !isNaN(Number(row.timestamp))
  const isValidProductId = row?.product_id?.length > 0;
  const isValidProductName = row?.product_name?.length > 0;
  const isValidType = (row?.type === 'in' || row?.type === 'out')
  const qty = Number(row?.quantity);
  const isValidQuantity = Number.isInteger(qty) && qty > 0;

  return (
    isValidateTimestamp &&
    isValidProductId &&
    isValidProductName &&
    isValidType &&
    isValidQuantity
  )
}

/**
 * Aggregates a sorted array of valid rows into a map keyed by product_id.
 * Assumes rows are already sorted by timestamp ascending.
 * Detects anomalies: products that go negative at any point during processing.
 */
export function buildStockMap(rows) {
  const result = rows.reduce((acc, row) => {
    const { product_id, product_name, type, quantity } = row;

    if (!acc[product_id]) {
      acc[product_id] = {
        product_name,
        quantity: 0,
        anomaly: false,

      }
    }

    const qty = Number(row.quantity);

    acc[product_id].quantity += type === 'in' ? qty : -qty;

    if (acc[product_id].quantity < 0) {
      acc[product_id].anomaly = true;
    }

    return acc;
  }, {});

  return result;
}

/**
 * Transforms the stock map into the final response shape:
 * { stock, low_stock, anomalies }
 */
export function buildResponse(stockMap) {
  const result = Object.entries(stockMap).reduce((acc, [productId, value]) => {
    acc.stock.push({
      product_id: productId,
      product_name: value.product_name,
      quantity: value.quantity,
    });

    if (value.anomaly) {
      acc.anomalies.push({
        product_id: productId,
        product_name: value.product_name,
        message: "Stock went negative"
      })

      return acc;
    }

    if (value.quantity < 10) {
      acc.low_stock.push({
        product_id: productId,
        product_name: value.product_name,
        quantity: value.quantity,
      })
    }

    return acc;
  }, {
    anomalies: [],
    stock: [],
    low_stock: []
  });


  return result;
}
