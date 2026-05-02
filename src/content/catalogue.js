export const CATALOGUE_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4hThM4eNgQ4OCgrAAAuFPcICOXUdc0Y8abYuhcYpUboQrFjNRmUC_lDa56pWfZT2C_omQsbY9fDpG/pub?gid=4098408&single=true&output=csv';

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
    .replace(/\u201d/g, '"')
    .replace(/â€”/g, '-')
    .replace(/â€™/g, "'");
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

function parseStacks(value) {
  return value
    .split(',')
    .map((stack) => normalizeText(stack.trim()))
    .filter(Boolean);
}

function splitTitle(title) {
  const cleanTitle = normalizeText(title).trim();

  if (!cleanTitle) {
    return { main: '', accent: '' };
  }

  const ampersandMatch = cleanTitle.match(/^(.+&)\s+(.*)$/);
  if (ampersandMatch) {
    return {
      main: ampersandMatch[1],
      accent: ampersandMatch[2],
    };
  }

  const parts = cleanTitle.split(/\s+/);
  if (parts.length === 1) {
    return { main: cleanTitle, accent: '' };
  }

  return {
    main: parts.slice(0, -1).join(' '),
    accent: parts.slice(-1).join(' '),
  };
}

export function mapCsvToCatalogue(text) {
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return { services: [], orbitIcons: [] };
  }

  const headers = rows[0].map(normalizeHeader);
  const headerMap = Object.fromEntries(headers.map((header, index) => [header, index]));

  const entries = rows
    .slice(1)
    .map((row, index) => {
      const title = normalizeText(pickCell(row, headerMap, ['title', 'name', 'label']));
      const description = normalizeText(
        pickCell(row, headerMap, ['description', 'desc', 'summary'])
      );
      const stacks = parseStacks(pickCell(row, headerMap, ['stacks', 'stack', 'tools']));
      const iconUrl = normalizeUrl(
        pickCell(row, headerMap, ['iconsurl', 'iconurl', 'icon', 'image'])
      );
      const titleParts = splitTitle(title);

      return {
        id: `catalogue-${index + 1}`,
        title,
        description,
        stacks,
        iconUrl,
        num: `C/${String(index + 1).padStart(2, '0')}`,
        main: titleParts.main,
        accent: titleParts.accent,
      };
    })
    .filter((entry) => entry.title || entry.iconUrl);

  const services = entries.filter((entry) => entry.title);
  const orbitIcons = entries
    .filter((entry) => entry.iconUrl)
    .map((entry, index) => ({
      id: `orbit-${index + 1}`,
      title: entry.title || entry.stacks[0] || `Skill ${index + 1}`,
      iconUrl: entry.iconUrl,
    }));

  return { services, orbitIcons };
}

export async function loadCatalogue(fetchImpl = fetch) {
  const response = await fetchImpl(`${CATALOGUE_CSV_URL}&t=${Date.now()}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch catalogue CSV: ${response.status}`);
  }

  const text = await response.text();
  return mapCsvToCatalogue(text);
}
