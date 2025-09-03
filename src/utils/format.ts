export function fmt(v: number | string) {
  return typeof v === "number" ? (Number.isFinite(v) ? v.toFixed(1) : "-") : v;
}

export function fmtTs(ts: string) {
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

export function fmtDate(ts?: string | null) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleDateString(undefined, { year:'numeric', month:'2-digit', day:'2-digit' }); }
  catch { return ts; }
}

export function fmtTime(ts?: string | null) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' }); }
  catch { return ts; }
}

export function formatDuration(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h} h ${m} min ${s} s`;
  return `${m} min ${s} s`;
}
