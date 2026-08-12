import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // postprocessing and drei both reach for three; without deduping, the app
  // ends up with two copies and cross-instance `instanceof` checks fail.
  resolve: {
    dedupe: ["three", "@react-three/fiber", "react", "react-dom"],
  },
  build: {
    target: "es2022",
    // The effect stack is dynamically imported, so leave chunking to rolldown.
    chunkSizeWarningLimit: 700,
  },
});
