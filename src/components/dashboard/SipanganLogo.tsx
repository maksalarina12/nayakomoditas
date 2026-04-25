import { LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** When true, hides the text label on small screens (icon-only). */
  compact?: boolean;
  /** Use light text styling — for placement on dark navy backgrounds. */
  onDark?: boolean;
}

export function SipanganLogo({ compact = false, onDark = false }: Props) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border shadow-sm sm:h-10 sm:w-10",
          onDark
            ? "border-navy-foreground/25 bg-navy-foreground/10"
            : "border-primary/20 bg-primary/5",
        )}
      >
        <div
          className={cn(
            "absolute inset-[6px] rounded-[5px] border",
            onDark ? "border-navy-foreground/20" : "border-primary/15",
          )}
        />
        <svg
          viewBox="0 0 40 40"
          aria-hidden
          className={cn("h-6 w-6 sm:h-7 sm:w-7", onDark ? "text-navy-foreground" : "text-primary")}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 25.5C10.5 22.5 12.75 21 15.5 21C19 21 20.5 24 24 24C26.75 24 28.5 22.5 32 18.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 18.5C11 15.75 13.75 14 17.25 14C21 14 22.5 17 26 17C28.25 17 30 16 31.5 14.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
        </svg>
      </div>

      <div className={cn("min-w-0", compact && "hidden sm:block")}>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-bold tracking-wide",
              onDark ? "text-navy-foreground" : "text-foreground",
            )}
          >
            RAKAN UMKM
          </span>
          {!compact && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                onDark
                  ? "border-navy-foreground/30 bg-navy-foreground/10 text-navy-foreground"
                  : "border-primary/15 bg-primary/5 text-primary",
              )}
            >
              <LineChart className="h-3 w-3" />
              AI
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-[11px]",
            onDark ? "text-navy-foreground/70" : "text-muted-foreground",
          )}
        >
          Smart Price Monitoring Lhokseumawe
        </p>
      </div>
    </div>
  );
}
