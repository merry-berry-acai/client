import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify("http://localhost:3000/api"),
    "import.meta.env.VITE_NODE_ENV": JSON.stringify("test"),
  },
});
