type LightCardProps = { on?: boolean | null | undefined };

export default function LightCard({ on }: LightCardProps) {
  const isOn = on ?? null;
  const color = isOn ? "#22c55e" : "#ef4444";
  const text  = isOn==null ? "—" : (isOn ? "Encendida" : "Apagada");

  return (
    <div style={{
      background:"#161a22",
      border:"1px solid #1f2430",
      borderRadius:16, padding:16,
      boxShadow:"0 6px 24px rgba(0,0,0,.35)",
      display:"flex", flexDirection:"column", gap:10
    }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontWeight:700, color:"#f3f4f6"}}>Luz</div>

        {/* cuadradito de estado */}
        <span style={{
          width:12, height:12, borderRadius:4, background: color
        }}/>
      </div>

      <div style={{
        marginTop:4,
        background: isOn ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
        color:"#fff", borderRadius:12, padding:"16px 12px",
        textAlign:"center", fontSize:22, fontWeight:800
      }}>
        {text}
      </div>
    </div>
  );
}
