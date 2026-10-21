import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Layers, Timer } from 'lucide-react';
import { Button, Card, Field, PageHeader, RangeField } from '../../components/ui';
import { db } from '../../data/db';
import { newId } from '../../lib/id';
import { detectCrisis } from '../../engine/crisis';
import { useCrisisStore } from '../../store/crisis';
import { useActiveTargets } from '../profile/useProfile';
import type { UrgeTechnique } from '../../data/types';
import { cx } from '../../lib/cx';

const FOUR_DS = [
  { id: 'delay', titleKey: 'cravings:dsDelayTitle', bodyKey: 'cravings:dsDelayBody' },
  { id: 'distract', titleKey: 'cravings:dsDistractTitle', bodyKey: 'cravings:dsDistractBody' },
  { id: 'deep', titleKey: 'cravings:dsDeepTitle', bodyKey: 'cravings:dsDeepBody' },
  { id: 'decatastrophize', titleKey: 'cravings:dsDecatTitle', bodyKey: 'cravings:dsDecatBody' },
] as const;

const DISTRACTIONS = [
  'cravings:distWalk',
  'cravings:distColdWater',
  'cravings:distCall',
  'cravings:distShower',
  'cravings:distMusic',
  'cravings:distClean',
  'cravings:distGame',
  'cravings:distJournal',
  'cravings:distPet',
  'cravings:distStretch',
] as const;

