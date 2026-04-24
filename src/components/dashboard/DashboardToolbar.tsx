import { CalendarIcon, Download, FileSpreadsheet, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  query: string;
  selectedDate: Date;
  minDate: Date;
  maxDate: Date;
  syncing: boolean;
  onQueryChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onSync: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
}

function getCalendarKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function DashboardToolbar({
  query,
  selectedDate,
  minDate,
  maxDate,
  syncing,
  onQueryChange,
  onDateChange,
  onSync,
  onExportExcel,
  onExportPdf,
}: Props) {
  const minKey = getCalendarKey(minDate);
  const maxKey = getCalendarKey(maxDate);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari komoditas..."
          className="h-9 w-56 border-border bg-background pl-8 text-sm"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-2 border-border bg-background font-tabular text-xs",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {format(selectedDate, "dd MMM yyyy", { locale: idLocale })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => {
              const key = getCalendarKey(date);
              return key < minKey || key > maxKey;
            }}
            defaultMonth={selectedDate}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 border-border bg-background text-xs"
        onClick={onSync}
        disabled={syncing}
      >
        <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
        {syncing ? "Sinkronisasi..." : "Sinkronisasi"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 border-success/40 bg-background text-xs text-success hover:bg-success/5 hover:text-success"
        onClick={onExportExcel}
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        Export Excel
      </Button>

      <Button
        size="sm"
        className="h-9 gap-1.5 bg-navy text-xs text-navy-foreground hover:bg-navy/90"
        onClick={onExportPdf}
      >
        <Download className="h-3.5 w-3.5" />
        Laporan PDF
      </Button>
    </div>
  );
}

