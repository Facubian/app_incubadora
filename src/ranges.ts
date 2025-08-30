import type { IncuPoint } from "./dataProvider";


export const RANGES = {
  temp: { ok:[20,26] as [number,number], warn:[18,28] as [number,number] },
  hum:  { ok:[60,85] as [number,number], warn:[50,90] as [number,number] },
  co2:  { ok:[400,1500] as [number,number], warn:[400,2000] as [number,number] }
};

const inRange = (v:number|undefined|null, [a,b]:[number,number]) =>
  v==null ? false : (v>=a && v<=b);

export function getStatus(p?:IncuPoint){
  if(!p) return "warn";
  const ok = inRange(p.temperature_c, RANGES.temp.ok)
         && inRange(p.humidity_pct, RANGES.hum.ok)
         && inRange(p.co2_ppm,    RANGES.co2.ok);
  const warn = inRange(p.temperature_c, RANGES.temp.warn)
            && inRange(p.humidity_pct, RANGES.hum.warn)
            && inRange(p.co2_ppm,    RANGES.co2.warn);
  return ok ? "ok" : (warn ? "warn" : "alert");
}
