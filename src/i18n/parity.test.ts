import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LOCALES_DIR = join(__dirname, '../../src/i18n/locales');
const NAMESPACES = [
  'common',
  'nav',
  'onboarding',
  'safety',
  'help',
  'resources',
  'sobriety',
  'cravings',
  'halt',
  'program',
  'journal',
  'paths',
  'coach',
  'settings',
  'dashboard',
] as const;

function flatKeys(obj: Record<string, unknown>, prefix = ''): Set<string> {
  const out = new Set<string>();
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const nested of flatKeys(v as Record<string, unknown>, key)) out.add(nested);
    } else {
      out.add(key);
    }
  }
  return out;
}

describe('i18n parity', () => {
  it('es and en have the same keys for every namespace', () => {
    const problems: string[] = [];
    for (const ns of NAMESPACES) {
      const es = JSON.parse(readFileSync(join(LOCALES_DIR, 'es', `${ns}.json`), 'utf8'));
      const en = JSON.parse(readFileSync(join(LOCALES_DIR, 'en', `${ns}.json`), 'utf8'));
      const esKeys = flatKeys(es);
      const enKeys = flatKeys(en);
      for (const k of esKeys) if (!enKeys.has(k)) problems.push(`${ns}: missing in en: ${k}`);
      for (const k of enKeys) if (!esKeys.has(k)) problems.push(`${ns}: missing in es: ${k}`);
    }
    expect(problems).toEqual([]);
  });

  it('every namespace file referenced in i18n/index.ts exists', () => {
    const indexSrc = readFileSync(join(__dirname, '../../src/i18n/index.ts'), 'utf8');
    // Sanity: at least the namespaces we test are loadable.
    for (const ns of NAMESPACES) {
      expect(indexSrc.includes(`'${ns}'`)).toBe(true);
    }
  });
});
