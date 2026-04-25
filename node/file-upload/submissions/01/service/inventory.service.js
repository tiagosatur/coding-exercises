import { isValidRow, parseCSV, buildStockMap, buildResponse } from '../analyze.js';

export function inventoryAnalyzeService(file) {
    if (!file) {
        throw new Error("File is required");
    }

    const text = file.buffer.toString('utf-8');
    const allRows = parseCSV(text);
    const rows = allRows.filter(isValidRow);

    const sortedRows = rows.sort((a, b) => {
        return Number(a.timestamp) - Number(b.timestamp)
    });

    const stockMap = buildStockMap(sortedRows)
    const response = buildResponse(stockMap);

    return response;
}