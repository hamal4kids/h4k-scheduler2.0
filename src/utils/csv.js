/**
 * Parse a raw CSV string into an array of objects.
 * Handles multi-line cells (newlines inside quoted fields).
 */
export function parseCsv(raw) {
  const rows = splitCsvRows(raw.trim());
  if (rows.length < 2) return [];
  const headers = splitCsvLine(rows[0]);
  return rows.slice(1).map(row => {
    const values = splitCsvLine(row);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] || '').trim()]));
  }).filter(row => Object.values(row).some(v => v !== ''));
}

/**
 * Split CSV into rows, respecting quoted fields that may contain newlines.
 */
function splitCsvRows(raw) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"') {
      // Handle escaped quotes ""
      if (inQuotes && raw[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && raw[i + 1] === '\n') i++; // skip \r\n
      if (current.trim() !== '') rows.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim() !== '') rows.push(current);
  return rows;
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
