import type { ScreeningToolId } from '../data/types';

export type Sex = 'male' | 'female' | 'other' | null;

export interface ScoreResult {
  score: number;
  positive: boolean;
}

/** AUDIT-C (OMS): 3 preguntas, 0-12. Hombres ≥4, mujeres ≥3 (NIAAA). */
export const AUDIT_C_IDS = ['audit-c-1', 'audit-c-2', 'audit-c-3'] as const;

export function scoreAuditC(answers: Record<string, number>, sex: Sex = null): ScoreResult {
  const score = AUDIT_C_IDS.reduce((sum, id) => sum + (answers[id] ?? 0), 0);
  const threshold = sex === 'female' ? 3 : 4;
  return { score, positive: score >= threshold };
}

/** CAGE-AID: adaptado al consumo de sustancias. ≥2 = problema probable. */
export const CAGE_AID_IDS = ['cage-aid-1', 'cage-aid-2', 'cage-aid-3', 'cage-aid-4'] as const;

export function scoreCageAid(answers: Record<string, number>): ScoreResult {
  const score = CAGE_AID_IDS.reduce((sum, id) => sum + ((answers[id] ?? 0) > 0 ? 1 : 0), 0);
  return { score, positive: score >= 2 };
}

/** PHQ-9: 9 preguntas, 0-27. Ítem 9 = ideación suicida. */
export const PHQ9_IDS: readonly string[] = Array.from({ length: 9 }, (_, i) => `phq-9-${i + 1}`);

export interface Phq9Result extends ScoreResult {
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  suicidality: boolean;
}

export function scorePhq9(answers: Record<string, number>): Phq9Result {
  const score = PHQ9_IDS.reduce((sum, id) => sum + Math.min(3, Math.max(0, answers[id] ?? 0)), 0);
  const severity =
    score >= 20
      ? 'severe'
      : score >= 15
        ? 'moderately-severe'
        : score >= 10
          ? 'moderate'
          : score >= 5
            ? 'mild'
            : 'minimal';
  return { score, positive: score >= 10, severity, suicidality: (answers['phq-9-9'] ?? 0) >= 1 };
}

export type DepFlagId =
  | 'daily-alcohol-or-benzo'
  | 'past-withdrawal-seizures'
  | 'benzo-daily-4w'
  | 'opioid-use'
  | 'withdrawal-symptoms-on-stop'
  | 'polysubstance'
  | 'pregnancy'
  | 'age-65-plus'
  | 'no-support-during-withdrawal'
  | 'serious-medical-condition';

export const DEP_FLAG_IDS: readonly DepFlagId[] = [
  'daily-alcohol-or-benzo',
  'past-withdrawal-seizures',
  'benzo-daily-4w',
  'opioid-use',
  'withdrawal-symptoms-on-stop',
  'polysubstance',
  'pregnancy',
  'age-65-plus',
  'no-support-during-withdrawal',
  'serious-medical-condition',
];

export function evaluateDepFlags(answers: Record<string, number>): DepFlagId[] {
  return DEP_FLAG_IDS.filter((flag) => (answers[flag] ?? 0) >= 1);
}

export interface InstrumentMeta {
  id: ScreeningToolId;
  /** Clave i18n del título. */
  titleKey: string;
  /** Clave i18n del aviso "no es diagnóstico". */
  disclaimerKey: string;
}

export const INSTRUMENTS: Record<ScreeningToolId, InstrumentMeta> = {
  'audit-c': {
    id: 'audit-c',
    titleKey: 'auditC',
    disclaimerKey: 'screeningDisclaimer',
  },
  'cage-aid': {
    id: 'cage-aid',
    titleKey: 'cageAid',
    disclaimerKey: 'screeningDisclaimer',
  },
  'phq-9': {
    id: 'phq-9',
    titleKey: 'phq9',
    disclaimerKey: 'screeningDisclaimer',
  },
  'dep-flags': {
    id: 'dep-flags',
    titleKey: 'depFlags',
    disclaimerKey: 'screeningDisclaimer',
  },
};
