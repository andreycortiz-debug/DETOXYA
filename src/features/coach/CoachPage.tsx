import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Bot, Send, Trash2, TriangleAlert } from 'lucide-react';
import { Button, Card, PageHeader } from '../../components/ui';
import { db } from '../../data/db';
import { newId } from '../../lib/id';
import { gateSubstances } from '../../content/substances';
import { getCoachReply, loadAiSettings } from '../../llm/coach';
import { detectCrisis } from '../../engine/crisis';
import { useCrisisStore } from '../../store/crisis';
import { cx } from '../../lib/cx';
import { useProfile } from '../profile/useProfile';
import type { CoachContext, CoachMessage } from '../../llm/types';

const QUICK_PROMPTS = [
  'quick_craving',
  'quick_slip',
  'quick_motivation',
  'quick_sleep',
  'quick_mood',
] as const;

export function CoachPage() {
  const { t, i18n } = useTranslation(['coach', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  const openCrisis = useCrisisStore((s) => s.open);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useLiveQuery(
    () => db.chats.orderBy('date').limit(60).toArray(),
    [],
    [] as {
      id: string;
      date: number;
      role: 'user' | 'assistant';
      content: string;
      source?: string;
    }[],
  );
  const targets = useLiveQuery(() => db.quitTargets.toArray(), [], []);
  const urgesCount = useLiveQuery(() => db.urges.count(), [], 0);
  const lastHalt = useLiveQuery(
    () => db.halts.orderBy('date').reverse().limit(1).toArray(),
    [],
    [],
  );
  const settings = useLiveQuery(() => loadAiSettings(), [], null);
  const profile = useProfile();

  const ctx = useMemo<CoachContext>(
    () => ({
      locale: lang,
      daysClean:
        targets && targets.length
          ? Math.floor(
              (Date.now() - Math.min(...targets.map((x) => x.startDate))) / (24 * 60 * 60 * 1000),
            )
          : null,
      goalLabel: targets?.[0]?.label ?? null,
      targetLabels: targets?.map((x) => x.label) ?? [],
      urgesRidden: urgesCount ?? 0,
      lastHalt: lastHalt?.[0]
        ? {
            hunger: lastHalt[0].hunger,
            anger: lastHalt[0].anger,
            loneliness: lastHalt[0].loneliness,
            tiredness: lastHalt[0].tiredness,
            craving: lastHalt[0].craving,
          }
        : null,
      hasGatedSubstance: gateSubstances(targets?.map((x) => x.substanceId) ?? []).length > 0,
      country: profile?.country ?? null,
    }),
    [lang, targets, urgesCount, lastHalt, profile?.country],
  );

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setInput('');
    setBusy(true);
    const now = Date.now();
    const history: CoachMessage[] = (messages ?? [])
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: text });

    await db.chats.put({ id: newId(), date: now, role: 'user', content: text });

    const crisis = detectCrisis(text);
    if (crisis.level !== 'none') openCrisis(crisis.level, 'coach');

    try {
      const reply = await getCoachReply(text, history, ctx);
      await db.chats.put({
        id: newId(),
        date: Date.now(),
        role: 'assistant',
        content: reply.content,
        source: reply.source,
      });
      await db.chats
        .where('date')
        .below(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .delete();
    } finally {
      setBusy(false);
      window.setTimeout(() => bottomRef.current?.scrollIntoView({ block: 'end' }), 50);
    }
  }

  async function clearChat() {
    await db.chats.clear();
  }

  return (
    <>
      <PageHeader
        title={t('coach:title')}
        subtitle={t('coach:subtitle')}
        actions={
          <button
            type="button"
            className="btn-ghost !min-h-8 !px-2 text-xs"
            onClick={() => void clearChat()}
          >
            <Trash2 size={14} aria-hidden />
            {t('coach:clear')}
          </button>
        }
      />

      <div className="banner-warning mb-4 flex items-start gap-2">
        <TriangleAlert size={16} aria-hidden className="mt-0.5 shrink-0" />
        <span>{t('coach:disclaimer')}</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((key) => (
          <button
            key={key}
            type="button"
            className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800 ring-1 ring-teal-200 dark:bg-teal-950 dark:text-teal-200 dark:ring-teal-800"
            onClick={() => void send(t(`coach:${key}`))}
            disabled={busy}
          >
            {t(`coach:${key}`)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(messages ?? []).length === 0 && <Card className="muted text-sm">{t('coach:empty')}</Card>}
        {messages?.map((m) => (
          <div
            key={m.id}
            className={cx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cx(
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
                m.role === 'user'
                  ? 'rounded-br-md bg-teal-600 text-white'
                  : 'rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700',
              )}
            >
              {m.role === 'assistant' && (
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Bot size={12} aria-hidden />
                  {m.source === 'ollama'
                    ? t('coach:source_ollama', { model: settings?.model ?? '' })
                    : m.source === 'crisis'
                      ? t('coach:source_crisis')
                      : m.source === 'medical'
                        ? t('coach:source_medical')
                        : t('coach:source_rules')}
                </div>
              )}
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="animate-pulse rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              {t('coach:thinking')}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="sticky bottom-20 mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          className="input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('coach:placeholder')}
          aria-label={t('coach:placeholder')}
          disabled={busy}
        />
        <Button type="submit" disabled={busy || !input.trim()} aria-label={t('coach:send')}>
          <Send size={16} aria-hidden />
        </Button>
      </form>
    </>
  );
}
