import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft, Phone } from 'lucide-react';
import { Button, Card, Field } from '../../components/ui';
import { cx } from '../../lib/cx';
import { newId } from '../../lib/id';
import { todayKey } from '../../lib/time';
import { db } from '../../data/db';
import type { Goal, ScreeningToolResult } from '../../data/types';
import { SUBSTANCES } from '../../content/substances';
import { assessSafety } from '../../engine/safety';
import { scoreAuditC, scoreCageAid, scorePhq9, type Sex } from '../../engine/screening';
import { useCrisisStore } from '../../store/crisis';
import { emergencyPhoneFor } from '../help/resources';
import {
  AUDIT_C_QUESTIONS,
  CAGE_AID_QUESTIONS,
  COUNTRY_OPTIONS,
  DEP_FLAG_QUESTIONS,
  PHQ9_QUESTIONS,
  type WizardQuestion,
} from './instruments';

const DISCLAIMER_VERSION = '1.0';

type StepId =
  | 'welcome'
  | 'country'
  | 'goal'
  | 'substances'
  | 'details'
  | 'screeningIntro'
  | 'auditC'
  | 'cageAid'
  | 'depFlags'
  | 'phq9'
  | 'risk'
  | 'pledge';

interface SelectedTarget {
  substanceId: string;
  label: string;
  dailyUnits: number;
  unitPrice: number;
}

interface FormState {
  country: string | null;
  goal: Goal | null;
  customLabel: string;
  includeCustom: boolean;
  selected: Record<string, SelectedTarget>;
  sex: Sex | null | undefined;
  answers: Record<string, number>;
  disclaimerAck: boolean;
  gateMedicalAck: boolean;
  gateOpioidAck: boolean;
  crisisAck: boolean;
  pledgeReasons: string;
}

const INITIAL: FormState = {
  country: null,
  goal: null,
  customLabel: '',
  includeCustom: false,
  selected: {},
  sex: null,
  answers: {},
  disclaimerAck: false,
  gateMedicalAck: false,
  gateOpioidAck: false,
  crisisAck: false,
  pledgeReasons: '',
};

function detectCurrency(): string {
  try {
    return Intl.NumberFormat().resolvedOptions().currency || 'USD';
  } catch {
    return 'USD';
  }
}

