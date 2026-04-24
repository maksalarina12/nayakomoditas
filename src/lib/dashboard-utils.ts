import { stapleItems, type StapleItem } from "./staple-data";

const DAY_MS = 24 * 60 * 60 * 1000;
const DASHBOARD_TIMEZONE = "Asia/Jakarta";

type DateParts = {
  year: number;
  month: number;
  day: number;
};

function getDatePartsInJakarta(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DASHBOARD_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value ?? "0");
  const month = Number(parts.find((part) => part.type === "month")?.value ?? "0");
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "0");

  return { year, month, day };
}

function createStableDate(parts: DateParts): Date {
  // Simpan pada UTC siang hari agar tetap jatuh pada kalender yang sama saat
  // dirender di browser/client dengan zona waktu berbeda.
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0));
}

function getDateKey(date: Date): string {
  const { year, month, day } = getDatePartsInJakarta(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Generate daftar snapshot 7 hari terakhir berdasarkan kalender Asia/Jakarta,
 * supaya preview Lovable dan GitHub Pages menampilkan hari yang sama.
 */
export function getAvailableSnapshotDates(): Date[] {
  const today = createStableDate(getDatePartsInJakarta(new Date()));
  const dates: Date[] = [];

  for (let i = 6; i >= 0; i--) {
    dates.push(new Date(today.getTime() - i * DAY_MS));
  }

  return dates;
}

export function getSnapshotIndex(selected: Date, available: Date[]): number {
  const target = getDateKey(selected);
  const idx = available.findIndex((date) => getDateKey(date) === target);
  return idx === -1 ? available.length - 1 : idx;
}

/**
 * Build a snapshot of items reflecting prices for a specific historical day.
 * Index 6 = hari ini, index 5 = kemarin, dst.
 */
export function buildSnapshotItems(items: StapleItem[], snapshotIdx: number): StapleItem[] {
  const safeIndex = Math.min(Math.max(snapshotIdx, 0), 6);
  if (safeIndex >= 6) return items;

  return items.map((item) => {
    const today = item.trend7d[safeIndex];
    const yesterday = item.trend7d[Math.max(0, safeIndex - 1)];
    const visibleWindow = item.trend7d.slice(Math.max(0, safeIndex - 6), safeIndex + 1);
    const paddedTrend =
      visibleWindow.length < 7
        ? [...Array(7 - visibleWindow.length).fill(visibleWindow[0]), ...visibleWindow]
        : visibleWindow;

    return {
      ...item,
      hargaHariIni: today,
      hargaKemarin: yesterday,
      trend7d: paddedTrend,
    };
  });
}

/**
 * Simulate a market sync by perturbing today's price slightly.
 */
export function syncStapleItems(items: StapleItem[]): StapleItem[] {
  return items.map((item) => {
    const drift = (Math.random() - 0.45) * 0.025; // -1.1% to +1.4%
    const newPrice = Math.max(500, Math.round((item.hargaHariIni * (1 + drift)) / 50) * 50);
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
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: DASHBOARD_TIMEZONE,
  }).format(date);
}

export function formatSnapshotShort(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: DASHBOARD_TIMEZONE,
  }).format(date);
}

// re-export for convenience
export { stapleItems };
