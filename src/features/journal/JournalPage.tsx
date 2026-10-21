import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2 } from 'lucide-react';
import { Button, Card, Field, PageHeader } from '../../components/ui';
import { db } from '../../data/db';
import { newId } from '../../lib/id';
import { promptOfDay } from '../../content/prompts';
import { detectCrisis } from '../../engine/crisis';
import { useCrisisStore } from '../../store/crisis';
import { cx } from '../../lib/cx';
import type { JournalKind } from '../../data/types';

type Tab = 'write' | 'thought' | 'list';

const THOUGHT_FIELDS = [
  'situation',
  'thought',
  'emotion',
  'evidenceFor',
  'evidenceAgainst',
  'reframe',
] as const;

export function JournalPage() {
  const { t, i18n } = useTranslation(['journal', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  const openCrisis = useCrisisStore((s) => s.open);
  const entries = useLiveQuery(
    async () => await db.journal.orderBy('date').reverse().limit(50).toArray(),
    [],
    [],
  );
  const [tab, setTab] = useState<Tab>('write');
  const [usePrompt, setUsePrompt] = useState(true);
  const [text, setText] = useState('');
  const [thought, setThought] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState(false);

  const prompt = promptOfDay();

  async function saveEntry(kind: JournalKind, promptId: string | null, content: string) {
    if (!content.trim()) return;
    const crisis = detectCrisis(content);
    if (crisis.level !== 'none') openCrisis(crisis.level, 'journal');
    await db.journal.add({
      id: newId(),
      date: Date.now(),
      kind,
      promptId,
      text: content.trim(),
      mood: null,
    });
    setText('');
    setThought({});
    setFlash(true);
    window.setTimeout(() => setFlash(false), 2000);
  }

  function saveThought() {
    const payload = JSON.stringify(
      Object.fromEntries(THOUGHT_FIELDS.map((f) => [f, (thought[f] ?? '').trim()])),
    );
    void saveEntry('thought', 'thought-record', payload);
  }

  async function remove(id: string) {
    await db.journal.delete(id);
    setConfirmDeleteId(null);
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <>
      <PageHeader title={t('nav:journal')} subtitle={t('journal:subtitle')} />
      <div className="mb-4 flex gap-2">
        {(['write', 'thought', 'list'] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cx(
              'btn-base flex-1 !min-h-9 !py-1.5 text-xs',
              tab === id
                ? 'bg-teal-600 text-white'
                : 'bg-white ring-1 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700',
            )}
          >
            {t(`journal:tab_${id}`)}
          </button>
        ))}
      </div>

      {tab === 'write' && (
        <div className="space-y-3">
          <Card className="space-y-3">
            <button
              type="button"
              onClick={() => setUsePrompt((v) => !v)}
              className="text-left text-sm font-medium text-teal-700 dark:text-teal-300"
            >
              {usePrompt ? t('journal:useFree') : t('journal:usePrompt')}
            </button>
            {usePrompt && (
              <p className="rounded-xl bg-teal-50 p-3 text-sm text-teal-900 dark:bg-teal-950/50 dark:text-teal-100">
                {prompt.text[lang]}
              </p>
            )}
            <Field label={t('journal:entryLabel')} htmlFor="journal-text">
              <textarea
                id="journal-text"
                className="input min-h-36"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Field>
            <Button
              className="w-full"
              onClick={() =>
                void saveEntry('free', usePrompt ? `daily:${prompt.index}` : null, text)
              }
            >
              {flash ? t('journal:saved') : t('journal:save')}
            </Button>
          </Card>
        </div>
      )}

      {tab === 'thought' && (
        <div className="space-y-3">
          <div className="banner-warning">{t('journal:thoughtIntro')}</div>
          {THOUGHT_FIELDS.map((f) => (
            <Card key={f}>
              <Field label={t(`journal:field_${f}`)} htmlFor={`thought-${f}`}>
                <textarea
                  id={`thought-${f}`}
                  className="input min-h-16"
                  rows={2}
                  value={thought[f] ?? ''}
                  onChange={(e) => setThought((v) => ({ ...v, [f]: e.target.value }))}
                />
              </Field>
            </Card>
          ))}
          <Button className="w-full" onClick={saveThought}>
            {flash ? t('journal:saved') : t('journal:saveThought')}
          </Button>
        </div>
      )}

      {tab === 'list' && (
        <div className="space-y-2">
          {(entries ?? []).length === 0 && (
            <Card>
              <p className="muted">{t('journal:empty')}</p>
            </Card>
          )}
          {entries?.map((entry) => (
            <Card key={entry.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="muted text-xs">
                  {new Date(entry.date).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                  {entry.kind === 'thought' ? ` · ${t('journal:tab_thought')}` : ''}
                </p>
                <button
                  type="button"
                  className="btn-ghost !min-h-8 !px-2 text-rose-600"
                  onClick={() => setConfirmDeleteId(entry.id)}
                  aria-label={t('common:actions.delete')}
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </div>
              {confirmDeleteId === entry.id && (
                <div className="banner-warning flex items-center justify-between gap-2 !text-xs">
                  <span>{t('journal:confirmDelete')}</span>
                  <span className="flex gap-1.5">
                    <button
                      type="button"
                      className="btn-danger !min-h-8 !px-2 !py-1 text-xs"
                      onClick={() => void remove(entry.id)}
                    >
                      {t('common:actions.delete')}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost !min-h-8 !px-2 !py-1 text-xs"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      {t('common:actions.cancel')}
                    </button>
                  </span>
                </div>
              )}
              <JournalBody kind={entry.kind} text={entry.text} t={t} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function JournalBody({
  kind,
  text,
  t,
}: {
  kind: JournalKind;
  text: string;
  t: (key: string) => string;
}) {
  if (kind !== 'thought') {
    return <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{text}</p>;
  }
  let data: Record<string, string> = {};
  try {
    data = JSON.parse(text) as Record<string, string>;
  } catch {
    return <p className="whitespace-pre-wrap text-sm">{text}</p>;
  }
  return (
    <dl className="space-y-1.5 text-sm">
      {THOUGHT_FIELDS.filter((f) => data[f]).map((f) => (
        <div key={f}>
          <dt className="font-semibold text-slate-700 dark:text-slate-300">
            {t(`journal:field_${f}`)}
          </dt>
          <dd className="muted whitespace-pre-wrap">{data[f]}</dd>
        </div>
      ))}
    </dl>
  );
}
