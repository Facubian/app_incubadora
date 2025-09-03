import type { IncuPoint } from "../dataProvider";

type NumericKey = "temperature_c" | "humidity_pct" | "co2_ppm";

export function seriesOf(arr: IncuPoint[], key: NumericKey) {
  return arr
    .map((d, i) => {
      const v = d[key];
      if (v === null || v === undefined) return null;
      return { i, value: Number(v) };
    })
    .filter((p): p is { i: number; value: number } => p !== null);
}

export function minMax(nums: number[]) {
  if (nums.length === 0) return { min: "-", max: "-" } as const;
  return { min: Math.min(...nums), max: Math.max(...nums) } as const;
}
