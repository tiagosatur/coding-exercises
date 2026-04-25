import { describe, it, expect } from 'vitest';
import { parseCSV, isValidRow, buildStockMap, buildResponse } from './analyze.js';

// ─────────────────────────────────────────────
// parseCSV
// ─────────────────────────────────────────────

describe('parseCSV', () => {
  it('returns an array of objects keyed by header names', () => {
    const csv = 'a,b,c\n1,2,3';
    expect(parseCSV(csv)).toEqual([{ a: '1', b: '2', c: '3' }]);
  });

  it('handles multiple data rows', () => {
    const csv = 'x,y\n1,2\n3,4';
    expect(parseCSV(csv)).toHaveLength(2);
  });

  it('trims whitespace from headers and values', () => {
    const csv = ' name , value \n hello , world ';
    expect(parseCSV(csv)[0]).toEqual({ name: 'hello', value: 'world' });
  });

  it('handles trailing newlines without producing empty rows', () => {
    const csv = 'a,b\n1,2\n';
    expect(parseCSV(csv)).toHaveLength(1);
  });

  it('returns an empty array for a header-only CSV', () => {
    const csv = 'timestamp,product_id,product_name,type,quantity\n';
    expect(parseCSV(csv)).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// isValidRow
// ─────────────────────────────────────────────

describe('isValidRow', () => {
  const valid = {
    timestamp: '1704844800',
    product_id: 'A1',
    product_name: 'Wireless Earbuds',
    type: 'in',
    quantity: '100',
  };

  it('accepts a valid in row', () => {
    expect(isValidRow(valid)).toBe(true);
  });

  it('accepts a valid out row', () => {
    expect(isValidRow({ ...valid, type: 'out' })).toBe(true);
  });

  it('rejects non-numeric timestamp', () => {
    expect(isValidRow({ ...valid, timestamp: 'not_a_timestamp' })).toBe(false);
  });

  it('rejects empty timestamp', () => {
    expect(isValidRow({ ...valid, timestamp: '' })).toBe(false);
  });

  it('rejects missing product_id', () => {
    expect(isValidRow({ ...valid, product_id: '' })).toBe(false);
  });

  it('rejects missing product_name', () => {
    expect(isValidRow({ ...valid, product_name: '' })).toBe(false);
  });

  it('rejects uppercase type', () => {
    expect(isValidRow({ ...valid, type: 'IN' })).toBe(false);
    expect(isValidRow({ ...valid, type: 'OUT' })).toBe(false);
  });

  it('rejects unrecognised type values', () => {
    expect(isValidRow({ ...valid, type: 'received' })).toBe(false);
    expect(isValidRow({ ...valid, type: '' })).toBe(false);
  });

  it('rejects non-numeric quantity', () => {
    expect(isValidRow({ ...valid, quantity: 'abc' })).toBe(false);
  });

  it('rejects zero quantity', () => {
    expect(isValidRow({ ...valid, quantity: '0' })).toBe(false);
  });

  it('rejects negative quantity', () => {
    expect(isValidRow({ ...valid, quantity: '-10' })).toBe(false);
  });

  it('rejects decimal quantity', () => {
    expect(isValidRow({ ...valid, quantity: '1.5' })).toBe(false);
  });

  it('rejects a row with missing fields', () => {
    expect(isValidRow({ timestamp: '1704844800' })).toBe(false);
  });

  it('rejects an entirely empty row', () => {
    expect(isValidRow({ timestamp: '', product_id: '', product_name: '', type: '', quantity: '' })).toBe(false);
  });
});

// ─────────────────────────────────────────────
// buildStockMap
// ─────────────────────────────────────────────

describe('buildStockMap', () => {
  it('adds quantity for in transactions', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '100', timestamp: '1' },
    ];
    expect(buildStockMap(rows)['A1'].quantity).toBe(100);
  });

  it('subtracts quantity for out transactions', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '100', timestamp: '1' },
      { product_id: 'A1', product_name: 'Widget', type: 'out', quantity: '30', timestamp: '2' },
    ];
    expect(buildStockMap(rows)['A1'].quantity).toBe(70);
  });

  it('accumulates multiple transactions for the same product', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '50', timestamp: '1' },
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '50', timestamp: '2' },
      { product_id: 'A1', product_name: 'Widget', type: 'out', quantity: '40', timestamp: '3' },
    ];
    expect(buildStockMap(rows)['A1'].quantity).toBe(60);
  });

  it('tracks multiple products independently', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '50', timestamp: '1' },
      { product_id: 'B2', product_name: 'Gadget', type: 'in', quantity: '20', timestamp: '2' },
      { product_id: 'A1', product_name: 'Widget', type: 'out', quantity: '10', timestamp: '3' },
    ];
    const map = buildStockMap(rows);
    expect(map['A1'].quantity).toBe(40);
    expect(map['B2'].quantity).toBe(20);
  });

  it('stores product_name on each entry', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '10', timestamp: '1' },
    ];
    expect(buildStockMap(rows)['A1'].product_name).toBe('Widget');
  });

  it('sets anomaly to false when stock never goes negative', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '100', timestamp: '1' },
      { product_id: 'A1', product_name: 'Widget', type: 'out', quantity: '30', timestamp: '2' },
    ];
    expect(buildStockMap(rows)['A1'].anomaly).toBe(false);
  });

  it('sets anomaly to true when stock goes negative', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '10', timestamp: '1' },
      { product_id: 'A1', product_name: 'Widget', type: 'out', quantity: '15', timestamp: '2' },
    ];
    expect(buildStockMap(rows)['A1'].anomaly).toBe(true);
  });

  it('keeps anomaly true even when stock later recovers', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '10', timestamp: '1' },
      { product_id: 'A1', product_name: 'Widget', type: 'out', quantity: '15', timestamp: '2' },
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '20', timestamp: '3' },
    ];
    const product = buildStockMap(rows)['A1'];
    expect(product.quantity).toBe(15);  // recovered to positive
    expect(product.anomaly).toBe(true); // still flagged
  });

  it('only flags the product that went negative, not others', () => {
    const rows = [
      { product_id: 'A1', product_name: 'Widget', type: 'in', quantity: '10', timestamp: '1' },
      { product_id: 'A1', product_name: 'Widget', type: 'out', quantity: '20', timestamp: '2' },
      { product_id: 'B2', product_name: 'Gadget', type: 'in', quantity: '50', timestamp: '3' },
    ];
    const map = buildStockMap(rows);
    expect(map['A1'].anomaly).toBe(true);
    expect(map['B2'].anomaly).toBe(false);
  });

  it('returns an empty object for an empty rows array', () => {
    expect(buildStockMap([])).toEqual({});
  });
});

