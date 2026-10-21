import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Check } from 'lucide-react';
import { Button, Card, Field, PageHeader } from '../../components/ui';
import { db } from '../../data/db';
import { newId } from '../../lib/id';
import { detectCrisis } from '../../engine/crisis';
import { useCrisisStore } from '../../store/crisis';
import { CBT_LESSONS, CBT_SOURCES, MBRP_PRACTICES, MBRP_SOURCES } from '../../content/courses';
import { PAWS } from '../../content/paws';
import { SourcesList } from '../../components/SourcesList';
import { cx } from '../../lib/cx';

export function CbtCoursePage() {
  const { t, i18n } = useTranslation(['program', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  const progress = useLiveQuery(() => db.progress.toArray(), [], []);
  const doneIds = new Set(
    (progress ?? [])
      .filter((p) => p.courseId === 'cbt' && p.status === 'done')
      .map((p) => p.lessonId),
  );

  return (
    <>
      <PageHeader title={t('program:cbtTitle')} subtitle={t('program:cbtSubtitle')} />
      <div className="space-y-2">
        {CBT_LESSONS.map((lesson, idx) => (
          <Link
            key={lesson.id}
            to={`/program/cbt/${lesson.id}`}
            className="card flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-semibold">{lesson.title[lang]}</p>
              <p className="muted mt-0.5 line-clamp-2 text-xs">{lesson.summary[lang]}</p>
            </div>
            {doneIds.has(lesson.id) ? (
              <Check size={18} className="shrink-0 text-teal-600" aria-hidden />
            ) : (
              <span className="muted shrink-0 text-xs">{idx + 1}</span>
            )}
          </Link>
        ))}
        <SourcesList sources={CBT_SOURCES} />
      </div>
    </>
  );
}

export function CbtLessonPage() {
  const { lessonId } = useParams();
  const { t, i18n } = useTranslation(['program', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  const navigate = useNavigate();
  const openCrisis = useCrisisStore((s) => s.open);
  const lesson = CBT_LESSONS.find((l) => l.id === lessonId);
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  if (!lesson) {
    return (
      <>
        <PageHeader title={t('common:errors.notFound')} />
        <Link to="/program/cbt" className="btn-secondary">
          {t('common:actions.back')}
        </Link>
      </>
    );
  }

  async function complete() {
    const text = reflection.trim();
    if (text) {
      const crisis = detectCrisis(text);
      if (crisis.level !== 'none') openCrisis(crisis.level, 'cbt-reflection');
      await db.journal.add({
        id: newId(),
        date: Date.now(),
        kind: 'prompt',
        promptId: `cbt:${lesson!.id}`,
        text,
        mood: null,
      });
    }
    await db.progress.put({
      id: `cbt:${lesson!.id}`,
      courseId: 'cbt',
      lessonId: lesson!.id,
      status: 'done',
      updatedAt: Date.now(),
    });
    setSaved(true);
    const idx = CBT_LESSONS.findIndex((l) => l.id === lesson!.id);
    const next = CBT_LESSONS[idx + 1];
    window.setTimeout(() => {
      if (next) navigate(`/program/cbt/${next.id}`);
      else navigate('/program/cbt');
    }, 600);
  }

  const nextIdx = CBT_LESSONS.findIndex((l) => l.id === lesson.id) + 1;
  const nextLesson = CBT_LESSONS[nextIdx];

  return (
    <>
      <PageHeader title={lesson.title[lang]} subtitle={lesson.summary[lang]} />
      <div className="space-y-4">
        <Card className="space-y-2">
          <h2 className="text-base font-semibold">{t('program:keyPoints')}</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {lesson.keyPoints[lang].map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-2">
          <h2 className="text-base font-semibold">{t('program:exercise')}</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">{lesson.exercise[lang]}</p>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-base font-semibold">{t('program:reflection')}</h2>
          <p className="muted text-sm">{lesson.reflection[lang]}</p>
          <Field label={t('program:reflectionLabel')} htmlFor="reflection">
            <textarea
              id="reflection"
              className="input min-h-24"
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </Field>
          <Button
            className={cx('w-full', saved && 'bg-teal-700')}
            onClick={() => void complete()}
            disabled={saved}
          >
            {saved ? t('common:actions.done') : t('program:markDone')}
          </Button>
          {nextLesson && (
            <Link to={`/program/cbt/${nextLesson.id}`} className="btn-ghost w-full text-xs">
              {t('program:nextLesson')}
            </Link>
          )}
        </Card>

        <SourcesList sources={CBT_SOURCES} />
      </div>
    </>
  );
}

export function MbrpPage() {
  const { t, i18n } = useTranslation(['program', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  return (
    <>
      <PageHeader title={t('program:mbrpTitle')} subtitle={t('program:mbrpSubtitle')} />
      <div className="space-y-2">
        {MBRP_PRACTICES.map((p) => (
          <Link
            key={p.id}
            to={`/program/mbrp/${p.id}`}
            className="card flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-semibold">{p.title[lang]}</p>
              <p className="muted mt-0.5 line-clamp-2 text-xs">{p.intro[lang]}</p>
            </div>
            <span className="chip shrink-0 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              {p.minutes} min
            </span>
          </Link>
        ))}
        <SourcesList sources={MBRP_SOURCES} />
      </div>
    </>
  );
}

export function MbrpPracticePage() {
  const { practiceId } = useParams();
  const { t, i18n } = useTranslation(['program', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  const navigate = useNavigate();
  const practice = MBRP_PRACTICES.find((p) => p.id === practiceId);
  const [step, setStep] = useState(0);

  if (!practice) {
    return (
      <>
        <PageHeader title={t('common:errors.notFound')} />
        <Link to="/program/mbrp" className="btn-secondary">
          {t('common:actions.back')}
        </Link>
      </>
    );
  }

  const steps = practice.steps[lang];
  const isLast = step >= steps.length - 1;

  return (
    <>
      <PageHeader
        title={practice.title[lang]}
        subtitle={`${practice.minutes} min · ${t('program:practiceStep', { n: step + 1, total: steps.length })}`}
      />
      <div className="space-y-4">
        <p className="muted text-sm">{practice.intro[lang]}</p>
        <Card className="min-h-32">
          <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100">
            {steps[step]}
          </p>
        </Card>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            {t('common:actions.back')}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (!isLast) setStep((s) => s + 1);
              else {
                void db.progress.put({
                  id: `mbrp:${practice.id}`,
                  courseId: 'mbrp',
                  lessonId: practice.id,
                  status: 'done',
                  updatedAt: Date.now(),
                });
                navigate('/program/mbrp');
              }
            }}
          >
            {isLast ? t('common:actions.done') : t('program:practiceNext')}
          </Button>
        </div>
        <Link to="/program/mbrp" className="btn-ghost w-full text-xs">
          {t('common:actions.close')}
        </Link>
      </div>
    </>
  );
}

export function PawsPage() {
  const { t, i18n } = useTranslation(['program', 'common']);
  const lang = i18n.language === 'en' ? 'en' : 'es';
  return (
    <>
      <PageHeader title={PAWS.title[lang]} subtitle={t('program:pawsSubtitle')} />
      <div className="space-y-4">
        <Card>
          <p className="text-sm text-slate-700 dark:text-slate-300">{PAWS.what[lang]}</p>
        </Card>
        <Card>
          <h2 className="mb-2 text-base font-semibold">{t('program:windowsWaves')}</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">{PAWS.waves[lang]}</p>
        </Card>
        <Card>
          <h2 className="mb-2 text-base font-semibold">{t('program:commonSymptoms')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {PAWS.symptoms[lang].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-2 text-base font-semibold">{t('program:copePaws')}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {PAWS.coping[lang].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
        <div className="banner-warning">{PAWS.note[lang]}</div>
        <SourcesList sources={PAWS.sources} />
      </div>
    </>
  );
}
