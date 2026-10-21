import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpen, Bot, Flame, NotebookPen, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Field, PageHeader, RangeField } from '../../components/ui';
import { db } from '../../data/db';
import { getSubstance } from '../../content/substances';
import { newId } from '../../lib/id';
import { startOfDay, todayKey } from '../../lib/time';
import { useActiveTargets, useProfile } from '../profile/useProfile';
import { ClockCard, UrgeCounterBadge } from './ClockCard';
import { cx } from '../../lib/cx';

export function TodayPage() {
  const { t, i18n } = useTranslation(['sobriety', 'common', 'safety', 'nav', 'coach']);
  const profile = useProfile();
  const targets = useActiveTargets();
  const acks = useLiveQuery(() => db.acks.toArray(), [], undefined);
  const urgeCount = useLiveQuery(() => db.urges.count(), [], 0);
  const pledge = useLiveQuery(() => db.pledges.get(todayKey()), [], undefined);
  const review = useLiveQuery(() => db.reviews.get(todayKey()), [], undefined);
  const events = useLiveQuery(() => db.events.toArray(), [], undefined);

  const [pledgeDraft, setPledgeDraft] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [wins, setWins] = useState('');
  const [hard, setHard] = useState('');
  const [cravingAvg, setCravingAvg] = useState(5);
  const [slipTargetId, setSlipTargetId] = useState<string | null>(null);

  const nowHour = new Date().getHours();
  const hasGatedTarget = (targets ?? []).some(
    (t) => getSubstance(t.substanceId)?.requiresMedicalGate,
  );
  const medicalGatePending = hasGatedTarget && !acks?.some((a) => a.id === 'medical-detox');

  useEffect(() => {
    if (!targets || !events) return;
    const logged = new Set(
      events
        .filter((e) => e.kind === 'milestone' && e.message?.startsWith('milestone:'))
        .map((e) => e.message),
    );
    const dayNow = startOfDay();
    void (async () => {
      for (const target of targets) {
        const days = Math.floor((dayNow - startOfDay(target.startDate)) / (24 * 60 * 60 * 1000));
        for (const m of [1, 3, 7, 14, 30, 60, 90, 180, 365]) {
          if (days >= m) {
            const key = `milestone:${target.id}:${m}`;
            if (!logged.has(key)) {
              logged.add(key);
              // ID determinista: put() es idempotente, así no se duplican
              // si el effect se dispara dos veces antes de que el liveQuery se actualice.
              await db.events.put({
                id: key,
                date: Date.now(),
                kind: 'milestone',
                targetId: target.id,
                message: key,
              });
            }
          }
        }
      }
    })();
  }, [targets, events]);

  async function savePledge() {
    if (pledgeDraft === null) return;
    await db.pledges.put({
      date: todayKey(),
      reasons: pledgeDraft,
      photoDataUrl: pledge?.photoDataUrl ?? null,
      updatedAt: Date.now(),
    });
    setPledgeDraft(null);
  }

  async function saveReview() {
    await db.reviews.put({
      date: todayKey(),
      wins: wins.trim(),
      hard: hard.trim(),
      cravingAvg,
      note: null,
      updatedAt: Date.now(),
    });
    setReviewOpen(false);
    setWins('');
    setHard('');
  }

  async function recordSlip(mode: 'reset' | 'note') {
    if (!slipTargetId) return;
    const target = targets?.find((x) => x.id === slipTargetId);
    if (!target) return;
    const now = Date.now();
    await db.transaction('rw', [db.quitTargets, db.events], async () => {
      await db.events.add({
        id: newId(),
        date: now,
        kind: 'lapse',
        targetId: target.id,
        message: mode,
      });
      if (mode === 'reset') {
        await db.quitTargets.update(target.id, { endDate: now });
        await db.quitTargets.add({
          ...target,
          id: newId(),
          startDate: now,
          endDate: null,
          createdAt: now,
        });
      }
    });
    setSlipTargetId(null);
  }

  const currencies = useMemo(() => {
    return {
      currency: profile?.currency ?? 'USD',
      locale: profile?.locale ?? i18n.language,
    };
  }, [profile, i18n.language]);

  if (!targets) return null;

  return (
    <>
      <PageHeader
        title={t('nav:today')}
        subtitle={profile?.onboardedAt ? undefined : t('common:loading')}
      />

      {medicalGatePending && (
        <div className="banner-danger mb-4 flex items-start gap-2">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">{t('safety:medicalGate.title')}</p>
            <p className="mt-1">{t('safety:medicalGate.body')}</p>
            <Link to="/help" className="mt-2 inline-block font-semibold underline">
              {t('nav:help')}
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {targets.length === 0 && (
          <Card>
            <p className="muted">{t('sobriety:noTargets')}</p>
          </Card>
        )}

        {targets.map((target) => (
          <div key={target.id} className="space-y-2">
            <ClockCard target={target} currency={currencies.currency} locale={currencies.locale} />
            <div className="flex justify-end">
              <button
                type="button"
                className="btn-ghost !min-h-9 !px-3 text-xs"
                onClick={() => setSlipTargetId(target.id)}
              >
                {t('sobriety:slipButton')}
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <UrgeCounterBadge count={urgeCount ?? 0} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link to="/cravings" className="btn-primary !flex-col !gap-1 !py-3">
            <Flame size={20} aria-hidden />
            <span className="text-xs">{t('sobriety:cravingNow')}</span>
          </Link>
          <Link to="/coach" className="btn-secondary !flex-col !gap-1 !py-3">
            <Bot size={20} aria-hidden />
            <span className="text-xs">{t('coach:title')}</span>
          </Link>
          <Link to="/program" className="btn-secondary !flex-col !gap-1 !py-3">
            <BookOpen size={20} aria-hidden />
            <span className="text-xs">{t('sobriety:openProgram')}</span>
          </Link>
          <Link to="/journal" className="btn-secondary !flex-col !gap-1 !py-3">
            <NotebookPen size={20} aria-hidden />
            <span className="text-xs">{t('sobriety:writeJournal')}</span>
          </Link>
        </div>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{t('sobriety:pledgeTitle')}</h2>
            <button
              type="button"
              className="btn-ghost !min-h-9 !px-2 text-xs"
              onClick={() => setPledgeDraft(pledgeDraft ?? pledge?.reasons ?? '')}
            >
              {t('common:actions.edit')}
            </button>
          </div>
          {pledgeDraft !== null ? (
            <>
              <textarea
                className="input min-h-28"
                rows={4}
                value={pledgeDraft}
                onChange={(e) => setPledgeDraft(e.target.value)}
                aria-label={t('sobriety:pledgeTitle')}
              />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => void savePledge()}>
                  {t('common:actions.save')}
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setPledgeDraft(null)}>
                  {t('common:actions.cancel')}
                </Button>
              </div>
            </>
          ) : pledge?.reasons ? (
            <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
              {pledge.reasons}
            </p>
          ) : (
            <p className="muted">{t('sobriety:pledgeEmpty')}</p>
          )}
        </Card>

        {nowHour >= 17 && !review && !reviewOpen && (
          <Card className="space-y-3">
            <h2 className="text-base font-semibold">{t('sobriety:reviewTitle')}</h2>
            <p className="muted">{t('sobriety:reviewBody')}</p>
            <Button className="w-full" onClick={() => setReviewOpen(true)}>
              {t('sobriety:reviewStart')}
            </Button>
          </Card>
        )}

        {reviewOpen && (
          <Card className="space-y-3">
            <Field label={t('sobriety:reviewWins')} htmlFor="review-wins">
              <textarea
                id="review-wins"
                className="input min-h-20"
                rows={2}
                value={wins}
                onChange={(e) => setWins(e.target.value)}
              />
            </Field>
            <Field label={t('sobriety:reviewHard')} htmlFor="review-hard">
              <textarea
                id="review-hard"
                className="input min-h-20"
                rows={2}
                value={hard}
                onChange={(e) => setHard(e.target.value)}
              />
            </Field>
            <RangeField
              label={t('sobriety:reviewCraving', { value: cravingAvg })}
              value={cravingAvg}
              min={0}
              max={10}
              onChange={setCravingAvg}
              id="review-craving"
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => void saveReview()}>
                {t('common:actions.save')}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setReviewOpen(false)}>
                {t('common:actions.cancel')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {slipTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="slip-title"
        >
          <div className="card w-full max-w-md space-y-3 !p-5">
            <h2 id="slip-title" className="text-base font-semibold">
              {t('sobriety:slipTitle')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t('sobriety:slipBody')}</p>
            <Button variant="danger" className="w-full" onClick={() => void recordSlip('reset')}>
              {t('sobriety:slipReset')}
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => void recordSlip('note')}>
              {t('sobriety:slipNoteOnly')}
            </Button>
            <Button variant="ghost" className={cx('w-full')} onClick={() => setSlipTargetId(null)}>
              {t('common:actions.cancel')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
