import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { Button, Card, PageHeader, RangeField } from '../../components/ui';
import { db } from '../../data/db';
import { newId } from '../../lib/id';
import { DAY_MS, startOfDay } from '../../lib/time';
import type { HaltCheck } from '../../data/types';

const DIMENSIONS = [
  { key: 'hunger', labelKey: 'halt:hunger', actionKey: 'halt:actionHunger' },
  { key: 'anger', labelKey: 'halt:anger', actionKey: 'halt:actionAnger' },
  { key: 'loneliness', labelKey: 'halt:loneliness', actionKey: 'halt:actionLoneliness' },
  { key: 'tiredness', labelKey: 'halt:tiredness', actionKey: 'halt:actionTiredness' },
] as const;

type DimKey = (typeof DIMENSIONS)[number]['key'];

export function HaltPage() {
  const { t } = useTranslation(['halt', 'common', 'safety']);
  const [values, setValues] = useState<Record<DimKey, number>>({
    hunger: 0,
    anger: 0,
    loneliness: 0,
    tiredness: 0,
  });
  const [craving, setCraving] = useState(0);
  const [saved, setSaved] = useState(false);

  const recent = useLiveQuery(
    async (): Promise<HaltCheck[]> => {
      const cutoff = startOfDay() - 7 * DAY_MS;
      return db.halts.where('date').above(cutoff).toArray();
    },
    [],
    [],
  );

  const averages = useMemo(() => {
    const list = recent ?? [];
    if (list.length === 0) return null;
    const sum = (k: DimKey) => list.reduce((acc, r) => acc + r[k], 0) / list.length;
    return {
      hunger: sum('hunger'),
      anger: sum('anger'),
      loneliness: sum('loneliness'),
      tiredness: sum('tiredness'),
      count: list.length,
    };
  }, [recent]);

  const hotDimensions = DIMENSIONS.filter((d) => values[d.key] >= 4);

  async function save() {
    await db.halts.add({
      id: newId(),
      date: Date.now(),
      hunger: values.hunger,
      anger: values.anger,
      loneliness: values.loneliness,
      tiredness: values.tiredness,
      craving,
      note: null,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <PageHeader title={t('halt:title')} subtitle={t('halt:subtitle')} />
      <div className="space-y-4">
        <div className="banner-warning">
          {t('halt:safetyNote')}{' '}
          <Link to="/help" className="font-semibold underline">
            {t('safety:crisis.title')}
          </Link>
        </div>
        <Card className="space-y-4">
          {DIMENSIONS.map((d) => (
            <RangeField
              key={d.key}
              label={t(d.labelKey)}
              value={values[d.key]}
              min={0}
              max={5}
              onChange={(v) => setValues((prev) => ({ ...prev, [d.key]: v }))}
            />
          ))}
          <RangeField
            label={t('halt:craving')}
            value={craving}
            min={0}
            max={5}
            onChange={setCraving}
          />
          <Button className="w-full" onClick={() => void save()}>
            {saved ? t('halt:saved') : t('halt:save')}
          </Button>
        </Card>

        {hotDimensions.length > 0 && (
          <Card className="space-y-3">
            <h2 className="text-base font-semibold">{t('halt:actionsTitle')}</h2>
            <p className="muted">{t('halt:actionsBody')}</p>
            {hotDimensions.map((d) => (
              <div key={d.key} className="rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
                <p className="font-semibold text-amber-900 dark:text-amber-100">{t(d.labelKey)}</p>
                <p className="mt-1 text-amber-900/90 dark:text-amber-100/90">{t(d.actionKey)}</p>
              </div>
            ))}
            {values.tiredness >= 4 || craving >= 4 ? (
              <Link to="/cravings/surf?minutes=3" className="btn-primary w-full">
                {t('halt:surfCta')}
              </Link>
            ) : null}
          </Card>
        )}

        {averages && (
          <Card className="space-y-2">
            <h2 className="text-base font-semibold">{t('halt:patternTitle')}</h2>
            <p className="muted">{t('halt:patternBody', { count: averages.count })}</p>
            {DIMENSIONS.map((d) => (
              <div key={d.key}>
                <div className="mb-0.5 flex justify-between text-xs">
                  <span>{t(d.labelKey)}</span>
                  <span className="muted">{averages[d.key].toFixed(1)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${(averages[d.key] / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        )}

        <p className="muted text-center text-xs">{t('halt:footer')}</p>
      </div>
    </>
  );
}
