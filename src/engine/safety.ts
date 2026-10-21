import type { ScreeningToolResult } from '../data/types';
import { gateSubstances } from '../content/substances';
import { evaluateDepFlags, scorePhq9, type DepFlagId } from './screening';

export type RiskLevel = 'low' | 'elevated' | 'high';

export type GateId = 'medical-detox' | 'opioid-overdose' | 'phq9-crisis';

export interface SafetyAssessment {
  level: RiskLevel;
  gates: GateId[];
  flags: DepFlagId[];
  needsCrisisFlow: boolean;
}

const HIGH_RISK_FLAGS: ReadonlySet<DepFlagId> = new Set<DepFlagId>([
  'daily-alcohol-or-benzo',
  'past-withdrawal-seizures',
  'benzo-daily-4w',
  'withdrawal-symptoms-on-stop',
  'polysubstance',
  'pregnancy',
  'age-65-plus',
  'no-support-during-withdrawal',
  'serious-medical-condition',
]);

function findTool(results: readonly ScreeningToolResult[], tool: string) {
  return results.find((r) => r.tool === tool);
}

export function assessSafety(input: {
  targetSubstanceIds: readonly string[];
  screening: readonly ScreeningToolResult[];
}): SafetyAssessment {
  const flags = evaluateDepFlags(findTool(input.screening, 'dep-flags')?.answers ?? {});
  const phq = scorePhq9(findTool(input.screening, 'phq-9')?.answers ?? {});
  const gated = gateSubstances(input.targetSubstanceIds);
  const hasGated = gated.length > 0;
  const opioidTarget = input.targetSubstanceIds.includes('opioids');

  const gates = new Set<GateId>();
  let level: RiskLevel = 'low';

  if (phq.suicidality) {
    gates.add('phq9-crisis');
    level = 'high';
  } else if (phq.severity === 'moderately-severe' || phq.severity === 'severe') {
    level = 'elevated';
  } else if (phq.severity === 'moderate') {
    level = 'elevated';
  }

  if (hasGated && flags.some((f) => HIGH_RISK_FLAGS.has(f))) {
    gates.add('medical-detox');
    level = 'high';
  } else if (hasGated) {
    gates.add('medical-detox');
    if (level === 'low') level = 'elevated';
  }

  if (opioidTarget) {
    gates.add('opioid-overdose');
    if (level === 'low') level = 'elevated';
  }

  if (flags.length > 0 && level === 'low') level = 'elevated';

  return {
    level,
    gates: [...gates],
    flags,
    needsCrisisFlow: phq.suicidality,
  };
}

export function isCrisisTool(result: ScreeningToolResult): boolean {
  if (result.tool !== 'phq-9') return false;
  return (result.answers['phq-9-9'] ?? 0) >= 1;
}
