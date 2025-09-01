
export type IncuPoint = {
  device_id: string;
  ts: string;               
  temperature_c?: number | null;
  humidity_pct?: number | null;
  co2_ppm?: number | null;
  light_on?: boolean | null;
};


const API = import.meta.env.VITE_API_BASE as string | undefined;

export async function fetchSeries(limit=100): Promise<IncuPoint[]> {
  if (!API) return simulateSeries(limit);
  try {
    const r = await fetch(`${API}/series?limit=${limit}`, { cache: "no-store" });
    if (!r.ok) throw new Error("bad status");
    return await r.json();
  } catch {
    return simulateSeries(limit);
  }
}

export async function fetchLatest(prev?: IncuPoint): Promise<IncuPoint> {
  if (!API) return simulateStep(prev);
  try {
    const r = await fetch(`${API}/latest`, { cache: "no-store" });
    if (!r.ok) throw new Error("bad status");
    return await r.json();
  } catch {
    return simulateStep(prev);
  }
}

// ---- Simuladorrrrrrrrrr ----
function jitter(x:number, d:number){ return +(x + (Math.random()-0.5)*d).toFixed(1); }
function clamp(x:number, a:number, b:number){ return Math.min(b, Math.max(a,x)); }

export function simulateStep(prev?:IncuPoint):IncuPoint {
  const t = jitter(prev?.temperature_c ?? 24, 0.4);
  const h = jitter(prev?.humidity_pct ?? 65, 0.8);
  const c = Math.round(clamp((prev?.co2_ppm ?? 800) + (Math.random()-0.5)*20, 400, 2000));
  // Luz: cambia cada tanto
  const prevLight = prev?.light_on ?? true;
  const light = Math.random() < 0.1 ? !prevLight : prevLight;

  return {
    device_id: "incu-mock-01",
    ts: new Date().toISOString(),
    temperature_c: t,
    humidity_pct: h,
    co2_ppm: c,
    light_on: light,
  };
}


export function simulateSeries(n:number){
  const out: IncuPoint[] = [];
  for (let i=0;i<n;i++) out.push(simulateStep(out.at(-1)));
  return out;
}
