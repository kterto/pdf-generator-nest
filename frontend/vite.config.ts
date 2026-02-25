import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "src/"),
    },
  },
  plugins: [react(), tailwindcss()],
  envDir: "environments",
});
