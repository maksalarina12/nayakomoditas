import { LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
}

export function SipanganLogo({ compact = false }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-primary/20 bg-primary/5 shadow-sm">
        <div className="absolute inset-[6px] rounded-[5px] border border-primary/15" />
        <svg
          viewBox="0 0 40 40"
          aria-hidden
          className="h-7 w-7 text-primary"
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
          <span className="text-sm font-bold tracking-wide text-foreground">SIPANGAN</span>
          {!compact && (
            <span className="inline-flex items-center gap-1 rounded-sm border border-primary/15 bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <LineChart className="h-3 w-3" />
              AI
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">Sistem Informasi Pangan Nasional</p>
      </div>
    </div>
  );
}
