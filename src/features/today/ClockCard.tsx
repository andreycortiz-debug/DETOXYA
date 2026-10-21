import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Target } from 'lucide-react';
import type { QuitTarget } from '../../data/types';
import { daysBetween, elapsedParts } from '../../lib/time';
import { formatMoney, moneySaved, nextMilestone } from '../../lib/progress';
import { cx } from '../../lib/cx';

export function ClockCard({
  target,
  currency,
  locale,
}: {
  target: QuitTarget;
  currency: string;
  locale: string;
}) {
  const { t } = useTranslation(['sobriety', 'common']);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const days = daysBetween(target.startDate, now);
  const { hours, minutes, seconds } = elapsedParts(target.startDate, now);
  const next = nextMilestone(days);
  const milestoneLabel = next
    ? t('sobriety:nextMilestone', { days: next })
    : t('sobriety:allMilestones');
  const progress =
    next !== null ? Math.min(100, Math.max(0, ((days + hours / 24) / next) * 100)) : 100;
  const saved = moneySaved(target, days);

  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
            {t(`sobriety:goal_${target.goal}`)}
          </p>
          <h2 className="text-lg font-bold">{target.label}</h2>
        </div>
        <span className="chip bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
          <Target size={12} aria-hidden />
          {t('sobriety:cleanFor')}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black tracking-tight text-teal-700 dark:text-teal-300">
          {days}
        </span>
        <span className="muted">{t('common:time.days')}</span>
        <span className="ml-auto font-mono text-sm text-slate-600 dark:text-slate-300">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs">
          <span className="muted">{milestoneLabel}</span>
          <span className="muted">{Math.round(progress)}%</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {saved > 0 && (
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('sobriety:saved', { amount: formatMoney(saved, locale, currency) })}
        </p>
      )}
    </div>
  );
}

export function GoalChip({ goal }: { goal: QuitTarget['goal'] }) {
  const { t } = useTranslation('sobriety');
  return (
    <span
      className={cx('chip', 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300')}
    >
      {t(`sobriety:goal_${goal}`)}
    </span>
  );
}

export function UrgeCounterBadge({ count }: { count: number }) {
  const { t } = useTranslation('sobriety');
  return (
    <span className="chip bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <Flame size={12} aria-hidden />
      {t('sobriety:urgesRidden', { count })}
    </span>
  );
}
