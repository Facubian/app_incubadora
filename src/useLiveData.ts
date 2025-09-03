import { useEffect, useState } from "react";
import { fetchSeries, fetchLatest } from "./dataProvider";
import type { IncuPoint } from "./dataProvider";


export function useLiveData(intervalMs=2000, cap=100){
  const [data, setData] = useState<IncuPoint[]>([]);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  // carga inicial
  useEffect(() => {
    (async () => {
      const init = await fetchSeries(cap);
      setData(init);
    })();
  }, [cap]);

  // polling
  useEffect(() => {
    const iv = setInterval(async () => {
      try {
        const latest = await fetchLatest(data.at(-1));
        setData(prev => {
          const next = [...prev, latest];
          if (next.length > cap) next.shift(); 
          return next;
        });
        setApiOk(true);
      } catch {
        setApiOk(false);
      }
    }, intervalMs);
    return () => clearInterval(iv);
  }, [intervalMs, data, cap]);

  return { data, apiOk };
}
