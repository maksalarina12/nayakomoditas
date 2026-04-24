import { AlertTriangle, CheckCircle2, Info, Radio, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertLevel = "warning" | "success" | "info" | "danger";

interface AlertItem {
  id: string;
  level: AlertLevel;
  message: string;
  region: string;
  timeAgo: string;
}

const ALERTS: AlertItem[] = [
  {
    id: "a1",
    level: "warning",
    message: "Lonjakan permintaan Telur Ayam terdeteksi di Pasar Induk (+15%).",
    region: "DKI Jakarta · Pasar Induk Kramat Jati",
    timeAgo: "2 menit lalu",
  },
  {
    id: "a2",
    level: "success",
    message: "Harga Beras Premium berhasil distabilkan melalui Operasi Pasar.",
    region: "Jawa Tengah · 14 kota terdampak",
    timeAgo: "12 menit lalu",
  },
  {
    id: "a3",
    level: "danger",
    message: "Cabai Rawit Merah melonjak +10.3% akibat curah hujan tinggi.",
    region: "Jawa Timur · Sentra produksi Kediri",
    timeAgo: "27 menit lalu",
  },
  {
    id: "a4",
    level: "info",
    message: "Bantuan logistik Sustainability Route B aktif menuju Bandung.",
    region: "Jawa Barat · ETA 6 jam",
    timeAgo: "41 menit lalu",
  },
  {
    id: "a5",
    level: "success",
    message: "Stok Bawang Merah Brebes naik 8% pasca panen raya.",
    region: "Jawa Tengah · Brebes & Tegal",
    timeAgo: "1 jam lalu",
  },
];

// FIXED: Menggunakan standard Tailwind classes dengan dukungan dark mode dinamis
const LEVEL_CONFIG: Record<AlertLevel, {
  icon: typeof AlertTriangle;
  iconClass: string;
  ringClass: string;
  badge: string;
  badgeClass: string;
}> = {
  warning: {
    icon: TrendingUp,
    iconClass: "text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400",
    ringClass: "ring-amber-300 dark:ring-amber-500/30",
    badge: "Peringatan",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400",
    ringClass: "ring-emerald-300 dark:ring-emerald-500/30",
    badge: "Stabil",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  danger: {
    icon: AlertTriangle,
    iconClass: "text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400",
    ringClass: "ring-red-300 dark:ring-red-500/30",
    badge: "Kritis",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400",
    ringClass: "ring-blue-300 dark:ring-blue-500/30",
    badge: "Info",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400",
  },
};

export function LiveSmartAlerts() {
  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-card">
      {/* FIXED: bg-slate-header diganti bg-muted/50 agar nyambung di kedua tema */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-destructive opacity-60" />
            <Radio className="h-4 w-4 text-destructive" />
          </div>
          {/* FIXED: text-navy diganti text-foreground agar kelihatan di dark mode */}
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Live Smart Alerts
          </h2>
        </div>
        <span className="font-tabular text-[10px] uppercase tracking-wider text-muted-foreground">
          {ALERTS.length} sinyal aktif
        </span>
      </div>

      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {ALERTS.map((alert) => {
          const config = LEVEL_CONFIG[alert.level];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className="group flex gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1",
                  config.iconClass,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                      config.badgeClass,
                    )}
                  >
                    {config.badge}
                  </span>
                  <span className="font-tabular text-[10px] uppercase tracking-wider text-muted-foreground">
                    {alert.timeAgo}
                  </span>
                </div>
                {/* Teks message utama sudah text-foreground, aman */}
                <p className="text-xs font-semibold leading-snug text-foreground">
                  {alert.message}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{alert.region}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border bg-muted/50 px-4 py-2 font-tabular text-[10px] uppercase tracking-wider text-muted-foreground">
        Sumber: Sensor IoT pasar · Sentinel AI Indonesia
      </div>
    </div>
  );
}