export function OnboardingPage() {
  const { t, i18n } = useTranslation(['onboarding', 'safety', 'common']);
  const navigate = useNavigate();
  const openCrisis = useCrisisStore((s) => s.open);
  const crisisOpened = useRef(false);
  const saving = useRef(false);

  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);

  const selectedList = useMemo(() => Object.values(form.selected), [form.selected]);
  const substanceSelected = selectedList.some(
    (s) => SUBSTANCES.find((x) => x.id === s.substanceId)?.kind === 'substance',
  );
  const hasAlcohol = selectedList.some((s) => s.substanceId === 'alcohol');
  // Dep-flags se preguntan a cualquiera con cualquier sustancia, no solo gated:
  // así no se evade el gate médico marcando nicotina.
  const needsDepFlags = substanceSelected;
  const suicidality = (form.answers['phq-9-9'] ?? 0) >= 1;

  const screeningResults = useMemo<ScreeningToolResult[]>(() => {
    const now = Date.now();
    const results: ScreeningToolResult[] = [];
    const pick = (ids: readonly string[]) => {
      const out: Record<string, number> = {};
      for (const id of ids) out[id] = form.answers[id] ?? 0;
      return out;
    };
    if (hasAlcohol) {
      const answers = pick(AUDIT_C_QUESTIONS.map((q) => q.id));
      results.push({
        id: newId(),
        tool: 'audit-c',
        date: now,
        answers,
        score: scoreAuditC(answers, form.sex).score,
        positive: scoreAuditC(answers, form.sex).positive,
      });
    }
    if (substanceSelected) {
      const answers = pick(CAGE_AID_QUESTIONS.map((q) => q.id));
      results.push({
        id: newId(),
        tool: 'cage-aid',
        date: now,
        answers,
        ...scoreCageAid(answers),
      });
    }
    if (needsDepFlags) {
      const answers = pick(DEP_FLAG_QUESTIONS.map((q) => q.id));
      results.push({
        id: newId(),
        tool: 'dep-flags',
        date: now,
        answers,
        score: Object.values(answers).filter((v) => v >= 1).length,
        positive: Object.values(answers).some((v) => v >= 1),
      });
    }
    const phqAnswers = pick(PHQ9_QUESTIONS.map((q) => q.id));
    results.push({
      id: newId(),
      tool: 'phq-9',
      date: now,
      answers: phqAnswers,
      ...(() => {
        const r = scorePhq9(phqAnswers);
        return { score: r.score, positive: r.positive };
      })(),
    });
    return results;
  }, [form.answers, form.sex, hasAlcohol, needsDepFlags, substanceSelected]);

  const assessment = useMemo(
    () =>
      assessSafety({
        targetSubstanceIds: selectedList.map((s) => s.substanceId),
        screening: screeningResults,
      }),
    [selectedList, screeningResults],
  );

  const steps = useMemo<StepId[]>(() => {
    const list: StepId[] = [
      'welcome',
      'country',
      'goal',
      'substances',
      'details',
      'screeningIntro',
    ];
    if (hasAlcohol) list.push('auditC');
    if (substanceSelected) list.push('cageAid');
    if (needsDepFlags) list.push('depFlags');
    list.push('phq9');
    if (assessment.gates.length > 0 || suicidality) list.push('risk');
    list.push('pledge');
    return list;
  }, [hasAlcohol, substanceSelected, needsDepFlags, assessment.gates.length, suicidality]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  useEffect(() => {
    if (suicidality && !crisisOpened.current) {
      crisisOpened.current = true;
      openCrisis('active', 'onboarding-phq9');
    }
  }, [suicidality, openCrisis]);

  function toggleSubstance(id: string) {
    setForm((f) => {
      const next = { ...f.selected };
      if (next[id]) {
        delete next[id];
      } else {
        const info = SUBSTANCES.find((s) => s.id === id);
        next[id] = {
          substanceId: id,
          label: info ? info.labels[i18n.language === 'en' ? 'en' : 'es'] : id,
          dailyUnits: info?.defaultDailyUnits ?? 1,
          unitPrice: info?.defaultUnitPrice ?? 0,
        };
      }
      return { ...f, selected: next };
    });
  }

  function updateTarget(id: string, patch: Partial<SelectedTarget>) {
    setForm((f) => ({
      ...f,
      selected: { ...f.selected, [id]: { ...f.selected[id], ...patch } },
    }));
  }

  function answerOne(questionId: string, value: number) {
    setForm((f) => ({ ...f, answers: { ...f.answers, [questionId]: value } }));
  }

  function canContinue(): boolean {
    switch (step) {
      case 'welcome':
        return form.disclaimerAck;
      case 'country':
        return form.country !== null;
      case 'goal':
        return form.goal !== null;
      case 'substances':
        return selectedList.length > 0;
      case 'details':
        return selectedList.every(
          (s) => Number.isFinite(s.dailyUnits) && s.dailyUnits >= 0 && s.unitPrice >= 0,
        );
      case 'screeningIntro':
        return form.sex !== undefined;
      case 'auditC':
        return AUDIT_C_QUESTIONS.every((q) => form.answers[q.id] !== undefined);
      case 'cageAid':
        return CAGE_AID_QUESTIONS.every((q) => form.answers[q.id] !== undefined);
      case 'depFlags':
        return DEP_FLAG_QUESTIONS.every((q) => form.answers[q.id] !== undefined);
      case 'phq9':
        return PHQ9_QUESTIONS.every((q) => form.answers[q.id] !== undefined);
      case 'risk': {
        const needMedical =
          assessment.gates.includes('medical-detox') && form.gateMedicalAck !== true;
        const needOpioid =
          assessment.gates.includes('opioid-overdose') && form.gateOpioidAck !== true;
        const needCrisis = suicidality && form.crisisAck !== true;
        return !needMedical && !needOpioid && !needCrisis;
      }
      case 'pledge':
        return true;
    }
  }

  async function complete() {
    if (saving.current) return;
    saving.current = true;
    const now = Date.now();
    const targets = selectedList.map((s) => ({
      id: newId(),
      substanceId: s.substanceId,
      label: s.label.trim() || s.substanceId,
      kind: (SUBSTANCES.find((x) => x.id === s.substanceId)?.kind ?? 'substance') as
        'substance' | 'habit',
      goal: form.goal ?? 'undecided',
      startDate: now,
      endDate: null,
      unitPrice: s.unitPrice,
      dailyUnits: s.dailyUnits,
      createdAt: now,
    }));
    try {
      await db.transaction(
        'rw',
        [db.profile, db.quitTargets, db.screening, db.acks, db.pledges, db.events],
        async () => {
          await db.profile.put({
            id: 'current',
            locale: i18n.language,
            country: form.country === 'none' || form.country === null ? null : form.country,
            currency: detectCurrency(),
            createdAt: now,
            onboardedAt: now,
          });
          await db.quitTargets.bulkPut(targets);
          await db.screening.add({ id: newId(), date: now, results: screeningResults });
          await db.acks.put({ id: 'disclaimer', date: now, version: DISCLAIMER_VERSION });
          if (assessment.gates.includes('medical-detox') && form.gateMedicalAck) {
            await db.acks.put({ id: 'medical-detox', date: now, version: DISCLAIMER_VERSION });
            await db.events.add({
              id: newId(),
              date: now,
              kind: 'gate-ack',
              targetId: null,
              message: 'medical-detox',
            });
          }
          if (assessment.gates.includes('opioid-overdose') && form.gateOpioidAck) {
            await db.acks.put({ id: 'opioid-overdose', date: now, version: DISCLAIMER_VERSION });
          }
          if (suicidality) {
            await db.acks.put({ id: 'crisis-plan', date: now, version: DISCLAIMER_VERSION });
            await db.events.add({
              id: newId(),
              date: now,
              kind: 'crisis',
              targetId: null,
              message: 'onboarding-phq9',
            });
          }
          const reasons = form.pledgeReasons.trim();
          if (reasons) {
            await db.pledges.put({
              date: todayKey(),
              reasons,
              photoDataUrl: null,
              updatedAt: now,
            });
          }
          await db.events.add({
            id: newId(),
            date: now,
            kind: 'milestone',
            targetId: null,
            message: 'onboarding-complete',
          });
        },
      );
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
      saving.current = false;
    }
  }

  function next() {
    if (step === 'pledge') {
      void complete();
      return;
    }
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setStepIdx((i) => Math.max(0, i - 1));
  }

  const emergency = emergencyPhoneFor(form.country);
  const lang = i18n.language === 'en' ? 'en' : 'es';

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pt-6 pb-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="" width={32} height={32} className="rounded-xl" />
          <span className="font-bold">DETOXYA</span>
        </div>
        <span className="muted text-xs">
          {stepIdx + 1} / {steps.length}
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-teal-600 transition-all"
          style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1">
        {step === 'welcome' && (
          <section className="space-y-4">
            <h1 className="page-title">{t('onboarding:welcomeTitle')}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('onboarding:welcomeBody')}
            </p>
            <div className="flex gap-2">
              {(['es', 'en'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => void i18n.changeLanguage(code)}
                  className={cx(
                    'btn-secondary flex-1',
                    lang === code && '!bg-teal-600 !text-white',
                  )}
                >
                  {code === 'es' ? 'Español' : 'English'}
                </button>
              ))}
            </div>
            <div className="banner-warning">
              <p className="mb-2 font-semibold">{t('safety:notMedical.title')}</p>
              <p>{t('safety:notMedical.body')}</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, disclaimerAck: !f.disclaimerAck }))}
              className={cx(
                'flex w-full items-start gap-3 rounded-xl p-3 text-left text-sm ring-1 transition',
                form.disclaimerAck
                  ? 'bg-teal-50 ring-teal-600 dark:bg-teal-950/50'
                  : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700',
              )}
            >
              <span
                className={cx(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                  form.disclaimerAck
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-slate-400',
                )}
              >
                {form.disclaimerAck && <Check size={14} aria-hidden />}
              </span>
              {t('onboarding:disclaimerAck')}
            </button>
          </section>
        )}

        {step === 'country' && (
          <section className="space-y-4">
            <h1 className="page-title">{t('onboarding:countryTitle')}</h1>
            <p className="muted">{t('onboarding:countryBody')}</p>
            <Field label={t('onboarding:countryLabel')} htmlFor="country">
              <select
                id="country"
                className="input"
                value={form.country ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    country: e.target.value === '' ? 'none' : e.target.value,
                  }))
                }
              >
                <option value="none">{t('onboarding:countryPreferNot')}</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {t(c.labelKey)}
                  </option>
                ))}
              </select>
            </Field>
            {emergency && (
              <div className="banner-warning flex items-center gap-2">
                <Phone size={18} aria-hidden />
                {t('onboarding:emergencyNote', { number: emergency })}
              </div>
            )}
          </section>
        )}

        {step === 'goal' && (
          <section className="space-y-3">
            <h1 className="page-title">{t('onboarding:goalTitle')}</h1>
            <p className="muted">{t('onboarding:goalBody')}</p>
            {(
              [
                {
                  id: 'abstinence',
                  title: 'onboarding:goalAbstinence',
                  body: 'onboarding:goalAbstinenceBody',
                },
                {
                  id: 'moderation',
                  title: 'onboarding:goalModeration',
                  body: 'onboarding:goalModerationBody',
                },
                { id: 'taper', title: 'onboarding:goalTaper', body: 'onboarding:goalTaperBody' },
                {
                  id: 'undecided',
                  title: 'onboarding:goalUndecided',
                  body: 'onboarding:goalUndecidedBody',
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, goal: opt.id }))}
                className={cx(
                  'w-full rounded-xl p-3.5 text-left ring-1 transition',
                  form.goal === opt.id
                    ? 'bg-teal-50 ring-2 ring-teal-600 dark:bg-teal-950/50'
                    : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700',
                )}
              >
                <span className="block font-semibold">{t(opt.title)}</span>
                <span className="muted mt-0.5 block">{t(opt.body)}</span>
              </button>
            ))}
            {form.goal === 'taper' && (
              <div className="banner-warning">{t('safety:taperNotice')}</div>
            )}
          </section>
        )}

        {step === 'substances' && (
          <section className="space-y-4">
            <h1 className="page-title">{t('onboarding:substancesTitle')}</h1>
            <p className="muted">{t('onboarding:substancesBody')}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SUBSTANCES.map((s) => {
                const selected = Boolean(form.selected[s.id]);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSubstance(s.id)}
                    className={cx(
                      'rounded-xl px-3 py-2.5 text-left text-sm font-medium ring-1 transition',
                      selected
                        ? 'bg-teal-600 text-white ring-teal-600'
                        : 'bg-white text-slate-700 ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700',
                    )}
                  >
                    {s.labels[lang]}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  setForm((f) => {
                    const includeCustom = !f.includeCustom;
                    const selected = { ...f.selected };
                    if (includeCustom) {
                      selected['custom'] = {
                        substanceId: 'custom',
                        label: f.customLabel || t('onboarding:customDefault'),
                        dailyUnits: 1,
                        unitPrice: 0,
                      };
                    } else {
                      delete selected['custom'];
                    }
                    return { ...f, includeCustom, selected };
                  })
                }
                className={cx(
                  'rounded-xl px-3 py-2.5 text-left text-sm font-medium ring-1 transition',
                  form.includeCustom
                    ? 'bg-teal-600 text-white ring-teal-600'
                    : 'bg-white text-slate-700 ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700',
                )}
              >
                {t('onboarding:customOther')}
              </button>
            </div>
            {form.includeCustom && (
              <Field label={t('onboarding:customLabel')} htmlFor="custom-label">
                <input
                  id="custom-label"
                  className="input"
                  value={form.customLabel}
                  maxLength={40}
                  onChange={(e) => {
                    const label = e.target.value;
                    setForm((f) => ({
                      ...f,
                      customLabel: label,
                      selected: {
                        ...f.selected,
                        custom: {
                          substanceId: 'custom',
                          label: label || t('onboarding:customDefault'),
                          dailyUnits: f.selected.custom?.dailyUnits ?? 1,
                          unitPrice: f.selected.custom?.unitPrice ?? 0,
                        },
                      },
                    }));
                  }}
                />
              </Field>
            )}
          </section>
        )}

        {step === 'details' && (
          <section className="space-y-4">
            <h1 className="page-title">{t('onboarding:detailsTitle')}</h1>
            <p className="muted">{t('onboarding:detailsBody')}</p>
            {selectedList.map((s) => {
              const info = SUBSTANCES.find((x) => x.id === s.substanceId);
              const unitLabel = info ? info.units[lang] : t('onboarding:unit');
              return (
                <Card key={s.substanceId} className="space-y-3">
                  <p className="font-semibold">{s.label}</p>
                  <Field
                    label={t('onboarding:dailyUnitsLabel', { units: unitLabel })}
                    htmlFor={`units-${s.substanceId}`}
                  >
                    <input
                      id={`units-${s.substanceId}`}
                      className="input"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.1"
                      value={s.dailyUnits}
                      onChange={(e) =>
                        updateTarget(s.substanceId, { dailyUnits: Number(e.target.value) })
                      }
                    />
                  </Field>
                  <Field
                    label={t('onboarding:unitPriceLabel')}
                    hint={t('onboarding:currencyHint', { currency: detectCurrency() })}
                    htmlFor={`price-${s.substanceId}`}
                  >
                    <input
                      id={`price-${s.substanceId}`}
                      className="input"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.1"
                      value={s.unitPrice}
                      onChange={(e) =>
                        updateTarget(s.substanceId, { unitPrice: Number(e.target.value) })
                      }
                    />
                  </Field>
                </Card>
              );
            })}
          </section>
        )}

        {step === 'screeningIntro' && (
          <section className="space-y-4">
            <h1 className="page-title">{t('onboarding:screeningTitle')}</h1>
            <div className="banner-warning">{t('safety:screeningDisclaimer')}</div>
            <p className="muted">{t('onboarding:sexBody')}</p>
            <div className="space-y-2">
              {(
                [
                  { id: 'female', labelKey: 'onboarding:sexFemale' },
                  { id: 'male', labelKey: 'onboarding:sexMale' },
                  { id: 'other', labelKey: 'onboarding:sexOther' },
                  { id: 'prefer', labelKey: 'onboarding:sexPreferNot' },
                ] as const
              ).map((opt) => {
                const selected =
                  (opt.id === 'prefer' && form.sex === null) ||
                  (opt.id !== 'prefer' && form.sex === opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        sex: opt.id === 'prefer' ? null : (opt.id as Sex),
                      }))
                    }
                    className={cx(
                      'w-full rounded-xl px-3.5 py-3 text-left text-sm font-medium ring-1 transition',
                      selected
                        ? 'bg-teal-50 ring-2 ring-teal-600 dark:bg-teal-950/50'
                        : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-700',
                    )}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {(step === 'auditC' || step === 'cageAid' || step === 'depFlags' || step === 'phq9') && (
          <QuestionnaireStep step={step} answers={form.answers} onAnswer={answerOne} t={t} />
        )}

        {step === 'risk' && (
          <section className="space-y-4">
            <h1 className="page-title">{t('onboarding:riskTitle')}</h1>

            {suicidality && (
              <div className="banner-danger space-y-3">
                <p className="font-semibold">{t('safety:crisis.title')}</p>
                <p>{t('safety:crisis.body')}</p>
                {emergency && (
                  <a href={`tel:${emergency}`} className="btn-danger w-full">
                    <Phone size={18} aria-hidden />
                    {t('safety:crisis.callEmergency', { number: emergency })}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, crisisAck: !f.crisisAck }))}
                  className={cx(
                    'flex w-full items-start gap-3 rounded-lg p-2 text-left text-sm',
                    form.crisisAck && 'bg-rose-100/70 dark:bg-rose-950/50',
                  )}
                >
                  <span
                    className={cx(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                      form.crisisAck
                        ? 'border-rose-600 bg-rose-600 text-white'
                        : 'border-slate-400',
                    )}
                  >
                    {form.crisisAck && <Check size={14} aria-hidden />}
                  </span>
                  {t('safety:crisis.ack')}
                </button>
              </div>
            )}

            {assessment.gates.includes('medical-detox') && (
              <div className="banner-danger space-y-3">
                <p className="font-semibold">{t('safety:medicalGate.title')}</p>
                <p>{t('safety:medicalGate.body')}</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{t('safety:medicalGate.sign1')}</li>
                  <li>{t('safety:medicalGate.sign2')}</li>
                  <li>{t('safety:medicalGate.sign3')}</li>
                </ul>
                {emergency && (
                  <a href={`tel:${emergency}`} className="btn-danger w-full">
                    <Phone size={18} aria-hidden />
                    {t('safety:crisis.callEmergency', { number: emergency })}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gateMedicalAck: !f.gateMedicalAck }))}
                  className={cx(
                    'flex w-full items-start gap-3 rounded-lg p-2 text-left text-sm',
                    form.gateMedicalAck && 'bg-rose-100/70 dark:bg-rose-950/50',
                  )}
                >
                  <span
                    className={cx(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                      form.gateMedicalAck
                        ? 'border-rose-600 bg-rose-600 text-white'
                        : 'border-slate-400',
                    )}
                  >
                    {form.gateMedicalAck && <Check size={14} aria-hidden />}
                  </span>
                  {t('safety:medicalGate.ack')}
                </button>
              </div>
            )}

            {assessment.gates.includes('opioid-overdose') && (
              <div className="banner-warning space-y-3">
                <p className="font-semibold">{t('safety:opioidGate.title')}</p>
                <p>{t('safety:opioidGate.body')}</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{t('safety:opioidGate.point1')}</li>
                  <li>{t('safety:opioidGate.point2')}</li>
                  <li>{t('safety:opioidGate.point3')}</li>
                  <li>{t('safety:opioidGate.point4')}</li>
                </ul>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gateOpioidAck: !f.gateOpioidAck }))}
                  className={cx(
                    'flex w-full items-start gap-3 rounded-lg p-2 text-left text-sm',
                    form.gateOpioidAck && 'bg-amber-100/70 dark:bg-amber-950/50',
                  )}
                >
                  <span
                    className={cx(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                      form.gateOpioidAck
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-slate-400',
                    )}
                  >
                    {form.gateOpioidAck && <Check size={14} aria-hidden />}
                  </span>
                  {t('safety:opioidGate.ack')}
                </button>
              </div>
            )}
          </section>
        )}

        {step === 'pledge' && (
          <section className="space-y-4">
            <h1 className="page-title">{t('onboarding:pledgeTitle')}</h1>
            <p className="muted">{t('onboarding:pledgeBody')}</p>
            <Field
              label={t('onboarding:pledgeLabel')}
              hint={t('onboarding:pledgeHint')}
              htmlFor="pledge"
            >
              <textarea
                id="pledge"
                className="input min-h-32"
                rows={5}
                maxLength={2000}
                value={form.pledgeReasons}
                onChange={(e) => setForm((f) => ({ ...f, pledgeReasons: e.target.value }))}
              />
            </Field>
          </section>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        {stepIdx > 0 && (
          <Button variant="secondary" onClick={back} className="flex-1">
            <ChevronLeft size={18} aria-hidden />
            {t('common:actions.back')}
          </Button>
        )}
        <Button onClick={next} disabled={!canContinue()} className="flex-[2]">
          {step === 'pledge' ? t('onboarding:finish') : t('common:actions.continue')}
        </Button>
      </div>

      <p className="muted mt-4 text-center text-xs">{t('safety:notMedical.short')}</p>
    </div>
  );
}

