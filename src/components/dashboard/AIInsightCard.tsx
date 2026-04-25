import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, BrainCircuit, Leaf, Copy, Check, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Phase = "idle" | "loading" | "typing" | "done";

interface RegionInsight {
  region: string;
  province: string;
  hotCommodity: string;
  trendNote: string;
  recommendation: string;
  route: string;
  riskLevel: "Rendah" | "Sedang" | "Tinggi";
  confidence: number;
  nearbyMarkets: string[];
}

const REGION_DB: RegionInsight[] = [
  {
    region: "Lhokseumawe",
    province: "Aceh",
    hotCommodity: "Cabai Merah Keriting",
    trendNote: "berada di Rp 45.000/kg dengan inflasi lokal terpantau 6,69%",
    recommendation:
      "Pantau pasokan dari Medan lebih awal, amankan stok cabai dan bumbu cepat jual sebelum gangguan distribusi berdampak ke kios UMKM.",
    route: "Koridor Pasok Medan-Lhokseumawe",
    riskLevel: "Tinggi",
    confidence: 94.8,
    nearbyMarkets: ["Pasar Inpres Lhokseumawe", "Pasar Pusong", "Pasar Batuphat", "Pasar Cunda"],
  },
  {
    region: "Banda Aceh",
    province: "Aceh",
    hotCommodity: "Cabai Merah Keriting",
    trendNote: "naik 12,8% dalam 5 hari akibat curah hujan tinggi di sentra Bener Meriah",
    recommendation:
      "Aktifkan pasokan dari Sumatera Utara via jalur lintas timur (Langsa) dan operasi pasar di Pasar Aceh & Pasar Peunayong.",
    route: "Sustainability Route Sumatera-Utara",
    riskLevel: "Sedang",
    confidence: 91.2,
    nearbyMarkets: ["Pasar Aceh", "Pasar Peunayong", "Pasar Lambaro", "Pasar Sigli"],
  },
  {
    region: "Medan",
    province: "Sumatera Utara",
    hotCommodity: "Bawang Merah",
    trendNote: "stabil cenderung turun 2,1% setelah panen raya Brebes masuk via Belawan",
    recommendation:
      "Pertahankan distribusi normal, fokuskan stok cadangan untuk kawasan timur (Asahan, Labuhanbatu).",
    route: "Sustainability Route Trans-Sumatera",
    riskLevel: "Rendah",
    confidence: 94.6,
    nearbyMarkets: ["Pasar Petisah", "Pasar Sambu", "Pusat Pasar Medan", "Pasar Marelan"],
  },
  {
    region: "Jakarta",
    province: "DKI Jakarta",
    hotCommodity: "Beras Premium",
    trendNote: "naik 2,8% karena peningkatan permintaan ritel modern menjelang akhir bulan",
    recommendation:
      "Lakukan operasi pasar Bulog di 5 pasar induk dengan harga HET Rp 13.900/kg, prioritaskan Cipinang & Kramat Jati.",
    route: "Sustainability Route Jawa-Tengah",
    riskLevel: "Sedang",
    confidence: 93.7,
    nearbyMarkets: ["Pasar Induk Cipinang", "Pasar Kramat Jati", "Pasar Senen", "Pasar Minggu"],
  },
  {
    region: "Bandung",
    province: "Jawa Barat",
    hotCommodity: "Minyak Goreng Curah",
    trendNote: "diperkirakan menipis dalam 4 hari ke depan akibat gangguan distribusi tol Cipularang",
    recommendation:
      "Aktifkan jalur distribusi cadangan (Sustainability Route B) dan subsidi angkutan agar konsumen tetap di bawah Rp 17.000.",
    route: "Sustainability Route B (Cikampek-Bandung)",
    riskLevel: "Tinggi",
    confidence: 92.4,
    nearbyMarkets: ["Pasar Caringin", "Pasar Andir", "Pasar Kosambi", "Pasar Kiaracondong"],
  },
  {
    region: "Surabaya",
    province: "Jawa Timur",
    hotCommodity: "Telur Ayam Ras",
    trendNote: "lonjakan permintaan +15% dari sektor HoReCa pasca event nasional",
    recommendation:
      "Koordinasi dengan PINSAR Jatim untuk pasokan dari Blitar & Kediri, monitor harga di Pasar Pabean & Keputran.",
    route: "Sustainability Route Jatim-Selatan",
    riskLevel: "Sedang",
    confidence: 89.8,
    nearbyMarkets: ["Pasar Pabean", "Pasar Keputran", "Pasar Wonokromo", "Pasar Genteng"],
  },
  {
    region: "Makassar",
    province: "Sulawesi Selatan",
    hotCommodity: "Daging Sapi",
    trendNote: "naik 4,2% akibat keterlambatan kapal ternak dari NTT",
    recommendation:
      "Percepat bongkar muat di Pelabuhan Soekarno-Hatta dan aktifkan stok beku Bulog regional.",
    route: "Sustainability Route Indonesia-Timur",
    riskLevel: "Sedang",
    confidence: 90.5,
    nearbyMarkets: ["Pasar Terong", "Pasar Daya", "Pasar Pa'baeng-baeng", "Pasar Sentral"],
  },
  {
    region: "Denpasar",
    province: "Bali",
    hotCommodity: "Cabai Rawit Merah",
    trendNote: "naik 8,5% karena lonjakan permintaan pariwisata & gangguan pasokan dari Jember",
    recommendation:
      "Buka jalur cepat penyeberangan Ketapang-Gilimanuk, prioritaskan distribusi ke Pasar Badung.",
    route: "Sustainability Route Banyuwangi-Bali",
    riskLevel: "Sedang",
    confidence: 88.9,
    nearbyMarkets: ["Pasar Badung", "Pasar Kreneng", "Pasar Sanglah", "Pasar Kumbasari"],
  },
  {
    region: "Pontianak",
    province: "Kalimantan Barat",
    hotCommodity: "Gula Pasir",
    trendNote: "stabil dengan stok aman 21 hari, harga di bawah HET Rp 14.500/kg",
    recommendation:
      "Pertahankan rotasi stok normal, monitor isu penyelundupan di perbatasan Entikong.",
    route: "Sustainability Route Kalimantan-Barat",
    riskLevel: "Rendah",
    confidence: 95.1,
    nearbyMarkets: ["Pasar Flamboyan", "Pasar Mawar", "Pasar Dahlia", "Pasar Kemuning"],
  },
];

