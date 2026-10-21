import { db } from './db';

export const EXPORT_APP = 'detoxya';
export const EXPORT_VERSION = 2;

export const EXPORT_TABLES = [
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
] as const;

export type ExportTable = (typeof EXPORT_TABLES)[number];

export type ExportPayload = {
  app: string;
  version: number;
  exportedAt: number;
  data: Record<ExportTable, unknown[]>;
};

/** Claves de settings que nunca viajan en un backup (privacidad del PIN). */
const SECRET_SETTING_KEYS = new Set(['lock.pin.hash', 'lock.pin.salt', 'lock.pin']);

export function validateImport(input: unknown): string | null {
  if (typeof input !== 'object' || input === null) return 'not-object';
  const payload = input as Record<string, unknown>;
  if (payload['app'] !== EXPORT_APP) return 'not-detoxya';
  const version = payload['version'];
  if (version !== 1 && version !== 2) return 'version';
  const data = payload['data'];
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return 'data';
  const record = data as Record<string, unknown>;
  // En v1 no existía la tabla triggers: es opcional.
  const required = version === 2 ? EXPORT_TABLES : EXPORT_TABLES.filter((t) => t !== 'triggers');
  for (const table of required) {
    if (!(table in record)) return `table:${table}`;
    if (!Array.isArray(record[table])) return `table:${table}`;
  }
  return null;
}

export async function exportAll(): Promise<ExportPayload> {
  const data = {} as Record<ExportTable, unknown[]>;
  for (const table of EXPORT_TABLES) {
    let rows = (await db.table(table).toArray()) as unknown[];
    if (table === 'settings') {
      rows = rows.filter(
        (r) =>
          !(
            typeof (r as { key?: string }).key === 'string' &&
            SECRET_SETTING_KEYS.has((r as { key: string }).key)
          ),
      );
    }
    data[table] = rows;
  }
  return { app: EXPORT_APP, version: EXPORT_VERSION, exportedAt: Date.now(), data };
}

export async function importAll(payload: ExportPayload): Promise<number> {
  let count = 0;
  const tables = (
    payload.version === 1 ? EXPORT_TABLES.filter((t) => t !== 'triggers') : EXPORT_TABLES
  ) as string[];
  await db.transaction(
    'rw',
    tables.map((t) => db.table(t)),
    async () => {
      for (const table of tables) {
        const rows = payload.data[table as ExportTable] as { id?: string; key?: string }[];
        await db.table(table).clear();
        for (const row of rows) {
          if (
            table === 'settings' &&
            typeof row.key === 'string' &&
            SECRET_SETTING_KEYS.has(row.key)
          )
            continue;
          await db.table(table).put(row);
          count += 1;
        }
      }
    },
  );
  return count;
}

export async function clearAllData(): Promise<void> {
  await db.delete();
}
