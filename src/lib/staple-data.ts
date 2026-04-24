export type Status = "naik" | "turun" | "stabil";

export interface StapleItem {
  id: string;
  nama: string;
  kategori: string;
  hargaKemarin: number;
  hargaHariIni: number;
  satuan: string;
  trend7d: number[];
}

export const stapleItems: StapleItem[] = [
  {
    id: "beras-premium",
    nama: "Beras Premium",
    kategori: "Beras & Serealia",
    hargaKemarin: 15800,
    hargaHariIni: 16250,
    satuan: "kg",
    trend7d: [15500, 15600, 15750, 15800, 15700, 15800, 16250],
  },
  {
    id: "gula-pasir",
    nama: "Gula Pasir Lokal",
    kategori: "Bahan Pemanis",
    hargaKemarin: 18500,
    hargaHariIni: 18200,
    satuan: "kg",
    trend7d: [18800, 18700, 18600, 18550, 18500, 18500, 18200],
  },
  {
    id: "minyak-goreng",
    nama: "Minyak Goreng Curah",
    kategori: "Minyak & Lemak",
    hargaKemarin: 16200,
    hargaHariIni: 16850,
    satuan: "liter",
    trend7d: [15900, 16000, 16100, 16100, 16200, 16200, 16850],
  },
  {
    id: "telur-ayam",
    nama: "Telur Ayam Ras",
    kategori: "Protein Hewani",
    hargaKemarin: 29500,
    hargaHariIni: 28750,
    satuan: "kg",
    trend7d: [30200, 30100, 29800, 29600, 29500, 29500, 28750],
  },
  {
    id: "daging-sapi",
    nama: "Daging Sapi Murni",
    kategori: "Protein Hewani",
    hargaKemarin: 138000,
    hargaHariIni: 139500,
    satuan: "kg",
    trend7d: [137000, 137500, 138000, 138000, 138500, 138000, 139500],
  },
  {
    id: "daging-ayam",
    nama: "Daging Ayam Ras",
    kategori: "Protein Hewani",
    hargaKemarin: 36500,
    hargaHariIni: 37200,
    satuan: "kg",
    trend7d: [35800, 36000, 36200, 36400, 36500, 36500, 37200],
  },
  {
    id: "bawang-merah",
    nama: "Bawang Merah",
    kategori: "Bumbu Dapur",
    hargaKemarin: 42000,
    hargaHariIni: 39500,
    satuan: "kg",
    trend7d: [44000, 43500, 43000, 42500, 42000, 42000, 39500],
  },
  {
    id: "bawang-putih",
    nama: "Bawang Putih Bonggol",
    kategori: "Bumbu Dapur",
    hargaKemarin: 38500,
    hargaHariIni: 38500,
    satuan: "kg",
    trend7d: [38000, 38200, 38500, 38500, 38500, 38500, 38500],
  },
  {
    id: "cabai-merah",
    nama: "Cabai Merah Keriting",
    kategori: "Sayuran",
    hargaKemarin: 52000,
    hargaHariIni: 58500,
    satuan: "kg",
    trend7d: [48000, 49000, 50500, 51000, 52000, 52000, 58500],
  },
  {
    id: "cabai-rawit",
    nama: "Cabai Rawit Merah",
    kategori: "Sayuran",
    hargaKemarin: 68000,
    hargaHariIni: 75000,
    satuan: "kg",
    trend7d: [62000, 64000, 65500, 67000, 68000, 68000, 75000],
  },
  {
    id: "tepung-terigu",
    nama: "Tepung Terigu Segitiga",
    kategori: "Bahan Pokok",
    hargaKemarin: 13200,
    hargaHariIni: 13100,
    satuan: "kg",
    trend7d: [13300, 13300, 13250, 13200, 13200, 13200, 13100],
  },
  {
    id: "kedelai",
    nama: "Kedelai Impor",
    kategori: "Beras & Serealia",
    hargaKemarin: 13800,
    hargaHariIni: 14100,
    satuan: "kg",
    trend7d: [13600, 13700, 13750, 13800, 13800, 13800, 14100],
  },
];

export function formatRupiah(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

export function getSelisih(item: StapleItem) {
  const diff = item.hargaHariIni - item.hargaKemarin;
  const pct = (diff / item.hargaKemarin) * 100;
  const status: Status = diff > 0 ? "naik" : diff < 0 ? "turun" : "stabil";
  return { diff, pct, status };
}

export function buildTrendData(item: StapleItem) {
  const labels = ["6 hari lalu", "5 hari lalu", "4 hari lalu", "3 hari lalu", "2 hari lalu", "Kemarin", "Hari Ini"];
  return item.trend7d.map((harga, i) => ({
    label: labels[i],
    hari: `H-${6 - i}`,
    harga,
  }));
}
