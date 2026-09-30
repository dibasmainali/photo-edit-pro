import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("jspdf") ||
            id.includes("pdf-lib") ||
            id.includes("html2canvas") ||
            id.includes("dompurify")
          ) {
            return "pdf-vendor";
          }

          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("scheduler") ||
            id.includes("wouter")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("@radix-ui") ||
            id.includes("lucide-react") ||
            id.includes("framer-motion") ||
            id.includes("recharts") ||
            id.includes("@tanstack/react-query")
          ) {
            return "ui-vendor";
          }

          if (
            id.includes("exif-js") ||
            id.includes("@hookform") ||
            id.includes("react-hook-form") ||
            id.includes("zod") ||
            id.includes("clsx")
          ) {
            return "form-vendor";
          }

          return "vendor";
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
