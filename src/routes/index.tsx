import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PriceTable } from "@/components/dashboard/PriceTable";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { stapleItems } from "@/lib/staple-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard Harga Bahan Pokok · SIPANGAN" },
      {
        name: "description",
        content:
          "Sistem pemantauan harga bahan pokok harian dengan analisis volatilitas dan laporan inflasi.",
      },
    ],
  }),
});

const featuredIds = ["beras-premium", "gula-pasir", "minyak-goreng", "telur-ayam"];

function DashboardPage() {
  const featured = useMemo(
    () => featuredIds.map((id) => stapleItems.find((i) => i.id === id)!),
    [],
  );
  const [selectedId, setSelectedId] = useState<string>("beras-premium");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selected = stapleItems.find((i) => i.id === selectedId)!;

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setLoading(true);
    setTimeout(() => {
      setSelectedId(id);
      setLoading(false);
    }, 700);
  };

  const handleAction = (label: string) => {
    setToast(`${label} sedang diproses...`);
    setTimeout(() => setToast(null), 2200);
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy-foreground/10 ring-1 ring-navy-foreground/20">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">SIPANGAN · Sistem Informasi Pangan Nasional</h1>
              <p className="text-[11px] text-navy-foreground/70">
                Direktorat Stabilitas Harga Pokok · Republik Indonesia
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-[11px] md:flex">
            <span className="inline-flex items-center gap-1.5 text-navy-foreground/80">
              <ShieldCheck className="h-3.5 w-3.5" /> Data Terverifikasi
            </span>
            <span className="font-tabular text-navy-foreground/70">
              {today}
            </span>
          </div>
        </div>
      </header>

      {/* Sub Header / Toolbar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Dashboard Eksekutif
            </p>
            <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-navy">
              Pemantauan Harga Bahan Pokok
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari komoditas..."
                className="h-9 w-56 rounded-sm border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-navy/15"
              />
            </div>
            <ToolbarButton icon={Calendar} onClick={() => handleAction("Filter Tanggal")}>
              Filter Tanggal
            </ToolbarButton>
            <ToolbarButton icon={RefreshCw} onClick={() => handleAction("Sinkronisasi Data")}>
              Sinkronisasi
            </ToolbarButton>
            <ToolbarButton
              icon={FileSpreadsheet}
              onClick={() => handleAction("Export Excel")}
              variant="success"
            >
              Export Excel
            </ToolbarButton>
            <ToolbarButton
              icon={FileText}
              onClick={() => handleAction("Download Laporan PDF")}
              variant="primary"
            >
              Download Laporan (PDF)
            </ToolbarButton>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] space-y-6 px-6 py-6">
        {/* Section: Executive Summary */}
        <section>
          <SectionHeader
            label="Ringkasan Eksekutif"
            sub="4 Komoditas Utama Terpantau"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <MetricCard
                key={item.id}
                item={item}
                active={item.id === selectedId}
                onClick={() => handleSelect(item.id)}
              />
            ))}
          </div>
        </section>

        {/* Section: Chart */}
        <section>
          <TrendChart item={selected} loading={loading} />
        </section>

        {/* Section: Table */}
        <section>
          <SectionHeader
            label="Buku Besar Harga Komoditas"
            sub="Klik baris untuk memuat grafik volatilitas"
          />
          <PriceTable
            items={stapleItems}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
          <p>
            © {new Date().getFullYear()} SIPANGAN · Data harga merupakan rata-rata nasional dari 514 kota/kabupaten.
          </p>
          <p className="font-tabular uppercase tracking-wider">
            Versi 4.2.1 · Audit Internal Lulus
          </p>
        </footer>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-sm border border-navy/30 bg-card px-4 py-3 shadow-2xl">
          <Download className="h-4 w-4 text-navy" />
          <p className="text-sm font-medium text-foreground">{toast}</p>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2">
      <h3 className="text-sm font-bold uppercase tracking-wider text-navy">{label}</h3>
      {sub && (
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {sub}
        </span>
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  icon: Icon,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "primary" | "success";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-sm border px-3 text-xs font-semibold transition-all",
        "hover:-translate-y-0.5 active:translate-y-0",
        variant === "default" &&
          "border-border bg-card text-foreground hover:border-navy/40 hover:bg-accent hover:text-navy",
        variant === "primary" &&
          "border-navy bg-navy text-navy-foreground hover:bg-navy/90",
        variant === "success" &&
          "border-success bg-success text-success-foreground hover:bg-success/90",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