export function CravingsPage() {
  const { t } = useTranslation(['cravings', 'common']);
  const [params] = useSearchParams();
  const targets = useActiveTargets();
  const urges = useLiveQuery(
    async () => await db.urges.orderBy('date').reverse().limit(10).toArray(),
    [],
    [],
  );
  const triggers = useLiveQuery(() => db.triggers.toArray(), [], []);
  const openCrisis = useCrisisStore((s) => s.open);

  const [before, setBefore] = useState(7);
  const [after, setAfter] = useState(4);
  const [technique, setTechnique] = useState<UrgeTechnique>(
    (params.get('technique') as UrgeTechnique) || 'other',
  );
  const [trigger, setTrigger] = useState('');
  const [note, setNote] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const targetId = targets?.[0]?.id ?? null;
  const triggerList = useMemo(() => triggers ?? [], [triggers]);

  async function saveUrge() {
    const crisis = detectCrisis(note);
    if (crisis.level !== 'none') openCrisis(crisis.level, 'urge-note');
    await db.urges.add({
      id: newId(),
      date: Date.now(),
      targetId,
      trigger: trigger || null,
      technique,
      intensityBefore: before,
      intensityAfter: after,
      durationSec: 0,
      note: note.trim() || null,
    });
    setNote('');
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  }

  return (
    <>
      <PageHeader title={t('nav:cravings')} subtitle={t('cravings:subtitle')} />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Link to="/cravings/surf?minutes=3" className="btn-primary !flex-col !gap-1 !py-4">
            <Timer size={22} aria-hidden />
            {t('cravings:surfCta')}
          </Link>
          <Link to="/cravings/breath" className="btn-secondary !flex-col !gap-1 !py-4">
            <Layers size={22} aria-hidden />
            {t('cravings:breathCta')}
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/halt" className="btn-secondary !min-h-11 !px-4 !py-2 text-sm">
            {t('cravings:haltCta')}
          </Link>
          <Link to="/triggers" className="btn-secondary !min-h-11 !px-4 !py-2 text-sm">
            {t('cravings:triggersCta')}
          </Link>
        </div>

        <Card className="space-y-2">
          <h2 className="text-base font-semibold">{t('cravings:fourDsTitle')}</h2>
          <p className="muted">{t('cravings:fourDsBody')}</p>
          <div className="space-y-2">
            {FOUR_DS.map((d, i) => (
              <details
                key={d.id}
                open={i === 0}
                className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
              >
                <summary className="cursor-pointer text-sm font-semibold">{t(d.titleKey)}</summary>
                <p className="muted mt-1.5">{t(d.bodyKey)}</p>
              </details>
            ))}
          </div>
        </Card>

        <Card className="space-y-2">
          <h2 className="text-base font-semibold">{t('cravings:distractionsTitle')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {DISTRACTIONS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-2">
          <h2 className="text-base font-semibold">{t('cravings:coldTitle')}</h2>
          <p className="muted">{t('cravings:coldBody')}</p>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-base font-semibold">{t('cravings:logTitle')}</h2>
          <p className="muted">{t('cravings:logBody')}</p>

          <Field label={t('cravings:techniqueLabel')}>
            <div className="flex flex-wrap gap-2">
              {(
                ['surf', 'delay', 'four-ds', 'breath', 'cold', 'distraction', 'other'] as const
              ).map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setTechnique(tech)}
                  className={cx(
                    'chip ring-1',
                    technique === tech
                      ? 'bg-teal-600 text-white ring-teal-600'
                      : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700',
                  )}
                >
                  {t(`cravings:tech_${tech}`)}
                </button>
              ))}
            </div>
          </Field>

          <RangeField
            label={t('cravings:intensityBefore', { value: before })}
            value={before}
            min={0}
            max={10}
            onChange={setBefore}
          />
          <RangeField
            label={t('cravings:intensityAfter', { value: after })}
            value={after}
            min={0}
            max={10}
            onChange={setAfter}
          />

          {triggerList.length > 0 && (
            <Field label={t('cravings:triggerLabel')}>
              <select
                className="input"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
              >
                <option value="">{t('cravings:triggerNone')}</option>
                {triggerList.map((tr) => (
                  <option key={tr.id} value={tr.label}>
                    {tr.label}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label={t('cravings:noteLabel')} htmlFor="urge-note">
            <textarea
              id="urge-note"
              className="input min-h-20"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>

          <Button className="w-full" onClick={() => void saveUrge()}>
            {savedFlash ? t('cravings:savedUrge') : t('cravings:saveUrge')}
          </Button>
        </Card>

        {(urges?.length ?? 0) > 0 && (
          <Card className="space-y-2">
            <h2 className="text-base font-semibold">{t('cravings:recentTitle')}</h2>
            <ul className="space-y-2">
              {urges?.map((u) => (
                <li
                  key={u.id}
                  className="rounded-lg bg-slate-50 p-2.5 text-sm dark:bg-slate-800/60"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{t(`cravings:tech_${u.technique}`)}</span>
                    <span className="muted">
                      {u.intensityBefore} → {u.intensityAfter}
                    </span>
                  </div>
                  <p className="muted mt-0.5 text-xs">
                    {new Date(u.date).toLocaleString(undefined, {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                    {u.trigger ? ` · ${u.trigger}` : ''}
                  </p>
                </li>
              ))}
            </ul>
            <Link to="/dashboard" className="btn-ghost w-full text-xs">
              <BookOpen size={14} aria-hidden />
              {t('cravings:seeDashboard')}
            </Link>
          </Card>
        )}
      </div>
    </>
  );
}

export function WaveVisualizer({ running }: { running: boolean }) {
  const playState = running ? 'running' : 'paused';
  return (
    <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-b from-teal-50 to-sky-100 dark:from-teal-950 dark:to-slate-900">
      <svg
        viewBox="0 0 600 160"
        className="absolute bottom-0 h-24 w-[200%] animate-[wave_6s_linear_infinite]"
        style={{ animationPlayState: playState }}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 80 Q 75 20 150 80 T 300 80 T 450 80 T 600 80 V 160 H 0 Z"
          fill="currentColor"
          className="text-teal-500/60"
        />
      </svg>
      <svg
        viewBox="0 0 600 160"
        className="absolute bottom-0 h-20 w-[200%] animate-[wave_9s_linear_infinite_reverse]"
        style={{ animationPlayState: playState }}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 90 Q 75 50 150 90 T 300 90 T 450 90 T 600 90 V 160 H 0 Z"
          fill="currentColor"
          className="text-sky-500/50"
        />
      </svg>
    </div>
  );
}

export function UrgeSurfPage() {
  const { t } = useTranslation(['cravings', 'common']);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const minutes = Math.max(1, Math.min(20, Number(params.get('minutes')) || 3));
  const totalSec = minutes * 60;

  const [before, setBefore] = useState(7);
  const [after, setAfter] = useState<number | null>(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(totalSec);
  // Auto-arranca: en pleno antojo no debe exigir un toque extra.
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const targets = useActiveTargets();

  const phases = useMemo(
    () => [
      { until: 0.15, key: 'cravings:phaseObserve' },
      { until: 0.35, key: 'cravings:phaseLocate' },
      { until: 0.65, key: 'cravings:phaseBreathe' },
      { until: 1, key: 'cravings:phaseFall' },
    ],
    [],
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setRunning(false);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    const elapsedPct = 1 - remaining / totalSec;
    const idx = phases.findIndex((p) => elapsedPct <= p.until);
    setPhaseIdx(idx === -1 ? phases.length - 1 : idx);
  }, [remaining, totalSec, phases]);

  async function save() {
    await db.urges.add({
      id: newId(),
      date: Date.now(),
      targetId: targets?.[0]?.id ?? null,
      trigger: null,
      technique: 'surf',
      intensityBefore: before,
      intensityAfter: after ?? before,
      durationSec: totalSec,
      note: null,
    });
    navigate('/cravings');
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <>
      <PageHeader title={t('cravings:surfTitle')} subtitle={t('cravings:surfSubtitle')} />
      <div className="space-y-4">
        <WaveVisualizer running={running} />

        {!done && (
          <>
            <RangeField
              label={t('cravings:intensityBefore', { value: before })}
              value={before}
              min={0}
              max={10}
              onChange={setBefore}
            />
            <div className="text-center">
              <p className="text-6xl font-black tabular-nums text-teal-700 dark:text-teal-300">
                {mm}:{ss}
              </p>
              <p className="muted mt-2 min-h-12 px-2 text-sm">{t(phases[phaseIdx].key)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => setRunning((r) => !r)}
                disabled={remaining === 0}
              >
                {running
                  ? t('cravings:pause')
                  : remaining === totalSec
                    ? t('cravings:start')
                    : t('cravings:resume')}
              </Button>
              {running && (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setRunning(false);
                    setDone(true);
                  }}
                >
                  {t('cravings:finishEarly')}
                </Button>
              )}
            </div>
            <p className="muted text-center text-xs">{t('cravings:surfHint')}</p>
          </>
        )}

        {done && (
          <Card className="space-y-3">
            <p className="font-semibold text-teal-700 dark:text-teal-300">
              {t('cravings:surfDone')}
            </p>
            <RangeField
              label={t('cravings:intensityAfter', { value: after ?? before })}
              value={after ?? before}
              min={0}
              max={10}
              onChange={setAfter}
            />
            <Button className="w-full" onClick={() => void save()}>
              {t('cravings:saveUrge')}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/cravings')}>
              {t('common:actions.cancel')}
            </Button>
          </Card>
        )}
      </div>
    </>
  );
}

const BOX_CYCLE = [
  { labelKey: 'cravings:inhale', seconds: 4, scale: 1.25 },
  { labelKey: 'cravings:holdIn', seconds: 4, scale: 1.25 },
  { labelKey: 'cravings:exhale', seconds: 4, scale: 0.85 },
  { labelKey: 'cravings:holdOut', seconds: 4, scale: 0.85 },
] as const;

export function BreathPage() {
  const { t } = useTranslation(['cravings', 'common']);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running || count > 0) return;
    const next = (phase + 1) % BOX_CYCLE.length;
    if (phase === BOX_CYCLE.length - 1) setCycles((x) => x + 1);
    setPhase(next);
    setCount(BOX_CYCLE[next].seconds);
  }, [count, running, phase]);

  return (
    <>
      <PageHeader title={t('cravings:breathTitle')} subtitle={t('cravings:breathSubtitle')} />
      <div className="flex flex-col items-center gap-6 py-6">
        <div
          className="flex h-48 w-48 items-center justify-center rounded-full bg-teal-600/90 text-white transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${running ? BOX_CYCLE[phase].scale : 1})` }}
          aria-live="polite"
        >
          <div className="text-center">
            <p className="text-2xl font-bold">
              {running ? t(BOX_CYCLE[phase].labelKey) : '4-4-4-4'}
            </p>
            <p className="text-4xl font-black tabular-nums">{running ? count : ''}</p>
          </div>
        </div>
        <p className="muted">{t('cravings:breathCycles', { count: cycles })}</p>
        <Button onClick={() => setRunning((r) => !r)}>
          {running ? t('cravings:pause') : t('cravings:start')}
        </Button>
        <Link to="/cravings" className="btn-ghost text-xs">
          {t('common:actions.back')}
        </Link>
      </div>
    </>
  );
}
