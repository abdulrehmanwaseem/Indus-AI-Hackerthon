import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "maskable-icon-512x512.png",
        "hero.jpg",
      ],
      manifest: {
        name: "Tandarust AI",
        short_name: "Tandarust",
        description: "AI-Powered Healthcare Prioritization & Diagnostics",
        theme_color: "#0D9488",
        background_color: "#F8FAFC",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "hero.jpg",
            sizes: "1280x720",
            type: "image/jpeg",
            form_factor: "wide",
            label: "Tandarust Dashboard Desktop",
          },
          {
            src: "hero.jpg",
            sizes: "1280x720",
            type: "image/jpeg",
            label: "Tandarust Mobile View",
          },
        ],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
