import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PriceTable } from "@/components/dashboard/PriceTable";
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
    }, 700);
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
    }, 1100);
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
              Snapshot {selectedDateLabel}
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
          <TrendChart item={selected} loading={loading} selectedDateLabel={selectedDateLabel} />
        </section>

        {/* Section: Table */}
        <section>
          <SectionHeader
            label="Buku Besar Harga Komoditas"
            sub={`${filteredItems.length} komoditas · Klik baris untuk memuat grafik volatilitas`}
          />
          {filteredItems.length ? (
            <PriceTable
              items={filteredItems}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
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
          <p>
            © 2026 SIPANGAN · Data harga merupakan rata-rata nasional dari 514 kota/kabupaten.
          </p>
          <p className="font-tabular uppercase tracking-wider">
            Versi 4.2.1 · Audit Internal Lulus
          </p>
        </footer>
      </main>

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
