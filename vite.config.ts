import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  appType: "mpa",
  // postprocessing and drei both reach for three; without deduping, the app
  // ends up with two copies and cross-instance `instanceof` checks fail.
  resolve: {
    dedupe: ["three", "@react-three/fiber", "react", "react-dom"],
  },
  build: {
    target: "es2022",
    cssMinify: false,
    // The effect stack is dynamically imported, so leave chunking to rolldown.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, "index.html"),
        os: path.resolve(rootDir, "os.html"),
      },
    },
  },
});
