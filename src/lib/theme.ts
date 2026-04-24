export type AppTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "sipangan-theme";
export const THEME_CHANGE_EVENT = "sipangan-theme-change";

export function getSystemTheme(): AppTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): AppTheme | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "dark" || value === "light" ? value : null;
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<AppTheme>(THEME_CHANGE_EVENT, { detail: theme }));
  }
}

export function resolveTheme(): AppTheme {
  return getStoredTheme() ?? getSystemTheme();
}

export function setTheme(theme: AppTheme) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  applyTheme(theme);
}
