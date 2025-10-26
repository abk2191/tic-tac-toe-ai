import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto", // auto-injects the SW register script
      manifest: {
        name: "Tic Tac Toe",
        short_name: "Tic Tac Toe",
        start_url: ".", // see Step 7 for GitHub Pages
        scope: ".", // see Step 7 for GitHub Pages
        display: "fullscreen", // removes browser UI/URL bar when installed
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          {
            src: "/android-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // sensible defaults: caches your build assets & basic navigation
      },
    }),
  ],
  base: "/tic-tac-toe-ai/",
});
