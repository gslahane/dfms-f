import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // ensure assets are loaded relative to index.html
  base: "./",

  server: {
    host: "::",
    port: 7070,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // only warn if a chunk exceeds 700 kB
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // split React / React-DOM into their own vendor chunk
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            // all other third-party deps in a generic vendor chunk
            return "vendor";
          }
        },
      },
    },
  },
}));
