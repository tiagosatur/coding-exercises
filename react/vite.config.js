import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@styles": resolve(__dirname, "src/styles"),
      "@exercises": resolve(__dirname, "src/exercises"),
    },
  },
  plugins: [
    TanStackRouterVite({
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
      routeFileIgnorePattern: "(components|hooks|api)",
    }),
    react(),
    tailwindcss(),
  ],
});
