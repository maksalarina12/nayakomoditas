import { stapleItems, type StapleItem } from "./staple-data";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Generate the list of available snapshot dates (last 7 days, oldest first).
 * Uses a deterministic anchor so SSR and CSR render identically.
 */
export function getAvailableSnapshotDates(): Date[] {
  // Anchor on UTC midnight today to avoid hydration mismatch
  const today = new Date();
  const anchor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const dates: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    dates.push(new Date(anchor.getTime() - i * DAY_MS));
  }
  return dates;
}

export function getSnapshotIndex(selected: Date, available: Date[]): number {
  const target = startOfDay(selected).getTime();
  const idx = available.findIndex((d) => startOfDay(d).getTime() === target);
  return idx === -1 ? available.length - 1 : idx;
}

function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * Build a snapshot of items reflecting prices for a specific historical day.
 * Index 6 = today (uses live hargaHariIni / hargaKemarin).
 * Index < 6 shifts the lens backwards in the trend7d window.
 */
export function buildSnapshotItems(items: StapleItem[], snapshotIdx: number): StapleItem[] {
  if (snapshotIdx >= 6) return items;

  return items.map((item) => {
    const today = item.trend7d[snapshotIdx];
    const yesterday = item.trend7d[Math.max(0, snapshotIdx - 1)];
    const window = item.trend7d.slice(0, snapshotIdx + 1);
    // Pad to 7 entries by repeating the earliest known price
    const padded = window.length < 7
      ? [...Array(7 - window.length).fill(window[0]), ...window]
      : window;
    return {
      ...item,
      hargaHariIni: today,
      hargaKemarin: yesterday,
      trend7d: padded,
    };
  });
}

/**
 * Simulate a market sync by perturbing today's price slightly.
 */
export function syncStapleItems(items: StapleItem[]): StapleItem[] {
  return items.map((item) => {
    const drift = (Math.random() - 0.45) * 0.025; // -1.1% to +1.4%
    const newPrice = Math.max(500, Math.round(item.hargaHariIni * (1 + drift) / 50) * 50);
    const newTrend = [...item.trend7d.slice(1), newPrice];
    return {
      ...item,
      hargaKemarin: item.hargaHariIni,
      hargaHariIni: newPrice,
      trend7d: newTrend,
    };
  });
}

export function formatSnapshotDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatSnapshotShort(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// re-export for convenience
export { stapleItems };
