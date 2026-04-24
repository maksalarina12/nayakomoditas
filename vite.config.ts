// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages base path: set VITE_BASE_PATH="/your-repo-name/" during the
// CI build (the workflow does this automatically). Locally / on Lovable
// preview it stays "/" so nothing else changes.
const basePath = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  // Disable the Cloudflare Worker build so we get a pure static client bundle
  // suitable for GitHub Pages. The TanStack Start plugin then ships a SPA.
  cloudflare: false,
  tanstackStart: {
    target: "static",
    spa: { enabled: true },
  },
  vite: {
    base: basePath,
  },
});
