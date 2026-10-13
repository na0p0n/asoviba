// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// 本番URL。sitemap / canonical の基点。src/config/site.ts の SITE.url と一致させる。
// 独自ドメイン確定後にここと site.ts を差し替える。
const site = "https://asoviba.pages.dev";

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
