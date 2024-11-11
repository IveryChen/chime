import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      external: ["react-router-dom"],
      output: {
        globals: {
          "react-router-dom": "ReactRouterDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
