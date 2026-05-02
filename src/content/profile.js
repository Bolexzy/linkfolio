export const PROFILE_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4hThM4eNgQ4OCgrAAAuFPcICOXUdc0Y8abYuhcYpUboQrFjNRmUC_lDa56pWfZT2C_omQsbY9fDpG/pub?gid=0&single=true&output=csv';

export const DEFAULT_PROFILE = {
  title: 'Web Engineer',
  tagline: 'Interface engineer crafting calm, precise, inevitable interfaces.',
  bio:
    'I build production-grade web interfaces at the intersection of design and engineering - component systems, motion, and the small details that make a product feel inevitable.',
  portrait:
    'https://res.cloudinary.com/dtwdlzej8/image/upload/v1776471897/photo_2026-04-18_01-10-02_e7eiaq.jpg',
  resume: '',
  stats: [
    { num: '5+', label: 'Years shipping' },
    { num: '42', label: 'Projects delivered' },
    { num: '14', label: 'Teams collaborated' },
  ],
};

let profilePromise = null;

const STAT_LABELS = {
  years: 'Years shipping',
  projects: 'Projects delivered',
  teams: 'Teams collaborated',
};

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

function normalizeKey(value) {
  return value.toLowerCase().replace(/[\s_-]+/g, '');
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

function formatStat(value, key) {
  const raw = normalizeText(value);
  if (!raw) {
    return null;
  }

  const suffix = key === 'years' && /\d$/.test(raw) ? '+' : '';

  return {
    num: `${raw}${suffix}`,
    label: STAT_LABELS[key],
  };
}

export function mapCsvToProfile(text) {
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return DEFAULT_PROFILE;
  }

  const entries = rows.slice(1).reduce((accumulator, row) => {
    const key = normalizeKey(row[0] ?? '');
    const value = row[1] ?? '';

    if (key) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});

  const stats = ['years', 'projects', 'teams']
    .map((key) => formatStat(entries[key] ?? '', key))
    .filter(Boolean);

  return {
    title: normalizeText(entries.title ?? '') || DEFAULT_PROFILE.title,
    tagline: normalizeText(entries.tagline ?? '') || DEFAULT_PROFILE.tagline,
    bio: normalizeText(entries.bio ?? '') || DEFAULT_PROFILE.bio,
    portrait: normalizeUrl(entries.portrait ?? '') || DEFAULT_PROFILE.portrait,
    resume: normalizeUrl(entries.resume ?? '') || DEFAULT_PROFILE.resume,
    stats: stats.length > 0 ? stats : DEFAULT_PROFILE.stats,
  };
}

export async function loadProfile(fetchImpl = fetch) {
  const request = (async () => {
    const response = await fetchImpl(`${PROFILE_CSV_URL}&t=${Date.now()}`, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile CSV: ${response.status}`);
    }

    const text = await response.text();
    return mapCsvToProfile(text);
  })();

  return request;
}
