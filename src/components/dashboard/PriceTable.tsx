import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah, getSelisih, type StapleItem } from "@/lib/staple-data";

interface Props {
  items: StapleItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function PriceTable({ items, selectedId, onSelect }: Props) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-slate-header px-5 py-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
            Tabel Harga Komoditas
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pembaruan harian dari pasar tradisional & modern
          </p>
        </div>
        <span className="hidden font-tabular text-[11px] uppercase tracking-wider text-muted-foreground sm:inline">
          {items.length} Item
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-header/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 text-left">Nama Barang</th>
              <th className="px-5 py-3 text-left">Kategori</th>
              <th className="px-5 py-3 text-right">Harga Kemarin</th>
              <th className="px-5 py-3 text-right">Harga Hari Ini</th>
              <th className="px-5 py-3 text-right">Selisih (Rp)</th>
              <th className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const { diff, pct, status } = getSelisih(item);
              const isSelected = item.id === selectedId;
              const Arrow = status === "naik" ? ArrowUp : status === "turun" ? ArrowDown : ArrowRight;
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "cursor-pointer border-b border-border/60 transition-colors",
                    idx % 2 === 1 && !isSelected && "bg-table-stripe",
                    isSelected
                      ? "bg-navy/5 hover:bg-navy/10"
                      : "hover:bg-accent",
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {isSelected && <span className="h-6 w-1 rounded-full bg-navy" />}
                      <div>
                        <div className="font-semibold text-foreground">{item.nama}</div>
                        <div className="text-[11px] text-muted-foreground">per {item.satuan}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{item.kategori}</td>
                  <td className="px-5 py-3.5 text-right font-tabular text-muted-foreground">
                    {formatRupiah(item.hargaKemarin)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-tabular font-bold text-navy">
                    {formatRupiah(item.hargaHariIni)}
                  </td>
                  <td
                    className={cn(
                      "px-5 py-3.5 text-right font-tabular font-semibold",
                      status === "naik" && "text-destructive",
                      status === "turun" && "text-success",
                      status === "stabil" && "text-muted-foreground",
                    )}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-sm border px-2 py-1 font-tabular text-[11px] font-bold uppercase",
                          status === "naik" &&
                            "border-destructive/30 bg-danger-soft text-destructive",
                          status === "turun" &&
                            "border-success/30 bg-success-soft text-success",
                          status === "stabil" &&
                            "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        <Arrow className="h-3 w-3" />
                        {status} {pct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
