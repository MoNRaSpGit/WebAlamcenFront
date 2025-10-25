import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/WebAlamcenFront/", // 👈 importante: el nombre del repo tal cual en GitHub
});