const DEFAULT_REGION: RegionInsight = {
  region: "Lhokseumawe",
  province: "Aceh",
  hotCommodity: "Cabai Merah Keriting",
  trendNote: "terpantau sensitif terhadap pasokan Medan dengan inflasi lokal 6,69%",
  recommendation:
    "Rakan AI sebagai analis UMKM merekomendasikan stok lebih awal untuk cabai, bawang, dan minyak goreng saat arus barang Medan ke Lhokseumawe melambat.",
  route: "Koridor Pasok Medan-Lhokseumawe",
  riskLevel: "Tinggi",
  confidence: 94.8,
  nearbyMarkets: ["Pasar Inpres Lhokseumawe", "Pasar Pusong", "Pasar Batuphat", "Pasar Cunda"],
};

const LOADING_MESSAGES = [
  "Menghubungkan ke node AI Sustainability...",
  "Menganalisis rantai pasok regional...",
  "Mengkalkulasi proyeksi stok 7 hari...",
  "Menyusun rekomendasi tindakan lokal...",
];

function findRegion(query: string): RegionInsight {
  const q = query.trim().toLowerCase();
  if (!q) return DEFAULT_REGION;
  if (q.includes("kenapa harga naik") || q.includes("medan")) {
    return {
      ...DEFAULT_REGION,
      region: q.includes("medan") ? "Medan → Lhokseumawe" : "Lhokseumawe",
      trendNote:
        "mengalami lonjakan karena gangguan pasokan dari Medan, terutama pada cabai dan bumbu dapur yang bergerak cepat",
      recommendation:
        "UMKM disarankan mengamankan stok lebih awal, membagi pembelian ke beberapa pemasok, dan menaikkan buffer stok 2-3 hari sebelum distribusi Medan kembali normal.",
      riskLevel: "Tinggi",
    };
  }
  const exact = REGION_DB.find(
    (r) => r.region.toLowerCase() === q || r.province.toLowerCase() === q,
  );
  if (exact) return exact;
  const partial = REGION_DB.find(
    (r) => r.region.toLowerCase().includes(q) || r.province.toLowerCase().includes(q),
  );
  return partial ?? {
    ...DEFAULT_REGION,
    region: query.trim(),
    province: "Wilayah belum terindeks",
    trendNote:
      "data wilayah belum terhubung ke node AI lokal — rekomendasi diturunkan dari pola nasional terdekat",
  };
}

function buildResponse(insight: RegionInsight): string {
  return `Rakan AI sebagai Asisten Analitik UMKM Lhokseumawe membaca ${insight.region} (${insight.province}): komoditas paling diawasi adalah ${insight.hotCommodity}, ${insight.trendNote}. Rekomendasi untuk UMKM: ${insight.recommendation} Pasar prioritas pemantauan: ${insight.nearbyMarkets.slice(0, 3).join(", ")}.`;
}

