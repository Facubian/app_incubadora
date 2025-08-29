import { useState, useEffect } from "react";

function useSensorData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/sensores"); // aca iria la URL de la API
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error al traer datos:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // cada 5 seg

    return () => clearInterval(interval);
  }, []);

  return data;
}

export default useSensorData;