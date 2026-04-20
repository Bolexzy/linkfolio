export const PROJECTS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4hThM4eNgQ4OCgrAAAuFPcICOXUdc0Y8abYuhcYpUboQrFjNRmUC_lDa56pWfZT2C_omQsbY9fDpG/pub?gid=1830937377&single=true&output=csv';

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

function normalizeText(value) {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/\u2019/g, "'")
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"');
}

function normalizeUrl(value) {
  const url = value.trim();

  if (!url) {
    return '';
  }

  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  if (/^www\./i.test(url)) {
    return `https://${url}`;
  }

  return url;
}

function parseTags(value) {
  return value
    .split(',')
    .map((tag) => normalizeText(tag.trim()))
    .filter(Boolean);
}

export function mapCsvToProjects(text) {
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader);
  const headerMap = Object.fromEntries(headers.map((header, index) => [header, index]));

  return rows
    .slice(1)
    .map((row, index) => {
      const title = normalizeText(pickCell(row, headerMap, ['name', 'title', 'label']));
      const description = normalizeText(
        pickCell(row, headerMap, ['description', 'desc', 'summary'])
      );
      const tags = parseTags(pickCell(row, headerMap, ['tags', 'stack', 'tools']));
      const url = normalizeUrl(pickCell(row, headerMap, ['url', 'href', 'link']));
      const image = normalizeUrl(pickCell(row, headerMap, ['image', 'thumbnail', 'thumb']));
      const hoverImage = normalizeUrl(
        pickCell(row, headerMap, ['hoverimage', 'hoverimg', 'hover', 'imagehover'])
      );

      if (!title) {
        return null;
      }

      return {
        id: `${title}-${index}`,
        title,
        description,
        tags,
        url,
        image,
        hoverImage,
      };
    })
    .filter(Boolean);
}

export async function loadProjects(fetchImpl = fetch) {
  const response = await fetchImpl(PROJECTS_CSV_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch projects CSV: ${response.status}`);
  }

  const text = await response.text();
  return mapCsvToProjects(text);
}
