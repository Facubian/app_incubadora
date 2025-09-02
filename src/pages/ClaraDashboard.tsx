import "../styles/clara.css";
import { useMemo } from "react";
import { useLiveData } from "../useLiveData";
import type { IncuPoint } from "../dataProvider";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, YAxis, XAxis, Tooltip, CartesianGrid } from "recharts";

// helpers
type NumericKey = "temperature_c" | "humidity_pct" | "co2_ppm";

function seriesOf(arr: IncuPoint[], key: NumericKey) {
  return arr
    .map((d, i) => {
      const v = d[key];
      if (v === null || v === undefined) return null;
      return { i, value: Number(v) };
    })
    .filter((p): p is { i: number; value: number } => p !== null);
}

function minMax(nums: number[]) {
  if (nums.length === 0) return { min: "-", max: "-" } as const;
  return { min: Math.min(...nums), max: Math.max(...nums) } as const;
}

function findExtrema(arr: IncuPoint[], key: NumericKey) {
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
  } as { min: number | string; minTs: string | null; max: number | string; maxTs: string | null };
}

function fmtTs(ts: string) {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch {
    return ts;
  }
}

function fmtDate(ts?: string | null) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleDateString(undefined, { year:'numeric', month:'2-digit', day:'2-digit' }); }
  catch { return ts; }
}

function fmtTime(ts?: string | null) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' }); }
  catch { return ts; }
}

function analyzeLight(arr: IncuPoint[]) {
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
  const durationMs = lastInterval ? (new Date(lastInterval.end).getTime() - new Date(lastInterval.start).getTime()) : null;
  return { lastOnStart, durationMs, ongoing } as { lastOnStart: string | null; durationMs: number | null; ongoing: boolean };
}

