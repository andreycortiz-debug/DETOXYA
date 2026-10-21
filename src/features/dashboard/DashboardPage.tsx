import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, PageHeader } from '../../components/ui';
import { db } from '../../data/db';
import { daysBetween, startOfDay } from '../../lib/time';
import { formatMoney, moneySaved } from '../../lib/progress';
import { cx } from '../../lib/cx';
import { useActiveTargets, useProfile } from '../profile/useProfile';

const HEATMAP_DAYS = 30;
const WINDOW_DAYS = 14;

function daysAgoStart(count: number): number {
  return startOfDay(Date.now() - (count - 1) * 24 * 60 * 60 * 1000);
}

export function DashboardPage() {
  const { t, i18n } = useTranslation(['dashboard', 'nav', 'common', 'halt']);
  const profile = useProfile();
  const targets = useActiveTargets();

  const since30 = daysAgoStart(HEATMAP_DAYS);
  const since14 = daysAgoStart(WINDOW_DAYS);

  const urges = useLiveQuery(
    () => db.urges.where('date').aboveOrEqual(since30).toArray(),
    [since30],
    [],
  );
  const halts = useLiveQuery(
    () => db.halts.where('date').aboveOrEqual(since14).toArray(),
    [since14],
    [],
  );
  const reviewCount = useLiveQuery(() => db.reviews.count(), [], 0);
  const allUrges = useLiveQuery(() => db.urges.count(), [], 0);

  const heatmap = useMemo(() => {
    const counts = new Map<number, number>();
    for (const u of urges ?? []) {
      const day = startOfDay(u.date);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    return Array.from({ length: HEATMAP_DAYS }, (_, i) => {
      const day = startOfDay(Date.now() - (HEATMAP_DAYS - 1 - i) * 24 * 60 * 60 * 1000);
      return { day, count: counts.get(day) ?? 0 };
    });
  }, [urges]);

  const intensitySeries = useMemo(
    () =>
      (urges ?? [])
        .slice()
        .sort((a, b) => a.date - b.date)
        .slice(-14)
        .map((u, i) => ({
          n: i + 1,
          before: u.intensityBefore,
          after: u.intensityAfter,
        })),
    [urges],
  );

  const haltAvg = useMemo(() => {
    const list = halts ?? [];
    if (list.length === 0) return null;
    const avg = (pick: (h: (typeof list)[number]) => number) =>
      Math.round((list.reduce((s, h) => s + pick(h), 0) / list.length) * 10) / 10;
    return {
      hunger: avg((h) => h.hunger),
      anger: avg((h) => h.anger),
      loneliness: avg((h) => h.loneliness),
      tiredness: avg((h) => h.tiredness),
      craving: avg((h) => h.craving),
      sample: list.length,
    };
  }, [halts]);

  const triggerTop = useMemo(() => {
    const counts = new Map<string, number>();
    for (const u of urges ?? []) {
      const key = (u.trigger ?? '').trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [urges]);

  const cleanDays = targets?.length
    ? Math.max(...targets.map((x) => daysBetween(x.startDate, Date.now())))
    : 0;
  const saved = (targets ?? []).reduce(
    (sum, x) => sum + moneySaved(x, daysBetween(x.startDate, Date.now())),
    0,
  );

  const hasData = intensitySeries.length > 0 || (halts ?? []).length > 0;

  return (
    <>
      <PageHeader title={t('nav:dashboard')} subtitle={t('dashboard:subtitle')} />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Stat
            label={t('dashboard:statsClean')}
            value={`${cleanDays}`}
            unit={t(`dashboard:${cleanDays === 1 ? 'day' : 'days'}`)}
          />
          <Stat label={t('dashboard:statsUrges')} value={`${allUrges ?? 0}`} />
          <Stat
            label={t('dashboard:statsSaved')}
            value={saved > 0 ? formatMoney(saved, i18n.language, profile?.currency ?? 'EUR') : '—'}
          />
          <Stat label={t('dashboard:statsReviews')} value={`${reviewCount ?? 0}`} />
        </div>

        <Card className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('dashboard:heatmapTitle')}
          </h2>
          <div
            className="grid grid-cols-10 gap-1"
            role="img"
            aria-label={t('dashboard:heatmapTitle')}
          >
            {heatmap.map((cell) => (
              <div
                key={cell.day}
                title={`${new Date(cell.day).toLocaleDateString()}: ${cell.count}`}
                className={cx(
                  'aspect-square rounded-[4px]',
                  cell.count === 0
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : cell.count === 1
                      ? 'bg-amber-300 dark:bg-amber-700'
                      : cell.count === 2
                        ? 'bg-amber-500 dark:bg-amber-500'
                        : 'bg-amber-700 dark:bg-amber-300',
                )}
              />
            ))}
          </div>
          <p className="muted text-xs">{t('dashboard:heatmapHint')}</p>
        </Card>

        {!hasData && <Card className="muted">{t('dashboard:noData')}</Card>}

        {intensitySeries.length > 1 && (
          <Card className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('dashboard:intensityTitle')}
            </h2>
            <IntensitySparkline data={intensitySeries} />
            <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-amber-500" aria-hidden />
                {t('dashboard:intensityBefore')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-teal-600" aria-hidden />
                {t('dashboard:intensityAfter')}
              </span>
            </div>
            <p className="muted text-xs">{t('dashboard:intensityHint')}</p>
          </Card>
        )}

        {haltAvg && (
          <Card className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('dashboard:haltTitle')}
            </h2>
            {(
              [
                ['hunger', haltAvg.hunger],
                ['anger', haltAvg.anger],
                ['loneliness', haltAvg.loneliness],
                ['tiredness', haltAvg.tiredness],
                ['craving', haltAvg.craving],
              ] as const
            ).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="w-24 shrink-0 text-slate-600 dark:text-slate-300">
                  {t(`halt:${key}`)}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={cx(
                      'h-full rounded-full',
                      value >= 3 ? 'bg-amber-500' : 'bg-teal-500',
                    )}
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-slate-500">{value}</span>
              </div>
            ))}
            <p className="muted text-xs">{t('dashboard:haltHint')}</p>
          </Card>
        )}

        <Card className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('dashboard:triggersTitle')}
          </h2>
          {triggerTop.length === 0 ? (
            <p className="muted text-sm">{t('dashboard:emptyTriggers')}</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {triggerTop.map(([name, count]) => (
                <li key={name} className="flex items-center justify-between gap-2">
                  <span className="truncate text-slate-700 dark:text-slate-300">{name}</span>
                  <span className="chip bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <Card className="!p-3">
      <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-teal-700 dark:text-teal-300">
        {value}
        {unit ? <span className="ml-1 text-xs font-medium text-slate-500">{unit}</span> : null}
      </p>
    </Card>
  );
}

type IntensityPoint = { n: number; before: number; after: number };

/** Sparkline SVG sin dependencias: intensidad 0-10 antes/después de cada antojo. */
function IntensitySparkline({ data }: { data: IntensityPoint[] }) {
  const W = 320;
  const H = 140;
  const PAD = 8;
  const max = 10;
  const toX = (i: number) => PAD + (i / Math.max(1, data.length - 1)) * (W - 2 * PAD);
  const toY = (v: number) => H - PAD - (Math.min(max, Math.max(0, v)) / max) * (H - 2 * PAD);
  const path = (key: 'before' | 'after') =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d[key]).toFixed(1)}`)
      .join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-44 w-full"
      role="img"
      aria-hidden
      preserveAspectRatio="none"
    >
      {[0, 2, 4, 6, 8, 10].map((tick) => (
        <line
          key={tick}
          x1={PAD}
          x2={W - PAD}
          y1={toY(tick)}
          y2={toY(tick)}
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={1}
        />
      ))}
      <path d={path('before')} fill="none" stroke="#f59e0b" strokeWidth={2} />
      <path d={path('after')} fill="none" stroke="#0d9488" strokeWidth={2} />
    </svg>
  );
}
