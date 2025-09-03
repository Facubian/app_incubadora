import "../styles/clara.css";
import { useMemo } from "react";
import { useLiveData } from "../useLiveData";
import { ResponsiveContainer, AreaChart, Area, YAxis, XAxis, Tooltip, CartesianGrid } from "recharts";
import { seriesOf, minMax } from "../utils/series";
import { findExtrema } from "../utils/extrema";
import { analyzeLight } from "../utils/light";
import { fmt, fmtDate, fmtTime, formatDuration } from "../utils/format";

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
        <div className="header-content">
        <img src="/hongos.png" alt="logo" className="logo" />
        <span>Incubadora Mushroom</span>
        </div>
      </header>

      <div className="container">
        {/* Temperatura */}
        <div className="card">
          <h3>🌡️ Temperatura</h3>
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
          <h3>💧 Humedad</h3>
          <div className="graph">
            <div className="plot">
              {typeof lastHum !== 'undefined' && (
                <div className="chart-badge"><span className="dot on" style={{ background: '#60a5fa' }} />{fmt(lastHum)} %</div>
              )}
              {sHum.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sHum}>
                  <defs>
                    <linearGradient id="humFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                    <CartesianGrid stroke="#ffcccc" strokeOpacity={0.12} />
                    <XAxis dataKey="i" hide />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} width={0} />
                    <Tooltip formatter={(v: number) => [`${v.toFixed(1)} %`, "Humedad"]} />
                    <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fill="url(#humFill)" fillOpacity={1} isAnimationActive={false} />
                  </AreaChart>
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
          <h3>💡 Luz</h3>
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
          <h3>🌬️ O₂ / CO₂</h3>
          <div className="graph">
            <div className="plot">
              {typeof lastCO2 !== 'undefined' && (
                <div className="chart-badge"><span className="dot on" style={{ background: '#86efac' }} />{fmt(lastCO2)} ppm</div>
              )}
              {sCO2.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sCO2}>
                  <defs>
                    <linearGradient id="CO2Fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                    <CartesianGrid stroke="#ffcccc" strokeOpacity={0.12} />
                    <XAxis dataKey="i" hide />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} width={0} />
                    <Tooltip formatter={(v: number) => [`${v.toFixed(1)} %`, "CO2"]} />
                    <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fill="url(#humFill)" fillOpacity={1} isAnimationActive={false} />
                  </AreaChart>
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