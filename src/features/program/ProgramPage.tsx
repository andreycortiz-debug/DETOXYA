import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Brain, CalendarClock, Waves } from 'lucide-react';
import { Card, PageHeader } from '../../components/ui';
import { db } from '../../data/db';
import { CBT_LESSONS, MBRP_PRACTICES } from '../../content/courses';
import { useActiveTargets } from '../profile/useProfile';
import { getWithdrawal } from '../../content/withdrawal';

export function ProgramPage() {
  const { t } = useTranslation(['program', 'common']);
  const targets = useActiveTargets();
  const progress = useLiveQuery(() => db.progress.toArray(), [], []);

  const cbtDone = (progress ?? []).filter(
    (p) => p.courseId === 'cbt' && p.status === 'done',
  ).length;

  const withInfo = (targets ?? [])
    .map((target) => ({ target, info: getWithdrawal(target.substanceId) }))
    .filter((x) => x.info);

  return (
    <>
      <PageHeader title={t('nav:program')} subtitle={t('program:subtitle')} />
      <div className="space-y-4">
        {withInfo.length > 0 && (
          <Link to="/program/withdrawal" className="card flex items-center gap-3">
            <CalendarClock size={22} className="shrink-0 text-teal-600" aria-hidden />
            <div>
              <p className="font-semibold">{t('program:withdrawalTitle')}</p>
              <p className="muted text-xs">{t('program:withdrawalBody')}</p>
            </div>
          </Link>
        )}

        <Link to="/program/paws" className="card flex items-center gap-3">
          <Waves size={22} className="shrink-0 text-sky-600" aria-hidden />
          <div>
            <p className="font-semibold">{t('program:pawsTitle')}</p>
            <p className="muted text-xs">{t('program:pawsBody')}</p>
          </div>
        </Link>

        <Link to="/program/cbt" className="card flex items-center gap-3">
          <Brain size={22} className="shrink-0 text-teal-600" aria-hidden />
          <div>
            <p className="font-semibold">{t('program:cbtTitle')}</p>
            <p className="muted text-xs">
              {t('program:cbtProgress', { done: cbtDone, total: CBT_LESSONS.length })}
            </p>
          </div>
        </Link>

        <Link to="/program/mbrp" className="card flex items-center gap-3">
          <Waves size={22} className="shrink-0 text-teal-600" aria-hidden />
          <div>
            <p className="font-semibold">{t('program:mbrpTitle')}</p>
            <p className="muted text-xs">
              {t('program:mbrpBody', { count: MBRP_PRACTICES.length })}
            </p>
          </div>
        </Link>

        <Link to="/paths" className="card flex items-center gap-3">
          <CalendarClock size={22} className="shrink-0 text-amber-600" aria-hidden />
          <div>
            <p className="font-semibold">{t('program:pathsTitle')}</p>
            <p className="muted text-xs">{t('program:pathsBody')}</p>
          </div>
        </Link>

        <div className="banner-warning">{t('program:notMedical')}</div>
      </div>
    </>
  );
}

export function WithdrawalPage() {
  const { t, i18n } = useTranslation(['program', 'safety']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  const targets = useActiveTargets() ?? [];

  const entries = targets
    .map((target) => ({ target, info: getWithdrawal(target.substanceId) }))
    .filter(
      (
        x,
      ): x is {
        target: (typeof targets)[number];
        info: NonNullable<ReturnType<typeof getWithdrawal>>;
      } => Boolean(x.info),
    );

  return (
    <>
      <PageHeader title={t('program:withdrawalTitle')} subtitle={t('program:withdrawalSubtitle')} />
      <div className="banner-warning mb-4">{t('safety:notMedical.body')}</div>
      <div className="space-y-4">
        {entries.map(({ target, info }) => (
          <Card key={target.id} className="space-y-2">
            <h2 className="text-base font-bold">{target.label}</h2>
            <dl className="space-y-1.5 text-sm">
              <div>
                <dt className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('program:onset')}
                </dt>
                <dd className="muted">{info.onset[lang]}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('program:peak')}
                </dt>
                <dd className="muted">{info.peak[lang]}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('program:duration')}
                </dt>
                <dd className="muted">{info.duration[lang]}</dd>
              </div>
            </dl>
            <div className="banner-danger">{info.dangers[lang]}</div>
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('program:pawsShort')}
              </p>
              <p className="muted text-sm">{info.paws[lang]}</p>
            </div>
          </Card>
        ))}
        {entries.length === 0 && (
          <Card>
            <p className="muted">{t('program:noWithdrawalEntries')}</p>
          </Card>
        )}
      </div>
    </>
  );
}
