import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MediCare+ Admin",
        short_name: "MediCare",
        display: "standalone",
        start_url: "/",
        theme_color: "#0C2340",
        background_color: "#FFFFFF",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // Estrategia "cache first":
        // Los recursos se buscan primero en el caché, y si no están, se descargan de la red.
        runtimeCaching: [
          {
            urlPattern:
              /^https?:.*\.(js|css|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)$/, 
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // Esto es el cache de 30 días, en este caso solo lo maejamos a el como informacion
              },
            },
          },
        ],
      },
    }),
  ],
});
