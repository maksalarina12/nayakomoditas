import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah, getSelisih, type StapleItem } from "@/lib/staple-data";

interface Props {
  item: StapleItem;
  active: boolean;
  onClick: () => void;
}

export function MetricCard({ item, active, onClick }: Props) {
  const { pct, status } = getSelisih(item);
  const Icon = status === "naik" ? TrendingUp : status === "turun" ? TrendingDown : Minus;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-md border bg-card p-4 text-left transition-all sm:p-5",
        "sm:hover:-translate-y-0.5 sm:hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]",
        active
          ? "border-navy ring-2 ring-navy/15"
          : "border-border hover:border-navy/40",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          status === "naik" ? "bg-destructive" : status === "turun" ? "bg-success" : "bg-muted-foreground/30",
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.kategori}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-foreground sm:text-base">{item.nama}</h3>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 font-tabular text-xs font-bold",
            status === "naik"
              ? "bg-danger-soft text-destructive"
              : status === "turun"
                ? "bg-success-soft text-success"
                : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-3 w-3" />
          {pct >= 0 ? "+" : ""}
          {pct.toFixed(2)}%
        </span>
      </div>

      <div className="mt-4">
        <div className="font-tabular text-xl font-bold tracking-tight text-navy sm:text-2xl">
          {formatRupiah(item.hargaHariIni)}
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Sebelumnya
          </span>
          <span className="font-tabular text-xs text-muted-foreground line-through">
            {formatRupiah(item.hargaKemarin)}
          </span>
          <span className="text-[11px] text-muted-foreground">/ {item.satuan}</span>
        </div>
      </div>
    </button>
  );
}
