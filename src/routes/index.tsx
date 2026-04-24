import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { LiveSmartAlerts } from "@/components/dashboard/LiveSmartAlerts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PriceTable } from "@/components/dashboard/PriceTable";
import { SipanganLogo } from "@/components/dashboard/SipanganLogo";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { exportDashboardToExcel, exportDashboardToPdf } from "@/lib/dashboard-exports";
import {
  buildSnapshotItems,
  formatSnapshotDate,
  getAvailableSnapshotDates,
  getSnapshotIndex,
  syncStapleItems,
} from "@/lib/dashboard-utils";
import { stapleItems } from "@/lib/staple-data";
import { applyTheme, resolveTheme, setTheme, type AppTheme } from "@/lib/theme";

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
  const availableDates = useMemo(() => getAvailableSnapshotDates(), []);
  const [baseItems, setBaseItems] = useState(stapleItems);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(availableDates[availableDates.length - 1]);
  const [selectedId, setSelectedId] = useState<string>("beras-premium");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [themeMode, setThemeMode] = useState<AppTheme>("light");

  useEffect(() => {
    const initialTheme = resolveTheme();
    setThemeMode(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const snapshotIndex = useMemo(
    () => getSnapshotIndex(selectedDate, availableDates),
    [availableDates, selectedDate],
  );

  const snapshotItems = useMemo(
    () => buildSnapshotItems(baseItems, snapshotIndex),
    [baseItems, snapshotIndex],
  );

  const featured = useMemo(
    () => featuredIds.map((id) => snapshotItems.find((item) => item.id === id)!).filter(Boolean),
    [snapshotItems],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return snapshotItems;

    return snapshotItems.filter((item) => {
      const haystack = `${item.nama} ${item.kategori} ${item.satuan}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query, snapshotItems]);

  useEffect(() => {
    if (filteredItems.some((item) => item.id === selectedId)) return;
    setSelectedId(filteredItems[0]?.id ?? snapshotItems[0]?.id ?? "beras-premium");
  }, [filteredItems, selectedId, snapshotItems]);

  const selected =
    snapshotItems.find((item) => item.id === selectedId) ?? featured[0] ?? snapshotItems[0];

  const selectedDateLabel = formatSnapshotDate(selectedDate);

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setLoading(true);
    setTimeout(() => {
      setSelectedId(id);
      setLoading(false);
    }, 350);
  };

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    setLoading(true);

    setTimeout(() => {
      setBaseItems((current) => syncStapleItems(current));
      setSyncing(false);
      setLoading(false);
      toast.success("Sinkronisasi berhasil", {
        description: "Data harga mock telah diperbarui untuk simulasi pasar terbaru.",
      });
    }, 900);
  };

  const handleExportExcel = () => {
    if (!filteredItems.length) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    exportDashboardToExcel(filteredItems, selectedDate);
    toast.success("File Excel berhasil dibuat", {
      description: `Snapshot ${selectedDateLabel} telah diunduh.`,
    });
  };

  const handleExportPdf = () => {
    if (!filteredItems.length) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    exportDashboardToPdf(filteredItems, selectedDate);
    toast.success("Laporan PDF berhasil dibuat", {
      description: `Ringkasan harga ${selectedDateLabel} telah diunduh.`,
    });
  };

  const handleToggleTheme = () => {
    const nextTheme: AppTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* FIXED: Ditambahkan dark:bg-card dan penyesuaian teks agar rapi di dark mode */}
      <header className="border-b border-border bg-navy text-navy-foreground shadow-sm dark:bg-card dark:text-foreground">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <SipanganLogo onDark />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-3 text-[11px] md:flex">
              {/* FIXED: Warna teks disesuaikan di dark mode */}
              <span className="inline-flex items-center gap-1.5 text-navy-foreground/85 dark:text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Data Terverifikasi
              </span>
              <span className="font-tabular text-navy-foreground/75 dark:text-muted-foreground">
                Snapshot {selectedDateLabel}
              </span>
            </div>
            <ThemeToggle theme={themeMode} onToggle={handleToggleTheme} onDark />
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Dashboard Eksekutif
            </p>
            {/* FIXED: text-navy diubah jadi dark:text-foreground */}
            <h1 className="mt-1 text-xl font-bold tracking-tight text-navy sm:text-2xl dark:text-foreground">
              Pemantauan Harga Bahan Pokok
            </h1>
            <p className="mt-1 font-tabular text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
              Snapshot {selectedDateLabel}
            </p>
          </div>
          <DashboardToolbar
            query={query}
            selectedDate={selectedDate}
            minDate={availableDates[0]}
            maxDate={availableDates[availableDates.length - 1]}
            syncing={syncing}
            onQueryChange={setQuery}
            onDateChange={(date) => date && setSelectedDate(date)}
            onSync={handleSync}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
          />
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6">
        <section className="dashboard-section">
          <SectionHeader label="Ringkasan Eksekutif" sub="4 Komoditas Utama Terpantau" />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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

        <section className="dashboard-section">
          <TrendChart item={selected} loading={loading} selectedDateLabel={selectedDateLabel} />
        </section>

        <section className="dashboard-section grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AIInsightCard />
          </div>
          <div className="lg:col-span-1">
            <LiveSmartAlerts />
          </div>
        </section>

        <section className="dashboard-section">
          <SectionHeader
            label="Buku Besar Harga Komoditas"
            sub={`${filteredItems.length} komoditas · Klik baris untuk memuat grafik volatilitas`}
          />
          {filteredItems.length ? (
            <PriceTable items={filteredItems} selectedId={selectedId} onSelect={handleSelect} />
          ) : (
            <div className="rounded-md border border-dashed border-border bg-card px-6 py-12 text-center">
              <p className="text-sm font-semibold text-foreground">Komoditas tidak ditemukan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ubah kata kunci pencarian atau pilih tanggal snapshot lain.
              </p>
            </div>
          )}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
          <p>© 2026 SIPANGAN · Data harga merupakan rata-rata nasional dari 514 kota/kabupaten.</p>
          <p className="font-tabular uppercase tracking-wider">Versi 4.2.1 · Audit Internal Lulus</p>
        </footer>
      </main>
    </div>
  );
}

// FIXED: text-navy diubah jadi dark:text-foreground
function SectionHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2">
      <h2 className="text-sm font-bold uppercase tracking-wider text-navy dark:text-foreground">{label}</h2>
      {sub && <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{sub}</span>}
    </div>
  );
}
