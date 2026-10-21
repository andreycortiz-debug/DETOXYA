import { describe, expect, it } from 'vitest';
import { assessSafety } from './safety';
import type { ScreeningToolResult } from '../data/types';

function tool(
  result: Partial<ScreeningToolResult> & { tool: ScreeningToolResult['tool'] },
): ScreeningToolResult {
  return {
    id: 'x',
    date: 0,
    answers: {},
    score: 0,
    positive: false,
    ...result,
  };
}

const clean = [tool({ tool: 'phq-9', answers: {} }), tool({ tool: 'dep-flags', answers: {} })];

describe('assessSafety', () => {
  it('is low risk for cannabis without flags', () => {
    const a = assessSafety({ targetSubstanceIds: ['cannabis'], screening: clean });
    expect(a.level).toBe('low');
    expect(a.gates).toEqual([]);
    expect(a.needsCrisisFlow).toBe(false);
  });

  it('adds medical-detox gate for alcohol with daily use', () => {
    const a = assessSafety({
      targetSubstanceIds: ['alcohol'],
      screening: [
        tool({ tool: 'phq-9', answers: {} }),
        tool({ tool: 'dep-flags', answers: { 'daily-alcohol-or-benzo': 1 } }),
      ],
    });
    expect(a.gates).toContain('medical-detox');
    expect(a.level).toBe('high');
  });

  it('still gates alcohol without flags but elevated only', () => {
    const a = assessSafety({ targetSubstanceIds: ['alcohol'], screening: clean });
    expect(a.gates).toContain('medical-detox');
    expect(a.level).toBe('elevated');
  });

  it('flags opioid targets for overdose education', () => {
    const a = assessSafety({ targetSubstanceIds: ['opioids'], screening: clean });
    expect(a.gates).toContain('opioid-overdose');
    expect(a.level).toBe('elevated');
  });

  it('escalates on PHQ-9 suicidality', () => {
    const a = assessSafety({
      targetSubstanceIds: ['cannabis'],
      screening: [tool({ tool: 'phq-9', answers: { 'phq-9-9': 2 } })],
    });
    expect(a.needsCrisisFlow).toBe(true);
    expect(a.gates).toContain('phq9-crisis');
    expect(a.level).toBe('high');
  });

  it('raises level on severe PHQ-9 without suicidality', () => {
    const answers: Record<string, number> = {};
    for (let i = 1; i <= 8; i++) answers[`phq-9-${i}`] = 3;
    const a = assessSafety({
      targetSubstanceIds: ['cannabis'],
      screening: [tool({ tool: 'phq-9', answers })],
    });
    expect(a.level).toBe('elevated');
    expect(a.needsCrisisFlow).toBe(false);
  });
});
