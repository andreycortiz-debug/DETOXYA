import { describe, expect, it } from 'vitest';
import { scoreAuditC, scoreCageAid, scorePhq9, evaluateDepFlags } from './screening';

const audit = (a: number, b: number, c: number) => ({
  'audit-c-1': a,
  'audit-c-2': b,
  'audit-c-3': c,
});

describe('scoreAuditC', () => {
  it('scores zero when never drinks', () => {
    expect(scoreAuditC(audit(0, 0, 0), 'male')).toEqual({ score: 0, positive: false });
  });

  it('flags men at >= 4', () => {
    const r = scoreAuditC(audit(2, 1, 1), 'male');
    expect(r.score).toBe(4);
    expect(r.positive).toBe(true);
  });

  it('flags women at >= 3', () => {
    const r = scoreAuditC(audit(1, 1, 1), 'female');
    expect(r.score).toBe(3);
    expect(r.positive).toBe(true);
  });

  it('uses conservative threshold without sex info', () => {
    expect(scoreAuditC(audit(1, 1, 1), null).positive).toBe(false);
    expect(scoreAuditC(audit(2, 1, 1), null).positive).toBe(true);
  });
});

describe('scoreCageAid', () => {
  it('needs 2+ positive answers', () => {
    expect(
      scoreCageAid({ 'cage-aid-1': 1, 'cage-aid-2': 0, 'cage-aid-3': 0, 'cage-aid-4': 1 }),
    ).toEqual({ score: 2, positive: true });
    expect(
      scoreCageAid({ 'cage-aid-1': 1, 'cage-aid-2': 0, 'cage-aid-3': 0, 'cage-aid-4': 0 }).positive,
    ).toBe(false);
  });
});

describe('scorePhq9', () => {
  const base = {
    'phq-9-1': 0,
    'phq-9-2': 0,
    'phq-9-3': 0,
    'phq-9-4': 0,
    'phq-9-5': 0,
    'phq-9-6': 0,
    'phq-9-7': 0,
    'phq-9-8': 0,
    'phq-9-9': 0,
  };

  it('detects suicidality on item 9', () => {
    const r = scorePhq9({ ...base, 'phq-9-9': 1 });
    expect(r.suicidality).toBe(true);
    expect(r.score).toBe(1);
  });

  it('classifies severity bands', () => {
    expect(scorePhq9(base).severity).toBe('minimal');
    expect(
      scorePhq9({ ...base, 'phq-9-1': 1, 'phq-9-2': 1, 'phq-9-3': 1, 'phq-9-4': 2 }).severity,
    ).toBe('mild');
    const moderate: Record<string, number> = { ...base };
    for (let i = 1; i <= 5; i++) moderate[`phq-9-${i}`] = 2;
    expect(scorePhq9(moderate).severity).toBe('moderate');
    const severe: Record<string, number> = { ...base };
    for (let i = 1; i <= 9; i++) severe[`phq-9-${i}`] = 3;
    expect(scorePhq9(severe).severity).toBe('severe');
    expect(scorePhq9(severe).positive).toBe(true);
  });
});

describe('evaluateDepFlags', () => {
  it('returns only flags answered yes', () => {
    const flags = evaluateDepFlags({
      'daily-alcohol-or-benzo': 1,
      'past-withdrawal-seizures': 0,
      pregnancy: 1,
    });
    expect(flags).toEqual(['daily-alcohol-or-benzo', 'pregnancy']);
  });

  it('returns empty for no answers', () => {
    expect(evaluateDepFlags({})).toEqual([]);
  });
});
