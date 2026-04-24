import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppTheme } from "@/lib/theme";

interface Props {
  theme: AppTheme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      className={cn(
        "h-9 w-9 border-border bg-background/80 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent",
        isDark && "border-primary/20 bg-card",
      )}
      aria-label={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
      title={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
    >
      {isDark ? <SunMedium className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
    </Button>
  );
}
