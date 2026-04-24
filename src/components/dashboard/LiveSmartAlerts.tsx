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

const LEVEL_CONFIG: Record<AlertLevel, {
  icon: typeof AlertTriangle;
  iconClass: string;
  ringClass: string;
  badge: string;
  badgeClass: string;
}> = {
  warning: {
    icon: TrendingUp,
    iconClass: "text-warning bg-warning-soft",
    ringClass: "ring-warning/30",
    badge: "Peringatan",
    badgeClass: "bg-warning-soft text-warning",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-success bg-success-soft",
    ringClass: "ring-success/20",
    badge: "Stabil",
    badgeClass: "bg-success-soft text-success",
  },
  danger: {
    icon: AlertTriangle,
    iconClass: "text-destructive bg-danger-soft",
    ringClass: "ring-destructive/20",
    badge: "Kritis",
    badgeClass: "bg-danger-soft text-destructive",
  },
  info: {
    icon: Info,
    iconClass: "text-navy bg-accent",
    ringClass: "ring-navy/20",
    badge: "Info",
    badgeClass: "bg-accent text-navy",
  },
};

export function LiveSmartAlerts() {
  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-slate-header px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-destructive opacity-60" />
            <Radio className="h-4 w-4 text-destructive" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
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
                  config.ringClass,
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
                <p className="text-xs font-semibold leading-snug text-foreground">
                  {alert.message}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{alert.region}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border bg-slate-header px-4 py-2 font-tabular text-[10px] uppercase tracking-wider text-muted-foreground">
        Sumber: Sensor IoT pasar · Sentinel AI Indonesia
      </div>
    </div>
  );
}
