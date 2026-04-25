import { type StapleItem } from "./staple-data";

export type CityKey = "jakarta" | "bandung" | "medan" | "banda-aceh" | "lhokseumawe";

export interface CityProfile {
  key: CityKey;
  label: string;
  shortLabel: string;
  umkm: string;
  inflation: string;
  badge: string;
  note: string;
  multipliers: Partial<Record<string, number>>;
  overrides: Partial<Record<string, number>>;
}

export const CITY_PROFILES: CityProfile[] = [
  {
    key: "jakarta",
    label: "Jakarta",
    shortLabel: "Jakarta",
    umkm: "Nasional",
    inflation: "2.84%",
    badge: "Data Nasional",
    note: "Benchmark konsumsi nasional dan pasar induk utama.",
    multipliers: { "cabai-merah": 0.98, "cabai-rawit": 0.96, "beras-premium": 1.02 },
    overrides: {},
  },
  {
    key: "bandung",
    label: "Bandung",
    shortLabel: "Bandung",
    umkm: "Nasional",
    inflation: "2.71%",
    badge: "Data Nasional",
    note: "Harga standar kota besar dengan tekanan distribusi moderat.",
    multipliers: { "cabai-merah": 0.94, "cabai-rawit": 0.95, "minyak-goreng": 0.98 },
    overrides: {},
  },
  {
    key: "medan",
    label: "Medan",
    shortLabel: "Medan",
    umkm: "Supply Hub",
    inflation: "2.49%",
    badge: "Pusat Pasokan (Supply Hub)",
    note: "Kota pemasok utama Sumatera bagian utara untuk komoditas cabai dan bumbu.",
    multipliers: { "cabai-rawit": 0.78, "bawang-merah": 0.86, "bawang-putih": 0.9 },
    overrides: { "cabai-merah": 35000 },
  },
  {
    key: "banda-aceh",
    label: "Banda Aceh",
    shortLabel: "Banda Aceh",
    umkm: "Provinsi",
    inflation: "3.21%",
    badge: "Benchmark Provinsi Aceh",
    note: "Pembanding provinsi untuk membaca deviasi harga Lhokseumawe.",
    multipliers: { "cabai-merah": 0.92, "cabai-rawit": 0.9, "beras-premium": 0.99 },
    overrides: {},
  },
  {
    key: "lhokseumawe",
    label: "Lhokseumawe (Aceh)",
    shortLabel: "Lhokseumawe",
    umkm: "6,800+ UMKM",
    inflation: "6.69%",
    badge: "Fokus RAKAN UMKM",
    note: "Harga lokal prioritas untuk pemantauan UMKM Kota Lhokseumawe.",
    multipliers: { "cabai-rawit": 0.92, "bawang-merah": 0.96, "minyak-goreng": 1.01 },
    overrides: { "cabai-merah": 45000 },
  },
];

export const DEFAULT_CITY_KEY: CityKey = "lhokseumawe";

export function getCityProfile(key: CityKey) {
  return CITY_PROFILES.find((city) => city.key === key) ?? CITY_PROFILES[4];
}

export function applyCityProfile(items: StapleItem[], city: CityProfile): StapleItem[] {
  return items.map((item) => {
    const targetPrice = city.overrides[item.id] ?? Math.round((item.hargaHariIni * (city.multipliers[item.id] ?? 1)) / 50) * 50;
    const delta = targetPrice - item.hargaHariIni;
    const adjustedTrend = item.trend7d.map((price, index) => {
      const weight = (index + 1) / item.trend7d.length;
      return Math.max(500, Math.round((price + delta * weight) / 50) * 50);
    });

    return {
      ...item,
      hargaHariIni: targetPrice,
      hargaKemarin: adjustedTrend[adjustedTrend.length - 2] ?? item.hargaKemarin,
      trend7d: adjustedTrend,
    };
  });
}