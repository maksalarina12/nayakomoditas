import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { Activity, Loader2, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { buildTrendData, formatRupiah, getSelisih, type StapleItem } from "@/lib/staple-data";
import { cn } from "@/lib/utils";

interface Props {
  item: StapleItem;
  loading: boolean;
  selectedDateLabel: string;
}

export function TrendChart({ item, loading, selectedDateLabel }: Props) {
  const data = useMemo(() => buildTrendData(item), [item]);
  const { diff, pct, status } = getSelisih(item);
  const max = Math.max(...item.trend7d);
  const min = Math.min(...item.trend7d);
  const avg = item.trend7d.reduce((a, b) => a + b, 0) / item.trend7d.length;
  const isUp = status === "naik";
  const lineColor = status === "naik" ? "var(--destructive)" : status === "turun" ? "var(--success)" : "var(--navy)";
  const DailyIcon = status === "naik" ? TrendingUp : status === "turun" ? TrendingDown : Minus;

  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-slate-header px-5 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-navy" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
            Grafik Volatilitas Harga 7 Hari
          </h2>
        </div>
        <div className="flex items-center gap-2 font-tabular text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-success" />
          Snapshot · {selectedDateLabel}
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <StatCell label="Komoditas Aktif" value={item.nama} mono={false} />
        <StatCell label="Harga Saat Ini" value={formatRupiah(item.hargaHariIni)} accent="navy" />
        <StatCell
          label="Perubahan Harian"
          value={`${diff > 0 ? "+" : ""}${diff.toLocaleString("id-ID")} (${pct.toFixed(2)}%)`}
          accent={isUp ? "danger" : status === "turun" ? "success" : "muted"}
          icon={DailyIcon}
        />
        <StatCell label="Rata-rata 7 Hari" value={formatRupiah(Math.round(avg))} />
      </div>

      <div className="relative px-2 pb-3 pt-5 sm:px-5">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-card/85 backdrop-blur-sm">
            <Loader2 className="h-7 w-7 animate-spin text-navy" />
            <p className="font-tabular text-[11px] uppercase tracking-wider text-muted-foreground">
              Mengambil data pasar...
            </p>
          </div>
        )}

        <div className="h-[260px] w-full sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="hari"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v) => `Rp ${(v / 1000).toFixed(1)}k`}
                domain={[(dataMin: number) => Math.floor(dataMin * 0.98), (dataMax: number) => Math.ceil(dataMax * 1.02)]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--navy)", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <ReferenceLine y={avg} stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: "AVG", position: "right", fill: "var(--muted-foreground)", fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="harga"
                stroke={lineColor}
                strokeWidth={2.5}
                fill="url(#trendFill)"
                dot={{ r: 3, fill: "var(--card)", stroke: lineColor, strokeWidth: 2 }}
                activeDot={{ r: 5, fill: lineColor, stroke: "var(--card)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 font-tabular text-[11px] uppercase tracking-wider">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-muted-foreground">
              Tertinggi: <span className="font-bold text-destructive">{formatRupiah(max)}</span>
            </span>
            <span className="text-muted-foreground">
              Terendah: <span className="font-bold text-success">{formatRupiah(min)}</span>
            </span>
            <span className="text-muted-foreground">
              Volatilitas: <span className="font-bold text-navy">{(((max - min) / min) * 100).toFixed(2)}%</span>
            </span>
          </div>
          <span className="text-muted-foreground">Sumber: PIHPS Nasional · Bank Indonesia</span>
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  accent = "default",
  icon: Icon,
  mono = true,
}: {
  label: string;
  value: string;
  accent?: "default" | "navy" | "danger" | "success" | "muted";
  icon?: React.ComponentType<{ className?: string }>;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 bg-card px-4 py-3 sm:px-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div
        className={cn(
          "mt-1 flex items-center gap-1.5 text-sm font-bold",
          mono && "font-tabular",
          accent === "navy" && "text-navy",
          accent === "danger" && "text-destructive",
          accent === "success" && "text-success",
          accent === "muted" && "text-muted-foreground",
          accent === "default" && "text-foreground",
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span className="min-w-0 truncate">{value}</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { label: string; harga: number } }> }) {
  if (!active || !payload?.length) return null;
  const { label, harga } = payload[0].payload;
  return (
    <div className="rounded-sm border border-navy/30 bg-card px-3 py-2 shadow-lg">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-tabular text-sm font-bold text-navy">{formatRupiah(harga)}</p>
    </div>
  );
}
