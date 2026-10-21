import { validateImport, EXPORT_APP, EXPORT_VERSION } from './transfer';

describe('validateImport', () => {
  const build = (overrides: Record<string, unknown> = {}) => ({
    app: EXPORT_APP,
    version: EXPORT_VERSION,
    exportedAt: 1,
    data: { profile: [], urges: [] },
    ...overrides,
  });

  it('rejects non-objects', () => {
    expect(validateImport(null)).toBe('not-object');
    expect(validateImport('x')).toBe('not-object');
  });

  it('rejects wrong app marker', () => {
    expect(validateImport(build({ app: 'other' }))).toBe('not-detoxya');
  });

  it('rejects unknown version', () => {
    expect(validateImport(build({ version: 99 }))).toBe('version');
  });

  it('rejects missing data object', () => {
    expect(validateImport(build({ data: 'no' }))).toBe('data');
    expect(validateImport(build({ data: [] }))).toBe('data');
  });

  it('rejects when a table is missing or not an array', () => {
    expect(validateImport(build({ data: { profile: [] } }))).toBe('table:quitTargets');
    expect(
      validateImport(
        build({
          data: {
            ...Object.fromEntries(
              [
                'profile',
                'quitTargets',
                'screening',
                'acks',
                'urges',
                'halts',
                'journal',
                'pledges',
                'reviews',
                'progress',
                'chats',
                'events',
                'settings',
                'triggers',
              ].map((k) => [k, []]),
            ),
          },
        }),
      ),
    ).toBeNull();
  });
});