// ─────────────────────────────────────────────
// buildResponse
// ─────────────────────────────────────────────

describe('buildResponse', () => {
  it('includes every product in the stock array', () => {
    const map = {
      A1: { product_name: 'Widget', quantity: 70, anomaly: false },
      B2: { product_name: 'Gadget', quantity: 5, anomaly: false },
    };
    expect(buildResponse(map).stock).toHaveLength(2);
  });

  it('stock entries contain product_id, product_name, and quantity', () => {
    const map = { A1: { product_name: 'Widget', quantity: 70, anomaly: false } };
    expect(buildResponse(map).stock[0]).toEqual({
      product_id: 'A1',
      product_name: 'Widget',
      quantity: 70,
    });
  });

  it('puts products with quantity between 0 and 9 in low_stock', () => {
    const map = { A1: { product_name: 'Widget', quantity: 8, anomaly: false } };
    const { low_stock } = buildResponse(map);
    expect(low_stock).toHaveLength(1);
    expect(low_stock[0].product_id).toBe('A1');
  });

  it('does not put products with quantity >= 10 in low_stock', () => {
    const map = { A1: { product_name: 'Widget', quantity: 10, anomaly: false } };
    expect(buildResponse(map).low_stock).toHaveLength(0);
  });

  it('puts products with anomaly flag in anomalies with a message', () => {
    const map = { A1: { product_name: 'Widget', quantity: -5, anomaly: true } };
    const { anomalies } = buildResponse(map);
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0]).toEqual({
      product_id: 'A1',
      product_name: 'Widget',
      message: 'Stock went negative',
    });
  });

  it('does not put anomaly products in low_stock', () => {
    const map = { A1: { product_name: 'Widget', quantity: -5, anomaly: true } };
    expect(buildResponse(map).low_stock).toHaveLength(0);
  });

  it('includes anomaly product with positive recovered quantity in anomalies, not low_stock', () => {
    const map = { A1: { product_name: 'Widget', quantity: 5, anomaly: true } };
    const { low_stock, anomalies } = buildResponse(map);
    expect(anomalies).toHaveLength(1);
    expect(low_stock).toHaveLength(0);
  });

  it('returns empty arrays when no products qualify for low_stock or anomalies', () => {
    const map = { A1: { product_name: 'Widget', quantity: 100, anomaly: false } };
    const result = buildResponse(map);
    expect(result.low_stock).toEqual([]);
    expect(result.anomalies).toEqual([]);
  });

  it('returns empty arrays for all fields when stock map is empty', () => {
    const result = buildResponse({});
    expect(result.stock).toEqual([]);
    expect(result.low_stock).toEqual([]);
    expect(result.anomalies).toEqual([]);
  });
});
