import type { IncuPoint } from "../dataProvider";

type NumericKey = "temperature_c" | "humidity_pct" | "co2_ppm";

export function findExtrema(arr: IncuPoint[], key: NumericKey) {
  let minVal = Infinity, maxVal = -Infinity;
  let minTs: string | null = null, maxTs: string | null = null;

  for (const d of arr) {
    const v = d[key];
    if (v === null || v === undefined) continue;
    const n = Number(v);
    if (Number.isFinite(n)) {
      if (n < minVal) { minVal = n; minTs = d.ts; }
      if (n > maxVal) { maxVal = n; maxTs = d.ts; }
    }
  }

  return {
    min: Number.isFinite(minVal) ? minVal : "-",
    minTs,
    max: Number.isFinite(maxVal) ? maxVal : "-",
    maxTs,
  };
}
