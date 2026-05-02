export const CLIENTS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4hThM4eNgQ4OCgrAAAuFPcICOXUdc0Y8abYuhcYpUboQrFjNRmUC_lDa56pWfZT2C_omQsbY9fDpG/pub?gid=475629631&single=true&output=csv';

export const DEFAULT_REVIEWS = [
  {
    id: 'ajay-singh',
    quote:
      'Boluwatife has an exceptional eye for detail. He understood the brief immediately and shipped a product that felt inevitable from the first click.',
    name: 'Sarah Chen',
    role: 'Product Lead · Fintrak',
    initials: 'SC',
    avatarColor: '#56D6E6',
  },
  {
    id: 'charles-okon',
    quote:
      'Great communicator, fast turnaround. The component system he built became the reference point the entire team rallied around.',
    name: 'James Okonkwo',
    role: 'CTO · Buildstack',
    initials: 'JO',
    avatarColor: '#005b94',
  },
  {
    id: 'david-butler',
    quote:
      'Calm, precise, and technically excellent. Exactly the kind of embedded engineer you want when the interface is the product.',
    name: 'Amara Diallo',
    role: 'Design Director · Orbit Labs',
    initials: 'AD',
    avatarColor: '#FF9354',
  },
];

const REVIEW_COLORS = ['#56D6E6', '#005b94', '#FF9354', '#d9e5d6'];

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
    .replace(/\u00e2\u0080\u0094/g, '-')
    .replace(/\u00e2\u0080\u0093/g, '-')
    .replace(/\u00e2\u0080\u0099/g, "'")
    .replace(/\u00e2\u0080\u009c/g, '"')
    .replace(/\u00e2\u0080\u009d/g, '"')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatWord(word) {
  if (/^[a-z]{2,4}$/i.test(word)) {
    return word.toUpperCase();
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatRole(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return '';
  }

  return normalized
    .split(',')
    .map((segment) =>
      segment
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(formatWord)
        .join(' ')
    )
    .filter(Boolean)
    .join(' · ');
}

function getInitials(name) {
  const parts = normalizeText(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

export function mapCsvToReviews(text) {
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return DEFAULT_REVIEWS;
  }

  const headers = rows[0].map(normalizeHeader);
  const headerMap = Object.fromEntries(headers.map((header, index) => [header, index]));

  const reviews = rows
    .slice(1)
    .map((row, index) => {
      const name = normalizeText(pickCell(row, headerMap, ['name', 'client', 'author']));
      const role = formatRole(pickCell(row, headerMap, ['title', 'role', 'company']));
      const quote = normalizeText(pickCell(row, headerMap, ['review', 'quote', 'testimonial']));

      if (!name || !quote) {
        return null;
      }

      return {
        id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
        quote,
        name,
        role,
        initials: getInitials(name),
        avatarColor: REVIEW_COLORS[index % REVIEW_COLORS.length],
      };
    })
    .filter(Boolean);

  return reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
}

export async function loadReviews(fetchImpl = fetch) {
  const response = await fetchImpl(`${CLIENTS_CSV_URL}&t=${Date.now()}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch clients CSV: ${response.status}`);
  }

  const text = await response.text();
  return mapCsvToReviews(text);
}