export default function ClaraDashboard() {
  // 2000 ms y 100 puntos
  const { data } = useLiveData(2000, 100);
  const last = data.at(-1);

  // series
  const sTemp = useMemo(() => seriesOf(data, "temperature_c"), [data]);
  const sHum  = useMemo(() => seriesOf(data, "humidity_pct"), [data]);
  const sCO2  = useMemo(() => seriesOf(data, "co2_ppm"), [data]);

  const rTemp = useMemo(() => minMax(sTemp.map(p => p.value)), [sTemp]);
  const rHum  = useMemo(() => minMax(sHum.map(p => p.value)), [sHum]);
  const rCO2  = useMemo(() => minMax(sCO2.map(p => p.value)), [sCO2]);
  const eTemp = useMemo(() => findExtrema(data, "temperature_c"), [data]);
  const eHum  = useMemo(() => findExtrema(data, "humidity_pct"), [data]);
  const eCO2  = useMemo(() => findExtrema(data, "co2_ppm"), [data]);
  const light = useMemo(() => analyzeLight(data), [data]);

  const luzOn = last?.light_on === true;
  const lastTemp = sTemp.at(-1)?.value;
  const lastHum  = sHum.at(-1)?.value;
  const lastCO2  = sCO2.at(-1)?.value;

  return (
    <>
      <header>
        <img src="/mushroom.svg" alt="logo" className="logo" />
        <span>Incubadora Mushroom</span>
      </header>

      <div className="container">
        {/* Temperatura */}
        <div className="card">
          <h3>Temperatura</h3>
          <div className="graph">
            <div className="plot">
              {typeof lastTemp !== 'undefined' && (
                <div className="chart-badge"><span className="dot on" style={{ background: '#f87171' }} />{fmt(lastTemp)} °C</div>
              )}
              {sTemp.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sTemp}>
                  <defs>
                    <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                    <CartesianGrid stroke="#ffcccc" strokeOpacity={0.12} />
                    <XAxis dataKey="i" hide />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} width={0} />
                    <Tooltip formatter={(v: number) => [`${v.toFixed(1)} °C`, "Temperatura"]} />
                    <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fill="url(#tempFill)" fillOpacity={1} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : "[Gráfico]"}
            </div>
          </div>
          <div className="stats">
            <div>
              <div className="label">Mín</div>
              <div className="value">{fmt(rTemp.min)} °C</div>
              {eTemp.minTs && (
                <div className="meta-row">
                  <span className="meta-badge">{fmtDate(eTemp.minTs)}</span>
                  <span className="meta-badge">{fmtTime(eTemp.minTs)}</span>
                </div>
              )}
            </div>
            <div>
              <div className="label">Max</div>
              <div className="value">{fmt(rTemp.max)} °C</div>
              {eTemp.maxTs && (
                <div className="meta-row">
                  <span className="meta-badge">{fmtDate(eTemp.maxTs)}</span>
                  <span className="meta-badge">{fmtTime(eTemp.maxTs)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Humedad */}
        <div className="card">
          <h3>Humedad</h3>
          <div className="graph">
            <div className="plot">
              {typeof lastHum !== 'undefined' && (
                <div className="chart-badge"><span className="dot on" style={{ background: '#60a5fa' }} />{fmt(lastHum)} %</div>
              )}
              {sHum.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sHum}>
                    <CartesianGrid stroke="#ffcccc" strokeOpacity={0.12} />
                    <XAxis dataKey="i" hide />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} width={0} />
                    <Tooltip formatter={(v: number) => [`${v.toFixed(1)} %`, "Humedad"]} />
                    <Line type="monotone" dataKey="value" stroke="#ffe1e1" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : "[Gráfico]"}
            </div>
          </div>
          <div className="stats">
            <div>
              <div className="label">Mín</div>
              <div className="value">{fmt(rHum.min)} %</div>
              {eHum.minTs && (
                <div className="meta-row">
                  <span className="meta-badge">{fmtDate(eHum.minTs)}</span>
                  <span className="meta-badge">{fmtTime(eHum.minTs)}</span>
                </div>
              )}
            </div>
            <div>
              <div className="label">Max</div>
              <div className="value">{fmt(rHum.max)} %</div>
              {eHum.maxTs && (
                <div className="meta-row">
                  <span className="meta-badge">{fmtDate(eHum.maxTs)}</span>
                  <span className="meta-badge">{fmtTime(eHum.maxTs)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Luz */}
        <div className="card">
          <h3>Luz</h3>
          <div className="graph">
            <div className="plot">
              <div className="state-chip">
                <div className="state-pill">
                  <span className={`dot ${luzOn ? 'on' : 'off'}`} />
                  {luzOn ? 'Encendida' : 'Apagada'}
                </div>
              </div>
            </div>
          </div>
          {/* Info de último encendido */}
          <div className="stats light-info">
            <div>
              <div className="label">Último encendido</div>
              <div className="value">{light.lastOnStart ? `${fmtTime(light.lastOnStart)} hs` : '—'}</div>
              {light.lastOnStart && (
                <div className="meta-row">
                  <span className="meta-badge">{fmtDate(light.lastOnStart)}</span>
                </div>
              )}
            </div>
            <div>
              <div className="label">Duración</div>
              <div className="value">{light.durationMs != null ? formatDuration(light.durationMs) : '—'}</div>
            </div>
          </div>
        </div>

        {/* O₂ / CO₂ */}
        <div className="card">
          <h3>O₂ / CO₂</h3>
          <div className="graph">
            <div className="plot">
              {typeof lastCO2 !== 'undefined' && (
                <div className="chart-badge"><span className="dot on" style={{ background: '#86efac' }} />{fmt(lastCO2)} ppm</div>
              )}
              {sCO2.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sCO2}>
                    <CartesianGrid stroke="#ffcccc" strokeOpacity={0.12} />
                    <XAxis dataKey="i" hide />
                    <YAxis domain={['dataMin - 30', 'dataMax + 30']} width={0} />
                    <Tooltip formatter={(v: number) => [`${Math.round(v)} ppm`, "CO2"]} />
                    <Line type="monotone" dataKey="value" stroke="#ffd6d6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : "[Gráfico]"}
            </div>
          </div>
          <div className="stats">
            <div>
              <div className="label">Mín</div>
              <div className="value">{fmt(rCO2.min)} ppm</div>
              {eCO2.minTs && (
                <div className="meta-row">
                  <span className="meta-badge">{fmtDate(eCO2.minTs)}</span>
                  <span className="meta-badge">{fmtTime(eCO2.minTs)}</span>
                </div>
              )}
            </div>
            <div>
              <div className="label">Max</div>
              <div className="value">{fmt(rCO2.max)} ppm</div>
              {eCO2.maxTs && (
                <div className="meta-row">
                  <span className="meta-badge">{fmtDate(eCO2.maxTs)}</span>
                  <span className="meta-badge">{fmtTime(eCO2.maxTs)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function fmt(v: number | string) {
  return typeof v === "number" ? (Number.isFinite(v) ? v.toFixed(1) : "-") : v;
}

function formatDuration(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h} h ${m} min ${s} s`;
  return `${m} min ${s} s`;
}
