export type IncuPoint = {
  device_id: string;
  ts: string;
  temperature_c: number;
  humidity_pct: number;
  co2_ppm: number;
  light_on: boolean;
};

const API = import.meta.env.VITE_API_BASE as string | undefined;


export async function fetchSeries(limit = 100): Promise<IncuPoint[]> {
  if (!API) return simulateSeries(limit);
  try {
    // Solo pide el último dato varias veces
    const points: IncuPoint[] = [];
    for (let i = 0; i < limit; i++) {
      const r = await fetch(`${API}`, { cache: "no-store" });
      if (!r.ok) throw new Error("bad status");
      const raw = await r.json();
      points.push({
        device_id: "sensor-local-01",
        ts: raw.timestamp,
        temperature_c: raw.temperatura,
        humidity_pct: raw.humedad,
        co2_ppm: raw.CO2,
        light_on: raw.luz === "ON"
      });
    }
    return points;
  } catch (e) {
    console.error("Error al obtener series del backend:", e);
    return simulateSeries(limit);
  }
}


export async function fetchLatest(prev?: IncuPoint): Promise<IncuPoint> {
  if (!API) return simulateStep(prev);
  try {
    const r = await fetch(`${API}`, { cache: "no-store" });
    if (!r.ok) throw new Error("bad status");

    const raw = await r.json();

    const transformed: IncuPoint = {
      device_id: "sensor-local-01",
      ts: raw.timestamp,
      temperature_c: raw.temperatura,
      humidity_pct: raw.humedad,
      co2_ppm: raw.CO2,
      light_on: raw.luz === "ON"
    };

    console.log("Dato recibido del backend:", transformed); // <-- Agrega este print

    return transformed;
  } catch (e) {
    console.error("Error al obtener datos del backend:", e);
    return simulateStep(prev);
  }
}


// ---- Simuladorrrrrrrrrr ----
function jitter(x:number, d:number){ return +(x + (Math.random()-0.5)*d).toFixed(1); }
function clamp(x:number, a:number, b:number){ return Math.min(b, Math.max(a,x)); }

export function simulateStep(prev?:IncuPoint):IncuPoint {
  // smaller drift so lines look stable, with slight noise
  const t = jitter(prev?.temperature_c ?? 24, 0.15);
  const h = jitter(prev?.humidity_pct ?? 65, 0.25);
  const c = Math.round(clamp((prev?.co2_ppm ?? 800) + (Math.random()-0.5)*6, 400, 2000));
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
