import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppTheme } from "@/lib/theme";

interface Props {
  theme: AppTheme;
  onToggle: () => void;
  /** When placed on the navy header, use light styling so it stays visible. */
  onDark?: boolean;
}

export function ThemeToggle({ theme, onToggle, onDark = false }: Props) {
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      className={cn(
        "h-9 w-9 transition-all hover:-translate-y-0.5",
        onDark
          ? "border-navy-foreground/25 bg-navy-foreground/10 text-navy-foreground hover:border-navy-foreground/50 hover:bg-navy-foreground/20 hover:text-navy-foreground"
          : "border-border bg-background/80 backdrop-blur-sm hover:border-primary/40 hover:bg-accent",
      )}
      aria-label={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
      title={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
    >
      {isDark ? (
        <SunMedium className={cn("h-4 w-4", onDark ? "text-navy-foreground" : "text-primary")} />
      ) : (
        <Moon className={cn("h-4 w-4", onDark ? "text-navy-foreground" : "text-primary")} />
      )}
    </Button>
  );
}
