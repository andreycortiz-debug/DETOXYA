import Dexie, { type Table } from 'dexie';
import type {
  Ack,
  ChatMessage,
  EveningReview,
  HaltCheck,
  JournalEntry,
  LessonProgress,
  Pledge,
  Profile,
  QuitTarget,
  RecoveryEvent,
  Screening,
  SettingRow,
  TriggerItem,
  UrgeLog,
} from './types';

export class DetoxyaDB extends Dexie {
  profile!: Table<Profile, string>;
  quitTargets!: Table<QuitTarget, string>;
  screening!: Table<Screening, string>;
  acks!: Table<Ack, string>;
  urges!: Table<UrgeLog, string>;
  halts!: Table<HaltCheck, string>;
  journal!: Table<JournalEntry, string>;
  pledges!: Table<Pledge, string>;
  reviews!: Table<EveningReview, string>;
  progress!: Table<LessonProgress, string>;
  chats!: Table<ChatMessage, string>;
  events!: Table<RecoveryEvent, string>;
  settings!: Table<SettingRow, string>;
  triggers!: Table<TriggerItem, string>;

  constructor() {
    super('detoxya');
    this.version(1).stores({
      profile: 'id',
      quitTargets: 'id, substanceId, startDate, endDate',
      screening: 'id, date',
      acks: 'id, date',
      urges: 'id, date, targetId',
      halts: 'id, date',
      journal: 'id, date, kind',
      pledges: 'date',
      reviews: 'date',
      progress: 'id, courseId, lessonId, updatedAt',
      chats: 'id, date, role',
      events: 'id, date, kind, targetId',
      settings: 'key',
    });
    this.version(2)
      .stores({
        profile: 'id',
        quitTargets: 'id, substanceId, startDate, endDate',
        screening: 'id, date',
        acks: 'id, date',
        urges: 'id, date, targetId',
        halts: 'id, date',
        journal: 'id, date, kind',
        pledges: 'date',
        reviews: 'date',
        progress: 'id, courseId, lessonId, updatedAt',
        chats: 'id, date, role, source',
        events: 'id, date, kind, targetId',
        settings: 'key',
        triggers: 'id, label',
      })
      .upgrade(async (tx) => {
        // Migrar triggers desde el blob de settings a tabla propia.
        const row = await tx.table('settings').get('triggers');
        const list = Array.isArray(row?.value) ? (row.value as TriggerItem[]) : [];
        if (list.length) await tx.table('triggers').bulkPut(list);
        // Migrar PIN en claro a hash+salt (si existiera).
        const legacy = await tx.table('settings').get('lock.pin');
        if (legacy && typeof legacy.value === 'string' && legacy.value.length === 4) {
          const { storePin } = await import('../lib/pin');
          const { salt, hash } = await storePin(legacy.value);
          await tx.table('settings').put({ key: 'lock.pin.salt', value: salt });
          await tx.table('settings').put({ key: 'lock.pin.hash', value: hash });
          await tx.table('settings').delete('lock.pin');
        }
      });
  }
}

export const db = new DetoxyaDB();

export const SETTING_KEYS = {
  aiEnabled: 'ai.enabled',
  aiBaseUrl: 'ai.baseUrl',
  aiModel: 'ai.model',
  lockEnabled: 'lock.enabled',
  pinHash: 'lock.pin.hash',
  pinSalt: 'lock.pin.salt',
  pinFailCount: 'lock.pin.fails',
  pinLockUntil: 'lock.pin.lockUntil',
} as const;

/** Clave antigua (PIN en claro); ya no se usa, se migra en version(2).upgrade. */
export const LEGACY_PIN_KEY = 'lock.pin';

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.settings.get(key);
  return row ? (row.value as T) : fallback;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await db.settings.put({ key, value });
}
