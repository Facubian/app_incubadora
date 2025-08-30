import { useLiveData } from "./useLiveData";
import MetricCard from "./MetricCard";
import LightCard from "./LightCard";


function App() {
  const { data } = useLiveData(2000, 100);
  const last = data.at(-1);

  const sTemp = data.map(d => ({ temperature_c: d.temperature_c }));
  const sHum  = data.map(d => ({ humidity_pct:  d.humidity_pct  }));
  const sCO2  = data.map(d => ({ co2_ppm:      d.co2_ppm      }));

  return (
    <div style={{
      minHeight:"100vh",
      background:"#0f1115",           
      color:"#e5e7eb",                
      padding:20, fontFamily:"Inter, system-ui, sans-serif"
    }}>
      <h1 style={{margin:"0 0 8px", color:"#f3f4f6"}}>MushRoom — Incubadora (Prototipo)</h1>
      <p style={{margin:"0 0 16px", opacity:.6}}>Lecturas en vivo (últimos 100 puntos)</p>

      <div style={{display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16}}>
        <MetricCard
          title="Temperatura"
          value={fmt(last?.temperature_c)}
          unit="°C"
          data={sTemp}
          dataKey="temperature_c"
          color="#ef4444"     // rojo
          domain={[18,30]}
        />

        <MetricCard
          title="Humedad"
          value={fmt(last?.humidity_pct)}
          unit="%"
          data={sHum}
          dataKey="humidity_pct"
          color="#60a5fa"     // azul
          domain={[40,95]}
        />

        <LightCard on={last?.light_on} />

        <MetricCard
          title="CO₂"
          value={fmt(last?.co2_ppm)}
          unit="ppm"
          data={sCO2}
          dataKey="co2_ppm"
          color="#34d399"     // verde
          domain={[300,2000]}
          type="line"
        />
      </div>
    </div>
  );
}
const fmt = (v:number|null|undefined)=> v==null?"—":v;
export default App;
