import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, BrainCircuit, Leaf, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AI_RESPONSE =
  "Prediksi AI: Stok Minyak Goreng Curah diperkirakan menipis dalam 4 hari ke depan di regional Jawa Barat. Rekomendasi Tindakan: Segera aktifkan jalur distribusi cadangan (Sustainability Route B) dan berikan subsidi angkutan agar harga di tingkat konsumen tetap stabil di bawah Rp 17.000.";

const LOADING_MESSAGES = [
  "Menghubungkan ke node AI Sustainability...",
  "Menganalisis rantai pasok nasional...",
  "Mengkalkulasi proyeksi stok 7 hari...",
  "Menyusun rekomendasi tindakan...",
];

type Phase = "idle" | "loading" | "typing" | "done";

export function AIInsightCard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);
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

  const handleGenerate = () => {
    if (phase === "loading" || phase === "typing") return;
    setTyped("");
    setLoadingMsgIdx(0);
    setPhase("loading");

    const t1 = setTimeout(() => {
      setPhase("typing");
      let i = 0;
      const typeNext = () => {
        i++;
        setTyped(AI_RESPONSE.slice(0, i));
        if (i < AI_RESPONSE.length) {
          const t = setTimeout(typeNext, 18);
          timeoutsRef.current.push(t);
        } else {
          setPhase("done");
        }
      };
      typeNext();
    }, 2000);
    timeoutsRef.current.push(t1);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(AI_RESPONSE);
    setCopied(true);
    toast.success("Insight AI disalin ke clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Animated glow border */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-lg opacity-70"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.22 290 / 0.35), oklch(0.6 0.18 250 / 0.25), oklch(0.55 0.22 290 / 0.35))",
          padding: "1px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative rounded-lg bg-card shadow-[0_0_40px_-12px_oklch(0.55_0.22_290/0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-[oklch(0.97_0.03_290)] via-card to-[oklch(0.97_0.03_250)] px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-md bg-[oklch(0.55_0.22_290)] opacity-30 blur-md" />
              <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.55_0.22_290)] to-[oklch(0.45_0.2_260)] text-white shadow">
                <BrainCircuit className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
                SIPANGAN AI · Predictive Market Analysis
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Powered by Sustainability Engine v2.1
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-[oklch(0.55_0.22_290/0.3)] bg-[oklch(0.55_0.22_290/0.08)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.45_0.22_290)]">
            <Leaf className="h-3 w-3" />
            Sustainability Mode
          </span>
        </div>

        <div className="px-5 py-5">
          {phase === "idle" && (
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-2xl text-sm text-muted-foreground">
                Aktifkan analisis prediktif untuk mendapatkan rekomendasi
                stabilisasi harga berbasis machine learning, didukung data rantai
                pasok 514 kota/kabupaten.
              </p>
              <Button
                onClick={handleGenerate}
                className="relative h-10 gap-2 bg-gradient-to-r from-[oklch(0.45_0.22_290)] to-[oklch(0.4_0.2_260)] text-sm font-semibold text-white shadow-[0_8px_24px_-8px_oklch(0.45_0.22_290/0.6)] transition-transform hover:-translate-y-0.5 hover:from-[oklch(0.5_0.22_290)] hover:to-[oklch(0.45_0.2_260)]"
              >
                <Sparkles className="h-4 w-4" />
                Generate AI Sustainability Insight
              </Button>
            </div>
          )}

          {phase === "loading" && (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-[oklch(0.55_0.22_290/0.3)] bg-[oklch(0.55_0.22_290/0.04)] px-4 py-5">
              <Loader2 className="h-5 w-5 animate-spin text-[oklch(0.45_0.22_290)]" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  AI sedang menganalisis rantai pasok nasional...
                </p>
                <p className="font-tabular text-[11px] uppercase tracking-wider text-muted-foreground">
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </p>
              </div>
            </div>
          )}

          {(phase === "typing" || phase === "done") && (
            <div className="space-y-3">
              <div className="rounded-md border border-[oklch(0.55_0.22_290/0.25)] bg-gradient-to-br from-[oklch(0.98_0.02_290)] to-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[oklch(0.45_0.22_290)]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.45_0.22_290)]">
                    Hasil Analisis AI
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {typed}
                  {phase === "typing" && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-[1px] animate-pulse bg-[oklch(0.45_0.22_290)] align-middle" />
                  )}
                </p>
              </div>
              {phase === "done" && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 font-tabular text-[10px] uppercase tracking-wider">
                    <span className="rounded-sm bg-muted px-2 py-1 text-muted-foreground">
                      Confidence: 92.4%
                    </span>
                    <span className="rounded-sm bg-success-soft px-2 py-1 text-success">
                      Sustainability Route B
                    </span>
                    <span className="rounded-sm bg-danger-soft px-2 py-1 text-destructive">
                      Risk: Sedang
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
                      className="h-8 gap-1.5 bg-gradient-to-r from-[oklch(0.45_0.22_290)] to-[oklch(0.4_0.2_260)] text-xs text-white"
                      onClick={handleGenerate}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Analisis Ulang
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

void cn;
