// src/pages/ClaraDashboard.tsx
import "../styles/clara.css";

export default function ClaraDashboard() {
  return (
    <>
      <header>Incubadora</header>

      <div className="container">
        <div className="card">
          <h3>Temperatura</h3>
          <div className="graph">[Aquí va gráfico]</div>
          <div className="min-max">Mínimo: x | Máximo: y</div>
        </div>

        <div className="card">
          <h3>Humedad</h3>
          <div className="graph">[Aquí va gráfico]</div>
          <div className="min-max">Mínimo: x | Máximo: y</div>
        </div>

        <div className="card">
          <h3>Luz</h3>
          <div className="graph">Encendida</div>
          <div className="min-max">Mínimo: - | Máximo: -</div>
        </div>

        <div className="card">
          <h3>O₂ / CO₂</h3>
          <div className="graph">[Aquí va gráfico]</div>
          <div className="min-max">Mínimo: x | Máximo: y</div>
        </div>
      </div>
    </>
  );
}