export function AIInsightCard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);
  const [location, setLocation] = useState("");
  const [activeInsight, setActiveInsight] = useState<RegionInsight>(DEFAULT_REGION);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 600);
    return () => clearInterval(interval);
  }, [phase]);

  const runAnalysis = (insight: RegionInsight) => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setActiveInsight(insight);
    setTyped("");
    setLoadingMsgIdx(0);
    setPhase("loading");

    const response = buildResponse(insight);
    const t1 = setTimeout(() => {
      setPhase("typing");
      let i = 0;
      const typeNext = () => {
        i++;
        setTyped(response.slice(0, i));
        if (i < response.length) {
          const t = setTimeout(typeNext, 14);
          timeoutsRef.current.push(t);
        } else {
          setPhase("done");
        }
      };
      typeNext();
    }, 1800);
    timeoutsRef.current.push(t1);
  };

  const handleGenerate = () => {
    if (phase === "loading" || phase === "typing") return;
    runAnalysis(findRegion(location));
  };

  const handleQuickRegion = (name: string) => {
    if (phase === "loading" || phase === "typing") return;
    setLocation(name);
    runAnalysis(findRegion(name));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildResponse(activeInsight));
    setCopied(true);
    toast.success("Insight Rakan AI disalin ke clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const riskColor =
    activeInsight.riskLevel === "Tinggi"
      ? "bg-danger-soft text-destructive"
      : activeInsight.riskLevel === "Rendah"
        ? "bg-success-soft text-success"
        : "bg-warning-soft text-warning";

  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Animated glow border */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-lg opacity-70"
        style={{
          background:
            "linear-gradient(135deg, var(--ai) / 35%, var(--primary) / 25%, var(--ai) / 35%)",
          padding: "1px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative rounded-lg bg-card shadow-[0_0_40px_-12px_var(--ai)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-ai-soft/50 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-md bg-ai opacity-30 blur-md" />
              <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-ai text-white shadow">
                <BrainCircuit className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
                Rakan AI · Asisten Analitik UMKM Lhokseumawe
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Food Inflation · Market Prices · Supply Chain Medan
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-ai/30 bg-ai/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ai">
            <Leaf className="h-3 w-3" />
            Sustainability Mode
          </span>
        </div>

        <div className="space-y-4 px-4 py-5 sm:px-5">
          {/* Location chat input */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Tanya Rakan AI
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Kenapa harga naik? Medan, Banda Aceh..."
                  className="h-10 pl-8 text-sm"
                  disabled={phase === "loading" || phase === "typing"}
                />
              </div>
              <Button
                type="submit"
                disabled={phase === "loading" || phase === "typing"}
                className="h-10 gap-2 bg-ai text-sm font-semibold text-white shadow-[0_8px_24px_-8px_var(--ai)] transition-transform hover:-translate-y-0.5 hover:bg-ai/90"
              >
                {phase === "loading" || phase === "typing" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {phase === "idle" || phase === "done" ? "Tanya Rakan AI" : "Menganalisis..."}
              </Button>
            </form>

            {/* Quick region chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Cepat:
              </span>
              {["Lhokseumawe", "Medan", "Banda Aceh", "Jakarta", "Bandung", "Kenapa harga naik?"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleQuickRegion(r)}
                  disabled={phase === "loading" || phase === "typing"}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-ai/40 hover:bg-ai/10 hover:text-ai disabled:opacity-50"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {phase === "idle" && (
            <p className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
              Halo! Saya Rakan AI, asisten pintar RAKAN UMKM. Ada data harga atau tren inflasi yang ingin Anda cek hari ini?
            </p>
          )}

          {phase === "loading" && (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-ai/30 bg-ai/5 px-4 py-5">
              <Loader2 className="h-5 w-5 animate-spin text-ai" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Rakan AI sedang menganalisis {activeInsight.region}...
                </p>
                <p className="font-tabular text-[11px] uppercase tracking-wider text-muted-foreground">
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </p>
              </div>
            </div>
          )}

          {(phase === "typing" || phase === "done") && (
            <div className="space-y-3">
              <div className="rounded-md border border-ai/25 bg-ai-soft/40 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-ai" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ai">
                      Hasil Analisis Rakan AI
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-sm bg-navy/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">
                    <MapPin className="h-2.5 w-2.5" />
                    {activeInsight.region} · {activeInsight.province}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {typed}
                  {phase === "typing" && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-[1px] animate-pulse bg-ai align-middle" />
                  )}
                </p>
              </div>

              {phase === "done" && (
                <>
                  {/* Nearby markets recommendation */}
                  <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-success" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Rekomendasi Pasar Terdekat — {activeInsight.region}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeInsight.nearbyMarkets.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1 rounded-sm border border-success/30 bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success"
                        >
                          <MapPin className="h-2.5 w-2.5" />
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 font-tabular text-[10px] uppercase tracking-wider">
                      <span className="rounded-sm bg-muted px-2 py-1 text-muted-foreground">
                        Confidence: {activeInsight.confidence.toFixed(1)}%
                      </span>
                      <span className="rounded-sm bg-success-soft px-2 py-1 text-success">
                        {activeInsight.route}
                      </span>
                      <span className={`rounded-sm px-2 py-1 ${riskColor}`}>
                        Risk: {activeInsight.riskLevel}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        onClick={handleCopy}
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Disalin" : "Salin"}
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 gap-1.5 bg-ai text-xs text-white hover:bg-ai/90"
                        onClick={handleGenerate}
                      >
                        <Send className="h-3.5 w-3.5" />
                        Tanya Lagi
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
