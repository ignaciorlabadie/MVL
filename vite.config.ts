import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "src/index.html",
        resumen: "src/resumen.html",
        config: "src/config.html",
      },
    },
  },
});
