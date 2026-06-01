import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const appVersion = JSON.parse(readFileSync("./package.json", "utf8")).version;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
  },
});