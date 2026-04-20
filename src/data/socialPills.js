export const SOCIAL_PILLS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4hThM4eNgQ4OCgrAAAuFPcICOXUdc0Y8abYuhcYpUboQrFjNRmUC_lDa56pWfZT2C_omQsbY9fDpG/pub?gid=146718836&single=true&output=csv';

export const DEFAULT_SOCIAL_PILL_ACCENT = '#9ca3af';

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }

      row.push(cell.trim());
      if (row.some((value) => value !== '')) {
        rows.push(row);
      }

      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some((value) => value !== '')) {
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(value) {
  return value.toLowerCase().replace(/[\s_-]+/g, '');
}

function pickCell(row, headerMap, aliases) {
  for (const alias of aliases) {
    const index = headerMap[alias];
    if (index !== undefined) {
      return row[index]?.trim() ?? '';
    }
  }

  return '';
}

function normalizeAccent(value) {
  const accent = value.trim();

  if (!accent) {
    return DEFAULT_SOCIAL_PILL_ACCENT;
  }

  if (/^[0-9a-f]{3}$/i.test(accent) || /^[0-9a-f]{6}$/i.test(accent)) {
    return `#${accent}`;
  }

  return accent;
}

function normalizeUrl(value) {
  const url = value.trim();

  if (!url) {
    return '';
  }

  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  if (/^wa\.me\//i.test(url) || /^www\./i.test(url)) {
    return `https://${url}`;
  }

  if (/^[\w-]+\.[a-z]{2,}(\/.*)?$/i.test(url)) {
    return `https://${url}`;
  }

  return url;
}

function deriveMeta(meta, href) {
  if (meta) {
    return meta;
  }

  if (!href) {
    return '';
  }

  try {
    const parsed = new URL(href);
    return parsed.pathname && parsed.pathname !== '/'
      ? parsed.pathname
      : parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function mapCsvToSocialPills(text) {
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader);
  const headerMap = Object.fromEntries(headers.map((header, index) => [header, index]));

  return rows
    .slice(1)
    .map((row) => {
      const label = pickCell(row, headerMap, ['label', 'name', 'title']);
      const href = normalizeUrl(pickCell(row, headerMap, ['url', 'href', 'link']));
      const meta = pickCell(row, headerMap, ['meta', 'handle', 'subtitle', 'subtext']);
      const accent = normalizeAccent(
        pickCell(row, headerMap, ['accent', 'color', 'pillcolor'])
      );

      if (!label) {
        return null;
      }

      return {
        label,
        href,
        meta: deriveMeta(meta, href),
        accent,
      };
    })
    .filter(Boolean);
}

export async function loadSocialPills(fetchImpl = fetch) {
  const response = await fetchImpl(SOCIAL_PILLS_CSV_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch social pills CSV: ${response.status}`);
  }

  const text = await response.text();
  return mapCsvToSocialPills(text);
}
