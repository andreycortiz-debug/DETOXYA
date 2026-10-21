export const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(ts: number = Date.now()): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function todayKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function daysBetween(fromTs: number, toTs: number = Date.now()): number {
  return Math.max(0, Math.floor((startOfDay(toTs) - startOfDay(fromTs)) / DAY_MS));
}

export function elapsedParts(
  fromTs: number,
  now: number = Date.now(),
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const diff = Math.max(0, now - fromTs);
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / (60 * 60 * 1000)),
    minutes: Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((diff % (60 * 1000)) / 1000),
  };
}

export function formatDurationHuman(
  fromTs: number,
  now: number = Date.now(),
  t: (key: string, opts?: Record<string, unknown>) => string,
): string {
  const { days, hours, minutes } = elapsedParts(fromTs, now);
  if (days > 0) return t('time.daysHours', { days, hours });
  if (hours > 0) return t('time.hoursMinutes', { hours, minutes });
  return t('time.minutes', { minutes });
}