function QuestionnaireStep({
  step,
  answers,
  onAnswer,
  t,
}: {
  step: StepId;
  answers: Record<string, number>;
  onAnswer: (id: string, value: number) => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const config: Record<
    string,
    { titleKey: string; questions: readonly WizardQuestion[]; danger?: boolean }
  > = {
    auditC: { titleKey: 'onboarding:auditC', questions: AUDIT_C_QUESTIONS },
    cageAid: { titleKey: 'onboarding:cageAid', questions: CAGE_AID_QUESTIONS },
    depFlags: {
      titleKey: 'onboarding:depFlags',
      questions: DEP_FLAG_QUESTIONS,
      danger: true,
    },
    phq9: { titleKey: 'onboarding:phq9', questions: PHQ9_QUESTIONS },
  };
  const cfg = config[step];
  if (!cfg) return null;

  return (
    <section className="space-y-4">
      <div>
        <h1 className="page-title">{t(cfg.titleKey)}</h1>
        <p className="muted mt-1">{t('safety:screeningDisclaimer')}</p>
      </div>
      {cfg.questions.map((q, idx) => (
        <div key={q.id} className="space-y-2">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            <span className="muted mr-1">{idx + 1}.</span>
            {t(q.labelKey)}
          </p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onAnswer(q.id, opt.value)}
                  className={cx(
                    'rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition',
                    selected
                      ? cfg.danger
                        ? 'bg-amber-500 text-white ring-amber-500'
                        : 'bg-teal-600 text-white ring-teal-600'
                      : 'bg-white text-slate-700 ring-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700',
                  )}
                >
                  {t(opt.labelKey)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
