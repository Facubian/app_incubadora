import { ResponsiveContainer, AreaChart, Area, LineChart, Line, Tooltip, YAxis, CartesianGrid } from "recharts";

type MetricCardProps = {
  title: string;
  value: number | string | null | undefined;
  unit?: string;
  data: Array<Record<string, any>>;
  dataKey: string;
  color: string;              // color del sensor
  domain?: [number, number];
  type?: "area" | "line";
};

export default function MetricCard({
  title, value, unit, data, dataKey, color, domain, type="area"
}: MetricCardProps) {
  return (
    <div style={{
      background:"#161a22",            // card gris oscuro
      border:"1px solid #1f2430",
      borderRadius:16, padding:16,
      boxShadow:"0 6px 24px rgba(0,0,0,.35)",
      display:"flex", flexDirection:"column", gap:10
    }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontWeight:700, color:"#f3f4f6"}}>{title}</div>

        {/* Valor + cuadradito de color */}
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{
            width:12, height:12, borderRadius:4, background:color
          }}/>
          <div style={{fontSize:24, fontWeight:800, color:"#fff"}}>
            {value ?? "—"} {unit ?? ""}
          </div>
        </div>
      </div>

      <div style={{height:120}}>
        <ResponsiveContainer width="100%" height="100%">
          {type==="area" ? (
            <AreaChart data={data}>
              <YAxis domain={domain} hide />
              <CartesianGrid stroke="#232938" strokeDasharray="3 3" />
              <Tooltip contentStyle={{background:"#0f1115", border:"1px solid #232938", color:"#fff"}} />
              <Area type="monotone" dataKey={dataKey}
                    stroke={color} fill={color} fillOpacity={0.12}
                    isAnimationActive={false}/>
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <YAxis domain={domain} hide />
              <CartesianGrid stroke="#232938" strokeDasharray="3 3" />
              <Tooltip contentStyle={{background:"#0f1115", border:"1px solid #232938", color:"#fff"}} />
              <Line type="monotone" dataKey={dataKey}
                    stroke={color} dot={false}
                    isAnimationActive={false}/>
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
