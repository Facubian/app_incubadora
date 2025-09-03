import type { IncuPoint } from "../dataProvider";

export function analyzeLight(arr: IncuPoint[]) {
  let prev: boolean | null | undefined = undefined;
  let currentStart: string | null = null;
  const intervals: { start: string; end: string }[] = [];

  for (const d of arr) {
    const on = d.light_on ?? null;
    if (prev !== true && on === true) currentStart = d.ts;
    if (prev === true && on !== true && currentStart) {
      intervals.push({ start: currentStart, end: d.ts });
      currentStart = null;
    }
    prev = on;
  }

  const now = new Date().toISOString();
  const ongoing = prev === true && currentStart !== null;
  if (ongoing && currentStart) intervals.push({ start: currentStart, end: now });

  const lastInterval = intervals.at(-1) || null;
  const lastOnStart = lastInterval?.start ?? null;
  const durationMs = lastInterval
    ? (new Date(lastInterval.end).getTime() - new Date(lastInterval.start).getTime())
    : null;

  return { lastOnStart, durationMs, ongoing };
}
