import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  server: {
    https: {
      cert: fs.readFileSync("../localhost+2.pem"),
      key: fs.readFileSync("../localhost+2-key.pem"),
    },

  },
});
