import type { QuitTarget } from '../data/types';

export const MILESTONE_DAYS = [1, 3, 7, 14, 30, 60, 90, 180, 365, 548, 730, 1095] as const;

export function nextMilestone(days: number): number | null {
  for (const m of MILESTONE_DAYS) {
    if (m > days) return m;
  }
  return null;
}

export function achievedMilestones(days: number): number[] {
  return MILESTONE_DAYS.filter((m) => m <= days);
}

export function moneySaved(
  target: Pick<QuitTarget, 'dailyUnits' | 'unitPrice'>,
  days: number,
): number {
  return Math.max(0, target.dailyUnits * target.unitPrice * days);
}

export function formatMoney(amount: number, locale: string, currency: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount >= 100 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${Math.round(amount)}`;
  }
}
